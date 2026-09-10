import 'dotenv/config'
import assert from 'node:assert/strict'
import dns from 'node:dns'
import { before, after, test } from 'node:test'
import mongoose from 'mongoose'

try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']) } catch {}
import User from '../models/User.js'
import Order from '../models/Order.js'
import generateToken from '../utils/generateToken.js'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET ||= 'delivery-integration-test-secret-only'
const { default: app } = await import('../app.js')
const dbName = `divya_delivery_test_${Date.now()}`
let server, base, admin, customer, outsider, driver, driverId, orderId
const address = { fullName: 'Delivery Test', email: 'customer@delivery.example', phone: '9876543210', addressLine: 'Sector 4', city: 'Noida', state: 'UP', postalCode: '201301' }
async function request(path, token, method = 'GET', body) {
  const response = await fetch(base + path, { method, headers: { ...(token && { Authorization: `Bearer ${token}` }), 'Content-Type': 'application/json' }, ...(body && { body: JSON.stringify(body) }) })
  return { status: response.status, ...(await response.json()) }
}
before(async () => {
  assert.ok(process.env.MONGO_URI, 'Configure MONGO_URI to run delivery integration tests')
  await mongoose.connect(process.env.MONGO_URI, { dbName, serverSelectionTimeoutMS: 10000 })
  const makeUser = async (name, flags = {}) => User.create({ name, email: `${name}@delivery.example`, phone: '9876543210', password: 'DeliveryTest!123', ...flags })
  admin = generateToken((await makeUser('admin', { isAdmin: true }))._id)
  const owner = await makeUser('customer')
  customer = generateToken(owner._id)
  outsider = generateToken((await makeUser('outsider'))._id)
  const order = await Order.create({ user: owner._id, shippingAddress: address, items: [{ product: 'test-product', slug: 'test-product', name: 'Test product', price: 500, quantity: 1 }], itemsPrice: 500, shippingPrice: 0, totalPrice: 500, orderStatus: 'Packed' })
  orderId = order.id
  server = app.listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}/api`
})
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve))
  if (mongoose.connection.readyState === 1 && mongoose.connection.name === dbName && /^divya_delivery_test_\d+$/.test(dbName)) await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})
test('admin creates and assigns a partner; only an active assigned driver can update the order', async () => {
  assert.equal((await request('/delivery/team')).status, 401)
  assert.equal((await request('/delivery/team', customer)).status, 403)
  const created = await request('/delivery/team', admin, 'POST', { name: 'Partner', email: 'partner@delivery.example', phone: '9876543210', password: 'DeliveryTest!123', deliveryArea: 'Noida 201301', isAdmin: true })
  assert.equal(created.status, 201)
  driverId = created.data.driver._id
  const login = await request('/auth/login', null, 'POST', { email: 'partner@delivery.example', password: 'DeliveryTest!123' })
  assert.equal(login.data.user.isDriver, true); assert.equal(login.data.user.isAdmin, false)
  driver = login.data.token
  assert.equal((await request(`/delivery/orders/${orderId}/update`, driver, 'PUT', { location: 'Store', status: 'Shipped' })).status, 404)
  assert.equal((await request(`/delivery/orders/${orderId}/assign`, admin, 'PUT', { driverId })).status, 200)
  assert.equal((await request('/delivery/orders', driver)).data.orders.length, 1)
  assert.equal((await request(`/delivery/orders/${orderId}/update`, customer, 'PUT', { location: 'Store' })).status, 403)
  assert.equal((await request(`/delivery/orders/${orderId}/update`, driver, 'PUT', { location: 'Store', status: 'Out for Delivery' })).status, 400)
  assert.equal((await request(`/delivery/orders/${orderId}/update`, driver, 'PUT', { location: 'Store', status: 'Shipped' })).status, 200)
  const update = await request(`/delivery/orders/${orderId}/update`, driver, 'PUT', { location: 'Sector 4', status: 'Out for Delivery', coordinates: { latitude: 28.6, longitude: 77.3 } })
  assert.equal(update.status, 200); assert.equal(update.data.order.deliveryCoordinates.latitude, 28.6)
  assert.equal(update.data.order.trackingEvents.at(-1).location, 'Sector 4')
  assert.equal((await request(`/delivery/orders/${orderId}/update`, driver, 'PUT', { location: 'Bad GPS', coordinates: { latitude: 100, longitude: 2 } })).status, 400)
  await request(`/delivery/team/${driverId}`, admin, 'PUT', { deliveryActive: false })
  assert.equal((await request('/delivery/orders', driver)).status, 403)
  await request(`/delivery/team/${driverId}`, admin, 'PUT', { deliveryActive: true })
})
test('customer-only OTP, wrong-attempt lockout, expiry, reassignment and verified COD completion', async () => {
  assert.equal((await request(`/orders/${orderId}`, outsider)).status, 403)
  assert.equal((await request(`/orders/${orderId}`)).status, 401)
  assert.equal((await request(`/delivery/orders/${orderId}/otp`, driver, 'POST')).status, 404)
  assert.equal((await request(`/delivery/orders/${orderId}/otp`, outsider, 'POST')).status, 404)
  const code = await request(`/delivery/orders/${orderId}/otp`, customer, 'POST')
  assert.match(code.data.otp, /^\d{6}$/)
  for (const [path, token] of [[`/orders/${orderId}`, customer], ['/delivery/orders', driver], ['/orders/admin/all', admin], ['/orders/my', customer]]) {
    const result = await request(path, token)
    assert.equal(JSON.stringify(result).includes('"deliveryOtp"'), false)
  }
  assert.equal((await request(`/orders/${orderId}/status`, admin, 'PUT', { orderStatus: 'Delivered' })).status, 400)
  for (let i = 0; i < 5; i++) assert.equal((await request(`/delivery/orders/${orderId}/complete`, driver, 'POST', { otp: '000000' })).status, 400)
  assert.equal((await request(`/delivery/orders/${orderId}/complete`, driver, 'POST', { otp: code.data.otp, cashCollected: true })).status, 429)
  await Order.updateOne({ _id: orderId }, { $set: { deliveryOtpExpiresAt: new Date(Date.now() - 1000) } })
  assert.equal((await request(`/delivery/orders/${orderId}/complete`, driver, 'POST', { otp: code.data.otp, cashCollected: true })).status, 400)
  const nextDriver = await User.create({ name: 'Replacement', email: 'replacement@delivery.example', phone: '9876543210', password: 'DeliveryTest!123', isDriver: true })
  await request(`/delivery/orders/${orderId}/assign`, admin, 'PUT', { driverId: nextDriver.id })
  assert.equal((await request(`/delivery/orders/${orderId}/update`, driver, 'PUT', { location: 'Old driver' })).status, 404)
  driver = generateToken(nextDriver._id)
  assert.equal((await request(`/delivery/orders/${orderId}/complete`, driver, 'POST', { otp: code.data.otp, cashCollected: true })).status, 400)
  const fresh = (await request(`/delivery/orders/${orderId}/otp`, customer, 'POST')).data.otp
  assert.equal((await request(`/delivery/orders/${orderId}/complete`, driver, 'POST', { otp: fresh })).status, 400)
  const completed = await request(`/delivery/orders/${orderId}/complete`, driver, 'POST', { otp: fresh, cashCollected: true })
  assert.equal(completed.status, 200); assert.equal(completed.data.order.orderStatus, 'Delivered')
  assert.equal(completed.data.order.paymentStatus, 'Paid'); assert.ok(completed.data.order.deliveryOtpVerifiedAt)
  assert.equal((await request(`/delivery/orders/${orderId}/complete`, driver, 'POST', { otp: fresh, cashCollected: true })).status, 400)
  assert.equal((await request(`/delivery/orders/${orderId}/update`, driver, 'PUT', { location: 'After delivery' })).status, 400)
})
