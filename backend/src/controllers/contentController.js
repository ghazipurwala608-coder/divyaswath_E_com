import SiteContent from '../models/SiteContent.js'
import { websiteContent } from '../../../shared/websiteContent.js'
import { validateContent } from '../../../shared/contentValidation.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const getContent = asyncHandler(async (req, res) => {
  const records = await SiteContent.find().lean()
  const pages = { ...websiteContent }
  records.forEach(record => { if (websiteContent[record.key]) pages[record.key] = record.content })
  sendSuccess(res, { data: { pages } })
})
export const getAdminContent = asyncHandler(async (req, res) => {
  const records = await SiteContent.find().select('-updatedBy').lean()
  const recordMap = new Map(records.map(r => [r.key, r]))
  const pages = Object.entries(websiteContent).map(([key, defaultContent]) => {
    const existing = recordMap.get(key)
    return {
      key,
      content: existing ? existing.content : defaultContent,
      revision: existing ? existing.revision : 0,
      updatedAt: existing?.updatedAt || new Date().toISOString()
    }
  })
  sendSuccess(res, { data: { pages } })
})
export const updateContent = asyncHandler(async (req, res) => {
  const template = Object.hasOwn(websiteContent, req.params.key) ? websiteContent[req.params.key] : null
  if (!template) { res.status(404); throw new Error('Page not found') }
  try { validateContent(req.body.content, template) } catch (error) { res.status(400); throw error }
  if (req.params.key === 'settings') {
    const { fee, freeAbove, estimatedDays } = req.body.content?.shipping || {}
    if ([fee, freeAbove].some(value => value < 0 || value > 100000) || !Number.isInteger(estimatedDays) || estimatedDays < 1 || estimatedDays > 90) { res.status(400); throw new Error('Enter valid shipping charges and delivery days (1–90)') }
  }
  if (!Number.isInteger(req.body.revision)) { res.status(400); throw new Error('A valid content revision is required') }

  let page = await SiteContent.findOne({ key: req.params.key })
  if (!page) {
    page = await SiteContent.create({
      key: req.params.key,
      content: req.body.content,
      revision: 1,
      updatedBy: req.user._id,
    })
  } else {
    if (page.revision !== req.body.revision) {
      res.status(409); throw new Error('This page changed in another session. Reload before saving.')
    }
    page.content = req.body.content
    page.revision += 1
    page.updatedBy = req.user._id
    await page.save()
  }
  sendSuccess(res, { message: 'Website content saved', data: { page } })
})
