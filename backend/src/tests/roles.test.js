import 'dotenv/config'
import dns from 'dns'
import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import mongoose from 'mongoose'

try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']) } catch (e) {}
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import { roleOf, adminAccess } from '../utils/roles.js'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET ||= 'role-integration-test-secret-only'
const { default: app } = await import('../app.js')
const dbName = `divya_roles_test_${Date.now()}`
let server, base, superToken, adminToken, driverToken, customerToken, adminId
const future = new Date(Date.now() + 86400000 * 45).toISOString().slice(0, 10)
async function request(path, token, method = 'GET', body) {
  const response = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, ...(body && { body: JSON.stringify(body) }) })
  return { status: response.status, ...await response.json() }
}
before(async () => {
  assert.ok(process.env.MONGO_URI, 'Configure MONGO_URI for integration tests')
  await mongoose.connect(process.env.MONGO_URI, { dbName, serverSelectionTimeoutMS: 10000 })
  const create = (name, role, extra = {}) => User.create({ name, email: `${name}@roles.example`, phone: '9876543210', password: 'RolesTest!123', role, ...extra })
  superToken = generateToken((await create('owner', 'super_admin'))._id)
  const admin = await create('admin', 'admin', { subscription: { plan: 'Annual', status: 'active', expiresAt: new Date(`${future}T23:59:59Z`) } })
  adminId = admin.id; adminToken = generateToken(admin._id)
  driverToken = generateToken((await create('driver', 'delivery_boy', { managedBy: admin._id }))._id)
  customerToken = generateToken((await create('customer', 'customer'))._id)
  server = app.listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}/api`
})
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve))
  if (mongoose.connection.readyState === 1 && mongoose.connection.name === dbName && /^divya_roles_test_\d+$/.test(dbName)) await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})

test('explicit roles and legacy accounts resolve without granting super-admin store access', async () => {
  assert.equal(roleOf({ isAdmin: true }), 'admin')
  assert.equal(roleOf({ isDriver: true }), 'delivery_boy')
  assert.equal(roleOf({ role: 'customer', isAdmin: true }), 'customer')
  assert.equal(adminAccess({ role: 'super_admin', isAdmin: true }), false)
  assert.equal((await request('/super-admin/admins')).status, 401)
  for (const token of [adminToken, driverToken, customerToken]) assert.equal((await request('/super-admin/admins', token)).status, 403)
  assert.equal((await request('/super-admin/admins', superToken)).status, 200)
  assert.equal((await request('/admin/dashboard', superToken)).status, 403)
  assert.equal((await request('/admin/dashboard', driverToken)).status, 403)
  assert.equal((await request('/delivery/orders', adminToken)).status, 403)
  assert.equal((await request('/delivery/orders', driverToken)).status, 200)
  assert.equal((await request('/admin/dashboard', adminToken)).status, 200)
})

test('super admin manages admins and manual subscriptions with validation and audit history', async () => {
  const body = { name: 'New Admin', email: 'new@roles.example', phone: '9876543210', password: 'RolesTest!123', role: 'super_admin', subscription: { plan: 'Monthly', status: 'active', expiresAt: future } }
  assert.equal((await request('/super-admin/admins', adminToken, 'POST', body)).status, 403)
  const created = await request('/super-admin/admins', superToken, 'POST', body)
  assert.equal(created.status, 201)
  assert.equal(created.data.admin.role, 'admin')
  assert.equal(created.data.admin.password, undefined)
  assert.equal(created.data.admin.accessStatus, 'active')
  assert.equal((await request('/super-admin/admins', superToken, 'POST', body)).status, 409)
  const path = `/super-admin/admins/${created.data.admin._id}`
  assert.equal((await request(path, superToken, 'PUT', { subscription: { plan: 'Bad date', status: 'active', expiresAt: '2027-02-31' } })).status, 400)
  assert.equal((await request(path, superToken, 'PUT', { role: 'super_admin' })).status, 400)
  assert.equal((await request(path, superToken, 'PUT', { password: 'ChangedPass!123' })).status, 200)
  assert.equal((await request('/auth/login', null, 'POST', { email: body.email, password: 'ChangedPass!123' })).data.user.role, 'admin')
  const list = await request('/super-admin/admins', superToken)
  assert.ok(list.data.events.length >= 2)
  assert.equal(JSON.stringify(list.data).includes('ChangedPass!123'), false)
  const registered = await request('/auth/register', null, 'POST', { name: 'Shopper', email: 'shopper@roles.example', phone: '9876543210', password: 'RolesTest!123', role: 'super_admin', isAdmin: true })
  assert.equal(registered.data.user.role, 'customer')
})

test('expiry, pause and account disable immediately revoke existing admin and team tokens', async () => {
  const path = `/super-admin/admins/${adminId}`
  for (const patch of [
    { subscription: { plan: 'Expired', status: 'active', expiresAt: '2000-01-01' } },
    { subscription: { plan: 'Paused', status: 'paused', expiresAt: future } },
    { accountActive: false },
  ]) {
    assert.equal((await request(path, superToken, 'PUT', patch)).status, 200)
    assert.equal((await request('/admin/dashboard', adminToken)).status, 403)
    assert.equal((await request('/delivery/team', adminToken)).status, 403)
    assert.equal((await request('/delivery/orders', driverToken)).status, 403)
    assert.equal((await request('/auth/login', null, 'POST', { email: 'admin@roles.example', password: 'RolesTest!123' })).status, 403)
    assert.equal((await request('/auth/login', null, 'POST', { email: 'driver@roles.example', password: 'RolesTest!123', portal: 'delivery' })).status, 403)
    assert.equal((await request(path, superToken, 'PUT', { accountActive: true, subscription: { plan: 'Renewed', status: 'active', expiresAt: future } })).status, 200)
    assert.equal((await request('/admin/dashboard', adminToken)).status, 200)
    assert.equal((await request('/delivery/orders', driverToken)).status, 200)
  }
})
