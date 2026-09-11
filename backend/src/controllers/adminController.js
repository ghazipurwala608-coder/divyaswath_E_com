import { customerQuery } from '../utils/roles.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import ContactMessage from '../models/ContactMessage.js'
import Subscriber from '../models/Subscriber.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const dashboard = asyncHandler(async (req, res) => {
  const [products, orders, users, revenue, recentOrders, lowStock, enquiries, subscribers, orderStatuses, monthlySales] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    User.countDocuments(customerQuery),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' }, paymentStatus: 'Paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.find().populate('user', 'name email phone').sort({ createdAt: -1 }).limit(10),
    Product.find({ isActive: true, countInStock: { $lte: 5 } }).select('name slug countInStock images'),
    ContactMessage.countDocuments({ status: { $ne: 'Resolved' } }),
    Subscriber.countDocuments({ status: 'Subscribed' }),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' }, paymentStatus: 'Paid', createdAt: { $gte: new Date(Date.now() - 180 * 86400000) } } }, { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$totalPrice' } } }, { $sort: { _id: 1 } }]),
  ])
  sendSuccess(res, { message: 'Dashboard fetched successfully', data: { stats: { products, orders, users, revenue: revenue[0]?.total || 0, enquiries, subscribers }, recentOrders, lowStock, orderStatuses, monthlySales } })
})
