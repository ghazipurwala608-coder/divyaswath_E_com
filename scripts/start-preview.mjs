import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
const root = path.resolve(import.meta.dirname, '..')
const artifacts = path.join(root, '.artifacts')
fs.mkdirSync(artifacts, { recursive: true })
function start(name, cwd, args, env) {
  const log = fs.openSync(path.join(artifacts, `${name}.log`), 'a')
  const child = spawn(process.execPath, args, { cwd: path.join(root, cwd), env: { ...process.env, ...env }, detached: true, windowsHide: true, stdio: ['ignore', log, log] })
  child.unref()
  return child.pid
}
const backend = start('backend-preview', 'backend', ['src/server.js'], { PORT: '5001' })
const frontend = start('frontend-preview', 'frontend', ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5174', '--strictPort'], { API_PROXY_TARGET: 'http://127.0.0.1:5001' })
fs.writeFileSync(path.join(artifacts, 'preview.json'), JSON.stringify({ backend, frontend, url: 'http://127.0.0.1:5174' }))
console.log('Preview starting at http://127.0.0.1:5174; API at http://127.0.0.1:5001')
