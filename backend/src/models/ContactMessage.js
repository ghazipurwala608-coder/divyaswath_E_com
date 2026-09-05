import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
  phone: { type: String, trim: true, maxlength: 20, default: '' },
  subject: { type: String, required: true, trim: true, maxlength: 100 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['New', 'In progress', 'Resolved'], default: 'New', index: true },
}, { timestamps: true })

export default mongoose.model('ContactMessage', contactMessageSchema)

