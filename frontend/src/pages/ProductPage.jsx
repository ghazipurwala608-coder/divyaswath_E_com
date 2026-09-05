import { AlertTriangle, ArrowRight, Camera, Check, ChevronRight, FlaskConical, Minus, PackageCheck, Plus, ShieldCheck, ShoppingBag, Sprout, Truck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCart } from '../context/CartContext.jsx'
import { fallbackProducts } from '../data/products.js'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(() => fallbackProducts.find((item) => item.slug === slug))
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fallback = fallbackProducts.find((item) => item.slug === slug)
    setProduct(fallback)
    setActiveImage(0)
    apiRequest(`/products/${slug}`).then(({ product: fetched }) => setProduct(fetched)).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!product) return
    document.title = `${product.name} ${product.subtitle} | Divya Swasth`
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', product.shortDescription)
  }, [product])

  const related = useMemo(() => fallbackProducts.filter((item) => item.slug !== slug).slice(0, 4), [slug])
  if (!product) return <div className="mx-auto max-w-7xl px-4 py-32 text-center"><h1 className="font-display text-5xl">Product not found</h1><Link to="/shop" className="mt-5 inline-block font-bold text-[#9e6d18]">Return to products</Link></div>

  const purchasable = product.availableForPurchase !== false && product.countInStock > 0 && product.price > 0
  const buyNow = () => { if (!purchasable) return; addToCart(product, quantity); navigate('/checkout') }
  const specifications = [
    ['Product', product.name], ['Form', product.form || 'To be confirmed'], ['Quantity', product.size], ['Category', product.classification], ['Vegetarian', product.vegetarian], ['MRP', product.mrp ? `₹${product.mrp.toLocaleString('en-IN')}/-` : 'To be confirmed'], ['MFG / EXP', 'Actual batch details will appear for the product being sold'], ['Storage', product.storage], ['Suggested use', 'As per final approved label'],
  ]

  return (
    <div>
      <div className="border-b border-[#e4e6df] bg-[#f5f5ee] px-4 py-3"><div className="mx-auto flex max-w-7xl items-center gap-2 text-[10px] font-semibold text-[#7d8880]"><Link to="/">Home</Link><ChevronRight className="h-3 w-3" /><Link to="/shop">Products</Link><ChevronRight className="h-3 w-3" /><span className="text-[#9b6c1a]">{product.name}</span></div></div>
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>{product.images?.length ? <><div className="relative min-h-[430px] overflow-hidden rounded-[1.6rem] border border-[#dfe4d8] bg-white"><img src={product.images[activeImage]} alt={`${product.name} concept view ${activeImage + 1}`} className="h-[430px] w-full object-contain" /><span className="absolute bottom-3 left-3 right-3 rounded-full bg-[#14271b]/95 px-4 py-2.5 text-center text-[8px] font-black uppercase tracking-[.12em] text-[#efd484]">Temporary concept only — replace with approved final photography</span></div><div className="mt-3 grid grid-cols-4 gap-2">{product.images.map((image, index) => <button type="button" key={image} onClick={() => setActiveImage(index)} className={`overflow-hidden rounded-xl border bg-white ${activeImage === index ? 'border-[#a97820] ring-2 ring-[#a97820]/15' : 'border-[#dde2da]'}`}><img src={image} alt="" className="h-20 w-full object-contain" /></button>)}</div></> : <ProductVisual product={product} />}</div>
        <div className="lg:py-4"><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#9d6d1a]">{product.category}</p><h1 className="mt-3 font-display text-5xl font-bold tracking-[-.02em] text-[#173824] sm:text-6xl">{product.name}</h1><p className="mt-2 text-lg text-[#6d786f]">{product.subtitle}</p><p className="mt-7 border-y border-[#e4e8e0] py-6 text-base leading-8 text-[#58675d]">{product.description}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{product.benefits.map((benefit) => <p key={benefit} className="flex items-start gap-2 text-sm font-semibold text-[#425349]"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e6efe2] text-[#367046]"><Check className="h-3 w-3" /></span>{benefit}</p>)}</div><p className="mt-4 text-[10px] leading-5 text-[#89938d]">*General support statements only. Final claims require evidence and regulatory review.</p><div className="mt-7"><p className="text-3xl font-black text-[#173d27]">{product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price to be confirmed'}</p><p className="mt-1 text-[10px] text-[#879088]">MRP inclusive of all taxes</p></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><QuantityPicker quantity={quantity} setQuantity={setQuantity} stock={product.countInStock} disabled={!purchasable} /><button type="button" onClick={() => addToCart(product, quantity)} disabled={!purchasable} className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-[#123b2a] px-7 text-[10px] font-black uppercase tracking-[.15em] text-white transition hover:bg-[#b98524] disabled:cursor-not-allowed disabled:bg-gray-400"><ShoppingBag className="h-4 w-4" /> {purchasable ? 'Add to cart' : 'Coming soon'}</button></div><button type="button" onClick={buyNow} disabled={!purchasable} className="mt-3 flex h-14 w-full items-center justify-center rounded-full border border-[#b98524] text-[10px] font-black uppercase tracking-[.15em] text-[#8d6116] transition hover:bg-[#f5ecd8] disabled:cursor-not-allowed disabled:opacity-50">Buy now</button><div className="mt-7 grid grid-cols-3 gap-3">{[[Truck, 'Tracked delivery'], [ShieldCheck, 'Secure checkout'], [PackageCheck, 'Safe packaging']].map(([Icon, text]) => <div key={text} className="rounded-xl bg-[#f1f3ec] p-3 text-center"><Icon className="mx-auto h-5 w-5 text-[#47704e]" /><span className="mt-2 block text-[8px] font-black uppercase tracking-wider text-[#57655c]">{text}</span></div>)}</div></div>
      </div></section>

      <section className="border-y border-[#dedfd6] bg-[#f1f3ec] px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-[2rem] border border-[#dde1d8] bg-white p-6 sm:p-9"><div className="flex items-center gap-3"><FlaskConical className="h-6 w-6 text-[#9d711d]" /><h2 className="font-display text-3xl text-[#183723]">Complete product information</h2></div><div className="mt-6 divide-y divide-[#ece9df]">{specifications.map(([label, value]) => <div key={label} className="grid gap-1 py-3.5 text-xs sm:grid-cols-[160px_1fr]"><span className="font-black uppercase tracking-[.08em] text-[#4c5b51]">{label}</span><span className="leading-5 text-[#6c776f]">{value}</span></div>)}</div></div><div className="grid gap-5"><InfoCard icon={Sprout} title="How to use" text={product.usage} /><InfoCard icon={ShieldCheck} title="Quality approach" text="Carefully selected ingredients, quality-focused manufacturing, batch testing and appropriate storage. Certification marks will only appear after valid documentation is verified." /><div className="rounded-[2rem] border border-[#ebc77a] bg-[#fff8e7] p-7"><AlertTriangle className="h-6 w-6 text-[#a87318]" /><h2 className="mt-4 font-display text-2xl text-[#3b3018]">Safety & disclaimer</h2><p className="mt-3 text-xs leading-6 text-[#76643d]">{product.disclaimer}</p></div></div></div>

        <div className="mt-14"><div className="text-center"><p className="text-[10px] font-black uppercase tracking-[.24em] text-[#9c6d19]">Inside the formula</p><h2 className="mt-3 font-display text-4xl text-[#183723]">Ingredients, clearly explained.</h2></div>{product.ingredients?.length ? <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{product.ingredients.map((ingredient, index) => <article key={ingredient} className="rounded-2xl border border-[#dde2d9] bg-white p-5"><span className="font-display text-3xl text-[#c39a44]">0{index + 1}</span><h3 className="mt-5 font-display text-xl text-[#1d3c29]">{ingredient}</h3><Link to="/ingredients" className="mt-4 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#96671a]">Learn more <ArrowRight className="h-3 w-3" /></Link></article>)}</div> : <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-[#c9d1c4] bg-white px-6 py-12 text-center"><Camera className="mx-auto h-8 w-8 text-[#78907d]" /><p className="mt-4 font-display text-2xl text-[#274332]">Final formula information pending</p><p className="mt-2 text-xs leading-6 text-[#748078]">Exact ingredients and quantities will be published only when they match the final approved formulation and label.</p></div>}</div>

        <div className="mt-14 rounded-[2rem] bg-[#10291d] p-8 text-center text-white"><p className="text-[9px] font-black uppercase tracking-[.22em] text-[#dfb862]">Real customer experiences</p><h2 className="mt-3 font-display text-3xl text-[#fff7e4]">No reviews published yet.</h2><p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/55">Only genuine reviews from consenting customers, with verified-purchase status where applicable, will appear here.</p></div>
      </div></section>

      <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="text-center font-display text-4xl text-[#1b3524]">Explore more wellness</h2><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item._id} product={item} />)}</div></div></section>
    </div>
  )
}

function InfoCard({ icon: Icon, title, text }) { return <div className="rounded-[2rem] border border-[#dde1d8] bg-white p-7"><Icon className="h-6 w-6 text-[#9d711d]" /><h2 className="mt-4 font-display text-2xl text-[#183723]">{title}</h2><p className="mt-3 text-xs leading-6 text-[#69766d]">{text}</p></div> }
function QuantityPicker({ quantity, setQuantity, stock, disabled }) { return <div className={`flex h-14 items-center justify-between rounded-full border border-[#d6ddd3] px-2 sm:w-36 ${disabled ? 'opacity-50' : ''}`}><button type="button" disabled={disabled} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#eef1eb]"><Minus className="h-4 w-4" /></button><span className="font-bold">{quantity}</span><button type="button" disabled={disabled} onClick={() => setQuantity((value) => Math.min(stock, value + 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#eef1eb]"><Plus className="h-4 w-4" /></button></div> }
