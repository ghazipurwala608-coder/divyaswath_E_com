import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

try {
  const { MONGO_URI, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_PHONE } = process.env
  if (!MONGO_URI || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD || !SUPER_ADMIN_PHONE) throw new Error('Set MONGO_URI, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD and SUPER_ADMIN_PHONE in backend/.env')
  if (!/^\S+@\S+\.\S+$/.test(SUPER_ADMIN_EMAIL) || !/^\d{10}$/.test(SUPER_ADMIN_PHONE) || SUPER_ADMIN_PASSWORD.length < 12 || SUPER_ADMIN_PASSWORD.length > 72) throw new Error('Use a valid email, 10 digit phone and a 12–72 character password')
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  if (await User.exists({ role: 'super_admin' })) throw new Error('A Super Admin already exists. No changes made.')
  if (await User.exists({ email: SUPER_ADMIN_EMAIL.trim().toLowerCase() })) throw new Error('Email already belongs to an account. Use a separate Super Admin email; existing accounts are not promoted.')
  await User.create({ name: process.env.SUPER_ADMIN_NAME || 'Super Admin', email: SUPER_ADMIN_EMAIL.trim().toLowerCase(), phone: SUPER_ADMIN_PHONE, password: SUPER_ADMIN_PASSWORD, role: 'super_admin' })
  console.log('Super Admin created. Sign in at /login to open /super-admin.')
} catch (error) { console.error(error.message); process.exitCode = 1 }
finally { await mongoose.disconnect() }
