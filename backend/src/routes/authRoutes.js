import express from 'express'
import rateLimit from 'express-rate-limit'
import { login, profile, register } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, statusCode: 429, message: 'Too many attempts. Please try again shortly.', data: null } })

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/profile', protect, profile)

export default router
