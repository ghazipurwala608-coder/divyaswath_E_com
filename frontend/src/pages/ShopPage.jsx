import { useSiteContent } from '../context/SiteContentContext.jsx'
import { Search, SlidersHorizontal, Leaf, X, ArrowRight, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './ShopPage.css'
import ProductCard from '../components/ProductCard.jsx'
import { useProducts } from '../hooks/useProducts.js'

export default function ShopPage() {
  const siteContent = useSiteContent('shop', siteIcons)

  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('featured')
  const { products } = useProducts()
  const categories = ['All', ...new Set(products.map(product => product.category))]
  const search = searchParams.get('search') || ''

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    const result = products.filter(
      (product) =>
        (category === 'All' || product.category === category) &&
        (!query ||
          `${product.name} ${product.subtitle} ${product.ingredients?.join(' ')}`
            .toLowerCase()
            .includes(query))
    )
    return [...result].sort((a, b) =>
      sort === 'low'
        ? a.price - b.price
        : sort === 'high'
        ? b.price - a.price
        : sort === 'rating'
        ? b.rating - a.rating
        : Number(b.featured) - Number(a.featured)
    )
  }, [products, category, sort, search])

  return (
    <div>
      {/* local keyframes — no extra animation library required */}
      <style>{`
        @keyframes floatY { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(18px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        .animate-fadeUp { animation: fadeUp .7s ease both }
        .animate-cardIn { animation: cardIn .5s cubic-bezier(.22,.61,.36,1) both }
        .animate-floatSlow { animation: floatY 7s ease-in-out infinite }
        .animate-floatSlower { animation: floatY 9s ease-in-out infinite }
      `}</style>

      <section className="shop-collection-hero" aria-labelledby="shop-heading">
        <img className="shop-collection-art" src={siteContent.media.collection_hero || '/images/shop-collection-hero.png'} alt="Fresh Ayurvedic herbs and amla with a brass mortar on a stone display" fetchPriority="high" />
        <div className="shop-collection-shade" />
        <div className="shop-collection-inner">
          <nav className="shop-collection-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} /><span aria-current="page">Our Products</span></nav>
          <div className="shop-collection-copy">
            <p className="shop-collection-eyebrow"><Leaf size={16} />{siteContent.text.the_divya_collection || 'The Divya Collection'}</p>
            <h1 id="shop-heading">{siteContent.text.wellness_for_every_day || 'Wellness for every day.'}</h1>
            <p className="shop-collection-description">{siteContent.text.explore_mindful_ayurvedic_blends_designed_aro || 'Explore mindful Ayurvedic blends designed around the rhythms and needs of modern life.'}</p>
            <a className="shop-collection-cta" href="#shop-products">Explore the collection <ArrowRight size={17} /></a>
            <div className="shop-collection-note"><span />Rooted in Ayurveda. Made for your everyday.</div>
          </div>
        </div>
      </section>

      {/* Filter / sort bar */}
      <section id="shop-products" className="shop-products px-4 py-14 sm:px-6 lg:px-8" aria-label="Browse products">
        <div className="mx-auto max-w-7xl">
          <div className="sticky top-4 z-20 mb-10 flex flex-col gap-5 rounded-[1.5rem] border border-[#e0e4da] bg-white/90 p-4 shadow-[0_10px_30px_rgba(20,40,27,.06)] backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
            {/* category pills */}
            <div className="flex min-w-0 gap-2 overflow-x-auto overflow-y-hidden pb-1 lg:flex-1 lg:pb-0">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    category === item
                      ? 'scale-[1.03] border-[#183d27] bg-[#183d27] text-white shadow-[0_6px_16px_rgba(24,61,39,.25)]'
                      : 'border-transparent bg-[#f2f4ee] text-[#526158] hover:border-[#d9b45f]/40 hover:text-[#9c6c17]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* search + sort */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="group relative min-w-0 flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#758179] transition-colors group-focus-within:text-[#a16e18]" />
                <input
                  value={search}
                  onChange={(event) =>
                    setSearchParams(
                      event.target.value ? { search: event.target.value } : {}
                    )
                  }
                  placeholder={siteContent.media.placeholder_2}
                  className="w-full rounded-full border border-[#dfe4da] py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                />
                {search && (
                  <button
                    onClick={() => setSearchParams({})}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8b1a4] hover:text-[#526158]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#758179]" />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="appearance-none rounded-full border border-[#dfe4da] bg-white py-2.5 pl-10 pr-8 text-xs font-bold text-[#1c2e20] outline-none transition-colors focus:border-[#b58529]"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Top rated</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <span className="h-px w-6 bg-[#d9b45f]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#738078]">
              {filtered.length}{siteContent.text.product}{filtered.length === 1 ? '' : 's'}{siteContent.text.found}</p>
          </div>

          {filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((product, i) => (
                <div
                  key={product._id || product.slug}
                  className="animate-cardIn"
                  style={{ animationDelay: `${Math.min(i, 10) * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-fadeUp rounded-[2rem] border border-dashed border-[#cbd3c7] bg-[#faf9f5] py-24 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#d9b45f]/40 bg-white">
                <Leaf className="h-6 w-6 text-[#a37622]" strokeWidth={1.4} />
              </div>
              <p className="font-serif text-3xl text-[#1c2e20]">{siteContent.text.no_wellness_match_found}</p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-[#738078]">{siteContent.text.try_a_different_search_term_or_clear_your_fil}</p>
              <button
                onClick={() => {
                  setCategory('All')
                  setSearchParams({})
                }}
                className="mt-5 rounded-full border border-[#a16e18]/30 px-5 py-2 text-sm font-bold text-[#a16e18] transition-colors hover:bg-[#a16e18] hover:text-white"
              >{siteContent.text.clear_filters}</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const siteIcons = {}
