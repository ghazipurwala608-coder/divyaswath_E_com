import { useSiteContent } from '../context/SiteContentContext.jsx'
import { Link } from 'react-router-dom'

export default function BrandLogo() {
  const siteContent = useSiteContent('brand-logo', siteIcons)

  return (
    <Link
      to={siteContent.media.to_1}
      className="group flex w-[190px] shrink-0 items-center gap-2.5 sm:w-[230px] sm:gap-3"
      aria-label="Divya Swasth home"
    >
      {/* Logo circle */}
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#c8973a]/40 bg-[#f5f0e8] shadow-sm sm:h-13 sm:w-13">
        <img
          src={siteContent.media.src_2}
          alt=""
          className="absolute -left-[70%] -top-[20%] w-[240%] max-w-none transition duration-300 group-hover:scale-105"
        />
      </span>
      {/* Brand text */}
      <span className="min-w-0">
        <span className="block whitespace-nowrap font-display text-[19px] font-bold leading-none tracking-[-.01em] sm:text-[23px]">
          <span className="text-[#4a7c3f]">{siteContent.text.divya}</span>{' '}
          <span className="text-[#c8973a]">{siteContent.text.swasth}</span>
        </span>
        <span className="mt-1 block whitespace-nowrap text-[5.5px] font-semibold uppercase tracking-[.08em] text-[#5a7a5a]/60 sm:text-[6px]">{siteContent.text.natural_healing_holistic_wellness_healthy_fut}</span>
        {/* Golden underline */}
        <span className="mt-1 block h-[1.5px] w-12 rounded-full bg-gradient-to-r from-[#c8973a] to-transparent" />
      </span>
    </Link>
  )
}

const siteIcons = {  }
