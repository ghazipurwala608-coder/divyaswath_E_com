import Product from '../models/Product.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

const cleanRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const createSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50)
  const filter = { isActive: true }
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category
  if (req.query.featured === 'true') filter.featured = true
  if (req.query.search) {
    const search = new RegExp(cleanRegex(req.query.search), 'i')
    filter.$or = [{ name: search }, { subtitle: search }, { category: search }, { ingredients: search }]
  }
  const sortMap = { low: { price: 1 }, high: { price: -1 }, rating: { rating: -1 }, newest: { createdAt: -1 } }
  const sort = sortMap[req.query.sort] || { featured: -1, createdAt: -1 }
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ])
  sendSuccess(res, {
    message: 'Products fetched successfully',
    data: { products },
    meta: { page, pages: Math.ceil(total / limit), total, limit },
  })
})

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
  if (!product) { res.status(404); throw new Error('Product not found') }
  sendSuccess(res, { message: 'Product fetched successfully', data: { product } })
})

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, slug: req.body.slug || createSlug(req.body.name) })
  sendSuccess(res, { statusCode: 201, message: 'Product created successfully', data: { product } })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const updates = { ...req.body }
  if (updates.name && !updates.slug) updates.slug = createSlug(updates.name)
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
  if (!product) { res.status(404); throw new Error('Product not found') }
  sendSuccess(res, { message: 'Product updated successfully', data: { product } })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
  if (!product) { res.status(404); throw new Error('Product not found') }
  sendSuccess(res, { message: 'Product archived successfully', data: { product } })
})
