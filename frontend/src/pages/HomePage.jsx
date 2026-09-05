import { Award, BadgeCheck, Check, ChevronRight, FlaskConical, Leaf, Minus, PackageCheck, Plus, RotateCw, ShieldCheck, ShoppingBag, Sprout, Truck, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../hooks/useProducts.js'

const botanicals = [
  ['Ashwagandha', 'Botanical extract', '/images/botanicals/ashwagandha.png'],
  ['Shilajit', 'Purified mineral resin', '/images/botanicals/shilajit.png'],
  ['Safed Musli', 'Botanical extract', '/images/botanicals/safed-musli.png'],
  ['Gokshura', 'Botanical extract', '/images/botanicals/gokshura.png'],
  ['Kaunch Beej', 'Botanical extract', '/images/botanicals/kaunch-beej.png'],
  ['Tribulus Terrestris', 'Botanical extract', '/images/botanicals/tribulus-terrestris.png'],
  ['Mucuna Pruriens', 'Botanical extract', '/images/botanicals/mucuna-pruriens.png'],
  ['Black Musli', 'Botanical extract', '/images/botanicals/black-musli.png'],
  ['Zinc', 'Essential mineral', '/images/botanicals/zinc.png'],
  ['Magnesium', 'Essential mineral', '/images/botanicals/magnesium.png'],
]

const heroBenefits = [
  [Zap, 'Daily vitality', 'Created for an active wellness routine'],
  [ShieldCheck, 'Responsible formula', 'Final claims subject to label approval'],
  [Leaf, 'Botanical approach', 'Selected ingredients in a modern format'],
]

const valueStrip = [
  [Leaf, 'Time-tested Ayurvedic herbs', 'Ancient wisdom meets modern wellness'],
  [FlaskConical, 'Considered formulation', 'Carefully selected ingredients in a convenient format'],
  [ShieldCheck, 'Premium quality focus', 'Sourcing and process information presented transparently'],
  [Award, 'Made for modern life', 'Simple support for everyday routines'],
]

const servicePromises = [
  [Leaf, 'Selected ingredients', 'Thoughtfully chosen for each planned formula'],
  [ShieldCheck, 'Safety information', 'Clear usage, storage and caution guidance'],
  [BadgeCheck, 'Quality focus', 'Transparent process and label verification'],
  [Truck, 'Tracked delivery', 'Order updates from dispatch to doorstep'],
  [PackageCheck, 'Secure packaging', 'Packed carefully for protected transit'],
]

const productViews = [
  { label: 'Left side', angle: '0°', image: '/images/a (2).jpeg' },
  { label: 'Front', angle: '60°', image: '/images/sugar-shield-front.jpeg' },
  { label: 'Right side', angle: '120°', image: '/images/a (1).jpeg' },
  { label: 'Back profile', angle: '180°', image: '/images/sugar-shield-back.jpeg' },
  { label: '45° left', angle: '240°', image: '/images/sugar-shield-45-left.jpeg' },
  { label: '45° right', angle: '360°', image: '/images/sugar-shield-45-right.jpeg' },
]

export default function HomePage() {
  const { products } = useProducts()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const product = products.find((item) => item.slug === 'divya-swasth-wellness') || products[0]

  if (!product) return null
  const otherProducts = products.filter((item) => item.slug !== product.slug).slice(0, 4)
  const purchasable = product.availableForPurchase !== false && product.countInStock > 0
  const buyNow = () => { if (!purchasable) return; addToCart(product, quantity); navigate('/checkout') }
  const productDetails = [
    ['Product name', product.name],
    ['Product type', product.subtitle],
    ['Form', product.form || 'Capsules'],
    ['Net quantity', product.size],
    ['Category', product.classification],
    ['Vegetarian', product.vegetarian],
    ['Shelf life', 'As stated on the final batch label'],
    ['Storage', product.storage],
  ]

  return (
    <div className="bg-[#f7f5ee]">
      <section className="grain relative min-h-[610px] overflow-hidden bg-[#050806] text-white lg:min-h-[650px]">
        <img src="/images/divya-swasth-hero.png" alt="Divya Swasth premium bottle concept with botanicals" className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#030503_0%,rgba(3,5,3,.96)_38%,rgba(3,5,3,.48)_65%,rgba(3,5,3,.12)_100%)]" />
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#d6a63e]/10 blur-3xl" />
        <div className="relative mx-auto grid min-h-[610px] max-w-7xl items-center px-4 py-12 sm:px-6 lg:min-h-[650px] lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <p className="animate-rise text-[8px] font-black uppercase tracking-[.26em] text-[#d6ae55]">Premium Ayurvedic wellness · Rooted in nature</p>
            <div className="animate-rise-delay mt-4 flex items-center gap-3 sm:gap-5">
              <span className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-full border border-[#d8b356]/35 bg-white/[.04] shadow-[0_0_35px_rgba(211,170,75,.14)] sm:block"><img src="/images/divyaswasth.png" alt="" className="absolute -left-[34px] -top-1 w-40 max-w-none" /></span>
              <div>
                <h1 className="font-display text-[3.45rem] font-bold leading-[.86] tracking-[-.045em] sm:text-[4.25rem]"><span className="text-[#789456]">DIVYA</span> <span className="text-[#dcb354]">SWASTH</span></h1>
                <p className="mt-3 border-t border-[#d8b356]/30 pt-2 text-[8px] font-black uppercase tracking-[.16em] text-white/65 sm:text-[9px]">Natural healing · Holistic wellness · Healthy future</p>
              </div>
            </div>
            <p className="animate-rise-delay mt-5 text-[13px] font-black uppercase tracking-[.13em] text-white">Ayurvedic wisdom for modern wellbeing.</p>
            <p className="animate-rise-delay-2 mt-4 max-w-lg text-xs leading-6 text-white/58">A planned botanical capsule formula designed to complement an active, balanced lifestyle. Exact ingredients, benefits and directions will follow the approved final label.</p>
            <div className="animate-rise-delay-2 mt-6 grid max-w-lg grid-cols-3 gap-2.5">{heroBenefits.map(([Icon, title, text]) => <div key={title} className="rounded-xl border border-[#d5ac51]/20 bg-black/35 p-3 backdrop-blur"><span className="grid h-8 w-8 place-items-center rounded-full border border-[#d5ac51]/30 bg-[#d5ac51]/10"><Icon className="h-4 w-4 text-[#dcb455]" /></span><p className="mt-3 text-[8px] font-black uppercase tracking-wider text-white/85">{title}</p><p className="mt-1 text-[8px] leading-4 text-white/38">{text}</p></div>)}</div>
            <div className="animate-rise-delay-2 mt-6 flex flex-wrap items-center gap-3"><p className="mr-3"><span className="block text-[7px] font-bold uppercase tracking-wider text-white/35">MRP incl. of taxes</span><span className="font-display text-3xl font-bold text-[#e5bc5c]">₹{product.price.toLocaleString('en-IN')}</span></p><button type="button" onClick={() => addToCart(product, quantity)} disabled={!purchasable} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b77d1d] to-[#e0b753] px-6 py-3 text-[8px] font-black uppercase tracking-[.14em] text-[#111b14] transition hover:-translate-y-0.5 disabled:opacity-50"><ShoppingBag className="h-3.5 w-3.5" /> Add to cart</button><Link to={`/products/${product.slug}`} className="flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-[8px] font-black uppercase tracking-[.14em] text-white/70 backdrop-blur">View details <ChevronRight className="h-3.5 w-3.5" /></Link></div>
          </div>
        </div>
        <p className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/65 px-4 py-2 text-[7px] font-black uppercase tracking-[.12em] text-white/45 backdrop-blur">Temporary concept visual · Not final packaging</p>
      </section>

      <section className="bg-[#f7f5ee] px-4 py-5 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#d5aa50]/25 bg-[linear-gradient(105deg,#111411_0%,#050705_52%,#121412_100%)] px-3 text-white shadow-[0_14px_35px_rgba(9,15,10,.18)] sm:grid-cols-2 lg:grid-cols-4">{valueStrip.map(([Icon, title, text], index) => <article key={title} className={`flex min-h-[116px] items-center gap-4 px-5 py-5 ${index ? 'border-t border-white/10 sm:border-l sm:border-t-0' : ''}`}><Icon className={`h-9 w-9 shrink-0 ${index === 0 ? 'text-[#79a84d]' : 'text-[#d9aa4b]'}`} strokeWidth={1.7} /><div><h2 className="max-w-[180px] text-[12px] font-black uppercase leading-[1.35] tracking-[.035em] text-white">{title}</h2><p className="mt-2 max-w-[190px] text-[10px] leading-[1.55] text-white/58">{text}</p></div></article>)}</div></section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Original Sugar Shield photography" title="360° product views" />
            <div className="flex items-center gap-2 rounded-full border border-[#d6c28e] bg-white px-4 py-2 text-[8px] font-black uppercase tracking-[.15em] text-[#76581d] shadow-sm">
              <RotateCw className="h-3.5 w-3.5 text-[#aa781e]" /> Explore every angle
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {productViews.map((view, index) => (
              <article key={view.label} className="group min-w-0 rounded-[1.35rem] border border-[#ded5c2] bg-white p-2.5 shadow-[0_12px_32px_rgba(31,51,35,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#c7a34e] hover:shadow-[0_18px_38px_rgba(31,51,35,.12)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#faf9f5_64%,#eeeade_100%)]">
                  <span className="absolute left-2.5 top-2.5 z-10 grid h-6 w-6 place-items-center rounded-full border border-[#d9c797] bg-white/90 text-[7px] font-black text-[#8c651b] shadow-sm">{String(index + 1).padStart(2, '0')}</span>
                  <img src={view.image} alt={`${view.label} view of Sugar Shield bottle`} loading="lazy" className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.035]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#f4f1e8] to-transparent" />
                </div>
                <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
                  <p className="truncate text-[8px] font-black uppercase tracking-[.1em] text-[#1b3a27]">{view.label}</p>
                  <span className="shrink-0 rounded-full bg-[#edf2e9] px-2 py-1 text-[7px] font-black text-[#6e7d70]">{view.angle}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-3 text-center text-[8px] leading-4 text-[#8a8174]">Each angle is presented separately for a clearer packaging view. Temporary concept photography—not final packaging.</p>
        </div>
      </section>

      <section className="border-y border-[#e0dacb] bg-white px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Purposeful ingredients, thoughtfully brought together" title="The power of Ayurvedic botanicals" /><div className="mt-7 grid overflow-hidden rounded-[1.3rem] border border-[#e1dac8] bg-[#fffefa] grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">{botanicals.map(([name, type, image]) => <article key={name} className="group border-b border-r border-[#e8e1d2] text-center"><div className="h-36 overflow-hidden bg-[#fbfaf5]"><img src={image} alt={`${name} reference`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="border-t border-[#eee7d9] px-2 py-3"><h3 className="text-[8px] font-black uppercase tracking-[.06em] text-[#1d3021]">{name}</h3><p className="mt-1 text-[7px] font-semibold text-[#747b75]">{type}</p></div></article>)}</div><p className="mt-3 text-center text-[8px] leading-4 text-[#8a8174]">Visual botanical library only. The final Divya Swasth ingredient list and quantities must match the approved formulation and label.</p></div></section>

      <section className="px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-[1.4rem] border border-[#ded8c9] bg-white p-6 shadow-[0_14px_38px_rgba(34,53,38,.06)]"><div className="flex items-center gap-3"><PackageCheck className="h-5 w-5 text-[#9d711d]" /><h2 className="font-display text-2xl font-bold text-[#1b3021]">Product details</h2></div><div className="mt-4 divide-y divide-[#eee9dd]">{productDetails.map(([label, value]) => <div key={label} className="grid gap-1 py-2.5 text-[9px] sm:grid-cols-[140px_1fr]"><span className="font-black uppercase tracking-[.06em] text-[#4d5d52]">{label}</span><span className="leading-4 text-[#707a73]">{value}</span></div>)}</div></article>
        <div className="grid gap-4"><article className="rounded-[1.4rem] border border-[#ded8c9] bg-white p-6 shadow-[0_14px_38px_rgba(34,53,38,.06)]"><div className="flex items-center gap-3"><Sprout className="h-5 w-5 text-[#9d711d]" /><h2 className="font-display text-2xl font-bold text-[#1b3021]">Suggested use</h2></div><p className="mt-4 text-xs leading-6 text-[#657168]">{product.usage}</p><p className="mt-3 rounded-xl bg-[#fff6df] p-3 text-[8px] leading-4 text-[#78612f]">Confirm this direction against the final approved product label before publishing.</p></article><article className="rounded-[1.4rem] border border-[#ded8c9] bg-[#102019] p-6 text-white shadow-[0_14px_38px_rgba(20,36,25,.15)]"><div className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-[#d4aa51]" /><h2 className="font-display text-2xl font-bold text-[#fff5dc]">Our quality promise</h2></div><p className="mt-4 text-[10px] leading-5 text-white/48">Carefully selected ingredients, quality-focused processes, appropriate batch testing and transparent safety information.</p><div className="mt-4 grid grid-cols-2 gap-2">{['Batch documentation', 'Safety review', 'Storage guidance', 'Label verification'].map((label) => <p key={label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 text-[7px] font-bold uppercase tracking-wider text-white/55"><Check className="h-3 w-3 text-[#d6ad55]" />{label}</p>)}</div></article></div>
      </div></div></section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-[1.35rem] border border-[#d6ab4d]/20 bg-[linear-gradient(110deg,#080c09_0%,#111a14_55%,#090e0b_100%)] text-white shadow-[0_18px_48px_rgba(11,20,14,.2)]"><div className="grid items-center gap-4 px-5 py-4 lg:grid-cols-[1fr_.34fr_.72fr]">
        <div className="flex items-center gap-4"><div className="h-24 w-32 overflow-hidden rounded-xl border border-white/10"><img src="/images/divya-swasth-hero.png" alt="Divya Swasth wellness product concept" className="h-full w-full object-cover object-right" /></div><div><p className="font-display text-2xl font-bold tracking-wide text-[#efc861]">DIVYA SWASTH</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[.12em] text-white/45">{product.subtitle}</p><p className="mt-2 text-[8px] font-bold uppercase tracking-wider text-white/55">{product.size} · Pre-launch concept</p></div></div>
        <div className="border-y border-white/10 py-3 lg:border-y-0 lg:border-l lg:px-6"><p className="text-[7px] font-bold uppercase tracking-wider text-white/35">MRP incl. taxes</p><p className="mt-1 font-display text-3xl font-black text-[#efb936]">₹{product.price.toLocaleString('en-IN')}</p></div>
        <div><div className="flex gap-2"><QuantityPicker quantity={quantity} setQuantity={setQuantity} stock={product.countInStock} /><button type="button" onClick={() => addToCart(product, quantity)} disabled={!purchasable} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c68c25] to-[#efca69] px-4 text-[8px] font-black uppercase tracking-[.1em] text-[#142018] disabled:opacity-50"><ShoppingBag className="h-4 w-4" /> Add to cart</button></div><button type="button" onClick={buyNow} disabled={!purchasable} className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#d7a844]/65 text-[8px] font-black uppercase tracking-[.12em] text-[#f0ce74] hover:bg-[#d7a844]/10 disabled:opacity-50"><Zap className="h-3.5 w-3.5" /> Buy now</button></div>
      </div></div></section>

      <section className="border-t border-[#e0ddd2] bg-white px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-4"><SectionTitle eyebrow="More from Divya Swasth" title="Explore the collection" /><Link to="/shop" className="mb-1 text-[8px] font-black uppercase tracking-[.15em] text-[#936719]">View all products →</Link></div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{otherProducts.map((item) => <ProductCard key={item._id} product={item} />)}</div></div></section>

      <section className="border-t border-[#ddd8c8] bg-[#f7f5ee] px-4 py-7 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.6rem] border border-[#d8c99f] bg-[linear-gradient(110deg,#f7f9f3_0%,#edf2e8_52%,#f8f6ef_100%)] shadow-[0_14px_38px_rgba(36,62,42,.08)] sm:grid-cols-2 lg:grid-cols-5">{servicePromises.map(([Icon, title, text], index) => <article key={title} className={`flex min-h-[112px] items-center gap-4 px-5 py-5 ${index ? 'border-t border-[#dce3d7] sm:border-l sm:border-t-0' : ''}`}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#b9c9b5] bg-white shadow-[0_6px_18px_rgba(42,69,47,.08)]"><Icon className="h-6 w-6 text-[#47704e]" strokeWidth={1.6} /></span><div><h2 className="text-[11px] font-black uppercase leading-4 tracking-[.06em] text-[#203a29]">{title}</h2><p className="mt-1.5 text-[9px] leading-4 text-[#6b786e]">{text}</p></div></article>)}</div></section>
    </div>
  )
}

function SectionTitle({ eyebrow, title }) {
  return <div><p className="text-[8px] font-black uppercase tracking-[.23em] text-[#a47724]">{eyebrow}</p><h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-[#1b3021]">{title}</h2></div>
}

function QuantityPicker({ quantity, setQuantity, stock }) {
  return <div className="flex h-11 w-28 shrink-0 items-center justify-between rounded-xl border border-white/15 bg-white/5 px-1 text-white"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10"><Minus className="h-3.5 w-3.5" /></button><span className="text-xs font-bold">{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(stock, value + 1))} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10"><Plus className="h-3.5 w-3.5" /></button></div>
}
