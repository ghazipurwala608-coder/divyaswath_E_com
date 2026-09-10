import 'dotenv/config'
import assert from 'node:assert/strict'
import dns from 'node:dns'
import { after, before, test } from 'node:test'
import mongoose from 'mongoose'

try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']) } catch {}
import fs from 'node:fs/promises'
import path from 'node:path'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { bootstrapStore } from '../data/bootstrap.js'
import { websiteContent } from '../../../shared/websiteContent.js'

process.env.NODE_ENV = 'test'
const dbName = `divya_swasth_test_${Date.now()}`
let server, base, admin, customer
const { default: app } = await import('../app.js')
const { uploadDirectory } = await import('../controllers/storeAdminController.js')
async function request(route, { token, method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(base + route, { method, headers: { ...(body && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }), ...headers }, body: Buffer.isBuffer(body) ? body : body ? JSON.stringify(body) : undefined })
  const result = await response.json()
  return { status: response.status, ...result, payload: result.data }
}
before(async () => {
  assert.ok(process.env.MONGO_URI, 'Configure MONGO_URI to run integration tests')
  await mongoose.connect(process.env.MONGO_URI, { dbName, serverSelectionTimeoutMS: 10000 })
  await bootstrapStore()
  await User.create({ name: 'Test Admin', email: 'admin@integration.example', phone: '9876543210', password: 'IntegrationOnly!123', isAdmin: true })
  server = app.listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}/api`
  admin = (await request('/auth/login', { method: 'POST', body: { email: 'admin@integration.example', password: 'IntegrationOnly!123' } })).payload.token
  customer = (await request('/auth/register', { method: 'POST', body: { name: 'Test Customer', email: 'customer@integration.example', phone: '9876501234', password: 'IntegrationOnly!123', isAdmin: true } })).payload.token
})
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve))
  // The generated database is isolated; this guard prevents deleting the configured store.
  if (mongoose.connection.readyState === 1 && mongoose.connection.name === dbName && /^divya_swasth_test_\d+$/.test(dbName)) await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})
test('catalog and every original page are seeded without removing or overwriting records', async () => {
  const list = await request('/products?limit=50')
  assert.equal(list.status, 200); assert.equal(list.payload.products.length, 6)
  assert.ok(list.payload.products.some(item => item.slug === 'endless-daily-wellness'))
  const product = list.payload.products[0]
  await Product.updateOne({ _id: product._id }, { $set: { price: 2345 } })
  const again = await bootstrapStore()
  assert.deepEqual(again, { productsInserted: 0, pagesInserted: 0 })
  assert.equal((await Product.findById(product._id)).price, 2345)
  const content = await request('/content')
  assert.equal(Object.keys(content.payload.pages).length, Object.keys(websiteContent).length)
  assert.equal(content.payload.pages.home.sections.homeFormulations.length, 4)
  assert.equal(content.payload.pages.ingredients.sections.ingredients.length, 8)
})
test('admin APIs reject guests and customers; registration cannot grant admin access', async () => {
  for (const endpoint of ['/admin/dashboard', '/admin/products', '/admin/customers', '/admin/messages', '/admin/subscribers', '/admin/content', '/admin/media']) {
    assert.equal((await request(endpoint)).status, 401)
    assert.equal((await request(endpoint, { token: customer })).status, 403)
    assert.equal((await request(endpoint, { token: admin })).status, 200)
  }
})
test('content saves reach the public API; card removal, unsafe URLs and stale edits are rejected', async () => {
  const { payload } = await request('/admin/content', { token: admin })
  const page = payload.pages.find(item => item.key === 'home')
  const content = structuredClone(page.content)
  content.text.natural_healing = 'NATURAL WELLNESS'
  const saved = await request('/admin/content/home', { token: admin, method: 'PUT', body: { content, revision: page.revision } })
  assert.equal(saved.status, 200)
  assert.equal((await request('/content')).payload.pages.home.text.natural_healing, 'NATURAL WELLNESS')
  assert.equal((await request('/admin/content/home', { token: admin, method: 'PUT', body: { content, revision: page.revision } })).status, 409)
  const invalid = structuredClone(content); invalid.sections.homeFormulations.pop()
  assert.equal((await request('/admin/content/home', { token: admin, method: 'PUT', body: { content: invalid, revision: saved.payload.page.revision } })).status, 400)
  content.media.src_1 = 'javascript:alert(1)'
  assert.equal((await request('/admin/content/home', { token: admin, method: 'PUT', body: { content, revision: saved.payload.page.revision } })).status, 400)
})
test('products support admin updates with validation and preserve original URLs and listings', async () => {
  const product = (await request('/admin/products', { token: admin })).payload.products[0]
  const saved = await request(`/products/id/${product._id}`, { token: admin, method: 'PUT', body: { __v: product.__v, name: 'Updated Lean Shape', price: 2100 } })
  assert.equal(saved.status, 200)
  assert.equal((await request(`/products/${product.slug}`)).payload.product.name, 'Updated Lean Shape')
  assert.equal(saved.payload.product.slug, product.slug)
  assert.equal((await request(`/products/id/${product._id}`, { token: admin, method: 'PUT', body: { __v: product.__v, price: 1 } })).status, 409)
  assert.equal((await request(`/products/id/${product._id}`, { token: admin, method: 'PUT', body: { __v: saved.payload.product.__v, countInStock: -1 } })).status, 400)
  assert.equal((await request(`/products/id/${product._id}`, { token: admin, method: 'DELETE' })).status, 400)
  const copy = { ...saved.payload.product, slug: 'integration-new-product', name: 'New test product' }
  const created = await request('/products', { token: admin, method: 'POST', body: copy })
  assert.equal(created.status, 201)
  await bootstrapStore()
  assert.equal((await request('/products/integration-new-product')).status, 200)
})
test('contact enquiries and consented subscriptions persist and can be managed', async () => {
  const sent = await request('/contact', { method: 'POST', body: { name: 'Test enquiry', email: 'enquiry@integration.example', subject: 'Delivery question', message: 'Please confirm delivery information.' } })
  assert.equal(sent.status, 201)
  const messages = (await request('/admin/messages', { token: admin })).payload.messages
  assert.ok(messages.some(item => item._id === sent.payload.referenceId))
  assert.equal((await request(`/admin/messages/${sent.payload.referenceId}`, { token: admin, method: 'PATCH', body: { status: 'Resolved' } })).payload.message.status, 'Resolved')
  assert.equal((await request('/newsletter', { method: 'POST', body: { email: 'newsletter@integration.example' } })).status, 400)
  for (let index = 0; index < 2; index++) assert.equal((await request('/newsletter', { method: 'POST', body: { email: 'newsletter@integration.example', consent: true, source: 'test' } })).status, 200)
  const subscribers = (await request('/admin/subscribers', { token: admin })).payload.subscribers
  assert.equal(subscribers.length, 1)
  assert.equal((await request(`/admin/subscribers/${subscribers[0]._id}`, { token: admin, method: 'PATCH', body: { status: 'Unsubscribed' } })).payload.subscriber.status, 'Unsubscribed')
})
const shippingAddress = { fullName: 'Test Customer', email: 'customer@integration.example', phone: '9876501234', addressLine: 'Integration test address', city: 'Panchkula', state: 'Haryana', postalCode: '134114', country: 'India' }
test('checkout uses database prices and shipping; reserves stock; cancellation restores stock once', async () => {
  const pages = (await request('/admin/content', { token: admin })).payload.pages
  const settings = pages.find(item => item.key === 'settings')
  settings.content.shipping = { fee: 125, freeAbove: 10000, estimatedDays: 5 }
  assert.equal((await request('/admin/content/settings', { token: admin, method: 'PUT', body: { content: settings.content, revision: settings.revision } })).status, 200)
  const product = await Product.findOne({ slug: 'sugar-shield-blood-sugar-support' })
  const body = { items: [{ product: product.id, slug: product.slug, quantity: 2, price: 1 }], shippingAddress, paymentMethod: 'COD' }
  const placed = await request('/orders', { token: customer, method: 'POST', body })
  assert.equal(placed.status, 201)
  const order = placed.payload.order
  assert.equal(order.itemsPrice, product.price * 2); assert.equal(order.shippingPrice, 125)
  assert.equal((await Product.findById(product.id)).countInStock, product.countInStock - 2)
  assert.equal((await request('/orders/my', { token: customer })).payload.orders.length, 1)
  assert.equal((await request('/orders/admin/all', { token: admin })).payload.orders.length, 1)
  const cancelled = await request(`/orders/${order._id}/status`, { token: admin, method: 'PUT', body: { orderStatus: 'Cancelled' } })
  assert.equal(cancelled.status, 200)
  assert.equal((await Product.findById(product.id)).countInStock, product.countInStock)
  await request(`/orders/${order._id}/status`, { token: admin, method: 'PUT', body: { orderStatus: 'Cancelled' } })
  assert.equal((await Product.findById(product.id)).countInStock, product.countInStock)
  body.items[0].quantity = 1.5
  assert.equal((await request('/orders', { token: customer, method: 'POST', body })).status, 400)
  const unavailable = await Product.findOne({ slug: 'endless-daily-wellness' })
  body.items = [{ product: unavailable.id, slug: unavailable.slug, quantity: 1 }]
  assert.equal((await request('/orders', { token: customer, method: 'POST', body })).status, 400)
})
test('concurrent checkout cannot oversell the final unit', async () => {
  const product = await Product.findOneAndUpdate({ slug: 'integration-new-product' }, { $set: { countInStock: 1, availableForPurchase: true } }, { new: true })
  const body = { items: [{ product: product.id, slug: product.slug, quantity: 1 }], shippingAddress, paymentMethod: 'COD' }
  const results = await Promise.all([request('/orders', { token: customer, method: 'POST', body }), request('/orders', { token: customer, method: 'POST', body })])
  assert.equal(results.filter(result => result.status === 201).length, 1)
  assert.equal((await Product.findById(product.id)).countInStock, 0)
})
test('dashboard totals, customers and goal recommendations use database records', async () => {
  const dashboard = (await request('/admin/dashboard', { token: admin })).payload
  assert.equal(dashboard.stats.users, 1)
  assert.equal(dashboard.stats.orders, await Order.countDocuments())
  assert.equal(dashboard.stats.revenue, 0)
  const customers = (await request('/admin/customers', { token: admin })).payload.customers
  assert.equal(customers.length, 1); assert.equal(customers[0].password, undefined)
  assert.equal((await request(`/admin/customers/${customers[0]._id}`, { token: admin })).status, 200)
  assert.equal((await request('/wellness/recommendations?goal=3')).payload.products[0].slug, 'lean-shape-garcinia-cambogia')
  assert.equal((await request('/wellness/recommendations?goal=100')).status, 400)
})
test('media library lists existing assets and accepts only supported image uploads', async () => {
  const media = (await request('/admin/media', { token: admin })).payload.media
  assert.ok(media.some(item => item.url === '/images/home/Vital.png'))
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')
  const uploaded = await request('/admin/media', { token: admin, method: 'POST', body: png, headers: { 'Content-Type': 'application/octet-stream' } })
  assert.equal(uploaded.status, 201)
  try { assert.equal((await fetch(base.replace('/api', '') + uploaded.payload.media.url)).status, 200) }
  finally { await fs.unlink(path.join(uploadDirectory, uploaded.payload.media.name)) }
  assert.equal((await request('/admin/media', { token: admin, method: 'POST', body: Buffer.from('<svg>untrusted</svg>'), headers: { 'Content-Type': 'application/octet-stream' } })).status, 400)
})
