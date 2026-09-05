import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Leaf,
  BookOpenCheck,
  Factory,
  Truck,
  Clock3,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Search,
  Mail,
  Sparkles,
  Users,
} from 'lucide-react'

const CATEGORIES = ['All', 'Product', 'Orders & Delivery', 'Returns & Care']

const faqs = [
  {
    code: 'REC.01',
    category: 'Product',
    q: 'Are your products vegetarian?',
    a: 'Vegetarian status will be shown product by product only after it is confirmed on the final approved label.',
    icon: Leaf,
  },
  {
    code: 'REC.02',
    category: 'Product',
    q: 'How should I use the products?',
    a: 'Follow the exact suggested use on the final product label. Do not exceed it. Consult a qualified healthcare professional where appropriate.',
    icon: BookOpenCheck,
  },
  {
    code: 'REC.03',
    category: 'Product',
    q: 'Where are the products manufactured?',
    a: 'Verified manufacturer and marketer information will be published exactly as it appears on final packaging.',
    icon: Factory,
  },
  {
    code: 'REC.04',
    category: 'Orders & Delivery',
    q: 'How can I track my order?',
    a: 'After dispatch, the tracking reference and carrier information will be shared through the verified email or mobile number used for your order.',
    icon: Truck,
  },
  {
    code: 'REC.05',
    category: 'Orders & Delivery',
    q: 'How long does delivery take?',
    a: 'Delivery estimates depend on serviceable PIN code, carrier and order processing. Final timelines will be stated in the shipping policy and at checkout.',
    icon: Clock3,
  },
  {
    code: 'REC.06',
    category: 'Returns & Care',
    q: 'Can I return an opened product?',
    a: 'Opened wellness products are generally subject to safety restrictions. The final return policy will state all eligibility, damage and refund conditions before launch.',
    icon: RotateCcw,
  },
  {
    code: 'REC.07',
    category: 'Product',
    q: 'Are these medicines or supplements?',
    a: 'The exact regulatory classification must be confirmed for every product and shown on its final label and product page. No product should be used as a substitute for prescribed treatment.',
    icon: ShieldCheck,
  },
  {
    code: 'REC.08',
    category: 'Returns & Care',
    q: 'How should products be stored?',
    a: 'Follow each label. Unless stated otherwise after approval, products are generally kept in a cool, dry and dark place, away from children.',
    icon: Snowflake,
  },
]

// A circular "provisional record" stamp — the design's signature element.
// It literally spells out the brief's own refrain (pending final approval),
// so the graphic and the copy are saying the same thing.
function ProvisionalStamp({ Icon, id, tone = 'light' }) {
  const ringColor = tone === 'dark' ? '#d9b45f' : '#a37622'
  const textColor = tone === 'dark' ? '#e9c983' : '#a37622'
  return (
    <svg viewBox="0 0 100 100" className="h-[68px] w-[68px]" aria-hidden="true">
      <defs>
        <path id={id} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke={ringColor} strokeWidth="0.75" strokeDasharray="1.5 3" opacity="0.7" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={ringColor} strokeWidth="1" opacity="0.9" />
      <text fontSize="7.4" letterSpacing="2.5" fill={textColor} fontFamily="ui-monospace, monospace">
        <textPath href={`#${id}`} startOffset="2%">
          PROVISIONAL · PENDING LABEL ·
        </textPath>
      </text>
      <foreignObject x="30" y="30" width="40" height="40">
        <div className="flex h-full w-full items-center justify-center">
          <Icon className="h-6 w-6" style={{ color: ringColor }} strokeWidth={1.4} />
        </div>
      </foreignObject>
    </svg>
  )
}

// Fixed low-opacity paper grain so the parchment reads as material, not a flat fill.
function GrainOverlay() {
  return (
    <svg className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.05]" aria-hidden="true">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}

function FloatingLeaves() {
  const leaf = (
    <path d="M2 20C2 8 14 2 30 2c2 18-8 30-20 30C6 32 2 26 2 20Z" stroke="#d9b45f" strokeWidth="1.2" />
  )
  return (
    <>
      <svg className="absolute left-[8%] top-10 h-14 w-14 animate-floatSlow opacity-15" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
      <svg className="absolute right-[10%] top-14 h-9 w-9 animate-floatSlower opacity-15" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
      <svg className="absolute bottom-8 left-[24%] h-7 w-7 animate-floatSlow opacity-10" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
      <svg className="absolute bottom-10 right-[20%] h-8 w-8 animate-floatSlower opacity-10" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
    </>
  )
}

const TRUST_PILLS = [
  { icon: Sparkles, text: '8 topics answered' },
  { icon: Users, text: 'Care team reviewed' },
  { icon: ShieldCheck, text: 'Provisional until launch' },
]

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [openCode, setOpenCode] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqs.filter((f) => {
      const matchesCategory = category === 'All' || f.category === category
      const matchesQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="relative min-h-screen bg-[#f4eedc] text-[#1c2e20]">
      <style>{`
        @keyframes floatY { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeUp { animation: fadeUp .7s ease both }
        .animate-cardIn { animation: cardIn .5s cubic-bezier(.22,.61,.36,1) both }
        .animate-floatSlow { animation: floatY 7s ease-in-out infinite }
        .animate-floatSlower { animation: floatY 9s ease-in-out infinite }
      `}</style>

      <GrainOverlay />

      {/* Hero — an "official record" plate, deliberately stamped rather than sold */}
      <section className="relative overflow-hidden bg-[#0c2a1d] px-4 py-24 text-center text-white">
        <FloatingLeaves />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center animate-fadeUp">
          <ProvisionalStamp Icon={ShieldCheck} id="hero-stamp" tone="dark" />

          <p className="mt-7 font-mono text-[10px] uppercase tracking-[.35em] text-[#dfb75e]">
            Ledger of frequently asked questions
          </p>
          <h1 className="mt-4 font-display text-5xl text-[#fff6df] sm:text-6xl">
            Clear answers, thoughtful care.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#c9d3c6]">
            Nothing here is a promise ahead of the label. Every record below
            will be re-checked against the final approved packaging before
            launch.
          </p>

          {/* trust pills — gives the hero more body without adding noise */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {TRUST_PILLS.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-[#e8e1cc] backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-[#d9b45f]" strokeWidth={1.8} />
                {text}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-8 flex w-full max-w-md items-center gap-3 rounded-full border border-[#d9b45f]/30 bg-[#123526] px-5 py-3 text-left focus-within:border-[#d9b45f]">
            <Search className="h-4 w-4 shrink-0 text-[#d9b45f]" strokeWidth={1.6} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the ledger…"
              className="w-full bg-transparent font-mono text-sm text-[#fff6df] placeholder:text-[#8ea28f] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="relative z-10 px-4 pt-10 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                category === c
                  ? 'scale-[1.03] border-[#0c2a1d] bg-[#0c2a1d] text-[#fff6df] shadow-[0_6px_16px_rgba(12,42,29,.2)]'
                  : 'border-[#ddceac] bg-[#fbf7ec] text-[#6d6350] hover:border-[#a37622]/50 hover:text-[#a37622]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Record list — index-card ledger, each entry catalogued and provisionally stamped */}
      <section className="relative z-10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-[#6d6350]">
              No record matches “{query}”. Try a different word.
            </p>
          )}

          <div className="relative space-y-5 pl-6 sm:pl-10">
            {/* ledger spine */}
            <div
              className="absolute bottom-2 left-0 top-2 w-px bg-[repeating-linear-gradient(to_bottom,#b8863b_0,#b8863b_4px,transparent_4px,transparent_9px)] opacity-60 sm:left-2"
              aria-hidden="true"
            />

            {filtered.map(({ code, category: cat, q, a, icon: Icon }, i) => {
              const isOpen = openCode === code
              const tilt = i % 2 === 0 ? '-rotate-[0.4deg]' : 'rotate-[0.4deg]'
              return (
                <details
                  key={code}
                  open={isOpen}
                  onToggle={(e) => setOpenCode(e.target.open ? code : null)}
                  className={`animate-cardIn group relative rounded-md border border-[#ddceac] bg-[#fbf7ec] shadow-[3px_4px_0_#e4d9b8] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[4px_6px_0_#d9c79a] open:-translate-y-[1px] open:border-[#a37622] open:shadow-[4px_6px_0_#d9c79a] ${tilt} open:rotate-0`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* filing tab */}
                  <div className="absolute -top-3 left-5 flex items-center gap-2 rounded-sm border border-[#ddceac] bg-[#f4eedc] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.2em] text-[#a37622]">
                    {code}
                    <span className="hidden text-[#c2ae7a] sm:inline">· {cat}</span>
                  </div>

                  <summary className="flex cursor-pointer list-none items-center gap-4 px-6 pb-5 pt-7 marker:content-none sm:gap-6 sm:px-8">
                    <span className="shrink-0">
                      <ProvisionalStamp Icon={Icon} id={`stamp-${code}`} />
                    </span>
                    <span className="flex-1 font-display text-lg leading-snug text-[#1c2e20] sm:text-xl">
                      {q}
                    </span>
                    <span
                      className="ml-1 shrink-0 font-mono text-lg text-[#a37622] transition-transform duration-300 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>

                  <div className="px-6 pb-7 sm:px-8">
                    <div className="border-t border-dashed border-[#ddceac] pt-4 sm:ml-[92px]">
                      <p className="text-sm leading-7 text-[#6d6350]">{a}</p>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA — ties the FAQ back into the rest of the site instead of dead-ending */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="animate-fadeUp relative overflow-hidden rounded-[1.75rem] border border-[#ddceac] bg-[#0c2a1d] px-8 py-10 text-center text-white">
            <FloatingLeaves />
            <div className="relative mx-auto flex max-w-sm flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b45f]/40 bg-white/5">
                <Mail className="h-5 w-5 text-[#d9b45f]" strokeWidth={1.6} />
              </span>
              <h3 className="mt-4 font-display text-2xl text-[#fff6df]">
                Still have a question?
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#c9d3c6]">
                Our care team is happy to help with anything not covered
                above.
              </p>
              <Link
                to="/contact"
                className="mt-6 rounded-full bg-[#d9b45f] px-6 py-2.5 text-sm font-bold text-[#0c2a1d] transition-all duration-300 hover:bg-[#e9c983] hover:shadow-[0_10px_24px_rgba(217,180,95,.3)]"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-md text-center font-mono text-xs leading-6 text-[#8c8064]">
          END OF LEDGER — remaining questions will be filed here as answers
          are confirmed against the approved label.
        </p>
      </section>
    </div>
  )
}