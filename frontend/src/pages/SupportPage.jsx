import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  CreditCard,
  FlaskConical,
  Headphones,
  Heart,
  Leaf,
  LockKeyhole,
  Mail,
  MessageCircle,
  PackageCheck,
  Phone,
  RotateCw,
  Search,
  ShieldCheck,
  Sprout,
  Truck,
  UserRound
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import './SupportPage.css'

const supportTopics = [
  {
    Icon: PackageCheck,
    title: 'ORDERS & TRACKING',
    text: 'Track your order, check status and delivery information.',
    path: '/orders',
    keywords: 'order tracking shipment status where is my package'
  },
  {
    Icon: RotateCw,
    title: 'RETURNS & REFUNDS',
    text: 'Know our return policy and request a refund.',
    path: '/returns',
    keywords: 'returns refunds replace cancel policy money back'
  },
  {
    Icon: Truck,
    title: 'SHIPPING & DELIVERY',
    text: 'Delivery timelines, shipping charges and locations.',
    path: '/shipping',
    keywords: 'shipping delivery time charges fee locations courier'
  },
  {
    Icon: CreditCard,
    title: 'PAYMENTS & BILLING',
    text: 'Payment methods, failed payments and billing related queries.',
    path: '/faq',
    keywords: 'payments billing upi card paytm cod failed transaction'
  },
  {
    Icon: Sprout,
    title: 'PRODUCTS & USAGE',
    text: 'How to use our products for best results.',
    path: '/ingredients',
    keywords: 'how to use dosage capsules timing ingredients results'
  },
  {
    Icon: Leaf,
    title: 'INGREDIENTS & SAFETY',
    text: 'Learn about our ingredients, certifications and safety.',
    path: '/ingredients',
    keywords: 'botanicals herbs ayurvedic natural safe certified gmp'
  },
  {
    Icon: UserRound,
    title: 'MY ACCOUNT',
    text: 'Manage your account, address and personal details.',
    path: '/account',
    keywords: 'login register profile password edit address account'
  },
  {
    Icon: ShieldCheck,
    title: 'PRIVACY & POLICIES',
    text: 'Read our policies, terms and important information.',
    path: '/privacy',
    keywords: 'privacy terms disclaimer safety policy legal'
  }
]

const popularSearches = [
  'Track Order',
  'Returns & Refunds',
  'Shipping',
  'Product Usage',
  'Payment',
  'Account'
]

export default function SupportPage() {
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  const filteredTopics = supportTopics.filter((topic) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      topic.title.toLowerCase().includes(term) ||
      topic.text.toLowerCase().includes(term) ||
      topic.keywords.toLowerCase().includes(term)
    )
  })

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchTerm(query.trim())
  }

  const handleTagClick = (tag) => {
    setQuery(tag)
    setSearchTerm(tag)
  }

  const handleNewsletter = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setSubscribing(true)
    try {
      await apiRequest('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: newsletterEmail, consent: true, source: 'support' })
      })
      toast.success('Thank you for subscribing to wellness updates!')
      setNewsletterEmail('')
    } catch (err) {
      toast.error(err.message || 'Subscription failed. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <div className="support-page-wrapper">
      {/* ── HERO SECTION ── */}
      <section className="support-hero-section">
        <div className="support-hero-content">
          <span className="support-kicker-label">SUPPORT CENTER</span>
          <h1>
            We&apos;re Here to
            <br />
            <span>Help You</span>
          </h1>
          <div className="support-hero-flourish">
            <span />
            <Leaf size={14} />
            <span />
          </div>
          <p className="support-hero-subtext">
            Your wellness is our priority.
            <br />
            Get quick answers or connect with our support team.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="support-main-content">
        {/* ── SEARCH CARD ── */}
        <section className="support-search-card">
          <h2>How can we help you today?</h2>
          <form className="support-search-form" onSubmit={handleSearchSubmit}>
            <Search size={18} className="support-search-icon" />
            <input
              type="text"
              className="support-search-input"
              placeholder="Search for help (e.g. order, returns, delivery, products...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="support-search-btn">
              SEARCH
            </button>
          </form>

          <div className="support-popular-tags">
            <strong>Popular Searches:</strong>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                type="button"
                className="support-tag-btn"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* ── SUPPORT TOPICS (8 CARDS) ── */}
        <section aria-labelledby="support-topics-heading">
          <div className="support-section-divider-title">
            <span />
            <h2 id="support-topics-heading">SUPPORT TOPICS</h2>
            <span />
          </div>

          {searchTerm && (
            <p className="text-center text-xs text-[#526353] mb-4">
              Showing results for &ldquo;<b>{searchTerm}</b>&rdquo; —{' '}
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSearchTerm('')
                }}
                className="text-[#b8862b] underline font-bold"
              >
                Clear filter
              </button>
            </p>
          )}

          <div className="support-topics-8grid">
            {filteredTopics.map(({ Icon, title, text, path }) => (
              <Link key={title} to={path} className="support-topic-box">
                <div className="support-topic-icon-wrap">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="support-topic-link-text">
                  Learn More <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>

          {!filteredTopics.length && (
            <div className="text-center py-10 bg-white rounded-xl border border-[#e8e2d4] mt-4">
              <p className="text-sm font-semibold text-[#183a27]">
                No matching support topics found for &ldquo;{searchTerm}&rdquo;.
              </p>
              <Link to="/contact" className="mt-3 inline-block text-xs font-bold text-[#b8862b] underline">
                Contact our customer care team directly
              </Link>
            </div>
          )}
        </section>

        {/* ── STILL NEED HELP? REACH OUT TO US (4 CHANNELS) ── */}
        <section aria-labelledby="reach-out-heading">
          <div className="support-section-divider-title">
            <span />
            <h2 id="reach-out-heading">Still need help? Reach out to us</h2>
            <span />
          </div>

          <div className="support-contact-4grid">
            {/* CHANNEL 1: WHATSAPP */}
            <div className="support-channel-card">
              <div className="channel-icon-wrap channel-icon-whatsapp">
                <MessageCircle size={22} />
              </div>
              <h3>WHATSAPP SUPPORT</h3>
              <p className="channel-detail">+91 97470 07253</p>
              <p className="channel-time">Mon - Sat: 9:00 AM - 6:00 PM</p>
              <a
                href="https://wa.me/919747007253"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-btn-solid-green"
              >
                <MessageCircle size={14} />
                CHAT ON WHATSAPP
              </a>
            </div>

            {/* CHANNEL 2: EMAIL */}
            <div className="support-channel-card">
              <div className="channel-icon-wrap channel-icon-mail">
                <Mail size={22} />
              </div>
              <h3>EMAIL SUPPORT</h3>
              <p className="channel-detail">divyaswasth@gmail.com</p>
              <p className="channel-time">We reply within 24 hours</p>
              <a href="mailto:divyaswasth@gmail.com" className="channel-btn-outline-green">
                <Mail size={14} />
                SEND AN EMAIL
              </a>
            </div>

            {/* CHANNEL 3: CALL US */}
            <div className="support-channel-card">
              <div className="channel-icon-wrap channel-icon-phone">
                <Phone size={22} />
              </div>
              <h3>CALL US</h3>
              <p className="channel-detail">+91 97470 07253</p>
              <p className="channel-time">Mon - Sat: 9:00 AM - 6:00 PM</p>
              <a href="tel:+919747007253" className="channel-btn-outline-green">
                <Phone size={14} />
                CALL NOW
              </a>
            </div>

            {/* CHANNEL 4: CONTACT FORM */}
            <div className="support-channel-card">
              <div className="channel-icon-wrap channel-icon-form">
                <Headphones size={22} />
              </div>
              <h3>CONTACT FORM</h3>
              <p className="channel-detail">Online Query</p>
              <p className="channel-time">Fill a form and our team will get back to you.</p>
              <Link to="/contact" className="channel-btn-solid-green">
                <Headphones size={14} />
                FILL CONTACT FORM
              </Link>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES STRIP ── */}
        <section className="support-trust-strip">
          <div className="support-trust-item">
            <Leaf size={26} />
            <div className="support-trust-text">
              <strong>100% Natural</strong>
              <small>Only pure &amp; natural ingredients.</small>
            </div>
          </div>
          <div className="support-trust-item">
            <ShieldCheck size={26} />
            <div className="support-trust-text">
              <strong>GMP Certified</strong>
              <small>Manufactured in GMP certified facilities.</small>
            </div>
          </div>
          <div className="support-trust-item">
            <FlaskConical size={26} />
            <div className="support-trust-text">
              <strong>Safe &amp; Effective</strong>
              <small>Backed by science &amp; Ayurvedic wisdom.</small>
            </div>
          </div>
          <div className="support-trust-item">
            <Heart size={26} />
            <div className="support-trust-text">
              <strong>Customer First</strong>
              <small>Your satisfaction is our top priority.</small>
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER BANNER STRIP ── */}
        <section className="support-newsletter-strip">
          <div className="newsletter-left">
            <div className="newsletter-icon-circle">
              <Mail size={22} />
            </div>
            <div className="newsletter-text">
              <strong>STAY CONNECTED WITH WELLNESS</strong>
              <p>Subscribe to our newsletter for health tips, exclusive offers &amp; product updates.</p>
            </div>
          </div>

          <div className="newsletter-form-wrap">
            <form className="newsletter-input-group" onSubmit={handleNewsletter}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={subscribing}
                className="newsletter-submit-btn"
              >
                {subscribing ? 'JOINING…' : 'SUBSCRIBE'}
              </button>
            </form>
            <span className="newsletter-privacy-note">
              <LockKeyhole size={10} />
              We respect your privacy. Unsubscribe anytime.
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
