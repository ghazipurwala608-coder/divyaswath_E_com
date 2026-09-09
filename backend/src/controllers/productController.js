import Product from '../models/Product.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { initialProducts } from '../../../shared/catalog.js'

const editableFields = ['slug', 'name', 'subtitle', 'category', 'price', 'mrp', 'countInStock', 'badge', 'theme', 'featured', 'shortDescription', 'description', 'ingredients', 'benefits', 'size', 'usage', 'form', 'classification', 'vegetarian', 'storage', 'disclaimer', 'images', 'imageStatus', 'availableForPurchase', 'cardImage', 'sortOrder']
function productInput(body, res) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) { res.status(400); throw new Error('Product details are required') }
  const updates = Object.fromEntries(editableFields.filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]))
  for (const field of ['price', 'mrp', 'countInStock', 'sortOrder']) {
    if (Object.hasOwn(updates, field) && (typeof updates[field] !== 'number' || !Number.isFinite(updates[field]) || updates[field] < 0 || (['countInStock', 'sortOrder'].includes(field) && !Number.isInteger(updates[field])))) { res.status(400); throw new Error(`${field} must be a valid non-negative number`) }
  }
  if (updates.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(updates.slug)) { res.status(400); throw new Error('Use lowercase letters, numbers and hyphens for the product slug') }
  for (const url of [...(Array.isArray(updates.images) ? updates.images : []), ...(updates.cardImage ? [updates.cardImage] : [])]) {
    if (typeof url !== 'string' || !/^(\/[^/]|https?:\/\/)/.test(url)) { res.status(400); throw new Error('Images must use a local path or an HTTP(S) URL') }
  }
  return updates
}

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
  const sort = sortMap[req.query.sort] || { sortOrder: 1, createdAt: 1 }
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ])
  sendSuccess(res, {
    message: 'Products fetched successfully',
    data: { products, total, page, pages: Math.ceil(total / limit) },
    meta: { page, pages: Math.ceil(total / limit), total, limit },
  })
})

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
  if (!product) { res.status(404); throw new Error('Product not found') }
  sendSuccess(res, { message: 'Product fetched successfully', data: { product } })
})

export const createProduct = asyncHandler(async (req, res) => {
  const input = productInput(req.body, res)
  if (!input.name) { res.status(400); throw new Error('Product name is required') }
  const product = await Product.create({ ...input, slug: input.slug || createSlug(input.name) })
  sendSuccess(res, { statusCode: 201, message: 'Product created successfully', data: { product } })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const updates = productInput(req.body, res)
  const product = await Product.findById(req.params.id)
  if (!product) { res.status(404); throw new Error('Product not found') }
  if (updates.slug && updates.slug !== product.slug) { res.status(400); throw new Error('Existing product links are permanent. Keep the current slug.') }
  if (req.body.__v !== product.__v) { res.status(409); throw new Error('This product changed. Refresh before saving.') }
  Object.assign(product, updates)
  await product.save()
  sendSuccess(res, { message: 'Product updated successfully', data: { product } })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const existing = await Product.findById(req.params.id)
  if (initialProducts.some(item => item.slug === existing?.slug)) { res.status(400); throw new Error('Original catalog products are preserved. Update stock or availability instead.') }
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
  if (!product) { res.status(404); throw new Error('Product not found') }
  sendSuccess(res, { message: 'Product archived successfully', data: { product } })
})
