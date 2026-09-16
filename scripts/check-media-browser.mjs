import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
const root = path.resolve(import.meta.dirname, '..')
const origin = 'http://localhost:5173'
const artifacts = path.join(root, '.artifacts')
await fs.mkdir(artifacts, { recursive: true })
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9223', `--user-data-dir=${path.join(root, '.browser-profile')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
try {
  let target
  for (let tries = 0; tries < 50; tries++) {
    try { target = (await (await fetch('http://127.0.0.1:9223/json')).json()).find(item => item.type === 'page'); if (target) break } catch { /* Browser starting. */ }
    await delay(200)
  }
  assert.ok(target, 'Chrome debug target is available')
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  const pending = new Map(), errors = [], uploadRequests = []
  let next = 0
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    if (data.id) { const callback = pending.get(data.id); pending.delete(data.id); data.error ? callback.reject(new Error(data.error.message)) : callback.resolve(data.result) }
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text)
    if (data.method === 'Network.requestWillBeSent' && data.params.request.method === 'POST') uploadRequests.push(data.params.request.url)
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++next; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })) })
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || 'Browser evaluation failed')
    return result.result.value
  }
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 160; attempt++) { if (await evaluate(`Boolean(${expression})`)) return; await delay(250) }
    console.log('Browser runtime errors:', errors)
    console.log('Visible page:', await evaluate('document.body.innerText.slice(0, 600)'))
    throw new Error('Timed out waiting for: ' + expression)
  }
  const visit = async route => { await send('Page.navigate', { url: origin + route }); await waitFor("document.readyState === 'complete' && document.querySelector('#root')?.innerText.length > 20"); await delay(600) }
  const screenshot = async name => { const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); await fs.writeFile(path.join(artifacts, name + '.png'), Buffer.from(result.data, 'base64')) }
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

  await visit('/login')
  const credentials = process.env.MEDIA_TEST_EMAIL && process.env.MEDIA_TEST_PASSWORD
    ? { email: process.env.MEDIA_TEST_EMAIL, password: process.env.MEDIA_TEST_PASSWORD }
    : JSON.parse(await fs.readFile(path.join(root, 'backend/.admin-credentials.local.json'), 'utf8'))
  const login = await fetch(origin+'/api/auth/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:credentials.email,password:credentials.password})})
  const response=await login.json()
  assert.equal(login.status,200,'Admin login succeeds')
  await evaluate(`localStorage.setItem('divyaSwasthToken',${JSON.stringify(response.data.token)});localStorage.setItem('divyaSwasthUser',${JSON.stringify(JSON.stringify(response.data.user))})`)
  await visit('/admin?tab=media')
  await waitFor("document.querySelector('input[type=file]')")
  await evaluate("window.__mediaFileInput = document.querySelector('input[type=file]'); window.dispatchEvent(new Event('blur')); window.dispatchEvent(new Event('focus'))")
  await delay(1200)
  assert.ok(await evaluate("window.__mediaFileInput === document.querySelector('input[type=file]')"), 'Returning from the file picker preserves the mounted upload input')
  await evaluate('window.__mediaNavigationCheck = true')
  const {root:dom}=await send('DOM.getDocument')
  const {nodeId}=await send('DOM.querySelector',{nodeId:dom.nodeId,selector:'input[type=file]'})
  await send('DOM.setFileInputFiles',{nodeId,files:[path.join(root,'frontend/public/images/logo.png')]})
  await waitFor("document.querySelector('[role=status]')?.textContent.includes('uploaded successfully') || !!document.querySelector('[role=alert]')")
  assert.ok(await evaluate("document.querySelector('[role=status]')?.textContent.includes('uploaded successfully')"), 'Device image uploads successfully')
  assert.ok(await evaluate('window.__mediaNavigationCheck === true'), 'Upload does not reload the page')
  assert.ok(uploadRequests.some(url => /^https:\/\/api\.cloudinary\.com\/v1_1\/[^/]+\/image\/upload$/.test(url)), 'Browser uploads directly to Cloudinary')
  const uploadedUrl = await evaluate("document.querySelector('[role=status] a').href")
  const listed = await fetch(origin + '/api/admin/media', { headers: { Authorization: `Bearer ${response.data.token}` } })
  assert.equal(listed.status, 200)
  assert.ok((await listed.json()).data.media.some(item => item.url === uploadedUrl), 'Uploaded image persists in the Cloudinary gallery')
  const delivered = await fetch(uploadedUrl)
  assert.equal(delivered.status, 200, 'Cloudinary serves the uploaded image')
  await visit('/admin?tab=media')
  await waitFor(`Array.from(document.querySelectorAll('.admin-media-grid img')).some(img => img.src === ${JSON.stringify(uploadedUrl)})`)
  assert.equal(errors.length, 0, 'No browser runtime errors')
  console.log('PASS: admin login, direct browser upload to Cloudinary, no page reload, gallery retrieval after refresh, image delivery')
  const cleanup = await fetch(origin + '/api/admin/media', { method: 'DELETE', headers: { Authorization: `Bearer ${response.data.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: uploadedUrl }) })
  assert.equal(cleanup.status, 200, 'Remove only the test upload')
  console.log('Status:',await evaluate("[...document.querySelectorAll('[role=alert],[role=status]')].map(e=>e.innerText).join(' | ')"))
  console.log('Preview visible:',await evaluate("!!document.querySelector('[role=dialog] img')"))
  await screenshot('upload-browser-result')
  console.log('Browser errors:',errors)
} finally { socket?.close(); chrome.kill() }
