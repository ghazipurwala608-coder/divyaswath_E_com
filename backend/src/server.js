import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import { sendSuccess } from './utils/apiResponse.js'

const requiredEnvironment = ['MONGO_URI', 'JWT_SECRET']
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key])
if (missingEnvironment.length) {
  console.error(`Missing environment variables: ${missingEnvironment.join(', ')}. Copy .env.example to .env and update the values.`)
  process.exit(1)
}

await connectDB()

const app = express()
const allowedOrigins = [
  'http://localhost:5173',
  'https://divyaswath-e-com-six.vercel.app',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((o) => o.trim()) : []),
]

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); callback(new Error('Origin not allowed by CORS')) }, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.get('/api/health', (req, res) => sendSuccess(res, { message: 'Divya Swasth API is healthy', data: { service: 'Divya Swasth API', timestamp: new Date().toISOString() } }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contact', contactRoutes)

app.use(notFound)
app.use(errorHandler)

const port = Number(process.env.PORT) || 5000
const server = app.listen(port, () => console.log(`Divya Swasth API running on http://localhost:${port}`))

process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`)
  server.close(() => process.exit(1))
})
