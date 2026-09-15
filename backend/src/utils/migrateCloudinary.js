import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'
import cloudinary from '../config/cloudinary.js'
import { productGalleries } from '../../../shared/productGalleries.js'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const mapPath = path.join(root, 'scripts/cloudinary-url-map.json')
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(error => { if (error.code === 'ENOENT') return []; throw error })
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat()
}
function replaceUrls(value, map) {
  if (typeof value === 'string') return map[value] || value
  if (Array.isArray(value)) return value.map(item => replaceUrls(item, map))
  if (value && typeof value === 'object' && value.constructor === Object) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceUrls(item, map)]))
  return value
}
async function run() {
  await cloudinary.api.ping()
  const map = JSON.parse(await fs.readFile(mapPath, 'utf8').catch(() => '{}'))
  let failed = 0
  let total = 0
  for (const [directory, prefix] of [['frontend/public', ''], ['backend/uploads', '/api/media']]) {
    const base = path.join(root, directory)
    for (const file of await walk(base)) {
      if (!/\.(png|jpe?g|webp|svg|gif|avif|jfif|ico)$/i.test(file)) continue
      total++
      const url = `${prefix}/${path.relative(base, file).replaceAll('\\', '/')}`
      if (map[url]?.startsWith(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`)) continue
      try {
        const hash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 16)
        const result = await cloudinary.uploader.upload(file, { public_id: `divyaswasth/migrated/${hash}-${path.parse(file).name.replace(/[^a-zA-Z0-9_-]/g, '_')}`, resource_type: 'image', overwrite: false, timeout: 60000 })
        map[url] = result.secure_url
        map[encodeURI(url)] = result.secure_url
        await fs.writeFile(mapPath, JSON.stringify(map, null, 2) + '\n')
        console.log(`Uploaded ${url}`)
      } catch (error) { failed++; console.error(`Upload failed: ${url}: ${error.message}`) }
    }
  }
  console.log(`Scanned ${total} images; ${failed} failed.`)
  if (failed) throw new Error('Some uploads failed. Rerun to resume before updating references.')
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required to migrate stored content')
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  for (const [collectionName, fields] of [['products', ['images', 'cardImage']], ['sitecontents', ['content']]]) {
    const collection = mongoose.connection.db.collection(collectionName)
    let updated = 0
    for await (const record of collection.find({})) {
      const changes = {}
      for (const field of fields) {
        if (record[field] === undefined) continue
        const next = replaceUrls(record[field], map)
        if (JSON.stringify(next) !== JSON.stringify(record[field])) changes[field] = next
      }
      if (Object.keys(changes).length) {
        const filter = { _id: record._id, ...Object.fromEntries(Object.keys(changes).map(field => [field, record[field]])) }
        const result = await collection.updateOne(filter, { $set: changes, ...(collectionName === 'sitecontents' ? { $inc: { revision: 1 } } : {}) })
        if (!result.matchedCount) throw new Error('Content changed during migration; rerun to resume')
        updated++
      }
    }
    console.log(`Updated ${updated} ${collectionName} records`)
  }
  const productCollection = mongoose.connection.db.collection('products')
  for (const [slug, gallery] of Object.entries(productGalleries)) {
    const record = await productCollection.findOne({ slug })
    if (!record || record.cloudinaryGalleryMigrated) continue
    const images = gallery.map(item => map[item.src] || item.src)
    const originalSingleImage = record.images?.length === 1 && record.images[0] === images[0]
    const brokenOriginalGallery = record.images?.some(url => url.startsWith('/images/product/') && !map[url])
    await productCollection.updateOne({ _id: record._id, images: record.images }, { $set: { ...(originalSingleImage || brokenOriginalGallery ? { images } : {}), cloudinaryGalleryMigrated: true } })
  }
  // Keep seed data, offline defaults and CSS images on the same Cloudinary URLs.
  const files = [...await walk(path.join(root, 'frontend/src')), ...await walk(path.join(root, 'shared')), ...await walk(path.join(root, 'backend/src/data'))]
  const entries = Object.entries(map).sort(([a], [b]) => b.length - a.length)
  for (const file of files) {
    if (!/\.(jsx?|css)$/.test(file)) continue
    const original = await fs.readFile(file, 'utf8')
    let source = original
    for (const [local, remote] of entries) source = source.split(local).join(remote)
    if (source !== original) await fs.writeFile(file, source)
  }
  console.log('Cloudinary migration complete: uploads, database content and source defaults updated.')
}
run().catch(error => { console.error(error.message); process.exitCode = 1 }).finally(() => mongoose.disconnect())
