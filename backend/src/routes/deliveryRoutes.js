import express from 'express'
import mongoose from 'mongoose'
import { randomInt, timingSafeEqual } from 'node:crypto'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { protect, adminOnly, staffAccessError } from '../middleware/authMiddleware.js'
import { roleOf } from '../utils/roles.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { trackingEventFor } from '../constants/orderTracking.js'

const router = express.Router()
const fail = (res, status, message) => { res.status(status); throw new Error(message) }
const active = order => !['Delivered', 'Cancelled'].includes(order.orderStatus)
const managedDriverQuery = (adminId, extra = {}) => ({
  $and: [
    extra,
    { $or: [{ managedBy: adminId }, { managedBy: { $exists: false } }] },
  ],
})
const safeOrder = order => {
  const value = order.toObject()
  delete value.deliveryOtp; delete value.deliveryOtpExpiresAt; delete value.deliveryOtpAttempts
  return value
}
const driverOnly = asyncHandler(async (req, res, next) => {
  if (roleOf(req.user) !== 'delivery_boy') { res.status(403); return next(new Error('Active delivery person access required')) }
  const accessError = await staffAccessError(req.user)
  if (accessError) { res.status(403); return next(new Error(accessError)) }
  next()
})
router.use(protect)
router.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) { res.status(400); return next(new Error('Invalid order or delivery person ID')) }
  next()
})
router.get('/team', adminOnly, asyncHandler(async (req, res) => {
  const drivers = await User.find(managedDriverQuery(req.user._id, { $or: [{ role: 'delivery_boy' }, { role: { $exists: false }, isDriver: true }] })).select('name email phone deliveryArea deliveryActive managedBy').sort({ name: 1 })
  sendSuccess(res, { data: { drivers } })
}))
router.post('/team', adminOnly, asyncHandler(async (req, res) => {
  const { name, email, phone, password, deliveryArea = '' } = req.body
  if (typeof name !== 'string' || !name.trim() || name.length > 80 || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{10}$/.test(phone) || typeof password !== 'string' || password.length < 8 || password.length > 72 || typeof deliveryArea !== 'string' || deliveryArea.length > 120) fail(res, 400, 'Enter a name, valid email, 10 digit phone, area and password of 8–72 characters')
  if (await User.exists({ email: email.trim().toLowerCase() })) fail(res, 409, 'This email already has an account. Use a separate delivery account.')
  const driver = await User.create({ name, email, phone, password, deliveryArea, role: 'delivery_boy', managedBy: req.user._id })
  sendSuccess(res, { statusCode: 201, data: { driver: { _id: driver._id, name: driver.name } } })
}))
router.put('/team/:id', adminOnly, asyncHandler(async (req, res) => {
  const driver = await User.findOne(managedDriverQuery(req.user._id, { _id: req.params.id, $or: [{ role: 'delivery_boy' }, { role: { $exists: false }, isDriver: true }] }))
  if (!driver) fail(res, 404, 'Delivery person not found')
  driver.managedBy ||= req.user._id
  const { name, email, phone, deliveryArea, password, deliveryActive } = req.body
  if (![name, email, phone, deliveryArea, password, deliveryActive].some(value => value !== undefined)) fail(res, 400, 'Provide delivery person details to update')
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim() || name.length > 80) fail(res, 400, 'Enter a name up to 80 characters')
    driver.name = name.trim()
  }
  if (email !== undefined) {
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) fail(res, 400, 'Enter a valid email')
    const normalized = email.trim().toLowerCase()
    if (await User.exists({ email: normalized, _id: { $ne: driver._id } })) fail(res, 409, 'This email already has an account')
    driver.email = normalized
  }
  if (phone !== undefined) {
    if (typeof phone !== 'string' || !/^\d{10}$/.test(phone)) fail(res, 400, 'Enter a 10 digit phone number')
    driver.phone = phone
  }
  if (deliveryArea !== undefined) {
    if (typeof deliveryArea !== 'string' || !deliveryArea.trim() || deliveryArea.length > 120) fail(res, 400, 'Enter a delivery area up to 120 characters')
    driver.deliveryArea = deliveryArea.trim()
  }
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length < 8 || password.length > 72) fail(res, 400, 'Password must be 8–72 characters')
    driver.password = password
  }
  if (deliveryActive !== undefined) {
    if (typeof deliveryActive !== 'boolean') fail(res, 400, 'Active state must be true or false')
    driver.deliveryActive = deliveryActive
  }
  await driver.save()
  sendSuccess(res, { data: { driver: { _id: driver._id, name: driver.name, email: driver.email, phone: driver.phone, deliveryArea: driver.deliveryArea, deliveryActive: driver.deliveryActive } } })
}))
router.delete('/team/:id', adminOnly, asyncHandler(async (req, res) => {
  const driver = await User.findOne(managedDriverQuery(req.user._id, { _id: req.params.id, $or: [{ role: 'delivery_boy' }, { role: { $exists: false }, isDriver: true }] }))
  if (!driver) fail(res, 404, 'Delivery person not found')
  if (await Order.exists({ deliveryPerson: driver._id, orderStatus: { $nin: ['Delivered', 'Cancelled'] } })) fail(res, 409, 'Reassign this partner’s active deliveries before deleting their account')
  await driver.deleteOne()
  sendSuccess(res, { message: 'Delivery person deleted. Previous order tracking history is retained.' })
}))
router.put('/orders/:id/assign', adminOnly, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.body.driverId)) fail(res, 400, 'Select a delivery person')
  const driver = await User.findOne(managedDriverQuery(req.user._id, { _id: req.body.driverId, deliveryActive: true, $or: [{ role: 'delivery_boy' }, { role: { $exists: false }, isDriver: true }] }))
  if (!driver) fail(res, 400, 'Select an active delivery person')
  const accessError = await staffAccessError(driver)
  if (accessError) fail(res, 400, accessError)
  const order = await Order.findById(req.params.id)
  if (!order) fail(res, 404, 'Order not found')
  if (!active(order)) fail(res, 400, 'Completed or cancelled orders cannot be assigned')
  if (!driver.managedBy) {
    driver.managedBy = req.user._id
    await driver.save()
  }
  order.deliveryPerson = driver._id
  order.deliveryAssignedAt = new Date()
  order.courierName = 'Divya Swasth Delivery'
  order.trackingNumber ||= `DS-${order._id}`.toUpperCase()
  order.deliveryOtp = undefined; order.deliveryOtpExpiresAt = undefined; order.deliveryOtpAttempts = 0
  order.deliveryCoordinates = undefined
  order.trackingEvents.push({ status: order.orderStatus, title: 'Delivery person assigned', message: `${driver.name} will deliver your order.`, location: order.currentLocation, timestamp: new Date() })
  await order.save()
  sendSuccess(res, { data: { order: safeOrder(order) } })
}))
router.get('/orders', driverOnly, asyncHandler(async (req, res) => {
  const orders = await Order.find({ deliveryPerson: req.user._id }).sort({ deliveryAssignedAt: -1 })
  sendSuccess(res, { data: { orders } })
}))
router.put('/orders/:id/update', driverOnly, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id })
  if (!order) fail(res, 404, 'Assigned order not found')
  if (!active(order)) fail(res, 400, 'This delivery is already closed')
  const { status = order.orderStatus, location = '', note = '', coordinates } = req.body
  if (typeof location !== 'string' || !location.trim() || location.length > 120 || typeof note !== 'string' || note.length > 300) fail(res, 400, 'Enter your current area or landmark (up to 120 characters) and a short update')
  const next = { Processing: 'Shipped', Confirmed: 'Shipped', Packed: 'Shipped', Shipped: 'Out for Delivery' }
  if (status !== order.orderStatus && next[order.orderStatus] !== status) fail(res, 400, 'Pick up the order, then mark it out for delivery. Completion requires OTP.')
  if (coordinates !== undefined) {
    if (!coordinates || !Number.isFinite(coordinates.latitude) || !Number.isFinite(coordinates.longitude) || Math.abs(coordinates.latitude) > 90 || Math.abs(coordinates.longitude) > 180) fail(res, 400, 'Invalid GPS coordinates')
    order.deliveryCoordinates = { latitude: coordinates.latitude, longitude: coordinates.longitude, updatedAt: new Date() }
  }
  if (status !== order.orderStatus) {
    if (status === 'Shipped') order.shippedAt = new Date()
    if (status === 'Out for Delivery') order.outForDeliveryAt = new Date()
  }
  const changed = status !== order.orderStatus
  order.orderStatus = status
  order.currentLocation = location.trim()
  const event = trackingEventFor(status, { location: location.trim(), note: note.trim() || (changed ? '' : 'Delivery person shared a location update.') })
  if (!changed) event.title = 'Delivery location updated'
  order.trackingEvents.push(event)
  await order.save()
  sendSuccess(res, { data: { order: safeOrder(order) } })
}))
// The delivery code is available only to the authenticated order owner.
router.post('/orders/:id/otp', asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).select('+deliveryOtp +deliveryOtpExpiresAt +deliveryOtpAttempts')
  if (!order) fail(res, 404, 'Order not found')
  if (!order.deliveryPerson || order.orderStatus !== 'Out for Delivery') fail(res, 400, 'OTP is available when your order is out for delivery')
  if (!order.deliveryOtp || order.deliveryOtpExpiresAt <= new Date()) {
    order.deliveryOtp = String(randomInt(100000, 1000000))
    order.deliveryOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    order.deliveryOtpAttempts = 0
    await order.save()
  }
  if (order.deliveryOtpAttempts >= 5) fail(res, 429, 'Code locked after 5 incorrect attempts. Request a new code after expiry.')
  res.set('Cache-Control', 'no-store')
  sendSuccess(res, { data: { otp: order.deliveryOtp, expiresAt: order.deliveryOtpExpiresAt } })
}))
router.post('/orders/:id/complete', driverOnly, rateLimit({ windowMs: 10 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false }), asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id }).select('+deliveryOtp +deliveryOtpExpiresAt +deliveryOtpAttempts')
  if (!order) fail(res, 404, 'Assigned order not found')
  if (order.orderStatus !== 'Out for Delivery') fail(res, 400, 'Order must be out for delivery')
  if (!order.deliveryOtp || order.deliveryOtpExpiresAt <= new Date()) fail(res, 400, 'Ask the customer to open tracking and request a fresh delivery OTP')
  if (order.deliveryOtpAttempts >= 5) fail(res, 429, 'Too many incorrect codes. Wait for code expiry before the customer requests another.')
  const otp = String(req.body.otp || '')
  if (!/^\d{6}$/.test(otp) || !timingSafeEqual(Buffer.from(otp), Buffer.from(order.deliveryOtp))) {
    order.deliveryOtpAttempts += 1
    await order.save()
    fail(res, 400, 'Incorrect delivery OTP')
  }
  if (order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid' && req.body.cashCollected !== true) fail(res, 400, 'Confirm cash collection before completing this COD order')
  const now = new Date()
  order.orderStatus = 'Delivered'; order.deliveredAt = now; order.deliveryOtpVerifiedAt = now
  order.deliveryOtp = undefined; order.deliveryOtpExpiresAt = undefined; order.deliveryOtpAttempts = 0
  if (order.paymentMethod === 'COD') { order.paymentStatus = 'Paid'; order.paidAt ||= now }
  order.trackingEvents.push(trackingEventFor('Delivered', { location: order.currentLocation, note: 'Handed to customer and delivery OTP verified.' }))
  await order.save()
  sendSuccess(res, { data: { order: safeOrder(order) } })
}))
export default router
