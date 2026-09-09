import { initialProducts } from '../../../shared/catalog.js'
export const fallbackProducts = initialProducts.map(product => ({ ...product, _id: product.slug }))
export const categories = ['All', ...new Set(fallbackProducts.map(product => product.category))]
