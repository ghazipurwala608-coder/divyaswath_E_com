import fs from 'node:fs'
let s = fs.readFileSync('scripts/extract-site-content.cjs', 'utf8')
s = s.replace('const files = [', 'const files = process.argv.length > 2 ? process.argv.slice(2) : [')
s = s.replace('const pages = {}', "const pages = fs.existsSync('shared/websiteContent.js') ? JSON.parse(fs.readFileSync('shared/websiteContent.js', 'utf8').split('export const websiteContent = ')[1]) : {}")
s = s.replace("if (!p.parentPath.parentPath.isProgram() || !p.node.id.name) return", "if (!p.parentPath.parentPath.isProgram() || !p.node.id.name || ['fields', 'methods'].includes(p.node.id.name)) return")
s = s.replace('let id = slug, index = 2', "let id = /^\\d/.test(slug) ? 'label_' + slug : slug, index = 2")
fs.writeFileSync('scripts/extract-site-content.cjs', s)
