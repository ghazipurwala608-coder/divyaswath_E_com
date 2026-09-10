import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FlaskConical,
  Globe2,
  Leaf,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Sprout,
  Truck
} from 'lucide-react'

const CERTIFICATIONS = [
  {
    id: 'made-in-india',
    name: 'Proudly Made in India',
    badge: '100% Authentic Vedic Heritage',
    authority: 'Government of India Standards',
    image: '/images/certifications/made-in-india.jpg',
    color: '#0e4525',
    accent: '#d4af37',
    tagline: 'Rooted in Ancient Ayurvedic Wisdom & Indigenous Herbal Sovereignty',
    summary:
      'Every Divya Swasth product is conceived, harvested, and crafted in India. We collaborate with generational herbal growers across India to source authentic botanical species at peak biological maturity.',
    highlights: [
      '100% sourced and manufactured within certified Indian facilities',
      'Honors classical formulas from Charaka Samhita and Sushruta Samhita',
      'Sustainably cultivated native botanicals with zero deforestation impact',
      'Supports domestic farmers and certified organic cultivation programs'
    ],
    whyItMatters:
      'Indian soil and micro-climates nurture the world’s most potent Ayurvedic herbs. By manufacturing entirely in India, we ensure rapid harvest-to-processing cycles that lock in fragile phytonutrients.'
  },
  {
    id: 'gmp',
    name: 'GMP Certified',
    badge: 'Good Manufacturing Practice',
    authority: 'WHO-GMP & Schedule M Standards',
    image: '/images/certifications/gmp.jpg',
    color: '#0a3d24',
    accent: '#e2b755',
    tagline: 'Cleanroom Technology, Process Standardization & Zero Contamination',
    summary:
      'Good Manufacturing Practice (GMP) certification guarantees that all products are manufactured under rigorous, controlled conditions with precision instrumentation, filtered HVAC airflow, and strict hygiene protocols.',
    highlights: [
      'Positive-pressure cleanroom manufacturing suites (Class 10,000 / ISO 7)',
      'Heavy-metal spectrometry screening for lead, mercury, arsenic, and cadmium',
      'Validated equipment sterilization cycles between individual batch runs',
      'Standardized botanical extracts ensuring consistent potency in every capsule'
    ],
    whyItMatters:
      'GMP compliance ensures that the ingredients listed on our bottle are exactly what you consume—without hidden contaminants, synthetic fillers, or batch-to-batch variation.'
  },
  {
    id: 'ayush',
    name: 'AYUSH Premium Certified',
    badge: 'Quality You Can Trust',
    authority: 'Ministry of AYUSH, Govt. of India',
    image: '/images/certifications/ayush.jpg',
    color: '#1a472a',
    accent: '#d9a74a',
    tagline: 'Recognized by India’s Premier Authority on Traditional Healthcare',
    summary:
      'The Ministry of AYUSH (Ayurveda, Yoga, Naturopathy, Unani, Siddha, Sowa-Rigpa and Homoeopathy) sets the gold standard for traditional medicinal formulations in India.',
    highlights: [
      'Compliant with the official Ayurvedic Pharmacopoeia of India (API)',
      'Classical synergistic herb combinations (Samyoga & Virudha screening)',
      'Approved classification as Ayurvedic Proprietary Medicine',
      'Strict verification of plant parts used (roots, leaves, standardized barks)'
    ],
    whyItMatters:
      'AYUSH recognition guarantees that our formulas are not modern chemical concoctions disguised as herbal, but true, holistic Ayurvedic remedies with validated safety profiles.'
  },
  {
    id: 'fssai',
    name: 'FSSAI Certified & Licensed',
    badge: 'Food Safety & Standards',
    authority: 'Food Safety and Standards Authority of India',
    image: '/images/certifications/fssai.jpg',
    color: '#123d24',
    accent: '#ea580c',
    tagline: 'Complete Consumer Safety, Lab Testing & Transparent Labeling',
    summary:
      'Licensed under the Food Safety and Standards Act (2006), ensuring complete adherence to nutritional purity, shelf-life stability, non-toxic packaging, and allergen disclosures.',
    highlights: [
      'Comprehensive testing for microbial safety, yeast, mold, and pathogens',
      '100% vegetarian capsule shells (HPMC plant-derived cellulose)',
      'Transparent nutritional facts and precise botanical extract disclosures',
      'Zero unauthorized preservatives, harmful binders, or banned synthetic dyes'
    ],
    whyItMatters:
      'FSSAI certification assures complete food-grade purity and confirms that Divya Swasth supplements meet all mandatory national health and dietary safety benchmarks.'
  },
  {
    id: 'iso',
    name: 'ISO 9001:2015 Certified',
    badge: 'Quality Management System',
    authority: 'International Organization for Standardization',
    image: '/images/certifications/iso.jpg',
    color: '#0b3864',
    accent: '#3b82f6',
    tagline: 'Global Benchmark for Process Consistency & Traceability',
    summary:
      'ISO 9001:2015 is the globally respected standard for quality management systems. It covers our end-to-end supply chain—from raw material verification to secure logistics.',
    highlights: [
      'Complete seed-to-shelf traceability with unique batch tracking numbers',
      'Independent third-party audits and annual compliance recertification',
      'Systematic quality risk assessment at every stage of production',
      'Dedicated customer satisfaction and post-market product monitoring'
    ],
    whyItMatters:
      'ISO certification demonstrates our unwavering commitment to world-class precision, institutional accountability, and continuous improvement across every department.'
  }
]

const QUALITY_PILLARS = [
  {
    icon: FlaskConical,
    title: 'Lab Tested Purity',
    desc: 'Every batch undergoes rigorous microbial, heavy metal, and potency assays.'
  },
  {
    icon: Sprout,
    title: '100% Vegetarian',
    desc: 'Plant-based HPMC capsules without gelatin, animal derivatives, or synthetic glazes.'
  },
  {
    icon: ShieldCheck,
    title: 'No Added Preservatives',
    desc: 'Pure botanical extracts stabilized naturally without harsh chemical agents.'
  },
  {
    icon: LockKeyhole,
    title: 'Hermetic Tamper Seal',
    desc: 'Medical-grade induction seal and moisture-lock barriers for maximum shelf freshness.'
  }
]

export default function CertificationsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Our Quality Certifications | Divya Swasth'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Discover Divya Swasth certifications: Made in India, GMP Certified, AYUSH Premium, FSSAI Licensed, and ISO 9001:2015 for authentic Ayurvedic purity.'
      )
    }
  }, [])

  return (
    <div className="bg-[#fcfaf3] text-[#1a3824]">
      {/* ── BREADCRUMB ── */}
      <nav aria-label="Breadcrumb" className="border-b border-[#e7e0ce] bg-[#f7f2e4] px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs font-semibold text-[#5c6d54]">
          <Link to="/" className="hover:text-[#9e6d18]">Home</Link>
          <ChevronRight size={13} className="text-[#a59f8c]" />
          <span className="text-[#1e3c27]">Our Certifications &amp; Quality</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[#e2d9c2] bg-[linear-gradient(135deg,#0d301b_0%,#061e11_100%)] px-4 py-14 text-white sm:px-8 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#69a838]/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[.18em] text-[#f3d582]">
            <Award size={14} className="text-[#f3d582]" />
            Official Trust &amp; Standards
          </div>

          <h1 className="mt-5 font-display text-3xl font-extrabold uppercase leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
            Certified Excellence.<br />
            <span className="text-[#e2b755]">Pure Ayurvedic Integrity.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xs font-medium leading-relaxed text-white/80 sm:text-sm md:text-base">
            At Divya Swasth, our commitment to your health is backed by internationally and nationally recognized manufacturing, safety, and quality certifications.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            {CERTIFICATIONS.map((cert) => (
              <a
                key={cert.id}
                href={`#${cert.id}`}
                className="group flex flex-col items-center rounded-xl border border-[#d4af37]/25 bg-white/5 p-3.5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37] hover:bg-white/10"
              >
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="h-14 w-14 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] transition duration-300 group-hover:scale-105 sm:h-16 sm:w-16"
                  loading="lazy"
                />
                <span className="mt-2 text-center text-[10px] font-bold uppercase tracking-wide text-[#f3d582]">
                  {cert.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 QUALITY PILLARS ── */}
      <section className="border-b border-[#e5decb] bg-[#f8f5ea] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_PILLARS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-xl border border-[#e2d8be] bg-[#fffdf7] p-5 shadow-[0_4px_14px_rgba(20,46,33,0.04)]"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#d4af37]/50 bg-[#0d301b] text-[#f3d582]">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a3824] uppercase tracking-wide">{title}</h3>
                  <p className="mt-1 text-xs text-[#526351] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATION CARDS DETAIL ── */}
      <section className="px-4 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-12">
          {CERTIFICATIONS.map((cert, index) => {
            const isEven = index % 2 === 1
            return (
              <article
                key={cert.id}
                id={cert.id}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#ded4bd] bg-[#fffdf7] shadow-[0_8px_30px_rgba(20,46,33,0.07)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(20,46,33,0.12)]"
              >
                <div className={`grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 ${isEven ? 'lg:grid-flow-dense' : ''}`}>
                  
                  {/* Left / Right Badge Showcase */}
                  <div className={`flex flex-col items-center justify-center text-center lg:col-span-5 ${isEven ? 'lg:col-start-8' : ''}`}>
                    <div className="relative rounded-2xl border border-[#d4af37]/40 bg-[radial-gradient(ellipse_at_center,#fdfaf0_0%,#f0e9d2_100%)] p-6 shadow-inner sm:p-8">
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="mx-auto h-48 w-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)] transition duration-500 hover:scale-105 sm:h-56 sm:w-56"
                        loading="lazy"
                      />
                      <span className="mt-4 inline-block rounded-full bg-[#0d301b] px-4 py-1 text-[10px] font-black uppercase tracking-[.14em] text-[#e8cf8c]">
                        {cert.badge}
                      </span>
                    </div>
                    <p className="mt-3 text-[11px] font-semibold text-[#667761] uppercase tracking-wider">
                      Authority: <strong className="text-[#1a3824]">{cert.authority}</strong>
                    </p>
                  </div>

                  {/* Description & Features */}
                  <div className={`lg:col-span-7 ${isEven ? 'lg:col-start-1' : ''}`}>
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[.16em] text-[#a87922]">
                      <FileCheck2 size={15} />
                      Standard {index + 1} of {CERTIFICATIONS.length}
                    </span>

                    <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-[#163823] sm:text-3xl">
                      {cert.name}
                    </h2>

                    <p className="mt-2 text-xs font-semibold text-[#8a6820] sm:text-sm">
                      {cert.tagline}
                    </p>

                    <p className="mt-4 text-xs font-medium leading-relaxed text-[#415344] sm:text-sm">
                      {cert.summary}
                    </p>

                    {/* Key Highlights Checklist */}
                    <div className="mt-5 rounded-xl border border-[#e8dfcb] bg-[#fbf8ee] p-4 sm:p-5">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1e3c27]">
                        Verified Quality Benchmarks:
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {cert.highlights.map((point) => (
                          <li key={point} className="flex items-start gap-2.5 text-xs text-[#2d4231] leading-snug">
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#4c8430]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why It Matters */}
                    <div className="mt-4 flex items-start gap-3 rounded-lg border-l-4 border-[#c8973a] bg-[#fdf9ea] p-3 text-xs text-[#524424] leading-relaxed">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-[#c8973a]" />
                      <p>
                        <strong>Why it matters to you:</strong> {cert.whyItMatters}
                      </p>
                    </div>
                  </div>

                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="border-t border-[#d8cfba] bg-[linear-gradient(135deg,#0a2716_0%,#04150c_100%)] px-4 py-16 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Leaf className="mx-auto h-10 w-10 text-[#d4af37]" />
          <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight sm:text-4xl text-white">
            Experience Certified Ayurvedic Wellness
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs font-medium leading-relaxed text-white/75 sm:text-sm">
            All our botanical formulations meet these stringent five-point safety and manufacturing standards for your everyday peace of mind.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#c8973a] to-[#e4b755] px-7 py-3.5 text-xs font-black uppercase tracking-[.12em] text-[#0f2a17] shadow-lg transition hover:brightness-110"
            >
              Explore Certified Products
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/ingredients"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-7 py-3.5 text-xs font-black uppercase tracking-[.12em] text-white backdrop-blur transition hover:bg-white/10"
            >
              Explore Our Ingredients
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
