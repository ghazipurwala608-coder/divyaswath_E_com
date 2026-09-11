import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import { adminAccess, roleOf } from '../utils/roles.js'

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
  if (roleOf(req.user) !== 'admin') {
    res.status(403)
    return next(new Error('Admin access required'))
  }
  if (!adminAccess(req.user)) {
    res.status(403)
    return next(new Error('Your admin access is paused or your subscription has expired. Contact the Super Admin.'))
  }
  next()
}

export function superAdminOnly(req, res, next) {
  if (roleOf(req.user) !== 'super_admin' || req.user.accountActive === false) {
    res.status(403)
    return next(new Error('Super Admin access required'))
  }
  next()
}

export async function staffAccessError(user) {
  const role = roleOf(user)
  if (user.accountActive === false) return 'Your account is paused. Contact your administrator.'
  if (role === 'admin' && !adminAccess(user)) return 'Your subscription has expired or access is paused. Contact the Super Admin.'
  if (role === 'delivery_boy') {
    if (!user.deliveryActive) return 'Your delivery access is paused. Contact your admin.'
    if (user.managedBy) {
      const owner = await User.findById(user.managedBy)
      if (!owner || !adminAccess(owner)) return 'Your team’s admin subscription is inactive. Contact your admin.'
    }
  }
  return ''
}
