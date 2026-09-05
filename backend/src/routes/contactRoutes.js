import express from 'express'
import rateLimit from 'express-rate-limit'
import { createContactMessage } from '../controllers/contactController.js'

const router = express.Router()
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: 'Too many messages. Please try again shortly.', data: null },
})

router.post('/', contactLimiter, createContactMessage)

export default router
