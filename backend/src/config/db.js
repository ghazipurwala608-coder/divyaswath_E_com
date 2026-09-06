import mongoose from 'mongoose'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 3000

export default async function connectDB(retries = MAX_RETRIES) {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s to find a server
      socketTimeoutMS: 45000,          // 45s socket idle timeout
    })
    console.log(`MongoDB connected: ${connection.connection.host}`)

    // Reconnect on disconnect
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...')
      setTimeout(() => connectDB(MAX_RETRIES), RETRY_DELAY_MS)
    })

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`)
    })
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`)
    if (retries > 0) {
      const delay = RETRY_DELAY_MS * (MAX_RETRIES - retries + 1)
      console.log(`Retrying in ${delay / 1000}s... (${retries} attempt(s) left)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return connectDB(retries - 1)
    }
    console.error('All MongoDB connection attempts failed. Exiting.')
    process.exit(1)
  }
}

