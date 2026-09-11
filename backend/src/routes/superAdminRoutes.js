import express from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import AdminAccessEvent from '../models/AdminAccessEvent.js'
import { protect, superAdminOnly } from '../middleware/authMiddleware.js'
import { adminAccess, adminQuery } from '../utils/roles.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

const router = express.Router()
router.use(protect, superAdminOnly)
const fail = (res, message, status = 400) => { res.status(status); throw new Error(message) }
const fields = 'name email phone role accountActive subscription createdAt'
const summary = user => ({ ...user.toObject(), accessStatus: user.accountActive === false ? 'disabled' : user.subscription?.status === 'paused' ? 'paused' : adminAccess(user) ? 'active' : 'expired' })
function validate(body, res, creating) {
  const patch = {}
  for (const [key, max] of [['name', 80], ['email', 254], ['phone', 10]]) {
    if (creating || body[key] !== undefined) {
      if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > max) fail(res, `Enter a valid ${key}`)
      patch[key] = body[key].trim()
    }
  }
  if (patch.email) {
    patch.email = patch.email.toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(patch.email)) fail(res, 'Enter a valid email')
  }
  if (patch.phone && !/^\d{10}$/.test(patch.phone)) fail(res, 'Enter a 10 digit phone number')
  if (creating || body.password !== undefined) {
    if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 72) fail(res, 'Password must contain 8–72 characters')
    patch.password = body.password
  }
  if (creating || body.subscription !== undefined) {
    const value = body.subscription
    if (!value || typeof value.plan !== 'string' || !value.plan.trim() || value.plan.length > 80 || !['active', 'paused'].includes(value.status)) fail(res, 'Enter a plan and valid subscription status')
    if (typeof value.expiresAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.expiresAt)) fail(res, 'Choose an expiry date')
    const expiry = new Date(`${value.expiresAt}T23:59:59.999+05:30`)
    if (Number.isNaN(expiry.getTime()) || new Date(`${value.expiresAt}T12:00:00Z`).toISOString().slice(0, 10) !== value.expiresAt) fail(res, 'Choose a valid expiry date')
    patch.subscription = { plan: value.plan.trim(), status: value.status, expiresAt: expiry }
  }
  if (body.accountActive !== undefined) {
    if (typeof body.accountActive !== 'boolean') fail(res, 'Account active must be true or false')
    patch.accountActive = body.accountActive
  }
  if (!Object.keys(patch).length) fail(res, 'Provide admin details to update')
  return patch
}
router.get('/admins', asyncHandler(async (req, res) => {
  const admins = await User.find(adminQuery).select(fields).sort({ createdAt: -1 })
  const events = await AdminAccessEvent.find().sort({ createdAt: -1 }).limit(30).populate('admin', 'name email').populate('actor', 'name')
  sendSuccess(res, { data: { admins: admins.map(summary), events } })
}))
router.post('/admins', asyncHandler(async (req, res) => {
  const patch = validate(req.body, res, true)
  if (await User.exists({ email: patch.email })) fail(res, 'This email already has an account', 409)
  const admin = await User.create({ ...patch, role: 'admin' })
  await AdminAccessEvent.create({ admin: admin._id, actor: req.user._id, action: 'Admin created', details: `Plan: ${admin.subscription.plan}; status: ${admin.subscription.status}; expires: ${admin.subscription.expiresAt.toISOString()}` })
  sendSuccess(res, { statusCode: 201, data: { admin: summary(await User.findById(admin._id).select(fields)) } })
}))
router.put('/admins/:id', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) fail(res, 'Invalid admin ID')
  const admin = await User.findOne({ _id: req.params.id, ...adminQuery })
  if (!admin) fail(res, 'Admin not found', 404)
  const patch = validate(req.body, res, false)
  if (patch.email && await User.exists({ email: patch.email, _id: { $ne: admin._id } })) fail(res, 'This email already has an account', 409)
  Object.assign(admin, patch)
  await admin.save()
  await AdminAccessEvent.create({ admin: admin._id, actor: req.user._id, action: 'Admin updated', details: `Changed: ${Object.keys(patch).map(key => key === 'password' ? 'password reset' : key).join(', ')}. Plan: ${admin.subscription.plan}; status: ${admin.subscription.status}; access: ${admin.accountActive ? 'enabled' : 'disabled'}; expires: ${admin.subscription.expiresAt?.toISOString() || 'legacy (no expiry)'}` })
  sendSuccess(res, { data: { admin: summary(await User.findById(admin._id).select(fields)) } })
}))
export default router
