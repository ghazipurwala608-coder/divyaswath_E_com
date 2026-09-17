import mongoose from 'mongoose'

const assessmentLeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  city: { type: String, trim: true, maxlength: 100, default: '' },
  goal: { type: String, required: true, trim: true },
  goalId: { type: String, trim: true, default: '' },
  duration: { type: String, trim: true, default: '' },
  ageGroup: { type: String, trim: true, default: '' },
  productSlug: { type: String, trim: true, default: '' },
  productName: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['New Lead', 'Contacted', 'Consulted', 'Converted', 'Closed'],
    default: 'New Lead',
    index: true
  },
  notes: { type: String, trim: true, default: '' },
  source: { type: String, default: 'Homepage 1-Min Assessment' }
}, { timestamps: true })

export default mongoose.model('AssessmentLead', assessmentLeadSchema)
