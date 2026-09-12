import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  FlaskConical,
  HeartPulse,
  Leaf,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trophy,
  Zap
} from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext.jsx'
import { productIngredientsData } from '../data/productIngredients.js'

const siteIcons = { FlaskConical, HeartPulse, Leaf, ShieldCheck, Sprout, Trophy, Zap }

const tabIcons = {
  all: Sprout,
  'sugar-shield-blood-sugar-support': ShieldCheck,
  'endless-daily-wellness': Zap,
  'lean-shape-garcinia-cambogia': Trophy,
  'vital-infinity-multivitamin': Sparkles
}

export default function IngredientsPage() {
  const siteContent = useSiteContent('ingredients', siteIcons)
  const [searchParams, setSearchParams] = useSearchParams()

  const productParam = searchParams.get('product') || 'all'
  const searchParam = searchParams.get('search') || ''

  const [activeTab, setActiveTab] = useState(productParam)
  const [query, setQuery] = useState(searchParam)
  const [descending, setDescending] = useState(false)

  // Sync state when URL params change
  useEffect(() => {
    const currentProd = searchParams.get('product') || 'all'
    const currentSearch = searchParams.get('search') || ''
    setActiveTab(currentProd)
    setQuery(currentSearch)
  }, [searchParams])

  // Update URL params on tab switch
  const handleTabChange = (tabSlug) => {
    setActiveTab(tabSlug)
    const newParams = new URLSearchParams(searchParams)
    if (tabSlug === 'all') {
      newParams.delete('product')
    } else {
      newParams.set('product', tabSlug)
    }
    setSearchParams(newParams, { replace: true })
  }

  // Update search query
  const handleSearchChange = (val) => {
    setQuery(val)
    const newParams = new URLSearchParams(searchParams)
    if (val.trim()) {
      newParams.set('search', val.trim())
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams, { replace: true })
  }

  // Clear filters
  const handleClearFilters = () => {
    setActiveTab('all')
    setQuery('')
    setSearchParams({}, { replace: true })
  }

  // Filtered and sorted product sections
  const filteredProducts = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim()

    return productIngredientsData
      .filter((prod) => {
        if (activeTab !== 'all' && prod.slug !== activeTab) return false
        return true
      })
      .map((prod) => {
        const matchingIngredients = prod.ingredients.filter((ing) => {
          if (!cleanQuery) return true
          const haystack = `${ing.name} ${ing.scientificName || ''} ${ing.description || ''} ${ing.tag || ''} ${ing.benefits || ''} ${prod.name}`.toLowerCase()
          return haystack.includes(cleanQuery)
        })

        const sorted = [...matchingIngredients].sort((a, b) => {
          if (!descending) return a.name.localeCompare(b.name)
          return b.name.localeCompare(a.name)
        })

        return {
          ...prod,
          ingredients: sorted
        }
      })
      .filter((prod) => prod.ingredients.length > 0)
  }, [activeTab, query, descending])

  const totalIngredientsCount = useMemo(() => {
    return filteredProducts.reduce((acc, p) => acc + p.ingredients.length, 0)
  }, [filteredProducts])

  const activeProductMeta = useMemo(() => {
    return productIngredientsData.find((p) => p.slug === activeTab)
  }, [activeTab])

  return (
    <div className="overflow-hidden bg-[#fffdf7] text-[#19351f]">
      {/* ── HERO BANNER ── */}
      <section className="relative min-h-[340px] overflow-hidden border-b border-[#e5ddca] bg-[#f7f3e8] px-5 py-8 sm:min-h-[380px] sm:px-8 sm:py-10 lg:min-h-[420px] lg:px-12 lg:py-12">
        <img
          src="/images/ingredients/hero intge.png"
          alt="Divya Swasth Botanical Ingredients"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3e8] via-[#f7f3e8]/90 to-transparent sm:via-[#f7f3e8]/75 lg:via-[#f7f3e8]/45" />

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="max-w-[24rem] sm:max-w-[30rem] lg:max-w-[36rem]">
            <p className="text-[12px] font-black uppercase tracking-[.1em] text-[#183822] sm:text-[14px]">
              {siteContent?.text?.our_ingredients || 'OUR INGREDIENTS'}
            </p>
            <h1 className="mt-2 font-display text-[2.2rem] font-bold uppercase leading-[1] tracking-[.01em] text-[#183822] sm:text-[2.8rem] lg:text-[3.3rem]">
              POWERED BY <span className="text-[#a77925]">NATURE</span>.<br />
              CRAFTED WITH PURPOSE.
            </h1>
            <p className="mt-4 max-w-[22rem] text-[12px] font-medium leading-[1.6] text-[#263b2c] sm:text-[13.5px]">
              {siteContent?.text?.we_believe_that_real_wellness_begins_with_rea ||
                'We believe that real wellness begins with pure, authentic ingredients. Every botanical herb in our formulations is carefully sourced and standardized for optimal potency.'}
            </p>

            <div className="mt-6 grid max-w-[24rem] grid-cols-3 divide-x divide-[#d8cfae] rounded-lg border border-[#e2d8bd] bg-white/75 p-2 backdrop-blur-sm text-center shadow-sm">
              <span className="flex flex-col items-center gap-1 px-2 text-[9px] font-bold leading-[1.25] text-[#263b2c]">
                <Leaf className="h-6 w-6 rounded-full border border-[#cdbd8c] p-1 text-[#8f6b26]" />
                Carefully<br />Sourced
              </span>
              <span className="flex flex-col items-center gap-1 px-2 text-[9px] font-bold leading-[1.25] text-[#263b2c]">
                <FlaskConical className="h-6 w-6 rounded-full border border-[#cdbd8c] p-1 text-[#8f6b26]" />
                Scientifically<br />Researched
              </span>
              <span className="flex flex-col items-center gap-1 px-2 text-[9px] font-bold leading-[1.25] text-[#263b2c]">
                <ShieldCheck className="h-6 w-6 rounded-full border border-[#cdbd8c] p-1 text-[#8f6b26]" />
                Quality<br />Assured
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORY TABS ── */}
      <nav aria-label="Product ingredient sections" className="sticky top-[68px] z-30 bg-[#003720] text-[#f5d585] shadow-md">
        <div className="mx-auto flex max-w-[1440px] overflow-x-auto scrollbar-none">
          {/* ALL FORMULATIONS TAB */}
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            aria-pressed={activeTab === 'all'}
            className={`flex min-h-[64px] min-w-[160px] flex-1 flex-col items-center justify-center gap-1 px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-[.06em] transition hover:bg-[#06482d] sm:min-h-[70px] ${
              activeTab === 'all' ? 'bg-[#06482d] text-white' : 'text-[#e5ca7d]'
            }`}
          >
            <Sprout className="h-5 w-5 text-[#d4ad4b]" />
            <span>All Formulations</span>
            {activeTab === 'all' && <span className="h-0.5 w-16 bg-[#c59b3f]" />}
          </button>

          {/* PRODUCT TABS */}
          {productIngredientsData.map((prod, index) => {
            const IconComponent = tabIcons[prod.slug] || Leaf
            const isActive = activeTab === prod.slug

            return (
              <button
                type="button"
                key={prod.slug}
                onClick={() => handleTabChange(prod.slug)}
                aria-pressed={isActive}
                className={`flex min-h-[64px] min-w-[160px] flex-1 flex-col items-center justify-center gap-1 border-l border-[#1b573d] px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-[.06em] transition hover:bg-[#06482d] sm:min-h-[70px] ${
                  isActive ? 'bg-[#06482d] text-white' : 'text-[#e5ca7d]'
                }`}
              >
                <IconComponent className="h-5 w-5 text-[#d4ad4b]" />
                <span>{prod.name}</span>
                {isActive && <span className="h-0.5 w-16 bg-[#c59b3f]" />}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <section className="border-b border-[#e8e1d3] bg-[#fbfaf5] px-4 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[1.4rem] font-bold uppercase leading-tight text-[#193923] sm:text-[1.7rem]">
                  {activeProductMeta ? `${activeProductMeta.name} Ingredients` : "Nature's Finest Ingredients"}
                </h2>
                <span className="rounded-full bg-[#e8deca] px-2.5 py-0.5 text-[11px] font-black text-[#1c3821]">
                  {totalIngredientsCount} {totalIngredientsCount === 1 ? 'herb' : 'herbs'}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#36493c]">
                {activeProductMeta
                  ? activeProductMeta.subtitle
                  : 'Authentic Ayurvedic herbs organized section-wise across our full formulation catalog.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* SEARCH INPUT */}
              <label className="flex h-10 w-full items-center gap-2 rounded-md border border-[#ddd8cf] bg-white px-3 sm:w-[280px] lg:w-[320px] shadow-sm focus-within:border-[#967425] focus-within:ring-1 focus-within:ring-[#967425]">
                <Search className="h-4 w-4 shrink-0 text-[#607366]" />
                <input
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  aria-label="Search ingredients"
                  placeholder="Search botanical, herb or benefit…"
                  className="w-full bg-transparent text-[12px] text-[#19351f] outline-none placeholder:text-[#a09c94]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="text-[11px] font-bold text-[#8c8272] hover:text-[#183822]"
                  >
                    ✕
                  </button>
                )}
              </label>

              {/* SORT DROPDOWN TOGGLE */}
              <button
                type="button"
                onClick={() => setDescending((prev) => !prev)}
                className="flex h-10 items-center justify-between gap-2 rounded-md border border-[#ddd8cf] bg-white px-3 text-[11.5px] font-semibold text-[#303a34] shadow-sm hover:bg-[#f6f2e8] transition"
              >
                <span>{descending ? 'Sort: Z to A' : 'Sort: A to Z'}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${descending ? 'rotate-180' : ''}`} />
              </button>

              {/* RESET BUTTON (WHEN ACTIVE) */}
              {(activeTab !== 'all' || query) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[#c4a974] bg-[#fdf8ee] px-3 text-[11px] font-bold text-[#7d5b1b] hover:bg-[#f5ebd2] transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  View All
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE FILTER NOTICE */}
          {activeProductMeta && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d6c7a1] bg-[#fbf6e9] p-3 text-[12px] text-[#2c3f30]">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeProductMeta.image}
                  alt={activeProductMeta.name}
                  className="h-9 w-9 rounded-md border border-[#dfd2b2] bg-white object-contain p-0.5"
                />
                <div>
                  <span className="font-bold text-[#14331d]">Showing ingredients for {activeProductMeta.name}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-[11.5px] text-[#55695a]">{activeProductMeta.badge}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/products/${activeProductMeta.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-[#8a6316] hover:underline"
                >
                  View Product Page <ExternalLink className="h-3 w-3" />
                </Link>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-2 rounded border border-[#c2b28c] bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#19351f] hover:bg-[#efe7d2]"
                >
                  Show All Formulations
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION-WISE INGREDIENTS LIST ── */}
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-12">
        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-[#ded5c2] bg-white p-12 text-center shadow-sm">
            <Leaf className="mx-auto h-12 w-12 text-[#9a865b]" />
            <h3 className="mt-3 font-display text-xl font-bold text-[#19351f]">No matching botanical ingredients found</h3>
            <p className="mt-1 text-xs text-[#526356]">Try adjusting your search query or clear the product filter.</p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#19351f] px-4 py-2 text-xs font-bold text-white hover:bg-[#285031]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {filteredProducts.map((product) => (
              <section
                key={product.slug}
                id={product.slug}
                className="scroll-mt-36 rounded-2xl border border-[#e5dfd0] bg-white p-5 shadow-sm sm:p-7 lg:p-8"
              >
                {/* ── PRODUCT SECTION HEADER ── */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#ece5d8] pb-6 md:flex-row md:items-center">
                  <div className="flex items-start gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 shrink-0 rounded-xl border border-[#ded5c3] bg-[#faf8f2] object-contain p-1 shadow-sm sm:h-20 sm:w-20"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white"
                          style={{ backgroundColor: product.accentColor }}
                        >
                          {product.category}
                        </span>
                        <span className="text-[11px] font-semibold text-[#66776a]">
                          {product.ingredients.length} botanical ingredients
                        </span>
                      </div>
                      <h2 className="mt-1 font-display text-[1.6rem] font-bold uppercase tracking-tight text-[#16331d] sm:text-[1.9rem]">
                        {product.name}
                      </h2>
                      <p className="text-[12px] font-medium text-[#445849] sm:text-[13px]">{product.subtitle}</p>
                      <p className="mt-1.5 max-w-3xl text-[11.5px] leading-relaxed text-[#596d5e]">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#c4a974] bg-[#fdfbf6] px-4 py-2.5 text-[11px] font-black uppercase tracking-[.04em] text-[#1e3c25] shadow-sm transition hover:bg-[#f6ebd0] hover:text-[#0b2812]"
                    >
                      View {product.name} <ArrowRight className="h-3.5 w-3.5 text-[#977126]" />
                    </Link>
                  </div>
                </div>

                {/* ── INGREDIENTS GRID ── */}
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {product.ingredients.map((ing) => (
                    <article
                      key={ing.name}
                      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#e5dfd3] bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:border-[#cbbba0] hover:shadow-[0_8px_18px_rgba(20,38,25,0.08)]"
                    >
                      <div>
                        {/* PHOTO */}
                        <div className="relative h-[165px] overflow-hidden bg-[#f4efe4] sm:h-[180px]">
                          <img
                            src={ing.image}
                            alt={`${ing.name} botanical ingredient`}
                            loading="lazy"
                            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                          />
                          {ing.tag && (
                            <span className="absolute bottom-2 left-2 rounded bg-[#173821]/90 px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-[#fae4a8] backdrop-blur-sm shadow-sm">
                              {ing.tag}
                            </span>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-3.5 sm:p-4">
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h3 className="flex items-center gap-1.5 font-sans text-[14.5px] font-black uppercase tracking-[.02em] text-[#1c3922]">
                                {ing.name}
                                <Leaf className="h-3.5 w-3.5 text-[#5e8436]" fill="currentColor" strokeWidth={1} />
                              </h3>
                              {ing.scientificName && (
                                <p className="text-[10.5px] font-medium italic text-[#728577]">
                                  {ing.scientificName}
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="mt-2 text-[11.5px] leading-[1.5] text-[#324536]">
                            {ing.description}
                          </p>
                        </div>
                      </div>

                      {/* CARD FOOTER */}
                      <div className="border-t border-[#f0ebdf] bg-[#faf8f2] px-3.5 py-2.5 sm:px-4">
                        <Link
                          to={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.04em] text-[#2c4432] transition hover:text-[#977126]"
                        >
                          Used in {product.name} <ArrowRight className="h-3 w-3 text-[#977126]" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* ── OUR PROMISES ── */}
      <section className="relative overflow-hidden border-y border-[#e2dccd] bg-[#fbfaf3] px-4 py-8 sm:px-8 lg:px-12 mt-12">
        <img
          src="/images/home/banner.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-90"
        />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-[#e5dfcf] sm:grid-cols-4">
          {siteContent?.sections?.promises?.map(([Icon, title, text]) => (
            <div key={title} className="flex min-h-[130px] flex-col items-center justify-center px-4 py-4 text-center sm:min-h-[150px]">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[#b8a775] bg-[#fbfaf3]/90 text-[#557a38] shadow-sm">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-[13px] font-black uppercase tracking-[.05em] text-[#24392a] sm:text-[14px]">
                {title}
              </h3>
              <p className="mt-1.5 whitespace-pre-line text-[11px] font-medium leading-[1.5] text-[#4a5148] sm:text-[12px]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER (WITH 4 BOTTLES IMAGE) ── */}
      <section className="relative min-h-[300px] overflow-hidden border-y border-[#0b5735] bg-[#003c23] sm:min-h-[340px]">
        <img
          src="/images/ingredients/ineven banner.png"
          alt="Divya Swasth Formulations & Botanical Ingredients"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
        />
        <div className="relative z-10 mx-auto flex min-h-[300px] max-w-[1440px] items-center justify-center px-8 py-10 sm:min-h-[340px] sm:px-14 sm:py-12 lg:px-20">
          <div className="max-w-[500px] flex flex-col items-center text-center">
            <h2 className="font-display text-[1.45rem] font-bold uppercase leading-[1.08] tracking-[.04em] text-[#e8c35a] sm:text-[1.85rem] lg:text-[2.25rem]">
              Wellness That Respects Nature
            </h2>
            <p className="mt-3 text-[11.5px] font-medium leading-[1.6] text-white/90 sm:text-[13px]">
              Thoughtfully selected. Responsibly formulated.
              <br />
              Made for your better tomorrow.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-[3px] border border-[#c9a33a] px-5 py-2.5 text-[10.5px] font-black uppercase tracking-[.06em] text-[#e8c35a] transition hover:bg-[#c9a33a] hover:text-[#0c2b16] sm:text-[11px]"
            >
              Explore Our Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
