import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  revision: { type: Number, default: 0 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })
export default mongoose.model('SiteContent', schema)
