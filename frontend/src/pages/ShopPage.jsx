import { Search, SlidersHorizontal, Leaf, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { categories } from '../data/products.js'
import { useProducts } from '../hooks/useProducts.js'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('featured')
  const { products } = useProducts()
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0b271b] px-4 py-24 text-center text-white">
        <img
          src="/images/botanical-hero-bg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b271b]/80 via-[#0b271b]/70 to-[#0b271b]" />
        <LeafBackdrop />

        <div className="relative mx-auto max-w-3xl animate-fadeUp">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#d9b45f]/40 bg-white/5 backdrop-blur-sm">
            <Leaf className="h-6 w-6 text-[#d9b45f]" strokeWidth={1.4} />
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#dfba65]">
            The Divya collection
          </p>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl">
            Wellness for every day.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60">
            Explore mindful Ayurvedic blends designed around the rhythms and
            needs of modern life.
          </p>
        </div>
      </section>

      {/* Filter / sort bar */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="sticky top-4 z-20 mb-10 flex flex-col gap-5 rounded-[1.5rem] border border-[#e0e4da] bg-white/90 p-4 shadow-[0_10px_30px_rgba(20,40,27,.06)] backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
            {/* category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
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
            <div className="flex items-center gap-3">
              <div className="group relative min-w-0 flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#758179] transition-colors group-focus-within:text-[#a16e18]" />
                <input
                  value={search}
                  onChange={(event) =>
                    setSearchParams(
                      event.target.value ? { search: event.target.value } : {}
                    )
                  }
                  placeholder="Search products"
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
              {filtered.length} product{filtered.length === 1 ? '' : 's'} found
            </p>
          </div>

          {filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, i) => (
                <div
                  key={product._id}
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
              <p className="font-serif text-3xl text-[#1c2e20]">
                No wellness match found.
              </p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-[#738078]">
                Try a different search term or clear your filters to see the
                full collection.
              </p>
              <button
                onClick={() => {
                  setCategory('All')
                  setSearchParams({})
                }}
                className="mt-5 rounded-full border border-[#a16e18]/30 px-5 py-2 text-sm font-bold text-[#a16e18] transition-colors hover:bg-[#a16e18] hover:text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function LeafBackdrop() {
  return (
    <>
      <div className="absolute -left-16 top-0 h-64 w-64 rounded-full border border-[#d2aa52]/10" />
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-[#d2aa52]/10" />

      <svg
        className="absolute left-[6%] top-16 h-16 w-16 animate-floatSlow opacity-20"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 20C2 8 14 2 30 2c2 18-8 30-20 30C6 32 2 26 2 20Z"
          stroke="#d9b45f"
          strokeWidth="1.2"
        />
      </svg>
      <svg
        className="absolute right-[8%] top-28 h-10 w-10 animate-floatSlower opacity-20"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 20C2 8 14 2 30 2c2 18-8 30-20 30C6 32 2 26 2 20Z"
          stroke="#d9b45f"
          strokeWidth="1.2"
        />
      </svg>
      <svg
        className="absolute bottom-10 left-[18%] h-8 w-8 animate-floatSlow opacity-10"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 20C2 8 14 2 30 2c2 18-8 30-20 30C6 32 2 26 2 20Z"
          stroke="#d9b45f"
          strokeWidth="1.2"
        />
      </svg>
    </>
  )
}