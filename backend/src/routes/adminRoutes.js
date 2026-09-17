import express from 'express'
import { dashboard } from '../controllers/adminController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'
import { getAdminContent, updateContent } from '../controllers/contentController.js'
import { 
  listProducts, 
  listCustomers, 
  customerDetail, 
  listMessages, 
  updateMessage, 
  listSubscribers, 
  updateSubscriber, 
  listLeads,
  updateLead,
  deleteLead,
  listMedia, 
  uploadMedia, 
  deleteMedia, 
  signMediaUpload 
} from '../controllers/storeAdminController.js'

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

// Assessment Leads
router.get('/leads', listLeads)
router.patch('/leads/:id', updateLead)
router.delete('/leads/:id', deleteLead)

router.get('/content', getAdminContent)
router.put('/content/:key', updateContent)
router.get('/media', listMedia)
router.post('/media/signature', signMediaUpload)
router.post('/media', express.raw({ type: ['application/octet-stream', 'image/*', '*/*'], limit: '10mb' }), uploadMedia)
router.delete('/media', deleteMedia)

export default router
