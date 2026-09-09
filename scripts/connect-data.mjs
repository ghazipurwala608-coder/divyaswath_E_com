import fs from 'node:fs'
const edit = (file, fn) => fs.writeFileSync(file, fn(fs.readFileSync(file, 'utf8')))
edit('frontend/src/pages/ProductPage.jsx', s => {
  s = s.replace("import { apiRequest } from '../api/client.js'", "import { useProducts } from '../hooks/useProducts.js'").replace("import { fallbackProducts } from '../data/products.js'\n", '')
  s = s.replace("const [product, setProduct] = useState(() => fallbackProducts.find((item) => item.slug === slug))", "const { products, loading } = useProducts()\n  const product = products.find(item => item.slug === slug)")
  s = s.replace(/    const fallback = fallbackProducts[\s\S]*?apiRequest\([^\n]+\n/, '    setActiveImage(0)\n    setQuantity(1)\n')
  s = s.replace("fallbackProducts.filter((item) => item.slug !== slug).slice(0, 4), [slug]", "products.filter((item) => item.slug !== slug).slice(0, 4), [products, slug]")
  s = s.replace('  if (!product) return', '  if (!product && loading) return <p className="p-12 text-center">Loading product…</p>\n  if (!product) return')
  s = s.replace('src={product.images[activeImage]}', 'src={product.images[activeImage] || product.images[0]}')
  return s
})
edit('frontend/src/pages/WellnessArticlePage.jsx', s => s.replace("import { getWellnessArticle, wellnessArticles } from '../data/wellnessArticles.js'\n", '').replace('const article = getWellnessArticle(slug)', "const { articles: wellnessArticles } = useSiteContent('articles')\n  const article = wellnessArticles.find(item => item.slug === slug)"))
for (const [file, before, after] of [
 ['frontend/src/pages/BlogPage.jsx', '[activeCategory, query]', '[activeCategory, query, siteContent.sections]'],
 ['frontend/src/pages/FaqPage.jsx', '[query, category]', '[query, category, siteContent.sections]'],
]) edit(file, s => s.replace(before, after))
for (const file of ['frontend/src/pages/CartPage.jsx', 'frontend/src/pages/CheckoutPage.jsx']) edit(file, s => {
  s = "import { useSiteContent } from '../context/SiteContentContext.jsx'\nimport { calculateShipping } from '../../../shared/shipping.js'\n" + s
  s = s.replace(/export default function (\w+)\(\) \{/, "$&\n  const { shipping: shippingSettings } = useSiteContent('settings')")
  s = s.replace('subtotal >= 999 ? 0 : 99', 'calculateShipping(subtotal, items.length, shippingSettings)').replace('items.length && subtotal < 999 ? 99 : 0', 'calculateShipping(subtotal, items.length, shippingSettings)')
  s = s.replaceAll('subtotal < 999', 'subtotal < shippingSettings.freeAbove').replaceAll('(999 - subtotal)', '(shippingSettings.freeAbove - subtotal)')
  return s
})
