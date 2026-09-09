import fs from 'fs'
import path from 'path'

const src = 'C:/Users/DELL/.gemini/antigravity-ide/brain/9bd00b08-cdc4-4a35-af0d-d2e7c94a8e49/.user_uploaded/media_1788892632071.png'
const dest = path.resolve('frontend/public/images/payments/upi-qr.png')

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log('Successfully copied QR code image to', dest)
  } else {
    console.error('Source QR code image not found at', src)
  }
} catch (err) {
  console.error('Error copying file:', err)
}
