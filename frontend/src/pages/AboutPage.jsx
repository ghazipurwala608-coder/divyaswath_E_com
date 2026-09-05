import { ArrowRight, Award, FlaskConical, Heart, Leaf, ShieldCheck, Sprout, UsersRound, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const values = [
  [Leaf, 'Nature first', 'We are rooted in the goodness of nature, with herbs and plants at the heart of everything we do.'],
  [FlaskConical, 'Science backed', 'Our formulations are a blend of traditional wisdom and modern research, quality at every step.'],
  [ShieldCheck, 'Quality assured', 'Every product is made to a standard of transparency, purity and responsible ingredients.'],
  [UsersRound, 'Made for everyone', 'Practical wellness built for real Indian lifestyles and routines, wherever you are.'],
]

const milestones = [
  { year: '2019', title: 'The beginning', text: 'A simple belief in bringing better botanical wellness home.', Icon: Sprout },
  { year: '2020', title: 'Research & development', text: 'We studied traditional ingredients and modern formats to create better solutions.', Icon: FlaskConical },
  { year: '2021', title: 'Made with care', text: 'Our first products came to life with purpose and passion for health.', Icon: Heart },
  { year: '2022', title: 'Growing together', text: '500+ families joined our wellness journey across India.', Icon: UsersRound },
  { year: '2023 & beyond', title: 'A healthier future', text: 'We continue to learn, improve and serve communities with nature-first wellness.', Icon: Award },
]

export default function AboutPage() {
  return (
    <div className="bg-[#fbf6e9] text-[#163724]">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[440px] overflow-hidden bg-[#f4edda]">
        <img
          src="/images/blog/wellness-blog-hero-v2.png"
          alt="Happy Indian family enjoying a wellness-focused lifestyle"
          className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
        />
        {/* Left cream gradient so text is readable */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,237,216,1)_0%,rgba(244,237,216,.97)_28%,rgba(244,237,216,.60)_48%,rgba(244,237,216,0)_70%)]" />

        <div className="relative mx-auto flex min-h-[440px] max-w-[1280px] items-center px-5 py-12 sm:px-10 lg:px-16">
          <div className="max-w-[430px]">
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#9a6c1f]">Our story</p>

            <h1 className="mt-4 font-display text-[40px] font-extrabold uppercase leading-[1] text-[#163724] sm:text-[50px]">
              Rooted in nature.<br />
              <span className="text-[#ad791e]">Driven by purpose.</span>
            </h1>

            <p className="mt-5 max-w-[360px] text-[12.5px] leading-[1.7] text-[#445448]">
              Divya Swasth was born from a simple belief: true wellness comes from
              nature, balanced with thoughtful science and everyday care. We bring
              you products that feel honest, practical and close to home.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[#063b25] px-5 py-3 text-[10px] font-black uppercase tracking-[.1em] text-white transition hover:bg-[#0a4d31]"
            >
              Explore our products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHAT DRIVES US ──────────────────────────────── */}
      <section className="bg-[#0a3d27] px-5 py-9 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-center font-display text-[17px] font-bold uppercase tracking-[.14em] text-[#f0ce70]">
            What drives us
          </h2>
          <span className="mx-auto mt-2 mb-7 block h-px w-10 bg-[#b08a30]" />

          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
            {values.map(([Icon, title, text], index) => (
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
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#a87922]">Our journey</p>
            <h2 className="mt-2 font-display text-[28px] font-bold uppercase text-[#163724]">Growing with purpose</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-5">
            {milestones.map(({ year, title, text, Icon }, index) => (
              <article key={year} className="relative flex flex-col items-center text-center">
                {/* Connecting line between cards */}
                {index < milestones.length - 1 && (
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
              src="/images/blog/daily-herbal-habits.png"
              alt="Herbal ingredients prepared for a daily wellness ritual"
              className="h-[280px] w-full object-cover"
            />
            {/* Sanskrit quote banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#083c29]/90 px-4 py-3 text-center backdrop-blur-[2px]">
              <p className="font-display text-[18px] leading-tight text-[#f3d581]">सर्वे भवन्तु सुखिनः</p>
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[.14em] text-white/65">May all be healthy</p>
            </div>
          </div>

          {/* Right — Text content */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#a87922]">A promise we stand by</p>
            <h2 className="mt-3 font-display text-[32px] font-bold leading-tight text-[#163724]">
              Wellness that feels honest, useful and close to home.
            </h2>
            <p className="mt-4 text-[13px] leading-[1.75] text-[#596660]">
              At Divya Swasth, we make wellness easier to understand and easier to live.
              Every choice is guided by natural ingredients, responsible information and
              respect for the people who trust us.
            </p>
            <p className="mt-3 text-[13px] leading-[1.75] text-[#596660]">
              We are committed to staying transparent about what goes into our products
              and honest about what they can do for you.
            </p>

            {/* 4 Value badges */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Homegrown', Sprout],
                ['Transparent', ShieldCheck],
                ['Safe & effective', FlaskConical],
                ['Thoughtful', Heart],
              ].map(([label, Icon]) => (
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
      <section className="relative overflow-hidden bg-[#063b25] px-5 py-5 text-white sm:px-10">
        <img
          src="/images/blog/newsletter-botanicals.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d5af4f] text-[#e5c66e]">
            <Mail className="h-5 w-5" strokeWidth={1.4} />
          </span>
          <div className="text-center sm:text-left sm:min-w-[240px]">
            <h2 className="text-[13px] font-black uppercase tracking-[.1em]">Stay connected for natural wellness</h2>
            <p className="mt-0.5 text-[10px] text-white/65">Health tips, thoughtful updates and more.</p>
          </div>
          <div className="flex w-full max-w-[380px] sm:ml-auto">
            <label className="sr-only" htmlFor="about-newsletter-email">Email address</label>
            <input
              id="about-newsletter-email"
              type="email"
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-l-md bg-white px-4 py-2.5 text-[10px] text-[#173b26] outline-none placeholder:text-[#8b938d]"
            />
            <button className="rounded-r-md bg-[#d39b35] px-5 py-2.5 text-[10px] font-black uppercase text-white hover:bg-[#b8842a] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
