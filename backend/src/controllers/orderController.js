import { adminAccess } from '../utils/roles.js'
import mongoose from 'mongoose'
import { NEXT_ORDER_STATUS, ORDER_STATUSES, PAYMENT_STATUSES, trackingEventFor } from '../constants/orderTracking.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import SiteContent from '../models/SiteContent.js'
import { websiteContent } from '../../../shared/websiteContent.js'
import { calculateShipping } from '../../../shared/shipping.js'

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'COD' } = req.body
  if (!Array.isArray(items) || !items.length) { res.status(400); throw new Error('Your order must contain at least one item') }
  const requiredAddress = ['fullName', 'email', 'phone', 'addressLine', 'city', 'state', 'postalCode']
  if (!shippingAddress || requiredAddress.some((field) => !String(shippingAddress[field] || '').trim())) { res.status(400); throw new Error('Complete shipping details are required') }
  if (!/^\S+@\S+\.\S+$/.test(shippingAddress.email)) { res.status(400); throw new Error('Please enter a valid delivery email') }
  if (!/^\d{10}$/.test(shippingAddress.phone)) { res.status(400); throw new Error('Please enter a valid 10 digit delivery phone number') }
  if (!/^\d{6}$/.test(shippingAddress.postalCode)) { res.status(400); throw new Error('Please enter a valid 6 digit PIN code') }
  if (!['COD', 'UPI', 'CARD'].includes(paymentMethod)) { res.status(400); throw new Error('Unsupported payment method') }
  const validIds = items.map((item) => item.product).filter((id) => mongoose.isValidObjectId(id))
  const slugs = items.map((item) => item.slug || item.product).filter(Boolean)
  const products = await Product.find({ isActive: true, $or: [{ _id: { $in: validIds } }, { slug: { $in: slugs } }] })
  if (products.length !== items.length) { res.status(400); throw new Error('One or more products are no longer available') }

  const safeItems = items.map((item) => {
    const product = products.find((entry) => entry._id.toString() === item.product || entry.slug === item.slug || entry.slug === item.product)
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) { res.status(400); throw new Error('Quantity must be a whole number between 1 and 10') }
    if (!product || product.availableForPurchase === false || product.price <= 0) { res.status(400); throw new Error('One or more products cannot be purchased yet') }
    if (product.countInStock < quantity) { res.status(400); throw new Error(`${product.name} has only ${product.countInStock} units available`) }
    return { product: product._id.toString(), name: product.name, slug: product.slug, price: product.price, quantity, theme: product.theme, image: product.images?.[0] || '' }
  })
  const itemsPrice = safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (new Set(safeItems.map(item => item.product)).size !== safeItems.length) { res.status(400); throw new Error('Combine duplicate product quantities before ordering') }
  const settings = (await SiteContent.findOne({ key: 'settings' }).lean())?.content || websiteContent.settings
  const shippingPrice = calculateShipping(itemsPrice, safeItems.length, settings.shipping)
  const estimatedDelivery = new Date(Date.now() + settings.shipping.estimatedDays * 24 * 60 * 60 * 1000)
  const reserved = []
  let order
  try {
    for (const item of safeItems) {
      const result = await Product.updateOne({ _id: item.product, isActive: true, availableForPurchase: true, countInStock: { $gte: item.quantity } }, { $inc: { countInStock: -item.quantity, __v: 1 } })
      if (!result.modifiedCount) { res.status(409); throw new Error(`${item.name} stock changed. Please review your cart.`) }
      reserved.push(item)
    }
    order = await Order.create({
    user: req.user._id,
    items: safeItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
    estimatedDelivery,
    trackingEvents: [trackingEventFor('Processing')],
    })
  } catch (error) {
    if (reserved.length) await Product.bulkWrite(reserved.map(item => ({ updateOne: { filter: { _id: item.product }, update: { $inc: { countInStock: item.quantity, __v: 1 } } } })))
    throw error
  }
  sendSuccess(res, { statusCode: 201, message: 'Order placed successfully', data: { order } })
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  sendSuccess(res, { message: 'Orders fetched successfully', data: { orders } })
})

export const getOrder = asyncHandler(async (req, res) => {
  const query = String(req.params.id || '').trim()
  let order = null

  if (mongoose.isValidObjectId(query)) {
    order = await Order.findById(query).populate('user', 'name email phone')
  }

  if (!order) {
    order = await Order.findOne({
      $or: [
        { trackingNumber: query.toUpperCase() },
        { 'shippingAddress.phone': query }
      ]
    }).populate('user', 'name email phone')
  }

  if (!order) {
    res.status(404)
    throw new Error('Order not found with provided ID or tracking number')
  }

  if (!req.user || (!adminAccess(req.user) && String(order.user?._id) !== String(req.user._id))) {
    res.status(req.user ? 403 : 401)
    throw new Error('Sign in with the customer account that placed this order to view tracking')
  }
  await order.populate('deliveryPerson', 'name phone')
  sendSuccess(res, { message: 'Order fetched successfully', data: { order } })
})

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 })
  sendSuccess(res, { message: 'Orders fetched successfully', data: { orders } })
})

export const cancelMyOrder = asyncHandler(async (req, res) => {
  const cancellableStatuses = ['Processing', 'Confirmed', 'Packed']
  const reason = String(req.body.reason || 'Cancelled by customer').trim()
  if (reason.length < 3 || reason.length > 200) { res.status(400); throw new Error('Please provide a valid cancellation reason') }

  const event = trackingEventFor('Cancelled', { note: reason })
  event.title = 'Cancelled by customer'
  const cancelledAt = new Date()
  const previous = await Order.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, orderStatus: { $in: cancellableStatuses } },
    { $set: { orderStatus: 'Cancelled', cancelledAt, cancellationReason: reason }, $push: { trackingEvents: event }, $inc: { __v: 1 } },
    { new: false, runValidators: true },
  )

  if (!previous) {
    const existing = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!existing) { res.status(404); throw new Error('Order not found') }
    res.status(400)
    throw new Error(existing.orderStatus === 'Cancelled' ? 'This order is already cancelled' : 'This order can no longer be cancelled online. Please contact support.')
  }

  if (previous.paymentStatus === 'Paid') {
    await Order.updateOne({ _id: previous._id }, { $set: { paymentStatus: 'Refund Pending' } })
  }
  await Product.bulkWrite(previous.items.map((item) => ({ updateOne: { filter: { _id: item.product }, update: { $inc: { countInStock: item.quantity } } } })))
  const order = await Order.findById(previous._id)
  sendSuccess(res, { message: 'Your order has been cancelled and its stock has been restored', data: { order } })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) { res.status(404); throw new Error('Order not found') }

  const requestedStatus = req.body.orderStatus || order.orderStatus
  if (order.deliveryPerson && requestedStatus !== order.orderStatus && ['Shipped', 'Out for Delivery'].includes(requestedStatus)) {
    res.status(400)
    throw new Error('The assigned delivery partner must confirm pickup and out-for-delivery updates from their dashboard')
  }
  if (order.deliveryPerson && requestedStatus === 'Delivered' && order.orderStatus !== 'Delivered') {
    res.status(400); throw new Error('Assigned deliveries must be completed by the delivery person with customer OTP verification')
  }
  if (!ORDER_STATUSES.includes(requestedStatus)) { res.status(400); throw new Error('Invalid order status') }
  if (req.body.paymentStatus && !PAYMENT_STATUSES.includes(req.body.paymentStatus)) { res.status(400); throw new Error('Invalid payment status') }

  const statusChanged = requestedStatus !== order.orderStatus
  if (statusChanged) {
    const canCancel = requestedStatus === 'Cancelled' && !['Delivered', 'Cancelled'].includes(order.orderStatus)
    const isNextStep = NEXT_ORDER_STATUS[order.orderStatus] === requestedStatus
    if (!canCancel && !isNextStep) {
      res.status(400)
      throw new Error(`Order can only move from ${order.orderStatus} to ${NEXT_ORDER_STATUS[order.orderStatus] || 'no further status'}`)
    }
  }

  const courierName = String(req.body.courierName ?? order.courierName ?? '').trim()
  const trackingNumber = String(req.body.trackingNumber ?? order.trackingNumber ?? '').trim().toUpperCase()
  const trackingUrl = String(req.body.trackingUrl ?? order.trackingUrl ?? '').trim()
  const currentLocation = String(req.body.currentLocation ?? order.currentLocation ?? '').trim()
  const note = String(req.body.note || '').trim()

  if (courierName.length > 80 || trackingNumber.length > 100 || currentLocation.length > 120 || note.length > 300) {
    res.status(400)
    throw new Error('One or more tracking details are too long')
  }
  if (trackingUrl) {
    try {
      const parsed = new URL(trackingUrl)
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol')
    } catch {
      res.status(400)
      throw new Error('Tracking URL must be a valid http or https link')
    }
  }
  if (['Shipped', 'Out for Delivery', 'Delivered'].includes(requestedStatus) && (!courierName || !trackingNumber)) {
    res.status(400)
    throw new Error('Courier name and tracking number are required before marking an order shipped')
  }

  let estimatedDelivery = order.estimatedDelivery
  if (Object.hasOwn(req.body, 'estimatedDelivery')) {
    if (!req.body.estimatedDelivery) estimatedDelivery = null
    else {
      estimatedDelivery = new Date(req.body.estimatedDelivery)
      if (Number.isNaN(estimatedDelivery.getTime())) { res.status(400); throw new Error('Estimated delivery date is invalid') }
    }
  }

  order.courierName = courierName
  order.trackingNumber = trackingNumber
  order.trackingUrl = trackingUrl
  order.currentLocation = currentLocation
  order.estimatedDelivery = estimatedDelivery
  if (req.body.paymentStatus) {
    order.paymentStatus = req.body.paymentStatus
    if (req.body.paymentStatus === 'Paid' && !order.paidAt) order.paidAt = new Date()
  }

  if (statusChanged) {
    const now = new Date()
    order.orderStatus = requestedStatus
    if (requestedStatus === 'Confirmed') order.confirmedAt = now
    if (requestedStatus === 'Packed') order.packedAt = now
    if (requestedStatus === 'Shipped') order.shippedAt = now
    if (requestedStatus === 'Out for Delivery') order.outForDeliveryAt = now
    if (requestedStatus === 'Delivered') {
      order.deliveredAt = now
      if (order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid'
        order.paidAt = now
      }
    }
    if (requestedStatus === 'Cancelled') {
      order.cancelledAt = now
      order.cancellationReason = note || 'Cancelled by store admin'
      if (order.paymentStatus === 'Paid') order.paymentStatus = 'Refund Pending'
    }
    order.trackingEvents.push(trackingEventFor(requestedStatus, { courierName, note, location: currentLocation }))

  } else if (note) {
    order.trackingEvents.push({ status: order.orderStatus, title: 'Tracking update', message: note, location: currentLocation, timestamp: new Date() })
  }

  await order.save()
  if (statusChanged && requestedStatus === 'Cancelled') {
    await Product.bulkWrite(order.items.map(item => ({ updateOne: { filter: { _id: item.product }, update: { $inc: { countInStock: item.quantity, __v: 1 } } } })))
  }
  sendSuccess(res, { message: statusChanged ? `Order marked ${requestedStatus}` : 'Delivery details updated', data: { order } })
})
