import Product from '../models/Product.js'
import SiteContent from '../models/SiteContent.js'
import products from './products.js'
import { websiteContent } from '../../../shared/websiteContent.js'

export async function bootstrapStore() {
  const activeSlugs = products.map(product => product.slug)
  await Product.updateMany({ slug: { $nin: activeSlugs } }, { isActive: false })
  const catalog = await Product.bulkWrite(products.map(product => ({
    updateOne: {
      filter: { slug: product.slug },
      update: { $set: { ...product, isActive: true } },
      upsert: true,
    }
  })))
  const content = await SiteContent.bulkWrite(Object.entries(websiteContent).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { $set: { key, content: value } },
      upsert: true,
    }
  })))
  return { productsInserted: catalog.upsertedCount, pagesInserted: content.upsertedCount }
}
