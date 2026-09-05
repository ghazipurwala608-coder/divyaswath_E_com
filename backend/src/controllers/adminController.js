import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const dashboard = asyncHandler(async (req, res) => {
  const [products, orders, users, revenue, recentOrders] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    User.countDocuments({ isAdmin: false }),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.find().populate('user', 'name email phone').sort({ createdAt: -1 }).limit(10),
  ])
  sendSuccess(res, { message: 'Dashboard fetched successfully', data: { stats: { products, orders, users, revenue: revenue[0]?.total || 0 }, recentOrders } })
})
