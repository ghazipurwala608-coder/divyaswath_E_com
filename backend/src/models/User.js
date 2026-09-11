import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { roleOf } from '../utils/roles.js'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['super_admin', 'admin', 'delivery_boy', 'customer'] },
  accountActive: { type: Boolean, default: true },
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscription: {
    plan: { type: String, trim: true, maxlength: 80, default: 'Legacy' },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
    expiresAt: { type: Date, default: null },
  },
  isAdmin: { type: Boolean, default: false },
  isDriver: { type: Boolean, default: false },
  deliveryActive: { type: Boolean, default: true },
  deliveryArea: { type: String, trim: true, maxlength: 120, default: '' },
}, { timestamps: true })

userSchema.pre('validate', function syncRole(next) {
  this.role = roleOf(this)
  this.isAdmin = this.role === 'admin'
  this.isDriver = this.role === 'delivery_boy'
  next()
})

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
