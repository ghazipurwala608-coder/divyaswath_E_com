import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401)
    throw new Error('Please sign in to continue')
  }

  try {
    const token = header.slice(7).trim()
    if (!token) throw new Error('Token is missing')
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'divya-swasth-api',
      audience: 'divya-swasth-storefront',
      algorithms: ['HS256'],
    })
    req.user = await User.findById(decoded.sub)
    if (!req.user) throw new Error('User no longer exists')
    next()
  } catch {
    res.status(401)
    throw new Error('Your session is invalid or has expired')
  }
})

export const optionalProtect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.slice(7).trim()
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          issuer: 'divya-swasth-api',
          audience: 'divya-swasth-storefront',
          algorithms: ['HS256'],
        })
        req.user = await User.findById(decoded.sub)
      }
    } catch {
      // Ignore optional token errors
    }
  }
  next()
})

export function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) {
    res.status(403)
    return next(new Error('Admin access required'))
  }
  next()
}

