import { useSiteContent } from '../context/SiteContentContext.jsx'
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const DEFAULT_QUICK_LINKS = [
  ['Home', '/'],
  ['Our Products', '/shop'],
  ['Our Ingredients', '/ingredients'],
  ['Our Certifications', '/certifications'],
  ['Wellness Quiz', '/wellness'],
  ['Blog', '/blog']
]

const DEFAULT_CUSTOMER_CARE = [
  ['Shipping & Delivery', '/shipping'],
  ['Returns & Refunds', '/returns'],
  ['Terms & Conditions', '/terms'],
  ['Privacy Policy', '/privacy']
]

const DEFAULT_CERTIFICATIONS = [
  { name: 'Made in India', image: '/images/certifications/made-in-india.jpg', label: '100% Authentic Ayurvedic' },
  { name: 'GMP Certified', image: '/images/certifications/gmp.jpg', label: 'Good Manufacturing Practice' },
  { name: 'AYUSH Premium', image: '/images/certifications/ayush.jpg', label: 'Ministry of AYUSH Certified' },
  { name: 'FSSAI Certified', image: '/images/certifications/fssai.jpg', label: 'Food Safety Authority of India' },
  { name: 'ISO 9001:2015', image: '/images/certifications/iso.jpg', label: 'Quality Management System' }
]

export default function Footer() {
  const siteContent = useSiteContent('footer', siteIcons)

  const quickLinks = (siteContent?.sections?.QUICK_LINKS || DEFAULT_QUICK_LINKS).filter(([, href]) => href !== '/contact')
  const customerCareLinks = (siteContent?.sections?.CUSTOMER_CARE || DEFAULT_CUSTOMER_CARE).filter(([, href]) => href !== '/faq')
  const certifications = siteContent?.sections?.CERTIFICATIONS || DEFAULT_CERTIFICATIONS

  return (
    <footer className="bg-[#0a1c0e] text-white border-t border-[#1a3822]">
      {/* ── MAIN FOOTER ── */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 pt-8 pb-4 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_1.1fr_1.2fr] lg:gap-6 lg:pt-8 lg:pb-4">

        {/* ── COL 1: Brand ── */}
        <div className="flex flex-col gap-3">
          {/* Logo + Brand Name */}
          <Link to={siteContent.media?.to_1 || '/'} className="group flex items-center gap-3" aria-label="Divya Swasth home">
            <span className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border-2 border-[#c8973a]/70 bg-white shadow-md">
              <img
                src={siteContent.media?.src_2 || '/images/logo.png'}
                alt={siteContent.media?.alt_3 || 'Divya Swasth'}
                className="absolute left-1/2 top-[3%] -translate-x-1/2 w-[165%] max-w-none transition duration-300 group-hover:scale-105"
              />
            </span>
            <div>
              <span className="block font-display text-[22px] font-extrabold leading-none tracking-wide">
                <span className="text-[#8ab96e]">{siteContent.text?.divya || 'DIVYA'}</span>{' '}
                <span className="text-[#c8973a]">{siteContent.text?.swasth || 'SWASTH'}</span>
              </span>
              <span className="mt-1.5 block text-[8px] font-semibold uppercase tracking-[.13em] text-white/55 leading-[1.7]">
                {siteContent.text?.natural_healing || 'Natural Healing'}<br />
                {siteContent.text?.holistic_wellness || 'Holistic Wellness'}<br />
                {siteContent.text?.healthy_future || 'Healthy Future'}
              </span>
            </div>
          </Link>

          {/* Sanskrit tagline */}
          <div className="mt-1">
            <p className="font-display text-[15px] font-bold text-[#c8973a] leading-snug">
              {siteContent.text?.label || 'सर्वे भवन्तु सुखिनः:'}
            </p>
            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[.1em] text-white/45">
              {siteContent.text?.sarve_bhavantu_svastham || 'Sarve Bhavantu Svastham'}
            </p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[.08em] text-white/35">
              {siteContent.text?._may_all_be_healthy || '— May All Be Healthy —'}
            </p>
          </div>

          {/* Social icons */}
          <div className="mt-2 flex items-center gap-2.5">
            {siteContent.sections?.cards4 ? (
              siteContent.sections.cards4.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/[.06] text-white/55 transition hover:border-[#c8973a]/60 hover:bg-[#c8973a]/15 hover:text-[#c8973a]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))
            ) : (
              <>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/[.06] text-white/55 transition hover:border-[#c8973a]/60 hover:bg-[#c8973a]/15 hover:text-[#c8973a]"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/[.06] text-white/55 transition hover:border-[#c8973a]/60 hover:bg-[#c8973a]/15 hover:text-[#c8973a]"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/[.06] text-white/55 transition hover:border-[#c8973a]/60 hover:bg-[#c8973a]/15 hover:text-[#c8973a]"
                >
                  <Youtube className="h-3.5 w-3.5" />
                </a>
              </>
            )}
            {/* WhatsApp */}
            <a
              href="https://wa.me/919747007253"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/[.06] text-white/55 transition hover:border-[#c8973a]/60 hover:bg-[#c8973a]/15 hover:text-[#c8973a]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── COL 2: Quick Links ── */}
        <div>
          <h3 className="text-[14px] font-black uppercase tracking-[.14em] text-[#c8973a]">
            {siteContent.text?.quick_links || 'QUICK LINKS'}
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {quickLinks.map(([label, href]) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-[14px] text-[#9eb59d] transition duration-200 hover:text-[#c8973a] inline-block font-normal"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── COL 3: Customer Care ── */}
        <div>
          <h3 className="text-[14px] font-black uppercase tracking-[.14em] text-[#c8973a]">
            {siteContent.text?.customer_care || 'CUSTOMER CARE'}
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {customerCareLinks.map(([label, href]) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-[14px] text-[#9eb59d] transition duration-200 hover:text-[#c8973a] inline-block font-normal"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── COL 4: Contact Us ── */}
        <div>
          <h3 className="text-[14px] font-black uppercase tracking-[.14em] text-[#c8973a]">
            {siteContent.text?.contact_us || 'CONTACT US'}
          </h3>
          <ul className="mt-4 flex flex-col gap-3.5">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c8973a]" />
              <a href="tel:+919747007253" className="text-[13px] leading-snug text-[#9eb59d] hover:text-[#c8973a] transition">
                +91 97470 07253,<br/>
                +91 92711741619 
              </a><br/>
               
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#c8973a]" />
              <a
                href="mailto:divyaswasth@gmail.com"
                className="text-[13px] leading-snug text-[#9eb59d] transition hover:text-[#c8973a]"
              >
                divyaswasth@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c8973a]" />
              <span className="text-[13px] leading-snug text-[#9eb59d]">
                Pocket 1, Okhla Phase 1,<br />
                New Delhi, Delhi 110020, India
              </span>
            </li>
          </ul>
        </div>

        {/* ── COL 5: Certifications ── */}
        <div>
          <Link to="/certifications" className="group block">
            <h3 className="flex items-center gap-1.5 text-[14px] font-black uppercase tracking-[.14em] text-[#c8973a] transition group-hover:text-[#e8cf8c]">
              {siteContent.text?.certifications || 'CERTIFICATIONS'}
              <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
            </h3>
          </Link>
          <p className="mt-1 text-[11px] text-[#9eb59d] leading-relaxed">
            Certified for highest Ayurvedic purity &amp; safety standards
          </p>
          <div className="mt-3.5 grid grid-cols-3 gap-2 max-w-[270px]">
            {certifications.map((item) => (
              <Link
                to="/certifications"
                key={item.name}
                className="group relative flex flex-col items-center justify-center rounded-[8px] border border-[#d4af37]/35 bg-[#0e2714] p-1.5 shadow-[0_3px_10px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37] hover:shadow-[0_6px_18px_rgba(212,175,55,0.25)]"
                title={`${item.name} · ${item.label} — Click to view details`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[46px] w-[46px] rounded-full object-contain transition duration-300 group-hover:scale-105 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                  loading="lazy"
                />
                <span className="mt-1 block text-center text-[7px] font-bold uppercase tracking-[.03em] text-[#e5ce8e] leading-tight line-clamp-1">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/[.08]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 py-2.5 text-[11px] text-white/50 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Divya Swasth. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-[11px] text-white/60">
            <span>{siteContent.text?.designed_with || 'Designed with'}</span>
            <span className="text-[#c8973a]">💛</span>
            <span>{siteContent.text?.for_a_healthy_future || 'for a Healthy Future'}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

const siteIcons = { Facebook, Instagram, Youtube }
