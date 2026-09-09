import express from 'express'
import { dashboard } from '../controllers/adminController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'
import { getAdminContent, updateContent } from '../controllers/contentController.js'
import { listProducts, listCustomers, customerDetail, listMessages, updateMessage, listSubscribers, updateSubscriber, listMedia, uploadMedia } from '../controllers/storeAdminController.js'

const router = express.Router()
router.use(protect, adminOnly)
router.get('/dashboard', dashboard)
router.get('/products', listProducts)
router.get('/customers', listCustomers)
router.get('/customers/:id', customerDetail)
router.get('/messages', listMessages)
router.patch('/messages/:id', updateMessage)
router.get('/subscribers', listSubscribers)
router.patch('/subscribers/:id', updateSubscriber)
router.get('/content', getAdminContent)
router.put('/content/:key', updateContent)
router.get('/media', listMedia)
router.post('/media', express.raw({ type: 'application/octet-stream', limit: '5mb' }), uploadMedia)
export default router
