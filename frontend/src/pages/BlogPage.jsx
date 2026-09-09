import { useSiteContent } from '../context/SiteContentContext.jsx'
import { useNewsletter } from '../hooks/useNewsletter.js'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Dumbbell,
  Mail,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function AllArticlesIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 27c-.2-7.4-.4-12.5-2-17.5" />
      <path d="M14.6 17.2C8.3 17 4.5 13.3 4 7c6.4.1 10.2 3.7 10.6 10.2Z" />
      <path d="M16.1 15.4C17.1 9 21.2 5.1 27.5 4c-.3 6.6-4.1 10.7-11.4 12.7" />
      <path d="M6.3 9.1c3.1 1.3 5.7 3.4 8.1 6.3M25.1 6.6c-3.6 2-6.2 5-8.4 8.7" />
    </svg>
  )
}

function NaturalWellnessIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 28V12" />
      <path d="M16 13c-4.2-1.7-6.2-5-5.1-9 4.2 1.1 6.4 4.2 5.1 9ZM16 18c-5.7.5-9.4-2-10.7-6.6 5.5-.8 9.2 1.6 10.7 6.6ZM16.2 19.3c5.6.1 9.2-2.7 10.3-7.4-5.5-.4-9 2.2-10.3 7.4Z" />
      <path d="M16 24c-3.8.3-6.3-1.3-7.2-4.3 3.7-.5 6.1 1 7.2 4.3ZM16.2 24c3.7.1 6.1-1.6 6.8-4.7-3.6-.2-5.9 1.5-6.8 4.7Z" />
    </svg>
  )
}

function AyurvedaIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 17.5h20c-.8 6.4-4.2 9.5-10 9.5S6.8 23.9 6 17.5Z" />
      <path d="M5 17.5h22M22.3 14.8l5-8.4M24.6 6.2l2.9 1.7" />
      <path d="M14.6 15.4c-3.1-2.6-3.3-5.2-1.2-7.5 2.8 1.6 3.5 4.1 1.2 7.5ZM16.3 15.3c1-3.4 3.2-5.2 6.3-5.1-.3 3.3-2.3 5.2-6.3 5.1Z" />
    </svg>
  )
}

function NutritionIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5.5 16.5h21c-.7 6.8-4.3 10.2-10.5 10.2S6.2 23.3 5.5 16.5Z" />
      <path d="M4.5 16.5h23M16 16.2c.1-5.5 2.7-9 7.8-10.5-.2 5.5-2.8 8.9-7.8 10.5Z" />
      <path d="M18.1 13.8c2.1-2.7 4-4.5 5.7-5.7" />
    </svg>
  )
}

function MentalWellnessIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 25.8c-5.8 0-10-2.3-12-6.2 4.3-.3 8.2.8 12 4.1 3.8-3.3 7.7-4.4 12-4.1-2 3.9-6.2 6.2-12 6.2Z" />
      <path d="M16 23.7c-4.2-3.6-5.1-8-2.7-13.2 1.2.8 2.1 1.7 2.7 2.7.7-1 1.6-1.9 2.8-2.7 2.3 5.2 1.4 9.6-2.8 13.2Z" />
      <path d="M12.1 22.1c-4.4-1.9-6.6-5.2-6.4-9.8 4.1.8 6.9 3.6 8.2 8.4M19.9 22.1c4.4-1.9 6.6-5.2 6.4-9.8-4.1.8-6.9 3.6-8.2 8.4" />
    </svg>
  )
}







export default function BlogPage() {
  const siteContent = useSiteContent('blog', siteIcons)

  const { subscribe, submitting, subscribed } = useNewsletter('BlogPage')
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Wellness Blog | Divya Swasth'
    return () => { document.title = previousTitle }
  }, [])

  const filteredArticles = useMemo(() => {
    const search = query.trim().toLowerCase()
    const selectedFilter = siteContent.sections.FILTERS.find((filter) => filter.key === activeCategory)
    return siteContent.sections.BLOG_ARTICLES.filter((article) => {
      const matchesCategory = activeCategory === 'All' || selectedFilter?.categories.includes(article.category)
      const matchesSearch = !search || `${article.title} ${article.summary} ${article.category}`.toLowerCase().includes(search)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, query, siteContent.sections])

  const selectCategory = (category) => {
    setActiveCategory((current) => current === category ? 'All' : category)
    document.getElementById('latest-articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-[#fbfaf4] text-[#1b3324]">
      <section className="relative min-h-[370px] overflow-hidden border-b border-[#dce4d6] sm:min-h-[390px]">
        <img
          src={siteContent.media.src_1}
          alt={siteContent.media.alt_2}
          className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,244,.98)_0%,rgba(255,253,244,.93)_32%,rgba(255,253,244,.45)_52%,rgba(255,253,244,.03)_76%)]" />
        <div className="relative mx-auto flex min-h-[370px] max-w-[1440px] items-center px-5 py-10 sm:min-h-[390px] sm:px-8 lg:px-12">
          <div className="max-w-[510px] animate-rise">
            <p className="font-display text-[16px] font-bold uppercase tracking-[.045em] text-[#183a25] sm:text-[18px]">{siteContent.text.wellness_blog}</p>
            <h1 className="mt-3 font-display text-[42px] font-bold leading-[1.04] text-[#153820] sm:text-[50px]">
              <span className="block">{siteContent.text.knowledge_for}</span>
              <span className="block">{siteContent.text.a}<span className="text-[#b27b20]">{siteContent.text.healthier_you}</span></span>
            </h1>
            <p className="mt-4 max-w-[430px] text-[14px] leading-[1.65] text-[#36493d] sm:text-[15px]">{siteContent.text.explore_expert_insights_natural_wellness_tips}</p>
            <a
              href="#latest-articles"
              className="mt-5 inline-flex items-center gap-3 rounded-md bg-[#123d28] px-6 py-3 text-[11px] font-black uppercase tracking-[.08em] text-white shadow-sm transition hover:bg-[#0b2e1d]"
            >{siteContent.text.explore_articles}<ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <nav className="relative z-10 mx-auto -mt-6 w-[calc(100%-2rem)] max-w-[1200px] overflow-hidden rounded-[14px] border border-[#e1e2dc] bg-white shadow-[0_3px_14px_rgba(26,52,34,0.06)] sm:w-[calc(100%-4rem)]" aria-label="Blog categories">
        <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {siteContent.sections.FILTERS.map(({ key, label, Icon }, index) => (
            <button
              key={key}
              type="button"
              onClick={() => selectCategory(key)}
              aria-pressed={activeCategory === key}
              className={`group relative flex min-h-[108px] flex-col items-center justify-center gap-2 border-b border-[#e8e8e2] px-3 pb-5 pt-4 transition lg:border-b-0 ${
                activeCategory === key ? 'text-[#38523d] after:absolute after:bottom-2.5 after:h-[2px] after:w-12 after:rounded-full after:bg-[#c28c2f]' : 'text-[#38523d] hover:bg-[#fafaf6] hover:text-[#8e6a22]'
              }`}
            >
              <Icon className="h-8 w-8 shrink-0 text-[#60785f]" strokeWidth={1.4} />
              <span className="text-center text-[11px] font-bold uppercase tracking-[.025em] text-[#1f2f24]">{label}</span>
              {index < siteContent.sections.FILTERS.length - 1 && <span className="absolute right-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-[#e7e7e1] lg:block" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </nav>

      <section id="latest-articles" className="scroll-mt-28 px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 border-b border-[#d8dfd4] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-[18px] font-bold uppercase tracking-[.04em] text-[#183a25]">{siteContent.text.latest_wellness_articles}</h2>
            <label className="flex w-full items-center gap-2 border-b border-[#9faa9f] pb-1.5 sm:w-64">
              <Search className="h-3.5 w-3.5 text-[#77867b]" />
              <span className="sr-only">{siteContent.text.search_articles}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={siteContent.media.placeholder_3}
                className="w-full bg-transparent text-[10px] text-[#2f4937] outline-none placeholder:text-[#8e998f]"
              />
            </label>
          </div>

          {filteredArticles.length ? (
            <div className="mt-6 grid items-start gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredArticles.map((article) => {
                const category = siteContent.sections.CATEGORY_META[article.category]
                return (
                  <article
                    key={article.slug}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#dfe4dc] bg-white shadow-[0_2px_10px_rgba(28,59,39,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(28,59,39,0.12)]"
                  >
                    <div className="relative">
                      <Link to={article.href} className="block aspect-[1.55/1] overflow-hidden bg-[#dfe8d9]">
                        <img
                          src={article.image}
                          alt={article.imageAlt}
                          loading="eager"
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      </Link>
                      <span className="absolute bottom-0 left-3 translate-y-1/2 rounded-[2px] border border-[#e1e5dd] bg-[#fffefa] px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[.1em] text-[#253f2d] shadow-sm">
                        {category.label}
                      </span>
                    </div>
                    <div className="flex flex-col px-4 pb-4 pt-6">
                      <h3 className="font-display text-[19px] font-bold leading-[1.2] text-[#172f20] transition group-hover:text-[#9b6a1d]">
                        <Link to={article.href}>{article.title}</Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-[11px] leading-[1.6] text-[#506057]">{article.summary}</p>
                      <div className="mt-4 flex items-center gap-3 border-t border-[#e1e5dd] pt-3 text-[9px] text-[#5f7065]">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{article.updated}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{article.read}</span>
                        <Link to={article.href} aria-label={`Read ${article.title}`} className="ml-auto text-[#31563a]">
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <AllArticlesIcon className="mx-auto h-8 w-8 text-[#a4b19f]" />
              <h3 className="mt-4 font-display text-2xl text-[#284532]">{siteContent.text.no_matching_articles_found}</h3>
              <button type="button" onClick={() => { setQuery(''); setActiveCategory('All') }} className="mt-3 text-[9px] font-black uppercase tracking-wider text-[#9a6c20]">{siteContent.text.view_all_articles}</button>
            </div>
          )}
        </div>
      </section>

      <section className="relative min-h-[146px] overflow-hidden border-y border-[#d6ded2] bg-[#f4f2e8] px-4 py-7 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute bottom-0 left-0 hidden h-full w-[210px] overflow-hidden sm:block" aria-hidden="true">
          <img src={siteContent.media.src_4} alt="" className="absolute bottom-0 left-0 h-[220px] w-auto max-w-none" />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[210px] overflow-hidden sm:block" aria-hidden="true">
          <img src={siteContent.media.src_5} alt="" className="absolute bottom-0 right-0 h-[220px] w-auto max-w-none" />
        </div>
        <div className="relative mx-auto flex max-w-[920px] flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div className="max-w-[390px]">
            <p className="font-display text-[16px] font-bold uppercase tracking-[.04em] text-[#1c3b27]">{siteContent.text.stay_inspired_stay_healthy}</p>
            <p className="mt-1.5 text-[10px] leading-[1.55] text-[#637067]">{siteContent.text.get_thoughtful_wellness_tips_ayurvedic_insigh}</p>
          </div>
          {subscribed ? (
            <p className="bg-[#dce8d6] px-5 py-2.5 text-[10px] font-bold text-[#2d5a36]">{siteContent.text.thank_you_for_subscribing}</p>
          ) : (
            <form
              onSubmit={subscribe}
              className="flex w-full max-w-[420px] overflow-hidden border border-[#aeb9aa] bg-white"
            >
              <label className="flex min-w-0 flex-1 items-center gap-2 px-4">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#849182]" />
                <span className="sr-only">{siteContent.text.email_address}</span>
                <input required type="email" placeholder={siteContent.media.placeholder_6} className="min-w-0 flex-1 bg-transparent py-2.5 text-[10px] outline-none" />
              </label>
              <button disabled={submitting || subscribed} className="bg-[#123d28] px-5 text-[8px] font-black uppercase tracking-[.12em] text-white transition hover:bg-[#0b2d1d]">{submitting ? 'Subscribing…' : subscribed ? 'Subscribed' : 'Subscribe'}</button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

const siteIcons = { AllArticlesIcon, AyurvedaIcon, Dumbbell, MentalWellnessIcon, NaturalWellnessIcon, NutritionIcon }
