// UI smoke checks use fixtures; API integration tests exercise the real database separately.
import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
const root = path.resolve(import.meta.dirname, '..')
await fs.mkdir(path.join(root, '.artifacts'), { recursive: true })
const browser = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9225', `--user-data-dir=${path.join(root, '.browser-profile', 'delivery-check')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
try {
  let target
  for (let i = 0; i < 40; i++) {
    try { target = (await (await fetch('http://127.0.0.1:9225/json')).json()).find(item => item.type === 'page'); if (target) break } catch { /* Starting browser. */ }
    await delay(200)
  }
  assert.ok(target, 'Chrome is available')
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  let next = 0
  const pending = new Map(), errors = []
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    if (data.id) { const item = pending.get(data.id); pending.delete(data.id); data.error ? item.reject(new Error(data.error.message)) : item.resolve(data.result) }
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text)
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++next; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })) })
  const evaluate = async expression => {
    const value = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (value.exceptionDetails) throw new Error(value.exceptionDetails.text)
    return value.result.value
  }
  const wait = async expression => {
    for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await delay(150) }
    console.log('Browser errors:', errors, 'Visible:', await evaluate('document.body.innerText.slice(0, 1500)'))
    throw new Error('Timed out: ' + expression)
  }
  await send('Runtime.enable'); await send('Page.enable')
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    const driver = {_id:'111111111111111111111111',name:'Rahul Sharma',email:'rahul@example.com',phone:'9876543210',isDriver:true,deliveryActive:true,deliveryArea:'Noida · 201301'};
    const owner = {_id:'222222222222222222222222',name:'Aman Soni'};
    const admin = {_id:'333333333333333333333333',name:'Store Admin',isAdmin:true};
    let order = {_id:'444444444444444444444444',user:owner,deliveryPerson:driver,deliveryAssignedAt:new Date().toISOString(),orderStatus:'Out for Delivery',paymentMethod:'COD',paymentStatus:'Pending',itemsPrice:899,shippingPrice:0,totalPrice:899,courierName:'Divya Swasth Delivery',trackingNumber:'DS-4444',currentLocation:'Sector 62, Noida',createdAt:new Date().toISOString(),estimatedDelivery:new Date().toISOString(),shippingAddress:{fullName:'Aman Soni',email:'aman@example.com',phone:'9876543210',addressLine:'B-42, Sector 62',city:'Noida',state:'Uttar Pradesh',postalCode:'201301',country:'India'},items:[{product:'p1',slug:'sugar-shield',name:'Sugar Shield',quantity:1,price:899}],trackingEvents:[{_id:'event1',status:'Out for Delivery',title:'Out for delivery',message:'Your partner is on the way.',location:'Sector 62',timestamp:new Date().toISOString()}]};
    const role = new URLSearchParams(location.search).get('role');
    const user = role==='admin'?admin:role==='customer'?owner:role==='driver'?driver:null;
    if(user){localStorage.setItem('divyaSwasthUser',JSON.stringify(user));localStorage.setItem('divyaSwasthToken','fixture');}else{localStorage.removeItem('divyaSwasthUser');localStorage.removeItem('divyaSwasthToken');}
    const originalFetch=window.fetch;
    window.fetch=async (url,options={})=>{
      const p=new URL(url,location.origin).pathname; if(!p.startsWith('/api/'))return originalFetch(url,options);
      let data={};
      if(p==='/api/content')data={pages:{}};
      else if(p==='/api/products')data={products:[]};
      else if(p==='/api/delivery/team')data={drivers:[driver]};
      else if(p==='/api/orders/admin/all')data={orders:[{...order,deliveryPerson:driver._id}]};
      else if(p==='/api/delivery/orders')data={orders:[order]};
      else if(p.endsWith('/otp'))data={otp:'123456',expiresAt:new Date(Date.now()+600000).toISOString()};
      else if(p.endsWith('/complete')){order={...order,orderStatus:'Delivered',paymentStatus:'Paid',deliveryOtpVerifiedAt:new Date().toISOString()};data={order};}
      else if(p.startsWith('/api/orders/'))data={order};
      return new Response(JSON.stringify({data}),{status:200,headers:{'Content-Type':'application/json'}});
    };
  ` })
  for (const [name, route, text] of [['login', '/delivery', 'Delivery partner login'], ['driver', '/delivery?role=driver', 'Aman Soni'], ['admin', '/admin?tab=delivery&role=admin', 'Dispatch & tracking'], ['customer', '/orders/444444444444444444444444?role=customer', 'Secure delivery code']]) {
    for (const width of [1440, 390]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 390 })
      await send('Page.navigate', { url: 'http://127.0.0.1:5174' + route })
      await wait(`document.body?.innerText.includes(${JSON.stringify(text)})`)
      await delay(350)
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
      await fs.writeFile(path.join(root, '.artifacts', `delivery-${name}-${width}.png`), Buffer.from(shot.data, 'base64'))
      if (!await evaluate(`document.documentElement.scrollWidth <= ${width + 2}`)) console.log(await evaluate(`Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>${width + 2}).slice(0,12).map(e=>({tag:e.tagName,class:e.className,width:e.getBoundingClientRect().width}))`))
      assert.ok(await evaluate(`document.documentElement.scrollWidth <= ${width + 2}`), name + ' fits ' + width)
      if (name === 'customer') {
        await evaluate("Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Get delivery OTP').click()")
        await wait("document.body.innerText.includes('123456')")
      }
      if (name === 'driver') {
        await evaluate("const input=document.querySelector('input[id^=otp]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'123456');input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('input[type=checkbox]').click()")
        await evaluate("document.querySelector('.delivery-otp').requestSubmit()")
        await wait("document.body.innerText.includes('Delivery completed. Thank you!') || document.body.innerText.includes('No deliveries here yet.')")
      }
      console.log(name + ' ' + width + ': passed')
    }
  }
  assert.deepEqual(errors, [], 'No browser runtime errors')
} finally { socket?.close(); browser.kill() }
