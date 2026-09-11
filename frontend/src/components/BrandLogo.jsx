import { useSiteContent } from '../context/SiteContentContext.jsx'
import { Link } from 'react-router-dom'

export default function BrandLogo() {
  const siteContent = useSiteContent('brand-logo', siteIcons)

  return (
    <Link
      to={siteContent.media.to_1 || '/'}
      className="group flex w-auto shrink-0 items-center gap-2.5 sm:gap-3"
      aria-label="Divya Swasth home"
    >
      {/* Logo circle */}
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#c8973a]/50 bg-white shadow-sm sm:h-12 sm:w-12">
        <img
          src={siteContent.media?.src_2 || '/images/logo.png'}
          alt="Divya Swasth"
          className="absolute left-1/2 top-[3%] -translate-x-1/2 w-[165%] max-w-none transition duration-300 group-hover:scale-105"
        />
      </span>
      {/* Brand text */}
      <span className="min-w-0">
        <svg
          viewBox="94 230 414 60"
          role="img"
          aria-label="Divya Swasth"
          className="block h-auto w-[190px] overflow-hidden sm:w-[230px]"
        >
          <image href="/images/logo.png" width="598" height="453" />
        </svg>
        <span className="mt-1 block whitespace-nowrap text-[5.5px] font-semibold uppercase tracking-[.08em] text-[#5a7a5a]/70 sm:text-[6.5px]">{siteContent.text.natural_healing_holistic_wellness_healthy_fut}</span>
        {/* Golden underline */}
        <span className="mt-1 block h-[1.5px] w-12 rounded-full bg-gradient-to-r from-[#c8973a] to-transparent" />
      </span>
    </Link>
  )
}

const siteIcons = {  }
