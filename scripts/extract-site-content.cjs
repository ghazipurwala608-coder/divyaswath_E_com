// One-time migration: retain the JSX/layout and move its editorial data into the CMS.
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const req = createRequire(path.resolve('frontend/package.json'))
const { parse } = req('@babel/parser')
const traverse = req('@babel/traverse').default
const files = process.argv.length > 2 ? process.argv.slice(2) : [
  'pages/HomePage', 'pages/AboutPage', 'pages/IngredientsPage', 'pages/FaqPage', 'pages/PolicyPage',
  'pages/BlogPage', 'pages/WellnessPage', 'pages/WellnessArticlePage', 'pages/ContactPage', 'pages/SupportPage',
  'pages/ShopPage', 'pages/ProductPage', 'components/VitalInfinityProduct', 'components/Header', 'components/Footer',
]
const pages = fs.existsSync('shared/websiteContent.js') ? JSON.parse(fs.readFileSync('shared/websiteContent.js', 'utf8').split('export const websiteContent = ')[1]) : {}
for (const name of files) {
  const file = `frontend/src/${name}.jsx`
  const source = fs.readFileSync(file, 'utf8')
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] })
  const key = name.split('/')[1].replace(/Page$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  const data = { text: {}, media: {}, sections: {} }
  const edits = [], hooks = new Map(), iconNames = new Set(), knownIcons = new Set()
  for (const node of ast.program.body) {
    if (node.type === 'ImportDeclaration' && node.source.value === 'lucide-react') node.specifiers.forEach(s => knownIcons.add(s.local.name))
    if (node.type === 'FunctionDeclaration' && /Icon$/.test(node.id.name)) knownIcons.add(node.id.name)
  }
  const serialize = node => {
    if (!node) throw Error('empty')
    if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(node.type)) return node.value
    if (node.type === 'NullLiteral') return null
    if (node.type === 'ArrayExpression') return node.elements.map(serialize)
    if (node.type === 'ObjectExpression') return Object.fromEntries(node.properties.map(p => {
      if (p.type !== 'ObjectProperty' || p.computed) throw Error('expression')
      return [p.key.name || p.key.value, serialize(p.value)]
    }))
    if (node.type === 'Identifier' && knownIcons.has(node.name)) { iconNames.add(node.name); return { $icon: node.name } }
    throw Error('not static')
  }
  const component = p => {
    for (let ancestor = p; ancestor; ancestor = ancestor.parentPath) {
      if (ancestor.isFunctionDeclaration() && /^[A-Z]/.test(ancestor.node.id?.name || '')) return ancestor
    }
    return null
  }
  const replace = (p, replacement) => {
    const owner = component(p)
    if (!owner) return false
    hooks.set(owner.node.start, owner.node.body.start + 1)
    edits.push({ start: p.node.start, end: p.node.end, text: replacement })
    return true
  }
  traverse(ast, {
    VariableDeclarator(p) {
      if (!p.parentPath.parentPath.isProgram() || !p.node.id.name || ['fields', 'methods'].includes(p.node.id.name)) return
      if (!['ArrayExpression', 'ObjectExpression'].includes(p.node.init?.type)) return
      const binding = p.scope.getBinding(p.node.id.name)
      if (!binding?.referencePaths.length || binding.referencePaths.some(ref => !component(ref))) return
      try {
        const value = serialize(p.node.init)
        const name = p.node.id.name
        data.sections[name] = value
        binding.referencePaths.forEach(ref => replace(ref, `siteContent.sections.${name}`))
        edits.push({ start: p.parentPath.node.start, end: p.parentPath.node.end, text: '' })
        p.skip()
      } catch { /* Keep computed and behavioural values in code. */ }
    },
    CallExpression(p) {
      const callee = p.node.callee
      if (callee.type !== 'MemberExpression' || callee.property.name !== 'map' || callee.object.type !== 'ArrayExpression' || !component(p)) return
      try {
        const value = serialize(callee.object)
        const id = `cards${Object.keys(data.sections).length + 1}`
        data.sections[id] = value
        replace(p.get('callee.object'), `siteContent.sections.${id}`)
      } catch { /* Product-derived lists stay in the product model. */ }
    },
    JSXText(p) {
      if (!component(p)) return
      const parentTag = p.parentPath.node.openingElement?.name?.name
      if (['style', 'script', 'option'].includes(parentTag)) return
      const lines = p.node.value.replace(/\r/g, '').split('\n')
      const text = lines.map((line, i) => {
        let value = line.replace(/\t/g, ' ')
        if (i) value = value.replace(/^ +/, '')
        if (i < lines.length - 1) value = value.replace(/ +$/, '')
        return value
      }).filter(Boolean).join(' ')
      if (!text.trim() || !/[\p{L}\p{N}]/u.test(text)) return
      const slug = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 45).replace(/_$/, '') || 'label'
      let id = /^\d/.test(slug) ? 'label_' + slug : slug, index = 2
      while (Object.hasOwn(data.text, id)) id = `${slug}_${index++}`
      data.text[id] = text
      replace(p, `{siteContent.text.${id}}`)
    },
    JSXAttribute(p) {
      if (!component(p) || p.node.value?.type !== 'StringLiteral') return
      const attr = p.node.name.name
      if (!['src', 'alt', 'href', 'to', 'placeholder', 'title', 'text'].includes(attr) || !p.node.value.value || p.node.value.value.startsWith('#')) return
      const id = `${attr}_${Object.keys(data.media).length + 1}`
      data.media[id] = p.node.value.value
      replace(p.get('value'), `{siteContent.media.${id}}`)
    },
  })
  const icons = [...iconNames].sort().join(', ')
  for (const start of hooks.values()) edits.push({ start, end: start, text: `\n  const siteContent = useSiteContent('${key}', siteIcons)\n` })
  let output = source
  const ordered = edits.sort((a,b) => b.start - a.start)
  let previous = Infinity
  for (const edit of ordered) {
    if (edit.end > previous) throw Error(`Overlapping migration in ${file} at ${edit.start}`)
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end)
    previous = edit.start
  }
  // Registry is stable; icons stay code-owned and never become executable CMS input.
  output = `import { useSiteContent } from '../context/SiteContentContext.jsx'\n` + output + `\nconst siteIcons = { ${icons} }\n`
  fs.writeFileSync(file, output)
  pages[key] = data
  console.log(`${key}: ${Object.keys(data.sections).length} sections; ${Object.keys(data.text).length} text fields`)
}
fs.writeFileSync('shared/websiteContent.js', `// Original storefront content. Structure and array sizes preserve the supplied design.\nexport const websiteContent = ${JSON.stringify(pages, null, 2)}\n`)
