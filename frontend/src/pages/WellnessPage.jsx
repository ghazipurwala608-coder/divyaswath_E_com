import WellnessQuiz from '../components/WellnessQuiz.jsx'
import { wellnessGoals } from '../data/wellnessQuiz.js'
import { useSiteContent } from '../context/SiteContentContext.jsx'
import { useNewsletter } from '../hooks/useNewsletter.js'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Clock,
  ClipboardList,
  Dumbbell,
  FlaskConical,
  Flower2,
  Gift,
  HeartPulse,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Sprout,
  UsersRound,
  Utensils,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'










export default function WellnessPage() {
  const siteContent = useSiteContent('wellness', siteIcons)

  const { subscribe, submitting, subscribed } = useNewsletter('WellnessPage')
  const [selectedGoal, setSelectedGoal] = useState('')

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Personalised Wellness Quiz | Divya Swasth'
    return () => { document.title = previousTitle }
  }, [])

  const scrollToGoals = () => {
    document.getElementById('wellness-goals')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-[#fbfaf4] text-[#183522]">
      <section className="relative min-h-[460px] overflow-hidden border-b border-[#dfe5da] bg-[#f8f4e9] sm:min-h-[480px] lg:min-h-[500px]">
        <img
          src={siteContent.media.src_1}
          alt={siteContent.media.alt_2}
          className="absolute inset-0 h-full w-full object-cover object-[68%_15%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,238,.98)_0%,rgba(251,248,238,.94)_28%,rgba(251,248,238,.55)_42%,rgba(251,248,238,.02)_58%)]" />

        <div className="relative mx-auto min-h-[460px] max-w-[1440px] px-5 py-8 sm:min-h-[480px] sm:px-8 lg:min-h-[500px] lg:px-16 lg:py-10">
          <div className="max-w-[480px]">
            <p className="text-[11px] font-black uppercase tracking-[.17em] text-[#284d33]">{siteContent.text.wellness_quiz}</p>
            <span className="mt-2 block h-px w-16 bg-[#c99535]" />

            <h1 className="mt-6 font-display text-[46px] font-bold leading-[1.05] text-[#123820] sm:text-[52px]">
              <span className="block">{siteContent.text.discover_your}</span>
              <span className="block">
                <span className="text-[#b47a20]">{siteContent.text.perfect}</span>{siteContent.text.wellness}</span>
              <span className="block">{siteContent.text.match}</span>
            </h1>

            <p className="mt-5 max-w-[420px] text-[17px] leading-[1.6] text-[#435449] sm:text-[19px]">{siteContent.text.take_our_quick_quiz_and_get_personalized_prod}</p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-4">
              {siteContent.sections.HERO_NOTES.map(({ label, Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#cfb46f] bg-[#fffdf6] text-[#426349]">
                    <Icon className="h-5 w-5" strokeWidth={1.4} />
                  </span>
                  <span className="whitespace-pre-line text-[13px] font-bold leading-[1.3] text-[#314336]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            {siteContent.sections.HERO_BENEFITS.map(({ label, Icon }, index) => {
              const positions = [
                { top: '24px', left: '52%' },
                { top: '28px', right: '4%' },
                { top: '175px', left: '46%' },
                { bottom: '24px', right: '4%' },
              ]
              return (
                <div
                  key={label}
                  style={positions[index] || {}}
                  className="absolute z-10 flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full border border-[#e2dfd4] bg-white/95 text-center shadow-[0_5px_18px_rgba(28,55,36,.12)] backdrop-blur-sm transition-transform hover:scale-105"
                >
                  <Icon className="h-7 w-7 text-[#22472d]" strokeWidth={1.35} />
                  <span className="mt-1 whitespace-pre-line text-[9px] font-bold leading-[1.15] text-[#203828]">{label}</span>
                </div>
              )
            })}

            <Link
              to={siteContent.media.to_3}
              className="absolute bottom-6 left-[47%] flex min-h-[110px] w-[440px] items-center gap-4 rounded-2xl border border-[#c99b3e]/70 bg-[#08331f] px-6 py-5 text-white shadow-[0_10px_30px_rgba(4,35,21,.35)] transition hover:-translate-y-0.5"
            >
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#0c3d25] text-[#e9c25f]">
                <Gift className="h-9 w-9" strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-[13px] text-white/85">{siteContent.text.complete_the_quiz_get}</span>
                <span className="block font-display text-[24px] font-bold uppercase leading-tight tracking-[.01em] text-[#e9c25f]">{siteContent.text.exclusive_offers}</span>
                <span className="block text-[13px] text-white/80">{siteContent.text.on_products_that_suit_you_best}</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="bg-[#fbfaf4] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">

          {/* Heading */}
          <div className="text-center">
            <h2 className="font-display text-[22px] font-bold uppercase tracking-[0.04em] text-[#15261b] sm:text-[24px]">{siteContent.text.how_it_works}</h2>

            {/* Decorative line */}
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="h-px w-8 bg-[#d5ba74]" />

              <Leaf
                className="h-4 w-4 rotate-[-25deg] fill-[#719b48] text-[#719b48]"
                strokeWidth={1}
              />

              <span className="h-px w-8 bg-[#d5ba74]" />
            </div>
          </div>

          {/* Steps */}
          <div className="mt-8 flex flex-col items-stretch gap-5 lg:flex-row lg:items-center lg:gap-4">
            {siteContent.sections.STEPS.map(({ title, text, Icon }, index) => (
              <div
                key={title}
                className="flex flex-1 flex-col items-center gap-4 lg:flex-row"
              >
                {/* Step Card */}
                <article
                  className="
              flex
              min-h-[118px]
              w-full
              items-center
              rounded-[14px]
              border
              border-[#e6e1d4]
              bg-[#fffdf9]
              px-4
              py-5
              shadow-[0_3px_12px_rgba(47,69,44,0.04)]
              sm:px-5
              lg:min-h-[120px]
            "
                >
                  {/* Left area */}
                  <div className="flex shrink-0 items-center">
                    {/* Number */}
                    <span
                      className="
                  mr-3
                  grid
                  h-[34px]
                  w-[34px]
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[#e6efce]
                  text-[15px]
                  font-bold
                  text-[#294426]
                "
                    >
                      {index + 1}
                    </span>

                    {/* Icon */}
                    <span className="grid h-[58px] w-[58px] shrink-0 place-items-center text-[#7b9a52]">
                      <Icon
                        className="h-[48px] w-[48px]"
                        strokeWidth={1.35}
                      />
                    </span>
                  </div>

                  {/* Text */}
                  <div className="ml-4">
                    <h3 className="text-[15px] font-extrabold leading-[1.3] text-[#202c23] sm:text-[16px]">
                      {title}
                    </h3>

                    <p className="mt-2 max-w-[240px] text-[12px] leading-[1.55] text-[#59635b] sm:text-[13px]">
                      {text}
                    </p>
                  </div>
                </article>

                {/* Arrow */}
                {index < siteContent.sections.STEPS.length - 1 && (
                  <>
                    {/* Desktop Arrow */}
                    <ArrowRight
                      className="hidden h-8 w-8 shrink-0 text-[#1e3527] lg:block"
                      strokeWidth={1.4}
                    />

                    {/* Mobile Arrow */}
                    <ArrowRight
                      className="h-7 w-7 rotate-90 text-[#1e3527] lg:hidden"
                      strokeWidth={1.4}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="wellness-goals" className="scroll-mt-28 bg-white px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">

          {/* Heading */}
          <div className="mb-7 text-center">
            <h2 className="font-display text-[20px] font-black uppercase tracking-[.06em] text-[#173623] sm:text-[22px]">Pick your wellness quiz</h2>
            <p className="mt-1.5 text-[12px] font-medium text-[#647168]">Step 1 of 3: Choose your main goal to get started.</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {wellnessGoals.map(({ id, title, text, icon, image }) => {
              const Icon = siteIcons[icon]
              const selected = selectedGoal === id
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => setSelectedGoal(id)}
                  aria-pressed={selected}
                  className={`group relative flex min-h-[320px] flex-col overflow-hidden rounded-[9px] border bg-white text-center shadow-[0_2px_10px_rgba(30,55,38,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(30,55,38,.13)] ${selected ? 'border-[#b8882f] ring-2 ring-[#d8b563]/30' : 'border-[#e2e8e0]'}`}
                >
                  {selected && <BadgeCheck className="absolute right-2 top-2 z-10 h-5 w-5 rounded-full bg-white text-[#a77520]" fill="#fff" />}

                  {/* Top: Icon + Title */}
                  <div className="flex min-h-[112px] flex-col items-center justify-center px-2 pb-2 pt-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-[#bccbb6] bg-[#fafcf7] text-[#31543a]">
                      <Icon className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                    <h3 className="mt-2.5 text-[11px] font-black uppercase leading-[1.25] tracking-[.03em] text-[#1a3326]">
                      {title}
                    </h3>
                  </div>

                  {/* Middle: Image - tall portrait */}
                  <div className="h-[154px] w-full overflow-hidden bg-[#e3ead9]">
                    <img
                      src={image}
                      alt={title}
                      loading="eager"
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Bottom: Description */}
                  <p className="flex flex-1 items-center justify-center px-2 py-3 text-[10px] leading-[1.35] text-[#56675b]">
                    {text}
                  </p>
                  <span className="mx-4 mb-4 rounded bg-[#163e29] px-4 py-2 text-xs font-bold text-white">Take the quiz →</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>


{selectedGoal && <WellnessQuiz key={selectedGoal} primary={selectedGoal} onReset={() => { setSelectedGoal(''); scrollToGoals() }} />}

      <section className="px-4 pb-5 pt-3 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[138px] max-w-[1200px] overflow-hidden rounded-lg border border-[#1e4a2e] bg-[#063b25] bg-[url('/images/wellness/wellness-quiz-cta-bg.svg')] bg-cover bg-center text-white shadow-2xl">

          <div className="relative mx-auto flex min-h-[138px] max-w-[1040px] items-center justify-center gap-3 text-center md:justify-center">

            {/* Center Text */}
            <div className="max-w-[480px] z-10 pt-2">
              <h2 className="font-serif text-[19px] leading-tight text-[#e8eee4] sm:text-[24px] tracking-wide">{siteContent.text.ready_to_start_your_wellness_journey}</h2>
              <p className="mt-1 text-[10px] leading-relaxed text-[#a8bba9] sm:text-[12px] font-medium tracking-wide">{siteContent.text.take_the_quiz_and_take_the_first_step_towards}</p>
              <button
                type="button"
                onClick={scrollToGoals}
                className="mt-3 inline-flex min-w-[200px] items-center justify-center gap-3 rounded-[4px] bg-[linear-gradient(180deg,#eab960,#c28930)] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.06em] text-white shadow-[0_4px_15px_rgba(194,137,48,0.3)] transition-all hover:brightness-110 hover:shadow-[0_6px_20px_rgba(194,137,48,0.4)]"
              >{siteContent.text.start_quiz_now}<ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </button>
            </div>

            {/* Right Badge */}
            <div className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-full border border-[#d2a853]/30 p-1 relative z-10">
              <div className="grid h-full w-full place-items-center rounded-full border-[1.5px] border-[#d2a853] bg-transparent text-center shadow-[inset_0_0_15px_rgba(210,168,83,0.15)] relative">
                <div className="absolute inset-[2px] rounded-full border border-dashed border-[#d2a853]/40"></div>
                <div className="flex flex-col items-center justify-center pt-1 relative z-10">
                  <p className="font-sans text-[21px] font-bold text-[#e6f1ea] leading-none mb-1 tracking-tight">{siteContent.text["100"]}</p>
                  <p className="text-[7px] font-bold uppercase leading-none text-[#e6f1ea] tracking-[0.05em] mb-1.5">{siteContent.text.confidential}</p>
                  <LockKeyhole className="h-4 w-4 text-[#d2a853]" strokeWidth={2} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="border-y border-[#e0e3dc] bg-[#fffefa] px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
          {siteContent.sections.TRUST_ITEMS.map(({ title, text, Icon }, index) => (
            <div key={title} className={`flex min-h-[42px] items-center justify-center gap-3 px-3 ${index ? 'sm:border-l sm:border-[#dfe3dc]' : ''}`}>
              <Icon className="h-9 w-9 shrink-0 text-[#4c694b]" strokeWidth={1.2} />
              <p className="text-[10px] leading-[1.4] text-[#56645a]"><strong className="block text-[#213b29]">{title}</strong>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative min-h-[76px] overflow-hidden border-t border-[#1b5a3b] bg-[#003a25] px-4 py-3 text-white sm:px-6 lg:px-8">
        <img
          src={siteContent.media.src_4}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-0 h-full w-[42%] object-cover object-right opacity-30 mix-blend-multiply"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-transparent" />
        <form className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center gap-3 sm:flex-row sm:gap-4" onSubmit={subscribe}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#c99a32] bg-[#003a25] text-[#e7bd54]">
            <Mail className="h-5 w-5" strokeWidth={1.4} />
          </span>
          <div className="text-center sm:text-left sm:min-w-[245px]">
            <h2 className="text-[13px] font-black uppercase tracking-[.08em]">STAY UPDATED ON WELLNESS</h2>
            <p className="mt-0.5 text-[10px] text-white/75">Get health tips, exclusive offers &amp; updates.</p>
          </div>
          <div className="flex w-full max-w-[380px] sm:ml-auto lg:mr-[150px]">
            <label className="sr-only" htmlFor="wellness-newsletter-email">{siteContent.text.email_address}</label>
            <input id="wellness-newsletter-email" required name="wellness-email" type="email" autoComplete="off" spellCheck="false" placeholder={siteContent.media.placeholder_5} className="min-w-0 flex-1 rounded-l-md bg-white px-4 py-2.5 text-[10px] text-[#203127] outline-none placeholder:text-[#8b938d]" />
            <button disabled={submitting || subscribed} type="submit" className="rounded-r-md bg-[#d39b35] px-5 py-2.5 text-[10px] font-black uppercase text-white">{submitting ? 'Subscribing…' : subscribed ? 'Subscribed' : 'Subscribe'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

const siteIcons = { BadgeCheck, Brain, ClipboardList, Clock, Dumbbell, FlaskConical, Flower2, HeartPulse, Leaf, ShieldCheck, Sparkles, Sprout, UsersRound, Utensils, Zap }
