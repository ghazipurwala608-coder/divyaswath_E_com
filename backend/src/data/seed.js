import 'dotenv/config'
import mongoose from 'mongoose'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import User from '../models/User.js'
import { bootstrapStore } from './bootstrap.js'
try {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Configure backend/.env first.')
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  console.log(await bootstrapStore())
  if (!await User.exists({ isAdmin: true })) {
    const email = process.env.ADMIN_EMAIL || 'admin@divyaswasth.in'
    if (await User.exists({ email })) throw new Error('Admin email belongs to an existing customer. Set a different ADMIN_EMAIL; no account was promoted.')
    const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(18).toString('base64url')
    if (password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters')
    await fs.writeFile('.admin-credentials.local.json', JSON.stringify({ email, password, login: '/login', dashboard: '/admin' }, null, 2), { mode: 0o600, flag: 'wx' })
    await User.create({ name: 'Divya Swasth Admin', email, phone: process.env.ADMIN_PHONE || '9876543210', password, isAdmin: true })
    console.log('Admin created. Credentials saved to backend/.admin-credentials.local.json (gitignored).')
  }
  console.log('Seed complete. Existing products, content, users and orders preserved.')
} catch (error) {
  console.error(`Seed failed: ${error.message}`)
  process.exitCode = 1
} finally { await mongoose.disconnect() }
