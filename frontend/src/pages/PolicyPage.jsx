import { useSiteContent } from '../context/SiteContentContext.jsx'
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Headphones, Leaf, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import './PolicyPage.css'

export default function PolicyPage({ type = 'shipping' }) {
  const siteContent = useSiteContent('policy', siteIcons)

  const defaultPolicies = {
    shipping: {
      eyebrow: 'SHIPPING & DELIVERY',
      title: 'From our care to your doorstep.',
      intro: 'Pure Ayurvedic wellness, carefully packaged and securely dispatched across all PIN codes in India.',
      sections: [
        [
          'Delivery areas',
          'We ship to all serviceable PIN codes across India. Every order is dispatched directly from our authentic Ayurvedic facility in tamper-evident packaging.'
        ],
        [
          'Estimated delivery time',
          'Orders are processed within 24-48 hours. Metro cities typically receive deliveries within 2 to 4 business days; other regions within 4 to 6 business days.'
        ],
        [
          'Shipping charges',
          'Enjoy FREE standard shipping on all prepaid orders or orders above ₹499. A nominal convenience fee applies to low-value cash on delivery orders.'
        ],
        [
          'Order tracking',
          'As soon as your parcel is dispatched, a real-time tracking number and live SMS/WhatsApp notification are sent to your registered contact details.'
        ],
        [
          'Delivery issues',
          'If you face any delivery delay or incorrect status update, contact our care team immediately at +91 97470 07253 or divyaswasth@gmail.com.'
        ],
        [
          'Damaged package',
          'If you receive an open or damaged parcel, photograph the outer box and contact us within 48 hours for an instant replacement.'
        ]
      ]
    },
    returns: {
      eyebrow: 'RETURNS & REFUNDS',
      title: 'A fair, safety-first process.',
      intro: 'We strive for 100% satisfaction with our authentic formulations while upholding the highest health and hygiene standards.',
      sections: [
        [
          'Return eligibility',
          'Unopened and sealed products in their original packaging can be returned within 7 days of delivery.'
        ],
        [
          'Opened products',
          'For health and safety compliance, opened or consumed health supplements cannot be returned unless verified as damaged or defective.'
        ],
        [
          'Damaged or incorrect order',
          'If you received a defective or wrong item, report it with unboxing photos/video within 48 hours for an immediate reshipment.'
        ],
        [
          'Refund processing',
          'Approved refunds are credited to the original payment source within 5-7 business days after package inspection.'
        ],
        [
          'Cancellations',
          'Orders can be cancelled before they are packed and handed over to our courier partner.'
        ],
        [
          'Support assistance',
          'For any return assistance, reach out via WhatsApp at +91 97470 07253 or email divyaswasth@gmail.com.'
        ]
      ]
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      title: 'Your information, handled with care.',
      intro: 'We respect your privacy and protect your personal information with 256-bit encryption.',
      sections: [
        [
          'Information collection',
          'We only collect essential details (name, address, email, phone) required to process orders and provide customer support.'
        ],
        [
          'Data protection',
          'Your personal information is never sold or rented to third-party advertisers.'
        ],
        [
          'Payment security',
          'All payment transactions are encrypted and processed through RBI-compliant, secure payment gateways.'
        ],
        [
          'Cookies & browsing',
          'We use cookies strictly to improve your shopping experience and remember cart selections.'
        ],
        [
          'Your rights',
          'You may request access to, correction of, or deletion of your personal account details at any time.'
        ],
        [
          'Contact privacy team',
          'For privacy queries, reach out to our grievance officer at divyaswasth@gmail.com.'
        ]
      ]
    },
    terms: {
      eyebrow: 'TERMS & CONDITIONS',
      title: 'Clear terms for a trustworthy journey.',
      intro: 'These terms outline the rules and guidelines for using the Divya Swasth online storefront.',
      sections: [
        [
          'Use of storefront',
          'By accessing this website, you agree to comply with our terms of service and applicable laws.'
        ],
        [
          'Product availability',
          'All formulations and promotional offers are subject to stock availability.'
        ],
        [
          'Accuracy of information',
          'We strive for accuracy in product descriptions, ingredients, and pricing.'
        ],
        [
          'Intellectual property',
          'All brand trademarks, logos, content, and images belong exclusively to Divya Swasth.'
        ],
        [
          'Limitation of liability',
          'Supplements are designed for holistic wellness and are not intended to replace professional medical advice.'
        ],
        [
          'Governing law',
          'Any disputes arising from purchases are subject to the jurisdiction of the courts of New Delhi, India.'
        ]
      ]
    }
  }

  const policy = siteContent?.sections?.policies?.[type] || defaultPolicies[type] || defaultPolicies.shipping
  const isShipping = type === 'shipping'
  const isPrivacy = type === 'privacy'
  const isTerms = type === 'terms'
  const isReturns = type === 'returns'
  const isEditorial = isPrivacy || isTerms || isReturns
  const highlights = isPrivacy
    ? [[FileText, 'Your information', 'What we collect'], [ShieldCheck, 'How it is used', 'Understand the details'], [Leaf, 'Your preferences', 'Cookies & communication'], [Headphones, 'Here to help', 'Questions & support']]
    : isReturns
      ? [[RotateCcw, 'Return eligibility', 'Understand the policy'], [ShieldCheck, 'Product condition', 'Packaging & safety'], [CheckCircle2, 'Refund process', 'What happens next'], [Headphones, 'Return assistance', 'Speak with our team']]
      : [[FileText, 'Website use', 'Know the essentials'], [ShieldCheck, 'Your account', 'Account responsibilities'], [CheckCircle2, 'Orders & purchases', 'Shopping with clarity'], [Headphones, 'Need a hand?', 'Questions & support']]

  return (
    <div className={`policy-page${isEditorial ? ` policy-editorial ${type}-page` : ''}`}>
      {/* ── HERO ── */}
      <section className="policy-hero">
        {isEditorial && <img className="privacy-hero-image" src={`/images/wellness/${type}-hero.png`} alt="" fetchPriority="high" />}
        <div className="policy-hero-inner">
          <div className="policy-hero-badge">
            {isShipping ? <Truck size={24} /> : type === 'returns' ? <RotateCcw size={24} /> : isPrivacy ? <ShieldCheck size={24} /> : <FileText size={24} />}
          </div>
          <p className="policy-hero-eyebrow">{policy.eyebrow}</p>
          <h1 className="policy-hero-title">{policy.title}</h1>
          <p className="policy-hero-intro">{policy.intro}</p>
          {isEditorial && <a href={`#${type}-details`} className="privacy-read-link">{isPrivacy ? 'Explore our privacy policy' : isReturns ? 'Explore returns & refunds' : 'Explore our terms & conditions'} <ArrowRight size={17} /></a>}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="policy-container">
        {/* Visual Artwork Card (Specifically for Shipping) */}
        {isShipping && (
          <div className="policy-visual-card">
            <div className="policy-visual-wrapper">
              <img
                src="/images/wellness/shipping-hero.jpg"
                alt="Ayurvedic Packaging and Safe Delivery"
                className="policy-visual-img"
              />
              <div className="policy-visual-overlay">
                <div className="policy-visual-text">
                  <span className="policy-visual-tag">
                    <ShieldCheck size={13} />
                    100% Tamper-Evident & Safe Transit
                  </span>
                  <h3>Crafted with Authenticity. Delivered with Care.</h3>
                  <p>Every parcel is packed using eco-friendly protective materials to preserve the potency of fresh herbs.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 4 TRUST HIGHLIGHTS STRIP ── */}
        {isEditorial ? <section className="policy-trust-bar" aria-label={isPrivacy ? 'Privacy topics' : isReturns ? 'Return and refund topics' : 'Terms topics'}>
          {highlights.map(([Icon, title, description]) => <div className="policy-trust-item" key={title}><div className="policy-trust-icon-box"><Icon size={21} /></div><div><h4>{title}</h4><p>{description}</p></div></div>)}
        </section> : <section className="policy-trust-bar">
          <div className="policy-trust-item">
            <div className="policy-trust-icon-box">
              <Truck size={18} />
            </div>
            <div>
              <h4>24-48h Dispatch</h4>
              <p>Fast dispatch from our facility</p>
            </div>
          </div>

          <div className="policy-trust-item">
            <div className="policy-trust-icon-box">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4>Tamper-Proof Box</h4>
              <p>100% sealed & private</p>
            </div>
          </div>

          <div className="policy-trust-item">
            <div className="policy-trust-icon-box">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4>Pan-India Delivery</h4>
              <p>All Indian PIN codes covered</p>
            </div>
          </div>

          <div className="policy-trust-item">
            <div className="policy-trust-icon-box">
              <Headphones size={18} />
            </div>
            <div>
              <h4>Dedicated Care</h4>
              <p>+91 97470 07253</p>
            </div>
          </div>
        </section>}

        {/* ── 6-GRID POLICY CARDS ── */}
        {isEditorial && <div className="privacy-section-heading" id={`${type}-details`}><div><span>{isPrivacy ? 'TRANSPARENCY, AT EVERY STEP' : isReturns ? 'HERE TO HELP, AT EVERY STEP' : 'THE DETAILS THAT MATTER'}</span><h2>{isPrivacy ? 'A little clarity. A lot of care.' : isReturns ? 'Clarity for your next step.' : 'Good experiences start with clarity.'}</h2></div><p>{isPrivacy ? 'Explore how your information is collected, used and managed when you shop with us.' : isReturns ? 'Read about return eligibility, product condition and the refund process before contacting our team.' : 'Find the terms for using our website, managing your account and shopping with Divya Swasth.'}</p></div>}
        <div className="policy-cards-grid">
          {policy.sections.map(([title, text], index) => (
            <article key={title} className="policy-card-item">
              <span className="policy-card-num">0{index + 1}</span>
              <h2 className="policy-card-title">{title}</h2>
              <p className="policy-card-desc">{text}</p>
            </article>
          ))}
        </div>

        {/* ── TRACK ORDER CTA BOX ── */}
        <div className="policy-track-cta">
          <div className="policy-track-cta-left">
            <h3>{isPrivacy ? 'A question about your privacy?' : isTerms ? 'Need a little more clarity?' : isReturns ? 'Need help with a return?' : 'Have an ongoing delivery?'}</h3>
            <p>{isPrivacy ? 'Reach out to our team for help with your personal information or account.' : isTerms ? 'Our team is here to help with questions about these terms, your account or an order.' : isReturns ? 'Share your order ID and the issue with our care team so we can help you with the next steps.' : 'Track your package status in real-time with your Order ID or mobile number.'}</p>
          </div>
          <Link to={isEditorial ? '/contact' : '/orders'} className="policy-track-btn">
            {isEditorial ? 'CONTACT OUR TEAM' : 'TRACK YOUR ORDER'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

const siteIcons = { AlertCircle, FileText, Truck, ShieldCheck, RotateCcw }
