import { useSiteContent } from '../context/SiteContentContext.jsx'
import { Award, BadgeCheck,ArrowRight, ChevronRight, FlaskConical, Leaf, Sprout, PackageCheck, RotateCw, ShieldCheck, ShoppingBag, Truck, Zap } from 'lucide-react'
import { useState } from 'react'
 
import { Link } from 'react-router-dom' 
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../hooks/useProducts.js'



 

// Retained for the existing hero markup, which is visually hidden behind the supplied banner.










 

export default function HomePage() {
  const siteContent = useSiteContent('home', siteIcons)

  const { products } = useProducts()
  const { addToCart } = useCart()
  const [quantity] = useState(1)
  const product = products.find((item) => item.slug === 'sugar-shield-blood-sugar-support') || products[0]

  if (!product) return null
  const purchasable = product.availableForPurchase !== false && product.countInStock > 0
   
  return (
    <div className="bg-[#f7f5ee]">
      <section className="home-reference-hero relative aspect-[1974/797] overflow-hidden bg-[#f9f5e8]">
        <img src={siteContent.media.src_1} alt={siteContent.media.alt_2} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute left-[6.3%] top-[10%] z-10 w-[42%] text-[#123d29]">
          <p className="font-display text-[clamp(9px,1.42vw,24px)] font-bold leading-none tracking-[.035em]">{siteContent.text.natural_healing}</p>
          <h1 className="mt-[1.6%] font-display text-[clamp(29px,5vw,82px)] font-bold leading-[.9] tracking-[-.025em] text-[#bd7f1d]">{siteContent.text.holistic}<br />{siteContent.text.wellness}</h1>
          <p className="mt-[2%] font-display text-[clamp(14px,2.35vw,40px)] font-bold leading-none tracking-[.02em]">{siteContent.text.healthy_future}</p>
          <div className="relative mt-[4.4%] w-[78%] border-t border-[#a88957]/65 pt-[3.2%]">
            <span className="absolute left-1/2 top-0 flex h-[12px] w-[25px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-px bg-[#fbf8eb]">
              <Leaf className="h-[8px] w-[8px] -rotate-[38deg] text-[#6a7836]" fill="currentColor" strokeWidth={1.4} />
              <span className="mt-[3px] h-[4px] w-[3px] rounded-full bg-[#b17a1e]" />
              <Leaf className="h-[8px] w-[8px] rotate-[38deg] text-[#6a7836]" fill="currentColor" strokeWidth={1.4} />
            </span>
            <p className="text-[clamp(6px,.95vw,15px)] font-semibold leading-[1.38] text-[#222d26]">{siteContent.text.ancient_wisdom_modern_wellness}<br />{siteContent.text.thoughtfully_crafted_for_you_and_your_family}</p>
            <Link to={siteContent.media.to_3} className="mt-[6%] inline-flex items-center rounded-[5px] bg-[#0e4027] px-[8%] py-[4.5%] text-[clamp(5px,.7vw,11px)] font-black uppercase tracking-[.035em] text-white shadow-[0_3px_7px_rgba(28,57,35,.22)]">{siteContent.text.explore_our_products}<Sprout className="ml-[10px] h-[1em] w-[1em] text-[#d9ad4b]" strokeWidth={2.4} /></Link>
            <Link to={siteContent.media.to_4} className="mt-[5%] flex items-center gap-2.5 text-[clamp(6px,.85vw,13px)] font-bold uppercase leading-none tracking-[.015em] text-[#29372e]"><span className="grid h-[clamp(20px,3.2vw,38px)] w-[clamp(20px,3.2vw,38px)] shrink-0 place-items-center rounded-full border border-[#315440]" aria-hidden="true"><span className="ml-px h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-[#315440]" /></span>{siteContent.text.watch_our_story}</Link>
          </div>
        </div>
        <aside aria-label="Product quality highlights" className="absolute right-[3.2%] top-[21%] z-10 hidden h-[58%] w-[8%] flex-col justify-center gap-[5%] rounded-[16px] border border-[#d8cfb7] bg-[linear-gradient(145deg,rgba(255,253,246,.96),rgba(244,239,220,.94))] px-[.9%] py-[.75%] text-center text-[#253e2d] shadow-[0_3px_10px_rgba(93,75,37,.14)] sm:flex">
          <TrustMark icon={<Leaf />} lines={['Natural', 'ingredients']} />
          <TrustMark icon={<FlaskConical />} lines={['Scientifically', 'formulated']} />
          <TrustMark icon={<BadgeCheck />} lines={['Quality', 'assured']} />
          <TrustMark icon={<Leaf />} lines={['100%', 'vegetarian']} />
        </aside>
        <div className="hidden absolute inset-0 bg-[linear-gradient(90deg,#030503_0%,rgba(3,5,3,.96)_38%,rgba(3,5,3,.48)_65%,rgba(3,5,3,.12)_100%)]" />
        <div className="hidden absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#d6a63e]/10 blur-3xl" />
        <div className="hidden relative mx-auto grid min-h-[610px] max-w-7xl items-center px-4 py-12 sm:px-6 lg:min-h-[650px] lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <p className="animate-rise text-[8px] font-black uppercase tracking-[.26em] text-[#d6ae55]">{siteContent.text.premium_ayurvedic_wellness_rooted_in_nature}</p>
            <div className="animate-rise-delay mt-4 flex items-center gap-3 sm:gap-5">
              <span className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-full border border-[#d8b356]/35 bg-white/[.04] shadow-[0_0_35px_rgba(211,170,75,.14)] sm:block"><img src={siteContent.media.src_5} alt="" className="absolute -left-[34px] -top-1 w-40 max-w-none" /></span>
              <div>
                <h1 className="font-display text-[3.45rem] font-bold leading-[.86] tracking-[-.045em] sm:text-[4.25rem]"><span className="text-[#789456]">{siteContent.text.divya}</span> <span className="text-[#dcb354]">{siteContent.text.swasth}</span></h1>
                <p className="mt-3 border-t border-[#d8b356]/30 pt-2 text-[8px] font-black uppercase tracking-[.16em] text-white/65 sm:text-[9px]">{siteContent.text.natural_healing_holistic_wellness_healthy_fut}</p>
              </div>
            </div>
            <p className="animate-rise-delay mt-5 text-[13px] font-black uppercase tracking-[.13em] text-white">{siteContent.text.ayurvedic_wisdom_for_modern_wellbeing}</p>
            <p className="animate-rise-delay-2 mt-4 max-w-lg text-xs leading-6 text-white/58">{siteContent.text.a_planned_botanical_capsule_formula_designed}</p>
            <div className="animate-rise-delay-2 mt-6 grid max-w-lg grid-cols-3 gap-2.5">{siteContent.sections.heroBenefits.map(([Icon, title, text]) => <div key={title} className="rounded-xl border border-[#d5ac51]/20 bg-black/35 p-3 backdrop-blur"><span className="grid h-8 w-8 place-items-center rounded-full border border-[#d5ac51]/30 bg-[#d5ac51]/10"><Icon className="h-4 w-4 text-[#dcb455]" /></span><p className="mt-3 text-[8px] font-black uppercase tracking-wider text-white/85">{title}</p><p className="mt-1 text-[8px] leading-4 text-white/38">{text}</p></div>)}</div>
            <div className="animate-rise-delay-2 mt-6 flex flex-wrap items-center gap-3"><p className="mr-3"><span className="block text-[7px] font-bold uppercase tracking-wider text-white/35">{siteContent.text.mrp_incl_of_taxes}</span><span className="font-display text-3xl font-bold text-[#e5bc5c]">₹{product.price.toLocaleString('en-IN')}</span></p><button type="button" onClick={() => addToCart(product, quantity)} disabled={!purchasable} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b77d1d] to-[#e0b753] px-6 py-3 text-[8px] font-black uppercase tracking-[.14em] text-[#111b14] transition hover:-translate-y-0.5 disabled:opacity-50"><ShoppingBag className="h-3.5 w-3.5" />{siteContent.text.add_to_cart}</button><Link to={`/products/${product.slug}`} className="flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-[8px] font-black uppercase tracking-[.14em] text-white/70 backdrop-blur">{siteContent.text.view_details}<ChevronRight className="h-3.5 w-3.5" /></Link></div>
          </div>
        </div>
        <p className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/65 px-4 py-2 text-[7px] font-black uppercase tracking-[.12em] text-white/45 backdrop-blur">{siteContent.text.temporary_concept_visual_not_final_packaging}</p>
      </section>

      <section className="bg-[#f7f5ee] px-4 py-5 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#d5aa50]/25 bg-[linear-gradient(105deg,#111411_0%,#050705_52%,#121412_100%)] px-3 text-white shadow-[0_14px_35px_rgba(9,15,10,.18)] sm:grid-cols-2 lg:grid-cols-4">{siteContent.sections.valueStrip.map(([Icon, title, text], index) => <article key={title} className={`flex min-h-[116px] items-center gap-4 px-5 py-5 ${index ? 'border-t border-white/10 sm:border-l sm:border-t-0' : ''}`}><Icon className={`h-9 w-9 shrink-0 ${index === 0 ? 'text-[#79a84d]' : 'text-[#d9aa4b]'}`} strokeWidth={1.7} /><div><h2 className="max-w-[180px] text-[12px] font-black uppercase leading-[1.35] tracking-[.035em] text-white">{title}</h2><p className="mt-2 max-w-[190px] text-[10px] leading-[1.55] text-white/58">{text}</p></div></article>)}</div></section>

      <section className="journey-showcase relative overflow-hidden bg-[#fbfaf3] px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#dce8bf]/45 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-12 h-52 w-52 rounded-full bg-[#edf0c9]/65 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center"><h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#183928] sm:text-3xl">{siteContent.text.choose_your_wellness_journey}</h2><p className="mt-1 text-xs font-medium text-[#35483b]">{siteContent.text.find_the_perfect_support_for_your_unique_well}</p></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.sections.wellnessJourneys.map(({ title, description, image, Icon }) => <article key={title} className="overflow-hidden rounded-xl border border-[#ddcfad] bg-[#fffdf8] text-center shadow-[0_7px_20px_rgba(49,68,40,.07)]"><div className="relative aspect-[1.7/1] overflow-hidden"><img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" /><span className="absolute -bottom-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border-4 border-[#fffdf8] bg-[#084321] text-[#e9c35e]"><Icon className="h-5 w-5" /></span></div><div className="px-5 pb-4 pt-8"><h3 className="font-display text-lg font-bold uppercase tracking-wide text-[#243a2b]">{title}</h3><p className="mt-1 min-h-10 text-[11px] leading-4 text-[#4e5b51]">{description}</p><Link to={siteContent.media.to_6} className="mt-3 inline-flex items-center rounded border border-[#cdb77c] px-4 py-1.5 text-[9px] font-black uppercase tracking-wide text-[#4b4736] transition hover:bg-[#f5eedb]">{siteContent.text.discover}<ChevronRight className="ml-1 h-3 w-3 text-[#a67924]" /></Link></div></article>)}
          </div>

          <div id="premium-formulations" className="mt-10 text-center"><h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#183928] sm:text-3xl">{siteContent.text.our_premium_wellness_formulations}</h2><p className="mt-1 text-xs font-medium text-[#35483b]">{siteContent.text.thoughtfully_crafted_with_natural_ingredients}</p></div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {siteContent.sections.homeFormulations.map((slot) => {
    const item = products.find(product => product.slug === slot.slug)
    const { name, type, image } = { ...slot, ...(item ? { name: item.name, type: item.subtitle, image: item.cardImage || item.images?.[0] || slot.image } : {}) }
    return (
    <article
      key={name}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#e3d9b8] bg-[#fffdf8] shadow-[0_7px_20px_rgba(49,68,40,.08)] transition hover:shadow-[0_12px_28px_rgba(49,68,40,.14)]"
    >
      <div className="relative w-full overflow-hidden bg-[#f3efe0]">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 rounded-full bg-[#064321] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#e9c35e] shadow-sm">
          {item?.size || '60 Capsules'}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 py-3 text-center">
        <h3 className="text-[13px] font-black uppercase tracking-wide text-[#263c2c]">
          {name}
        </h3>
        <p className="mt-0.5 text-[11px] leading-4 text-[#4c574f]">
          {type}
        </p>

        <p className="mt-2 font-display text-xl font-bold text-[#1c3527]">
          {item ? `₹${item.price.toLocaleString('en-IN')}/-` : 'Loading…'}
        </p>

        <Link
          to={`/products/${slot.slug}`}
          className="mt-2 inline-flex items-center justify-center gap-1 rounded-md bg-[#064321] px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#0a5a2e]"
        >{siteContent.text.view_details_2}<ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )})}
</div>


          <div className="mt-5 text-center"><Link to={siteContent.media.to_7} className="inline-flex items-center rounded-md bg-gradient-to-r from-[#d6a03b] to-[#efc766] px-7 py-3 text-[10px] font-black uppercase tracking-wide text-[#26331e] shadow-sm">{siteContent.text.view_all_products}<ChevronRight className="ml-1 h-4 w-4" /></Link></div>
        </div>
      </section>

    

     
 

      <section className="relative overflow-hidden bg-[#f7f3e7] text-[#183b28]" aria-label="Discover Divya Swasth">
        <img src={siteContent.media.src_8} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="relative mx-auto grid min-h-[184px] max-w-[1440px] items-center lg:grid-cols-[1.08fr_1.05fr_1fr]">
          <div className="flex flex-col items-center justify-center px-4 py-6 text-center lg:translate-y-6 lg:items-start lg:pl-16 lg:text-left">
            <h2 className="font-display text-[18px] font-bold uppercase leading-none tracking-[.035em] sm:text-[20px]">{siteContent.text.the_power_of_nature}</h2>
            <p className="mt-2 text-[10px] font-medium leading-[1.35] text-[#576257] sm:text-[11px]">{siteContent.text.carefully_selected_ingredients}<br />{siteContent.text.backed_by_traditional_wisdom}</p>
            <div className="mt-3 flex gap-2.5 sm:gap-3">
              {siteContent.sections.FOOTER_INGREDIENTS.map(([name, image]) => (
                <div key={name} className="w-[42px] text-center sm:w-[48px]">
                  <span className="mx-auto grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[#ccb983] bg-[#eee6c8] sm:h-11 sm:w-11">
                    <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover" />
                  </span>
                  <span className="mt-1 block text-[7px] font-bold leading-[1.1] text-[#3d493e] sm:text-[8px]">{name}</span>
                </div>
              ))}
            </div>
            <Link to={siteContent.media.to_9} className="mt-3 inline-flex items-center gap-2 border border-[#c1a96a] bg-[#fbf7e9]/75 px-4 py-1.5 text-[8px] font-black uppercase tracking-[.035em] text-[#46533f] transition hover:bg-[#eee5c8] sm:text-[9px]">{siteContent.text.explore_ingredients}<ArrowRight className="h-3 w-3 text-[#997020]" />
            </Link>
          </div>

          <img
            src="/images/logo.png"
            alt="Divya Swasth — Natural Healing, Holistic Wellness, Healthy Future. May all be healthy."
            width={598}
            height={453}
            loading="lazy"
            className="mx-auto h-auto w-[92%] rounded-xl bg-white object-contain shadow-[0_8px_18px_rgba(31,55,35,.2)] sm:w-[88%] lg:w-full"
          />

          <div className="flex items-center justify-center px-4 py-6 text-center lg:justify-start lg:pl-10 lg:text-left">
            <div>
              <h2 className="font-display text-[18px] font-bold uppercase leading-[1.05] tracking-[.035em] sm:text-[20px]">{siteContent.text.not_sure_where_to_start}</h2>
              <p className="mt-2 text-[10px] font-medium leading-[1.35] text-[#576257] sm:text-[11px]">{siteContent.text.take_our_quick_wellness_quiz_and}<br />{siteContent.text.find_your_perfect_match}</p>
              <Link to={siteContent.media.to_12} className="mt-3 inline-flex items-center gap-2 bg-[#d8aa3c] px-5 py-2 text-[8px] font-black uppercase tracking-[.04em] text-[#17351f] shadow-sm transition hover:bg-[#e5bd5b] sm:text-[9px]">{siteContent.text.take_the_quiz}<ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
   
      <section className="bg-[#fbfaf5] px-3 pb-2 pt-6 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">{siteContent.sections.servicePromises.map(([Icon, title, text], index) => <article key={title} className={`flex min-h-[78px] items-center gap-3 px-3 py-3 sm:px-5 ${index ? 'border-t border-[#aeb8ad] sm:border-l sm:border-t-0' : ''}`}><Icon className="h-8 w-8 shrink-0 text-[#3f5c46]" strokeWidth={1.7} /><div><h2 className="text-[11px] font-black uppercase leading-[1.15] tracking-[.035em] text-[#142c1d]">{title}</h2><p className="mt-1 text-[10px] font-bold uppercase leading-[1.15] tracking-[.02em] text-[#46574b]">{text}</p></div></article>)}</div></section>
    </div>
  )
}


function TrustMark({ icon, lines }) {
  return <div className="flex flex-col items-center gap-[7%]"><span className="grid aspect-square w-[37%] place-items-center text-[#315f3c] [&_svg]:h-full [&_svg]:w-full" aria-hidden="true">{icon}</span><p className="text-[clamp(4.5px,.5vw,7.5px)] font-black uppercase leading-[1.18] tracking-[-.02em]">{lines.map((line) => <span key={line} className="block">{line}</span>)}</p></div>
}


const siteIcons = { Award, FlaskConical, Leaf, PackageCheck, RotateCw, ShieldCheck, Truck, Zap }
