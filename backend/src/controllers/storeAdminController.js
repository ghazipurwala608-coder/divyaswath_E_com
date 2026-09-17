import SiteContent from '../models/SiteContent.js'
import { websiteContent } from '../../../shared/websiteContent.js'
import * as catalog from '../../../shared/catalog.js'
import { customerQuery } from '../utils/roles.js'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import ContactMessage from '../models/ContactMessage.js'
import Subscriber from '../models/Subscriber.js'
import AssessmentLead from '../models/AssessmentLead.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import cloudinary from '../config/cloudinary.js'

export const uploadDirectory = fileURLToPath(new URL('../../uploads/', import.meta.url))

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 })
  sendSuccess(res, { data: { products } })
})

export const listCustomers = asyncHandler(async (req, res) => {
  const customers = await User.aggregate([
    { $match: customerQuery },
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
  const customer = await User.findOne({ _id: req.params.id, ...customerQuery }).select('name email phone createdAt')
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

// Assessment Leads Handlers for Admin
export const listLeads = asyncHandler(async (req, res) => {
  const leads = await AssessmentLead.find().sort({ createdAt: -1 })
  sendSuccess(res, { data: { leads } })
})

export const updateLead = asyncHandler(async (req, res) => {
  const { status, notes } = req.body
  const validStatuses = ['New Lead', 'Contacted', 'Consulted', 'Converted', 'Closed']
  const updateData = {}
  
  if (status) {
    if (!validStatuses.includes(status)) {
      res.status(400)
      throw new Error('Invalid lead status')
    }
    updateData.status = status
  }
  
  if (typeof notes === 'string') {
    updateData.notes = notes
  }

  const lead = await AssessmentLead.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  )

  if (!lead) {
    res.status(404)
    throw new Error('Lead not found')
  }

  sendSuccess(res, { data: { lead } })
})

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await AssessmentLead.findByIdAndDelete(req.params.id)
  if (!lead) {
    res.status(404)
    throw new Error('Lead not found')
  }
  sendSuccess(res, { message: 'Lead deleted successfully' })
})

function extractPublicId(target) {
  try {
    const url = new URL(target)
    const prefix = `/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
    if (url.hostname !== 'res.cloudinary.com' || !url.pathname.startsWith(prefix)) return null
    const id = decodeURIComponent(url.pathname.slice(prefix.length).replace(/^v\d+\//, '').replace(/\.[^/.]+$/, ''))
    return id.startsWith('divyaswasth/') ? id : null
  } catch { return null }
}

function uploadStreamToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
    uploadStream.end(buffer)
  })
}

export const signMediaUpload = asyncHandler(async (req, res) => {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  if (!cloud_name || !api_key || !api_secret) {
    res.status(503)
    throw new Error('Cloudinary credentials are missing on the backend server.')
  }
  const name = String(req.body?.name || 'image').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100) || 'image'
  const params = {
    timestamp: Math.floor(Date.now() / 1000),
    public_id: `divyaswasth/uploads/${name}_${crypto.randomUUID()}`,
    overwrite: false,
    allowed_formats: 'png,jpg,jpeg,webp,svg,gif,avif',
  }
  res.set('Cache-Control', 'no-store')
  sendSuccess(res, { data: {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    params: { ...params, api_key, signature: cloudinary.utils.api_sign_request(params, api_secret) },
  } })
})

export const listMedia = asyncHandler(async (req, res) => {
  try {
    const resources = []
    let cursor
    do {
      const page = await cloudinary.api.resources({ type: 'upload', prefix: 'divyaswasth/', max_results: 500, ...(cursor ? { next_cursor: cursor } : {}) })
      resources.push(...(page.resources || []))
      cursor = page.next_cursor
    } while (cursor)
    const result = { resources }

    const cloudinaryMedia = (result.resources || []).map(item => ({
      name: item.public_id.split('/').pop(),
      url: item.secure_url,
      public_id: item.public_id,
      format: item.format,
      bytes: item.bytes,
      created_at: item.created_at,
    }))

    sendSuccess(res, { data: { media: cloudinaryMedia } })
  } catch (err) {
    console.error('Cloudinary listing error:', err?.message || err)
    res.status(502)
    throw new Error('Could not retrieve media from Cloudinary: ' + (err?.message || 'Unknown error'))
  }
})

export const uploadMedia = asyncHandler(async (req, res) => {
  const sourceUrl = req.body?.url
  if (sourceUrl && typeof sourceUrl === 'string') {
    let source
    try {
      source = new URL(sourceUrl)
    } catch {
      res.status(400)
      throw new Error('Provide a valid absolute image URL')
    }
    if (!['http:', 'https:'].includes(source.protocol)) {
      res.status(400)
      throw new Error('Image URL must use http or https')
    }
    const cleanName = path.parse(source.pathname).name.replace(/[^a-zA-Z0-9_-]/g, '_') || crypto.randomUUID()
    const publicId = `divyaswasth/uploads/${cleanName}_${Date.now()}`
    let result
    try {
      result = await cloudinary.uploader.upload(source.toString(), {
        public_id: publicId,
        resource_type: 'image',
      })
    } catch (err) {
      console.error('Cloudinary import error:', err?.message || err)
      res.status(502)
      throw new Error('Cloudinary could not fetch and save that image URL: ' + (err?.message || 'Check URL and try again.'))
    }
    return sendSuccess(res, { statusCode: 201, data: { media: { name: source.pathname.split('/').pop() || 'Imported image', url: result.secure_url, public_id: result.public_id } } })
  }

  let data = null
  let originalName = ''

  if (req.body && typeof req.body === 'object' && req.body.data) {
    originalName = req.body.name || ''
    const base64Str = String(req.body.data).replace(/^data:image\/[a-z0-9+.-]+;base64,/, '')
    data = Buffer.from(base64Str, 'base64')
  } else if (Buffer.isBuffer(req.body)) {
    data = req.body
    originalName = req.headers['x-file-name'] ? decodeURIComponent(req.headers['x-file-name']) : ''
  }

  if (!data || !Buffer.isBuffer(data) || data.length < 12 || data.length > 10 * 1024 * 1024) {
    res.status(400)
    throw new Error('Choose an image file under 10 MB')
  }

  const fileExt = path.extname(originalName).replace('.', '').toLowerCase()

  let extension = fileExt || 'png'
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    extension = 'png'
  } else if (data[0] === 255 && data[1] === 216) {
    extension = 'jpg'
  } else if (data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') {
    extension = 'webp'
  } else if (data.subarray(0, 4).equals(Buffer.from('GIF8')) || data.subarray(0, 3).equals(Buffer.from('GIF'))) {
    extension = 'gif'
  } else if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'jfif'].includes(fileExt)) {
    extension = fileExt === 'jpeg' ? 'jpg' : fileExt
  } else {
    res.status(400); throw new Error('Choose a supported image file')
  }

  const cleanName = path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, '_') || crypto.randomUUID()
  const publicId = `divyaswasth/uploads/${cleanName}_${Date.now()}`

  try {
    const result = await uploadStreamToCloudinary(data, {
      public_id: publicId,
      resource_type: 'image',
    })

    sendSuccess(res, {
      statusCode: 201,
      data: {
        media: {
          name: originalName || `${cleanName}.${extension}`,
          url: result.secure_url,
          public_id: result.public_id,
        },
      },
    })
  } catch (err) {
    console.error('Cloudinary media upload failed:', err?.message || err)
    res.status(502)
    throw new Error('Cloudinary upload failed: ' + (err?.message || 'Check server credentials and try again.'))
  }
})

export const deleteMedia = asyncHandler(async (req, res) => {
  const target = req.query.url || req.body?.url
  const publicId = (typeof req.body?.public_id === 'string' && req.body.public_id.startsWith('divyaswasth/'))
    ? req.body.public_id
    : (typeof target === 'string' ? extractPublicId(target) : null)

  if (!publicId) { res.status(400); throw new Error('Only this store Cloudinary images can be deleted') }
  const [products, pages] = await Promise.all([Product.find({ $or: [{ images: target }, { cardImage: target }] }).select('_id').lean(), SiteContent.find().select('content').lean()])
  const contains = value => typeof value === 'string' ? value === target : value && typeof value === 'object' ? Object.values(value).some(contains) : false
  if (products.length || pages.some(page => contains(page.content)) || contains(websiteContent) || contains(catalog)) {
    res.status(409); throw new Error('This image is used by the store. Replace it before deleting.')
  }
  const result = await cloudinary.uploader.destroy(publicId, { invalidate: true })
  if (!['ok', 'not found'].includes(result.result)) { res.status(502); throw new Error('Cloudinary could not delete this image') }
  sendSuccess(res, { message: 'Image deleted from Cloudinary' })
})
