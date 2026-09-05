import jwt from 'jsonwebtoken'

export default function generateToken(userId) {
  return jwt.sign(
    {},
    process.env.JWT_SECRET,
    {
      subject: userId.toString(),
      issuer: 'divya-swasth-api',
      audience: 'divya-swasth-storefront',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      algorithm: 'HS256',
    },
  )
}
