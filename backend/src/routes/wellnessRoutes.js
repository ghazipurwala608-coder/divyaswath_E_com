import express from 'express'
import SiteContent from '../models/SiteContent.js'
import Product from '../models/Product.js'
import AssessmentLead from '../models/AssessmentLead.js'
import { websiteContent } from '../../../shared/websiteContent.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

const router = express.Router()

router.get('/recommendations', asyncHandler(async (req, res) => {
  const settings = (await SiteContent.findOne({ key: 'settings' }).lean())?.content || websiteContent.settings
  const index = Number(req.query.goal)
  if (!Number.isInteger(index) || index < 0 || index >= settings.recommendations.length) { 
    res.status(400)
    throw new Error('Choose a wellness goal') 
  }
  const selection = settings.recommendations[index]
  const products = await Product.find({ slug: { $in: selection.slugs }, isActive: true }).sort({ sortOrder: 1 })
  sendSuccess(res, { data: { goal: selection.goal, products } })
}))

// Public Lead Capture for 1-Min Health Assessment Form
router.post('/assessment-lead', asyncHandler(async (req, res) => {
  const { name, phone, city = '', goal, goalId = '', duration = '', ageGroup = '', productSlug = '', productName = '' } = req.body
  
  if (!name || !String(name).trim()) {
    res.status(400)
    throw new Error('Name is required')
  }

  const cleanPhone = String(phone || '').replace(/\D/g, '')
  if (cleanPhone.length < 10) {
    res.status(400)
    throw new Error('Valid 10-digit mobile number is required')
  }

  if (!goal || !String(goal).trim()) {
    res.status(400)
    throw new Error('Health goal is required')
  }

  const lead = await AssessmentLead.create({
    name: name.trim(),
    phone: cleanPhone,
    city: city ? String(city).trim() : '',
    goal: String(goal).trim(),
    goalId,
    duration,
    ageGroup,
    productSlug,
    productName,
    status: 'New Lead'
  })

  sendSuccess(res, {
    statusCode: 201,
    message: 'Assessment details received successfully. An Ayurvedic doctor will review your profile.',
    data: { referenceId: lead._id, lead }
  })
}))

export default router
