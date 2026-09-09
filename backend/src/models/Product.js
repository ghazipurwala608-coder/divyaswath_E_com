import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  countInStock: { type: Number, required: true, min: 0, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  numReviews: { type: Number, min: 0, default: 0 },
  badge: { type: String, default: '' },
  theme: { type: String, default: 'gold' },
  featured: { type: Boolean, default: false, index: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, trim: true }],
  benefits: [{ type: String, trim: true }],
  size: { type: String, default: '60 vegetarian capsules' },
  usage: { type: String, required: true },
  form: { type: String, default: 'Capsules' },
  classification: { type: String, default: 'To be confirmed from the final approved label' },
  vegetarian: { type: String, default: 'To be confirmed from the final approved label' },
  storage: { type: String, default: 'Store in a cool, dry and dark place' },
  disclaimer: { type: String, required: true },
  images: [{ type: String, trim: true }],
  cardImage: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  imageStatus: { type: String, enum: ['Pending', 'Concept', 'Approved'], default: 'Pending' },
  availableForPurchase: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, optimisticConcurrency: true })

productSchema.index({ name: 'text', subtitle: 'text', category: 'text', ingredients: 'text' })

export default mongoose.model('Product', productSchema)
