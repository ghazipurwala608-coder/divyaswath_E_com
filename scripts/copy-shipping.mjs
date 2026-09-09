import fs from 'fs'
import path from 'path'

const src = 'C:/Users/DELL/.gemini/antigravity-ide/brain/9bd00b08-cdc4-4a35-af0d-d2e7c94a8e49/ayurvedic_shipping_delivery_1788893137878.jpg'
const dest = path.resolve('frontend/public/images/wellness/shipping-hero.jpg')

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log('Successfully copied shipping image to', dest)
  } else {
    console.error('Source shipping image not found at', src)
  }
} catch (err) {
  console.error('Error copying file:', err)
}
