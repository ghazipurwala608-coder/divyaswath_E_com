import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import deliveryRoutes from './routes/deliveryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import { sendSuccess } from './utils/apiResponse.js'
import contentRoutes from './routes/contentRoutes.js'
import newsletterRoutes from './routes/newsletterRoutes.js'
import wellnessRoutes from './routes/wellnessRoutes.js'
import { uploadDirectory } from './controllers/storeAdminController.js'

const app = express()
const allowedOrigins = [
  'http://localhost:5173',
  'https://divyaswath-e-com-six.vercel.app',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((o) => o.trim()) : []),
]

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); callback(new Error('Origin not allowed by CORS')) }, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.get('/', (req, res) => sendSuccess(res, { message: 'Divya Swasth API is running', data: { service: 'Divya Swasth API', version: '1.0.0' } }))
app.get('/api/health', (req, res) => sendSuccess(res, { message: 'Divya Swasth API is healthy', data: { service: 'Divya Swasth API', timestamp: new Date().toISOString() } }))
app.use('/api/auth', authRoutes)
app.use('/api/delivery', deliveryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/wellness', wellnessRoutes)
app.use('/api/media', express.static(uploadDirectory, { dotfiles: 'deny', maxAge: '1d' }))

app.use(notFound)
app.use(errorHandler)


export default app
