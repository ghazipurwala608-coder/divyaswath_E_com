import { useSiteContent } from '../context/SiteContentContext.jsx'
import { useNewsletter } from '../hooks/useNewsletter.js'
import { ArrowRight, Award, FlaskConical, Heart, Leaf, ShieldCheck, Sprout, UsersRound, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'





export default function AboutPage() {
  const siteContent = useSiteContent('about', siteIcons)

  const { subscribe, submitting, subscribed } = useNewsletter('AboutPage')
  return (
    <div className="bg-[#fbf6e9] text-[#163724]">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[440px] overflow-hidden bg-[#f4edda]">
        <img
          src={siteContent.media.src_1}
          alt={siteContent.media.alt_2}
          className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
        />
        {/* Left cream gradient so text is readable */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,237,216,1)_0%,rgba(244,237,216,.97)_28%,rgba(244,237,216,.60)_48%,rgba(244,237,216,0)_70%)]" />

        <div className="relative mx-auto flex min-h-[440px] max-w-[1280px] items-center px-5 py-12 sm:px-10 lg:px-16">
          <div className="max-w-[430px]">
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#9a6c1f]">{siteContent.text.our_story}</p>

            <h1 className="mt-4 font-display text-[40px] font-extrabold uppercase leading-[1] text-[#163724] sm:text-[50px]">{siteContent.text.rooted_in_nature}<br />
              <span className="text-[#ad791e]">{siteContent.text.driven_by_purpose}</span>
            </h1>

            <p className="mt-5 max-w-[360px] text-[12.5px] leading-[1.7] text-[#445448]">{siteContent.text.divya_swasth_was_born_from_a_simple_belief_tr}</p>

            <Link
              to={siteContent.media.to_3}
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[#063b25] px-5 py-3 text-[10px] font-black uppercase tracking-[.1em] text-white transition hover:bg-[#0a4d31]"
            >{siteContent.text.explore_our_products}<ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHAT DRIVES US ──────────────────────────────── */}
      <section className="bg-[#0a3d27] px-5 py-9 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-center font-display text-[17px] font-bold uppercase tracking-[.14em] text-[#f0ce70]">{siteContent.text.what_drives_us}</h2>
          <span className="mx-auto mt-2 mb-7 block h-px w-10 bg-[#b08a30]" />

          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
            {siteContent.sections.values.map(([Icon, title, text], index) => (
              <article
                key={title}
                className={`flex flex-col items-center px-5 text-center ${index ? 'sm:border-l sm:border-white/15' : ''}`}
              >
                <div className="grid h-12 w-12 place-items-center rounded-full border border-[#d6b050]/50 bg-white/10">
                  <Icon className="h-6 w-6 text-[#dfbc5e]" strokeWidth={1.3} />
                </div>
                <h3 className="mt-3 text-[11px] font-black uppercase tracking-[.08em] text-white">{title}</h3>
                <p className="mx-auto mt-1.5 max-w-[170px] text-[10px] leading-[1.55] text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR JOURNEY ─────────────────────────────────── */}
      <section className="px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-9 text-center">
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#a87922]">{siteContent.text.our_journey}</p>
            <h2 className="mt-2 font-display text-[28px] font-bold uppercase text-[#163724]">{siteContent.text.growing_with_purpose}</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-5">
            {siteContent.sections.milestones.map(({ year, title, text, Icon }, index) => (
              <article key={year} className="relative flex flex-col items-center text-center">
                {/* Connecting line between cards */}
                {index < siteContent.sections.milestones.length - 1 && (
                  <span className="absolute -right-3 top-5 hidden h-px w-6 bg-[#c9a558] sm:block" />
                )}
                {/* Top border line */}
                <span className="mb-4 block h-[2px] w-12 bg-[#c9a558]" />
                <div className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a558] bg-[#fdf7e7] text-[#1f4b2e] shadow-sm">
                  <Icon className="h-5 w-5" strokeWidth={1.3} />
                </div>
                <p className="mt-2.5 text-[10px] font-black text-[#a87922]">{year}</p>
                <h3 className="mt-1 text-[10px] font-black uppercase leading-tight text-[#1c3d28]">{title}</h3>
                <p className="mt-1.5 text-[9.5px] leading-[1.5] text-[#677267]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── A PROMISE WE STAND BY ───────────────────────── */}
      <section className="px-5 pb-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 md:grid-cols-2">

          {/* Left — Image with Sanskrit quote overlay */}
          <div className="relative overflow-hidden rounded-lg bg-[#c9b48a] shadow-md">
            <img
              src={siteContent.media.src_4}
              alt={siteContent.media.alt_5}
              className="h-[280px] w-full object-cover"
            />
            {/* Sanskrit quote banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#083c29]/90 px-4 py-3 text-center backdrop-blur-[2px]">
              <p className="font-display text-[18px] leading-tight text-[#f3d581]">{siteContent.text.label}</p>
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[.14em] text-white/65">{siteContent.text.may_all_be_healthy}</p>
            </div>
          </div>

          {/* Right — Text content */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#a87922]">{siteContent.text.a_promise_we_stand_by}</p>
            <h2 className="mt-3 font-display text-[32px] font-bold leading-tight text-[#163724]">{siteContent.text.wellness_that_feels_honest_useful_and_close_t}</h2>
            <p className="mt-4 text-[13px] leading-[1.75] text-[#596660]">{siteContent.text.at_divya_swasth_we_make_wellness_easier_to_un}</p>
            <p className="mt-3 text-[13px] leading-[1.75] text-[#596660]">{siteContent.text.we_are_committed_to_staying_transparent_about}</p>

            {/* 4 Value badges */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {siteContent.sections.cards3.map(([label, Icon]) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-md border border-[#ddd1b5] bg-[#fffaf0] py-4 text-center shadow-sm"
                >
                  <Icon className="h-5 w-5 text-[#547346]" strokeWidth={1.4} />
                  <p className="text-[9px] font-black uppercase tracking-[.05em] text-[#37513b]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────── */}
      <section className="relative min-h-[76px] overflow-hidden border-t border-[#1b5a3b] bg-[#003a25] px-4 py-3 text-white sm:px-6 lg:px-8">
        <img
          src={siteContent.media.src_6}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-0 h-full w-[42%] object-cover object-right opacity-30 mix-blend-multiply"
        />
        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#c99a32] bg-[#003a25] text-[#e7bd54]">
            <Mail className="h-5 w-5" strokeWidth={1.4} />
          </span>
          <div className="text-center sm:text-left sm:min-w-[245px]">
            <h2 className="text-[13px] font-black uppercase tracking-[.08em]">STAY UPDATED ON WELLNESS</h2>
            <p className="mt-0.5 text-[10px] text-white/75">Get health tips, exclusive offers &amp; updates.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-[380px] sm:ml-auto lg:mr-[150px]">
            <label className="sr-only" htmlFor="about-newsletter-email">{siteContent.text.email_address}</label>
            <input
              id="about-newsletter-email" required
              type="email"
              placeholder={siteContent.media.placeholder_7}
              className="min-w-0 flex-1 rounded-l-md bg-white px-4 py-2.5 text-[10px] text-[#173b26] outline-none placeholder:text-[#8b938d]"
            />
            <button disabled={submitting || subscribed} className="rounded-r-md bg-[#d39b35] px-5 py-2.5 text-[10px] font-black uppercase text-white hover:bg-[#b8842a] transition-colors">
              {submitting ? 'Subscribing…' : subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

    </div>
  )
}

const siteIcons = { Award, FlaskConical, Heart, Leaf, ShieldCheck, Sprout, UsersRound }
