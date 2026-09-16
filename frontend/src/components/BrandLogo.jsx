import { useSiteContent } from '../context/SiteContentContext.jsx'
import { Link } from 'react-router-dom'

export default function BrandLogo({ className = '' }) {
  const siteContent = useSiteContent('brand-logo', siteIcons)

  const divya = siteContent?.text?.divya || 'DIVYA'
  const swasth = siteContent?.text?.swasth || 'SWASTH'
  const tagline = siteContent?.text?.natural_healing_holistic_wellness_healthy_fut || 'NATURAL HEALING · HOLISTIC WELLNESS · HEALTHY FUTURE'
  const logoSrc = siteContent?.media?.src_2  || 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450630/divyaswasth/migrated/1282459c18c7948b-logo.png'
  const logoLink = siteContent?.media?.to_1 || '/'

  // Render DIVYA with prominent initial 'D' and stylized leaf flourish on 'A'
  const renderDivya = () => {
    const textUpper = (divya || 'DIVYA').toUpperCase()
    if (!textUpper) return null
    const firstChar = textUpper[0]
    const middleChars = textUpper.endsWith('A') ? textUpper.slice(1, -1) : textUpper.slice(1)
    const hasLeafA = textUpper.endsWith('A')

    return (
      <span className="inline-flex items-baseline text-[#0e3c1e] font-bold">
        {/* Prominent Capital First Letter (D) */}
        <span className="text-[25px] sm:text-[28px] leading-none">{firstChar}</span>

        {/* Middle letters (IVY) */}
        {middleChars && (
          <span className="text-[18px] sm:text-[20.5px] leading-none tracking-[0.02em]">
            {middleChars}
          </span>
        )}

        {/* Letter 'A' with Golden Leaf Accent */}
        {hasLeafA && (
          <span className="relative inline-block text-[18px] sm:text-[20.5px] leading-none">
            A
            <svg
              className="absolute left-1/2 top-[56%] -translate-x-[46%] -translate-y-1/2 w-[78%] h-[42%] pointer-events-none"
              viewBox="0 0 24 14"
              fill="none"
            >
              <path
                d="M1 7.5 C6 1.8 18 1.5 23 6.8 C18 12.8 6 12.2 1 7.5 Z"
                fill="url(#gold-leaf-grad)"
              />
              <defs>
                <linearGradient id="gold-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dfb75c" />
                  <stop offset="50%" stopColor="#c8973a" />
                  <stop offset="100%" stopColor="#a37622" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        )}
      </span>
    )
  }

  // Render SWASTH with prominent initial 'S'
  const renderSwasth = () => {
    const textUpper = (swasth || 'SWASTH').toUpperCase()
    if (!textUpper) return null
    const firstChar = textUpper[0]
    const restChars = textUpper.slice(1)

    return (
      <span className="inline-flex items-baseline text-[#be8a2f] font-bold">
        {/* Prominent Capital First Letter (S) */}
        <span className="text-[25px] sm:text-[28px] leading-none">{firstChar}</span>
        {/* Rest of letters (WASTH) */}
        {restChars && (
          <span className="text-[18px] sm:text-[20.5px] leading-none tracking-[0.02em]">
            {restChars}
          </span>
        )}
      </span>
    )
  }

  return (
    <Link
      to={logoLink}
      className={`group inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}
      aria-label="Divya Swasth home"
    >
      {/* Logo Emblem Icon */}
      <span className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border border-[#c8973a]/50 bg-white shadow-[0_2px_8px_rgba(200,151,58,0.18)] flex items-center justify-center p-0.5 transition duration-300 group-hover:border-[#c8973a] group-hover:scale-105 group-hover:shadow-[0_4px_14px_rgba(200,151,58,0.28)]">
        <img
          src={logoSrc}
          alt={`${divya} ${swasth}`}
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450630/divyaswasth/migrated/1282459c18c7948b-logo.png' }}
        />
      </span>

      {/* Brand Text Details */}
      <span className="brand-logo-text flex flex-col justify-center min-w-0">
        {/* Main Title: DIVYA SWASTH */}
        <span
          className="brand-logo-title flex items-baseline gap-1.5 leading-none tracking-[0.03em]"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
        >
          {renderDivya()}
          {renderSwasth()}
        </span>

        {/* Tagline / Subtitle */}
        <span className="brand-logo-tagline mt-[3px] block text-[5.5px] sm:text-[5.5px] font-semibold uppercase tracking-[0.14em] text-gray-500 whitespace-nowrap leading-none">
          {tagline}
        </span>

        {/* Golden Underline flourish */}
        <span className="mt-[2.5px] block h-[1.5px] w-full max-w-[185px] rounded-full bg-gradient-to-r from-[#be8a2f] via-[#e2b858] to-[#be8a2f]/30 opacity-95" />
      </span>
    </Link>
  )
}

const siteIcons = {}


