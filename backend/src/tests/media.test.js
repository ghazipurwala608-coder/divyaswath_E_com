import test from 'node:test'
import assert from 'node:assert/strict'
import cloudinary from '../config/cloudinary.js'
import { uploadMedia, deleteMedia, listMedia } from '../controllers/storeAdminController.js'

async function invoke(handler, req) {
  const res = { code: 200, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } }
  await handler({ headers: {}, query: {}, ...req }, res, error => { res.error = error })
  return res
}
const png = Buffer.from('89504e470d0a1a0a0000000000000000', 'hex')
test('upload returns the Cloudinary URL and does not duplicate the folder', async t => {
  t.mock.method(cloudinary.uploader, 'upload_stream', (options, done) => {
    assert.equal(options.resource_type, 'image')
    assert.equal(options.folder, undefined)
    assert.match(options.public_id, /^divyaswasth\/uploads\//)
    return { end(data) { assert.deepEqual(data, png); done(null, { secure_url: 'https://res.cloudinary.com/demo/image/upload/test.png', public_id: options.public_id }) } }
  })
  const result = await invoke(uploadMedia, { body: { name: 'logo.png', data: png.toString('base64') } })
  assert.equal(result.code, 201)
  assert.match(result.body.data.media.url, /^https:\/\/res.cloudinary.com\//)
})
test('Cloudinary failures return an error instead of silently storing locally', async t => {
  t.mock.method(cloudinary.uploader, 'upload_stream', (_options, done) => ({ end() { done(new Error('unavailable')) } }))
  const result = await invoke(uploadMedia, { body: png })
  assert.equal(result.code, 502)
  assert.match(result.error.message, /Cloudinary upload failed/)
})
test('oversize and unsupported uploads are rejected', async () => {
  for (const body of [Buffer.alloc(10 * 1024 * 1024 + 1), Buffer.from('<svg>untrusted</svg>')]) {
    assert.equal((await invoke(uploadMedia, { body })).code, 400)
  }
})
test('deletion rejects local paths and images belonging to another cloud', async () => {
  for (const url of ['/images/../../secret', 'https://res.cloudinary.com/another-cloud/image/upload/divyaswasth/test.png']) {
    assert.equal((await invoke(deleteMedia, { body: { url } })).code, 400)
  }
})
test('media library reads all Cloudinary pages', async t => {
  let calls = 0
  t.mock.method(cloudinary.api, 'resources', async options => {
    calls++
    if (calls === 1) return { resources: [{ public_id: 'divyaswasth/first', secure_url: 'https://example.com/first.png' }], next_cursor: 'next' }
    assert.equal(options.next_cursor, 'next')
    return { resources: [{ public_id: 'divyaswasth/second', secure_url: 'https://example.com/second.png' }] }
  })
  const result = await invoke(listMedia, {})
  assert.equal(calls, 2)
  assert.ok(result.body.data.media.some(item => item.name === 'second'))
})

test('public image links are stored in Cloudinary and return the hosted image', async t => {
  t.mock.method(cloudinary.uploader, 'upload', async (url, options) => {
    assert.equal(url, 'https://example.com/poster.png')
    assert.equal(options.resource_type, 'image')
    return { secure_url: 'https://res.cloudinary.com/demo/image/upload/poster.png', public_id: 'divyaswasth/uploads/poster', bytes: 1024 }
  })
  const result = await invoke(uploadMedia, { body: { url: 'https://example.com/poster.png' } })
  assert.equal(result.code, 201)
  assert.match(result.body.data.media.url, /res.cloudinary.com/)
  assert.equal((await invoke(uploadMedia, { body: { url: 'file:///test.png' } })).code, 400)
})
test('oversized image imports are removed and rejected', async t => {
  t.mock.method(cloudinary.uploader, 'upload', async () => ({ public_id: 'divyaswasth/uploads/oversized', bytes: 11 * 1024 * 1024 }))
  let removed = false
  t.mock.method(cloudinary.uploader, 'destroy', async () => { removed = true })
  assert.equal((await invoke(uploadMedia, { body: { url: 'https://example.com/big.png' } })).code, 400)
  assert.equal(removed, true)
})
