import fs from 'node:fs'
const file = 'backend/src/server.js'
const source = fs.readFileSync(file, 'utf8')
const imports = source.slice(0, source.indexOf('const requiredEnvironment')).replace("import 'dotenv/config'\n", '').replace("import connectDB from './config/db.js'\n", '').replace("import { bootstrapStore } from './data/bootstrap.js'\n", '')
const body = source.slice(source.indexOf('const app = express()'), source.indexOf('const port = Number'))
fs.writeFileSync('backend/src/app.js', imports + body + '\nexport default app\n')
const server = `import 'dotenv/config'
import connectDB from './config/db.js'
import { bootstrapStore } from './data/bootstrap.js'
import app from './app.js'

const missing = ['MONGO_URI', 'JWT_SECRET'].filter(key => !process.env[key])
if (missing.length) { console.error('Missing environment variables: ' + missing.join(', ')); process.exit(1) }
await connectDB()
await bootstrapStore()
const port = Number(process.env.PORT) || 5000
const server = app.listen(port, () => console.log('Divya Swasth API running on http://localhost:' + port))
process.on('unhandledRejection', error => { console.error(error.message); server.close(() => process.exit(1)) })
`
fs.writeFileSync(file, server)
