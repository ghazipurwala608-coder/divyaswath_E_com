import { Facebook, Heart, Instagram, Mail, MapPin, Phone,  Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  ['Home', '/'],
  ['Our Products', '/shop'],
  ['Our Ingredients', '/ingredients'],
  ['Wellness Quiz', '/wellness'],
  ['Blog', '/blog'],
  ['Contact Us', '/contact'],
]

const CUSTOMER_CARE = [
  ['FAQs', '/faq'],
  ['Shipping & Delivery', '/shipping'],
  ['Returns & Refunds', '/returns'],
  ['Terms & Conditions', '/terms'],
  ['Privacy Policy', '/privacy'],
]

const PAYMENT_METHODS = [
  { name: 'Visa', image: '/images/payments/visa.svg' },
  { name: 'Mastercard', image: '/images/payments/mastercard.svg' },
  { name: 'RuPay', image: '/images/payments/rupay.svg' },
  { name: 'UPI', image: '/images/payments/upi.svg' },
  { name: 'Paytm', image: '/images/payments/paytm.svg' },
  { name: 'Google Pay', image: '/images/payments/google-pay.svg' },
  { name: 'PhonePe', image: '/images/payments/phonepe.svg' },
  { name: 'Net Banking', image: '/images/payments/net-banking.svg' },
]


export default function Footer() {
  return (
    <footer className="bg-[#0d1f11] text-white">
      {/* ── MAIN FOOTER ── */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.1fr_1.1fr_1.55fr] lg:gap-5 lg:py-8">

        {/* ── COL 1: Brand ── */}
        <div className="flex flex-col gap-3">
          {/* Logo + Brand Name */}
          <Link to="/" className="group flex items-center gap-3" aria-label="Divya Swasth home">
            <span className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border-2 border-[#c8973a]/60 bg-[#0d1f11]">
              <img
                src="/images/divyaswasth.png"
                alt="Divya Swasth"
                className="absolute -left-[19px] -top-[2px] w-[90px] max-w-none transition duration-300 group-hover:scale-105"
              />
            </span>
            <div>
              <span className="block font-display text-[22px] font-extrabold leading-none tracking-wide">
                <span className="text-[#8ab96e]">DIVYA</span>{' '}
                <span className="text-[#c8973a]">SWASTH</span>
              </span>
              <span className="mt-1.5 block text-[8px] font-semibold uppercase tracking-[.13em] text-white/55 leading-[1.7]">
                Natural Healing<br />Holistic Wellness<br />Healthy Future
              </span>
            </div>
          </Link>

          {/* Sanskrit tagline */}
          <div className="mt-1">
            <p className="font-display text-[15px] font-bold text-[#c8973a] leading-snug">
              सर्वे भवन्तु सुखिनः:
            </p>
            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[.1em] text-white/45">
              Sarve Bhavantu Svastham
            </p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[.08em] text-white/35">
              — May All Be Healthy —
            </p>
          </div>

          {/* Social icons */}
          <div className="mt-2 flex items-center gap-2.5">
            {[
              { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
              { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
              { href: 'https://youtube.com', label: 'YouTube', Icon: Youtube },
            ].map(({ href, label, Icon }) => (
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
            ))}
            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210"
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
            Quick Links
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {QUICK_LINKS.map(([label, href]) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-[14px] text-white/60 transition duration-200 hover:text-[#c8973a] inline-block"
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
            Customer Care
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {CUSTOMER_CARE.map(([label, href]) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-[14px] text-white/60 transition duration-200 hover:text-[#c8973a] inline-block"
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
            Contact Us
          </h3>
          <ul className="mt-4 flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c8973a]" />
              <span className="text-[14px] leading-snug text-white/65">+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#c8973a]" />
              <a
                href="mailto:care@divyaswasth.com"
                className="text-[14px] leading-snug text-white/65 transition hover:text-[#c8973a]"
              >
                care@divyaswasth.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c8973a]" />
              <span className="text-[14px] leading-snug text-white/65">
                Saketri, Panchkula,<br />Haryana 134114, India
              </span>
            </li>
          </ul>
        </div>

        {/* ── COL 5: We Accept ── */}
        <div>
          <h3 className="text-[14px] font-black uppercase tracking-[.14em] text-[#c8973a]">
            We Accept
          </h3>
          <div className="mt-4 grid grid-cols-4 gap-2.5" aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map(({ name, image }) => (
              <div key={name} className="flex h-[50px] min-w-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white px-2 py-1.5 shadow-sm">
                <img
                  src={image}
                  alt={name}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-white/45">
            Designed with
            <Heart className="h-3.5 w-3.5 fill-[#d6a63f] text-[#d6a63f]" aria-hidden="true" />
            for a Healthy Future
          </p>
        </div>
      </div>

    

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/[.08]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-center px-6 py-3 text-[10px] text-white/30 sm:px-8">
          <p>© {new Date().getFullYear()} Divya Swasth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
