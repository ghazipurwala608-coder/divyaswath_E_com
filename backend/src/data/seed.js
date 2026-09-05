import 'dotenv/config'
import connectDB from '../config/db.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import products from './products.js'

async function seed() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Configure backend/.env first.')
    await connectDB()

    const users = [
      { name: 'Divya Swasth Admin', email: 'admin@divyaswasth.in', phone: '9876543210', password: 'Admin@123', isAdmin: true },
      { name: 'Demo Customer', email: 'customer@example.com', phone: '9876501234', password: 'Customer@123', isAdmin: false },
    ]
    for (const candidate of users) {
      const exists = await User.exists({ email: candidate.email })
      if (!exists) await User.create(candidate)
    }

    await Product.bulkWrite(products.map((product) => ({
      updateOne: {
        filter: { slug: product.slug },
        update: { $set: { ...product, isActive: true } },
        upsert: true,
      },
    })))
    const activeSlugs = products.map((product) => product.slug)
    const archived = await Product.updateMany({ slug: { $nin: activeSlugs }, isActive: true }, { $set: { isActive: false } })

    console.log(`Catalog synced with ${products.length} products. ${archived.modifiedCount} legacy products archived. Existing users and orders were preserved.`)
    process.exit(0)
  } catch (error) {
    console.error(`Catalog sync failed: ${error.message}`)
    process.exit(1)
  }
}

seed()
