import express from 'express'
import rateLimit from 'express-rate-limit'
import Subscriber from '../models/Subscriber.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
const router = express.Router()
router.post('/', rateLimit({ windowMs: 15 * 60 * 1000, limit: 15, standardHeaders: 'draft-7', legacyHeaders: false }), asyncHandler(async (req, res) => {
  const { email, consent, source = 'website' } = req.body
  if (typeof email !== 'string' || email.length > 160 || !/^\S+@\S+\.\S+$/.test(email) || consent !== true || typeof source !== 'string' || source.length > 80) { res.status(400); throw new Error('A valid email address and subscription consent are required') }
  const normalized = email.toLowerCase().trim()
  try {
    await Subscriber.findOneAndUpdate({ email: normalized }, { $set: { source, consentAt: new Date(), status: 'Subscribed' } }, { upsert: true, runValidators: true })
  } catch (error) { if (error.code !== 11000) throw error }
  sendSuccess(res, { message: 'Thank you for subscribing', data: { subscribed: true } })
}))
export default router
