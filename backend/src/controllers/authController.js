import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import generateToken from '../utils/generateToken.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { roleOf } from '../utils/roles.js'
import { staffAccessError } from '../middleware/authMiddleware.js'

const userPayload = (user) => ({ _id: user._id, name: user.name, email: user.email, phone: user.phone, role: roleOf(user), isAdmin: roleOf(user) === 'admin', isDriver: roleOf(user) === 'delivery_boy', deliveryActive: user.deliveryActive, deliveryArea: user.deliveryArea, accountActive: user.accountActive, ...(roleOf(user) === 'admin' && { subscription: user.subscription }) })

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !password) {
    res.status(400)
    throw new Error('Name, email, phone and password are required')
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400)
    throw new Error('Please enter a valid email address')
  }
  if (!/^\d{10}$/.test(phone)) {
    res.status(400)
    throw new Error('Please enter a valid 10 digit phone number')
  }
  if (password.length < 8) {
    res.status(400)
    throw new Error('Password must be at least 8 characters')
  }
  if (await User.exists({ email: email.toLowerCase() })) {
    res.status(409)
    throw new Error('An account with this email already exists')
  }

  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), phone, password })
  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user: userPayload(user), token: generateToken(user._id), tokenType: 'Bearer', expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password')
  if (!user || !(await user.comparePassword(password || ''))) {
    res.status(401)
    throw new Error('Incorrect email or password')
  }
  if (req.body.portal === 'delivery' && roleOf(user) !== 'delivery_boy') {
    res.status(403)
    throw new Error('Use the delivery partner account provided by your admin')
  }
  const accessError = await staffAccessError(user)
  if (accessError) {
    res.status(403)
    throw new Error(accessError)
  }
  sendSuccess(res, {
    message: 'Signed in successfully',
    data: { user: userPayload(user), token: generateToken(user._id), tokenType: 'Bearer', expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  })
})

export const profile = asyncHandler(async (req, res) => {
  sendSuccess(res, { message: 'Profile fetched successfully', data: { user: userPayload(req.user) } })
})
