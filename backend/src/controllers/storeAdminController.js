import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import ContactMessage from '../models/ContactMessage.js'
import Subscriber from '../models/Subscriber.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const uploadDirectory = fileURLToPath(new URL('../../uploads/', import.meta.url))
const publicDirectory = fileURLToPath(new URL('../../../frontend/public/images/', import.meta.url))
export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ sortOrder: 1, createdAt: 1 })
  sendSuccess(res, { data: { products } })
})
export const listCustomers = asyncHandler(async (req, res) => {
  const customers = await User.aggregate([
    { $match: { isAdmin: false } },
    { $project: { name: 1, email: 1, phone: 1, createdAt: 1 } },
    { $lookup: { from: 'orders', let: { customer: '$_id' }, pipeline: [
      { $match: { $expr: { $eq: ['$user', '$$customer'] } } },
      { $group: { _id: null, orders: { $sum: 1 }, spent: { $sum: { $cond: [{ $ne: ['$orderStatus', 'Cancelled'] }, '$totalPrice', 0] } } } },
    ], as: 'totals' } },
    { $addFields: { orders: { $ifNull: [{ $arrayElemAt: ['$totals.orders', 0] }, 0] }, spent: { $ifNull: [{ $arrayElemAt: ['$totals.spent', 0] }, 0] } } },
    { $project: { totals: 0 } }, { $sort: { createdAt: -1 } },
  ])
  sendSuccess(res, { data: { customers } })
})
export const customerDetail = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, isAdmin: false }).select('name email phone createdAt')
  if (!customer) { res.status(404); throw new Error('Customer not found') }
  const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 })
  sendSuccess(res, { data: { customer, orders } })
})
export const listMessages = asyncHandler(async (req, res) => sendSuccess(res, { data: { messages: await ContactMessage.find().sort({ createdAt: -1 }) } }))
export const updateMessage = asyncHandler(async (req, res) => {
  if (!['New', 'In progress', 'Resolved'].includes(req.body.status)) { res.status(400); throw new Error('Invalid enquiry status') }
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true, runValidators: true })
  if (!message) { res.status(404); throw new Error('Enquiry not found') }
  sendSuccess(res, { data: { message } })
})
export const listSubscribers = asyncHandler(async (req, res) => sendSuccess(res, { data: { subscribers: await Subscriber.find().sort({ createdAt: -1 }) } }))
export const updateSubscriber = asyncHandler(async (req, res) => {
  if (req.body.status !== 'Unsubscribed') { res.status(400); throw new Error('Only a new customer consent can resubscribe an email') }
  const subscriber = await Subscriber.findByIdAndUpdate(req.params.id, { $set: { status: 'Unsubscribed' } }, { new: true })
  if (!subscriber) { res.status(404); throw new Error('Subscriber not found') }
  sendSuccess(res, { data: { subscriber } })
})
async function walk(directory, prefix) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => [])
  const nested = await Promise.all(entries.map(async entry => {
    const url = `${prefix}/${entry.name}`
    if (entry.isDirectory()) return walk(path.join(directory, entry.name), url)
    return /\.(png|jpe?g|webp|svg|gif)$/i.test(entry.name) ? [{ name: entry.name, url }] : []
  }))
  return nested.flat()
}
export const listMedia = asyncHandler(async (req, res) => {
  const [builtIn, uploaded] = await Promise.all([walk(publicDirectory, '/images'), walk(uploadDirectory, '/api/media')])
  sendSuccess(res, { data: { media: [...uploaded, ...builtIn] } })
})
export const uploadMedia = asyncHandler(async (req, res) => {
  const data = req.body
  if (!Buffer.isBuffer(data) || data.length < 12 || data.length > 5 * 1024 * 1024) { res.status(400); throw new Error('Choose a PNG, JPEG or WebP image under 5 MB') }
  let extension
  if (data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = 'png'
  else if (data[0] === 255 && data[1] === 216 && data[2] === 255) extension = 'jpg'
  else if (data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') extension = 'webp'
  else { res.status(400); throw new Error('Unsupported image. Use PNG, JPEG or WebP.') }
  await fs.mkdir(uploadDirectory, { recursive: true })
  const name = `${crypto.randomUUID()}.${extension}`
  await fs.writeFile(path.join(uploadDirectory, name), data, { flag: 'wx' })
  sendSuccess(res, { statusCode: 201, data: { media: { name, url: `/api/media/${name}` } } })
})
