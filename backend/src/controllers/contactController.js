import ContactMessage from '../models/ContactMessage.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone = '', subject, message } = req.body
  if (![name, email, subject, message].every((value) => String(value || '').trim())) {
    res.status(400)
    throw new Error('Name, email, subject and message are required')
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400)
    throw new Error('Please enter a valid email address')
  }
  const contactMessage = await ContactMessage.create({ name, email, phone, subject, message })
  sendSuccess(res, {
    statusCode: 201,
    message: 'Your message has been received. Our care team will respond soon.',
    data: { referenceId: contactMessage._id },
  })
})

