import express from 'express'
import SiteContent from '../models/SiteContent.js'
import Product from '../models/Product.js'
import { websiteContent } from '../../../shared/websiteContent.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
const router = express.Router()
router.get('/recommendations', asyncHandler(async (req, res) => {
  const settings = (await SiteContent.findOne({ key: 'settings' }).lean())?.content || websiteContent.settings
  const index = Number(req.query.goal)
  if (!Number.isInteger(index) || index < 0 || index >= settings.recommendations.length) { res.status(400); throw new Error('Choose a wellness goal') }
  const selection = settings.recommendations[index]
  const products = await Product.find({ slug: { $in: selection.slugs }, isActive: true }).sort({ sortOrder: 1 })
  sendSuccess(res, { data: { goal: selection.goal, products } })
}))
export default router
