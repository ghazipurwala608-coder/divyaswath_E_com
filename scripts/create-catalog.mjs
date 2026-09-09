import fs from 'node:fs'
import products from '../backend/src/data/products.js'
import { wellnessArticles } from '../frontend/src/data/wellnessArticles.js'
import { websiteContent } from '../shared/websiteContent.js'
const images = { 'lean-shape-garcinia-cambogia': '/images/home/Lean.png', 'sugar-shield-blood-sugar-support': '/images/home/Suger sheid.png', 'vital-infinity-multivitamin': '/images/home/Vital.png' }
const catalog = products.map((product, index) => ({ ...product, sortOrder: index, ...(images[product.slug] ? { images: [images[product.slug]], cardImage: images[product.slug], imageStatus: 'Concept' } : {}) }))
catalog.push({ ...catalog.find(product => product.slug === 'divya-swasth-wellness'), slug: 'endless-daily-wellness', name: 'Endless', subtitle: 'Daily Wellness Support', category: 'Daily Nutrition', price: 1999, mrp: 1999, size: '60 capsules', countInStock: 0, availableForPurchase: false, badge: 'Coming soon', sortOrder: 5, shortDescription: 'Daily wellness support in a convenient capsule format.', description: 'Endless is part of the Divya Swasth daily wellness range. Refer to the final product label for the complete formula and directions.', images: ['/images/home/Endless.png'], cardImage: '/images/home/Endless.png', imageStatus: 'Concept' })
fs.writeFileSync('shared/catalog.js', `// Preserved catalog, including the existing Endless homepage card.\nexport const initialProducts = ${JSON.stringify(catalog, null, 2)}\n`)
fs.writeFileSync('backend/src/data/products.js', "export { initialProducts as default } from '../../../shared/catalog.js'\n")
fs.writeFileSync('frontend/src/data/products.js', "import { initialProducts } from '../../../shared/catalog.js'\nexport const fallbackProducts = initialProducts.map(product => ({ ...product, _id: product.slug }))\nexport const categories = ['All', ...new Set(fallbackProducts.map(product => product.category))]\n")
websiteContent.articles = { articles: wellnessArticles }
websiteContent.settings = {
  shipping: { fee: 99, freeAbove: 999, estimatedDays: 7 },
  store: { name: 'Divya Swasth', email: 'divyaswasth@gmail.com', phone: ' +91 97470 07253' },
  recommendations: [
    { goal: 'Immunity & Wellness', slugs: ['vital-infinity-multivitamin', 'endless-daily-wellness'] },
    { goal: 'Energy & Vitality', slugs: ['vital-infinity-multivitamin', 'divya-swasth-wellness'] },
    { goal: 'Digestion & Gut Health', slugs: ['endless-daily-wellness', 'vital-infinity-multivitamin'] },
    { goal: 'Weight Management', slugs: ['lean-shape-garcinia-cambogia'] },
    { goal: 'Mental Wellness & Stress Support', slugs: ['endless-daily-wellness'] },
    { goal: 'Men’s Health & Vitality', slugs: ['divya-swasth-wellness'] },
  ],
}
fs.writeFileSync('shared/websiteContent.js', `// Original storefront content. Structure and array sizes preserve the supplied design.\nexport const websiteContent = ${JSON.stringify(websiteContent, null, 2)}\n`)
console.log(`Preserved ${catalog.length} products and ${wellnessArticles.length} complete wellness articles`)
