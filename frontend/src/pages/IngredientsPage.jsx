import { useState } from 'react'
import { useSiteContent } from '../context/SiteContentContext.jsx'
import { ArrowRight, ChevronDown, FlaskConical, HeartPulse, Leaf, Search, ShieldCheck, Sprout, Trophy, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'







export default function IngredientsPage() {
  const siteContent = useSiteContent('ingredients', siteIcons)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(0)
  const [descending, setDescending] = useState(false)
  const groups = [[], [0, 6], [1, 4, 5], [3, 5], [0, 6], [7, 3]]
  const visible = siteContent.sections.ingredients.filter((item, index) => (!category || groups[category].includes(index)) && item.slice(0, 3).join(' ').toLowerCase().includes(query.toLowerCase()))
  const ingredients = query || category || descending ? [...visible].sort((a, b) => (descending ? -1 : 1) * a[0].localeCompare(b[0])) : visible

  return <div className="overflow-hidden bg-[#fffdf7] text-[#19351f]">
    <section className="relative min-h-[330px] overflow-hidden border-b border-[#e5ddca] bg-[#f7f3e8] px-5 py-7 sm:min-h-[360px] sm:px-8 sm:py-9 lg:min-h-[405px] lg:px-12 lg:py-10">
      <img src={siteContent.media.src_1} alt={siteContent.media.alt_2} className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3e8]/95 via-[#f7f3e8]/82 to-transparent sm:via-[#f7f3e8]/58 lg:via-[#f7f3e8]/28" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="max-w-[22rem] sm:max-w-[27rem] lg:max-w-[31rem]">
          <p className="text-[12px] font-black uppercase tracking-[.08em] text-[#183822] sm:text-[15px]">{siteContent.text.our_ingredients}</p>
          <h1 className="mt-2 font-display text-[2.15rem] font-bold uppercase leading-[.98] tracking-[.01em] text-[#183822] sm:text-[2.7rem] lg:text-[3.05rem]">{siteContent.text.powered_by}<span className="text-[#a77925]">{siteContent.text.nature}</span><br />{siteContent.text.crafted_with_purpose}</h1>
          <p className="mt-5 max-w-[18rem] text-[11px] font-medium leading-[1.65] text-[#263b2c] sm:text-xs">{siteContent.text.we_believe_that_real_wellness_begins_with_rea}</p>
          <div className="mt-5 grid max-w-[21rem] grid-cols-3 divide-x divide-[#d8cfae] text-center">
            <span className="flex flex-col items-center gap-1 px-2 text-[8px] font-bold leading-[1.25] text-[#263b2c]"><Leaf className="h-7 w-7 rounded-full border border-[#cdbd8c] p-1.5 text-[#8f6b26]" />{siteContent.text.carefully}<br />{siteContent.text.sourced}</span>
            <span className="flex flex-col items-center gap-1 px-2 text-[8px] font-bold leading-[1.25] text-[#263b2c]"><FlaskConical className="h-7 w-7 rounded-full border border-[#cdbd8c] p-1.5 text-[#8f6b26]" />{siteContent.text.scientifically}<br />{siteContent.text.researched}</span>
            <span className="flex flex-col items-center gap-1 px-2 text-[8px] font-bold leading-[1.25] text-[#263b2c]"><ShieldCheck className="h-7 w-7 rounded-full border border-[#cdbd8c] p-1.5 text-[#8f6b26]" />{siteContent.text.quality}<br />{siteContent.text.assured}</span>
          </div>
        </div>
      </div>
    </section>

    <nav aria-label="Ingredient categories" className="bg-[#003720] text-[#f5d585]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {siteContent.sections.ingredientCategories.map(([Icon, label], index) => (
          <button type="button" onClick={() => setCategory(index)} aria-pressed={category === index} key={label} className={`flex min-h-[64px] flex-col items-center justify-center gap-1 border-[#1b573d] px-2 py-2 text-center text-[8px] font-bold uppercase tracking-[.06em] transition hover:bg-[#06482d] sm:min-h-[72px] ${index > 0 ? 'border-l' : ''}`}>
            <Icon className="h-5 w-5 text-[#d4ad4b]" />
            <span>{label}</span>
            {index === category && <span className="h-0.5 w-12 bg-[#c59b3f]" />}
          </button>
        ))}
      </div>
    </nav>

    <section className="border-b border-[#e8e1d3] bg-[#fbfaf5] px-4 py-9 sm:px-8 sm:py-11 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h2 className="max-w-[240px] font-display text-[1.45rem] font-bold uppercase leading-[1.06] text-[#193923] sm:text-[1.65rem]">{siteContent.text.nature_s_finest}<br />{siteContent.text.ingredients}</h2>
            <p className="mt-2 max-w-[205px] text-[10px] leading-[1.35] text-[#263b2c]">{siteContent.text.our_formulations_combine_the_wisdom_of_ayurve}</p>
          </div>

          <div className="flex w-full gap-3 md:w-auto md:pt-1">
            <label className="flex h-9 flex-1 items-center gap-2 rounded-[3px] border border-[#ddd8cf] bg-white px-3 md:w-[320px]">
              <input value={query} onChange={event => setQuery(event.target.value)} aria-label="Search ingredients" placeholder={siteContent.media.placeholder_4} className="w-full bg-transparent text-[10px] outline-none placeholder:text-[#a6a29b]" />
              <Search className="h-3.5 w-3.5 shrink-0 text-[#38483e]" />
            </label>
            <button type="button" onClick={() => setDescending(value => !value)} className="flex h-9 w-[164px] items-center justify-between rounded-[3px] border border-[#ddd8cf] bg-white px-3 text-[10px] font-medium text-[#303a34]">{descending ? 'Sort by: Z to A' : siteContent.text.sort_by_a_to_z}<ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {!ingredients.length && <p className="col-span-full py-8 text-center text-sm">No matching ingredients. Try another search or category.</p>}
          {ingredients.map(([name, , text, image]) => (
            <article key={name} className="group overflow-hidden rounded-[7px] border border-[#dfd9cc] bg-[#fffefa] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(17,33,25,0.1)]">
              <div className="h-[190px] overflow-hidden bg-[#efe9dc] sm:h-[205px] lg:h-[220px]">
                <img
                  src={`/images/ingredients/${image}`}
                  alt={`${name} botanical ingredient`}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="flex items-center gap-1.5 font-sans text-[15px] font-black uppercase tracking-[.03em] text-[#1c3922] sm:text-[16px]">{name} <Leaf className="h-4 w-4 text-[#5e8436]" fill="currentColor" strokeWidth={1.5} /></h3>
                <p className="mt-2.5 min-h-[52px] text-[12.5px] leading-[1.55] text-[#324036] sm:text-[13px]">{text}</p>
                <Link to={`/shop?search=${encodeURIComponent(name)}`} className="mt-3.5 inline-flex items-center gap-2 rounded-[4px] border border-[#c8ad73] px-3.5 py-2 text-[10.5px] font-black uppercase tracking-[.04em] text-[#283b2c] transition hover:bg-[#f4ead1]">{siteContent.text.learn_more}<ArrowRight className="h-3.5 w-3.5 text-[#977126]" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden border-y border-[#e2dccd] bg-[#fbfaf3] px-4 py-5 sm:px-8 lg:px-10">
      <img src={siteContent.media.src_6} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-90" />
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-2 divide-x divide-[#e5dfcf] sm:grid-cols-4">
        {siteContent.sections.promises.map(([Icon, title, text]) => (
          <div key={title} className="flex min-h-[120px] flex-col items-center justify-center px-4 py-4 text-center sm:min-h-[140px]">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-[#b8a775] bg-[#fbfaf3]/80 text-[#557a38]">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-[13px] font-black uppercase tracking-[.05em] text-[#24392a] sm:text-[15px]">{title}</h3>
            <p className="mt-2 whitespace-pre-line text-[11px] font-medium leading-[1.5] text-[#4a5148] sm:text-[13px]">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="relative overflow-hidden border-y border-[#0b5735] bg-[#003c23]">
      <img src={siteContent.media.src_7} alt={siteContent.media.alt_8} className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
      <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-center px-8 py-10 sm:px-14 sm:py-12 lg:px-20 lg:py-14">
        <div className="max-w-[480px] flex flex-col items-center text-center">
          <h2 className="font-display text-[1.35rem] font-black uppercase leading-[1.05] tracking-[.04em] text-[#e8c35a] sm:text-[1.75rem] lg:text-[2.1rem]">{siteContent.text.wellness_that_respects_nature}</h2>
          <p className="mt-3 text-[11px] font-medium leading-[1.6] text-white/90 sm:text-[12px]">{siteContent.text.thoughtfully_selected_responsibly_formulated}<br />{siteContent.text.made_for_your_better_tomorrow}</p>
          <Link
            to={siteContent.media.to_9}
            className="mt-5 inline-flex items-center gap-2 rounded-[3px] border border-[#c9a33a] px-5 py-2.5 text-[10px] font-black uppercase tracking-[.06em] text-[#e8c35a] transition hover:bg-[#c9a33a] hover:text-[#0c2b16] sm:text-[11px]"
          >{siteContent.text.explore_our_products}<ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
}

const siteIcons = { FlaskConical, HeartPulse, Leaf, ShieldCheck, Sprout, Trophy, Zap }
