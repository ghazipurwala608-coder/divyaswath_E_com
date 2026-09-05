import express from 'express'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/productController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, adminOnly, createProduct)
router.route('/id/:id').put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct)
router.get('/:slug', getProduct)

export default router

