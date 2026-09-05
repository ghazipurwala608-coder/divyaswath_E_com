import express from 'express'
import { cancelMyOrder, createOrder, getMyOrders, getOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/my', protect, getMyOrders)
router.get('/admin/all', protect, adminOnly, getOrders)
router.put('/:id/cancel', protect, cancelMyOrder)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)
router.get('/:id', protect, getOrder)

export default router
