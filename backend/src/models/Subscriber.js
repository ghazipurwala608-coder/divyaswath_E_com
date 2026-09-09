import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  source: { type: String, default: 'website', maxlength: 80 },
  status: { type: String, enum: ['Subscribed', 'Unsubscribed'], default: 'Subscribed' },
  consentAt: { type: Date, required: true },
}, { timestamps: true })
export default mongoose.model('Subscriber', schema)
