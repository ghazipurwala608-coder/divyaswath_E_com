import fs from 'node:fs'
const edit = (file, fn) => fs.writeFileSync(file, fn(fs.readFileSync(file, 'utf8')))
const root = 'frontend/src/'
edit(root + 'main.jsx', s => s.replace("import App from './App.jsx'", "import App from './App.jsx'\nimport { SiteContentProvider } from './context/SiteContentContext.jsx'").replace('<CartProvider>', '<SiteContentProvider><CartProvider>').replace('</CartProvider>', '</CartProvider></SiteContentProvider>'))
edit(root + 'pages/HomePage.jsx', s => {
  s = s.replace("{ name: 'Sugar Shield',", "{ slug: 'sugar-shield-blood-sugar-support', name: 'Sugar Shield',").replace("{ name: 'Endless',", "{ slug: 'endless-daily-wellness', name: 'Endless',").replace("{ name: 'Lean Shape',", "{ slug: 'lean-shape-garcinia-cambogia', name: 'Lean Shape',").replace("{ name: 'Vital Infinity',", "{ slug: 'vital-infinity-multivitamin', name: 'Vital Infinity',")
  s = s.replace('homeFormulations.map(({ name, type, image }) => (', 'homeFormulations.map((slot) => {\n    const item = products.find(product => product.slug === slot.slug)\n    const { name, type, image } = { ...slot, ...(item ? { name: item.name, type: item.subtitle, image: item.cardImage || item.images?.[0] || slot.image } : {}) }\n    return (')
  s = s.replace('60 Capsules\n', "{item?.size || '60 Capsules'}\n").replace('₹1,999/-', "{item ? `₹${item.price.toLocaleString('en-IN')}/-` : 'Loading…'}")
  s = s.replace('to="/shop"\n          className=', 'to={`/products/${slot.slug}`}\n          className=')
  s = s.replace('  ))}\n</div>', '  )})}\n</div>')
  return s
})
edit(root + 'pages/ShopPage.jsx', s => s.replace("import { categories } from '../data/products.js'\n", '').replace('const { products } = useProducts()', "const { products } = useProducts()\n  const categories = ['All', ...new Set(products.map(product => product.category))]"))
for (const name of ['AboutPage', 'BlogPage', 'WellnessPage']) {
  edit(root + `pages/${name}.jsx`, s => {
    s = "import { useNewsletter } from '../hooks/useNewsletter.js'\n" + s
    s = s.replace(`export default function ${name}() {`, `export default function ${name}() {\n  const { subscribe, submitting, subscribed } = useNewsletter('${name}')`)
    s = s.replace("  const [subscribed, setSubscribed] = useState(false)\n", '')
    s = s.replace('onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }}', 'onSubmit={subscribe}').replace('onSubmit={(event) => event.preventDefault()}', 'onSubmit={subscribe}')
    if (name === 'AboutPage') {
      s = s.replace('<div className="flex w-full max-w-[380px] sm:ml-auto">', '<form onSubmit={subscribe} className="flex w-full max-w-[380px] sm:ml-auto">')
      s = s.replace('Subscribe\n            </button>\n          </div>', 'Subscribe\n            </button>\n          </form>')
    }
    s = s.replace(/(<input\s+(?:\n\s*)?id="(?:about|wellness)-newsletter-email")/, '$1 required')
    s = s.replace(/<button([^>]*>\s*)Subscribe/g, '<button disabled={submitting || subscribed}$1{submitting ? \'Subscribing…\' : subscribed ? \'Subscribed\' : \'Subscribe\'}')
    return s
  })
}
for (const name of ['ContactPage', 'SupportPage']) edit(root + `pages/${name}.jsx`, s => s.replace("apiRequest('/contact', { method: 'POST', body: JSON.stringify({ name: 'Newsletter visitor', email: newsletterEmail, subject: 'Newsletter subscription request', message: 'I would like to receive Divya Swasth wellness tips and product updates by email.' }) })", "apiRequest('/newsletter', { method: 'POST', body: JSON.stringify({ email: newsletterEmail, consent: true, source: 'contact' }) })").replace("apiRequest('/contact', { method: 'POST', body: JSON.stringify({ name: 'Newsletter visitor', email, subject: 'Newsletter subscription request', message: 'I would like to receive Divya Swasth wellness tips and product updates by email.' }) })", "apiRequest('/newsletter', { method: 'POST', body: JSON.stringify({ email, consent: true, source: 'support' }) })"))
edit(root + 'components/VitalInfinityProduct.jsx', s => s.replace("const artwork = '/images/home/Vital.png'\n", '').replace('export default function VitalInfinityProduct({ product }) {', "export default function VitalInfinityProduct({ product }) {\n  const artwork = product.images?.[0] || product.cardImage || '/images/home/Vital.png'").replace('<span>Vital Infinity</span>', '<span>{product.name}</span>').replace('<h1 id="vital-title">VITAL INFINITY</h1>', '<h1 id="vital-title">{product.name}</h1>').replace('<h2>Complete Multivitamin Capsules</h2>', '<h2>{product.subtitle}</h2>'))
console.log('Storefront product slots and newsletter forms connected')
