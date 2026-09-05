import mongoose from 'mongoose'
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../constants/orderTracking.js'

const orderItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  theme: { type: String, default: 'gold' },
  image: { type: String, default: '' },
}, { _id: false })

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
}, { _id: false })

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, enum: ORDER_STATUSES, required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  message: { type: String, required: true, trim: true, maxlength: 300 },
  location: { type: String, trim: true, maxlength: 120, default: '' },
  timestamp: { type: Date, required: true, default: Date.now },
}, { _id: true })

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  shippingAddress: { type: addressSchema, required: true },
  paymentMethod: { type: String, enum: ['COD', 'UPI', 'CARD'], default: 'COD' },
  paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'Pending' },
  orderStatus: { type: String, enum: ORDER_STATUSES, default: 'Processing', index: true },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  courierName: { type: String, trim: true, maxlength: 80, default: '' },
  trackingNumber: { type: String, trim: true, uppercase: true, maxlength: 100, default: '' },
  trackingUrl: { type: String, trim: true, maxlength: 500, default: '' },
  currentLocation: { type: String, trim: true, maxlength: 120, default: '' },
  estimatedDelivery: Date,
  trackingEvents: { type: [trackingEventSchema], default: [] },
  confirmedAt: Date,
  packedAt: Date,
  shippedAt: Date,
  outForDeliveryAt: Date,
  paidAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: { type: String, trim: true, maxlength: 200, default: '' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
