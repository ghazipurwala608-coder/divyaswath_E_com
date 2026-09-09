import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
const root = path.resolve(import.meta.dirname, '..')
const origin = 'http://127.0.0.1:5174'
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
  const pending = new Map(), errors = []
  let next = 0
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    if (data.id) { const callback = pending.get(data.id); pending.delete(data.id); data.error ? callback.reject(new Error(data.error.message)) : callback.resolve(data.result) }
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text)
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++next; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })) })
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || 'Browser evaluation failed')
    return result.result.value
  }
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 60; attempt++) { if (await evaluate(expression)) return; await delay(150) }
    console.log('Browser runtime errors:', errors)
    console.log('Visible page:', await evaluate('document.body.innerText.slice(0, 600)'))
    throw new Error('Timed out waiting for: ' + expression)
  }
  const visit = async route => { await send('Page.navigate', { url: origin + route }); await waitFor("document.readyState === 'complete' && document.querySelector('#root')?.innerText.length > 20"); await delay(600) }
  const screenshot = async name => { const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); await fs.writeFile(path.join(artifacts, name + '.png'), Buffer.from(result.data, 'base64')) }
  await send('Runtime.enable'); await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await visit('/')
  assert.equal(await evaluate("document.querySelectorAll('#premium-formulations + div article').length"), 4)
  assert.ok(await evaluate("document.body.innerText.includes('Endless') || document.body.innerText.includes('ENDLESS')"))
  await screenshot('storefront-desktop')
  for (const route of ['/shop', '/about', '/ingredients', '/faq', '/shipping', '/returns', '/privacy', '/terms', '/blog', '/wellness', '/contact', '/support', '/login', '/register', '/products/vital-infinity-multivitamin', '/products/lean-shape-garcinia-cambogia', '/wellness/balanced-portions']) {
    await visit(route)
    assert.ok(await evaluate("document.querySelector('main')?.innerText.length > 50"), route + ' renders')
  }
  await visit('/ingredients')
  assert.equal(await evaluate("document.querySelectorAll('article').length"), 12)
  await evaluate("{ const el = document.querySelector('input[aria-label=\"Search ingredients\"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, 'amla'); el.dispatchEvent(new Event('input', { bubbles: true })); }")
  await delay(300)
  assert.ok(await evaluate("document.body.innerText.includes('AMLA') || document.body.innerText.includes('Amla')"))
  await visit('/wellness')
  await evaluate("document.querySelector('#wellness-goals button')?.click()")
  await waitFor("document.body.innerText.includes('Your wellness selection')")
  await visit('/login')
  const credentials = JSON.parse(await fs.readFile(path.join(root, 'backend/.admin-credentials.local.json'), 'utf8'))
  await evaluate(`{const fields = ${JSON.stringify(credentials)}; for(const [name,value] of [['login-email',fields.email],['login-password',fields.password]]) {const input=document.getElementById(name);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}}`)
  await evaluate("document.querySelector('form').requestSubmit()")
  await waitFor("location.pathname === '/admin' && document.body.innerText.includes('A little care. A growing business.')")
  await screenshot('admin-desktop')
  await visit('/admin?tab=products')
  await waitFor("document.querySelectorAll('tbody tr').length === 6")
  await evaluate("document.querySelector('button[aria-label^=\"Edit \"]').click()")
  await waitFor("document.querySelector('[role=dialog]')")
  assert.ok(await evaluate("document.querySelectorAll('.admin-modal input').length > 8"))
  await screenshot('admin-product-editor')
  await evaluate("document.querySelector('button[aria-label=\"Close dialog\"]').click()")
  for (const tab of ['content', 'orders', 'customers', 'messages', 'subscribers', 'settings', 'media']) {
    await visit('/admin?tab=' + tab)
    await waitFor("!document.body.innerText.includes('Loading your store…')")
    assert.ok(await evaluate("document.querySelector('.admin-main')?.innerText.length > 50"), 'Admin ' + tab + ' renders')
  }
  await visit('/admin?tab=content')
  await waitFor("document.querySelectorAll('.admin-content-group').length > 0")
  await evaluate("document.querySelector('.admin-content-group').open = true")
  await screenshot('admin-content-editor')
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await visit('/admin')
  assert.ok(await evaluate('document.documentElement.scrollWidth <= 392'), 'Admin fits mobile viewport')
  await screenshot('admin-mobile')
  await visit('/')
  assert.ok(await evaluate('document.documentElement.scrollWidth <= 392'), 'Storefront fits mobile viewport')
  assert.equal(await evaluate("document.querySelectorAll('#premium-formulations + div article').length"), 4)
  await screenshot('storefront-mobile')
  assert.deepEqual(errors, [], 'No browser runtime errors')
  console.log('Browser checks passed: original 4 homepage cards, 18 storefront routes, admin login and 9 sections, desktop/mobile layouts; screenshots saved in .artifacts.')
} finally {
  socket?.close()
  chrome.kill()
}
