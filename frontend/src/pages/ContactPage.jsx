import { useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  MessageCircle,
  CheckCircle2,
  Headphones,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sprout,
  Truck
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import './ContactPage.css'
import { useNewsletter } from '../hooks/useNewsletter.js'

const topics = [
  'General enquiry',
  'Product question',
  'Order & tracking',
  'Returns & refunds',
  'Wholesale / partnership',
  'Something else'
]

const benefits = [
  [Sprout, 'Natural & Pure', 'Thoughtfully selected herbs and ingredients for your everyday wellness.'],
  [ShieldCheck, 'Quality Assured', 'Care at every step, from our ingredients to your doorstep.'],
  [Truck, 'Pan India Delivery', 'Bringing the goodness of Ayurveda closer to you, across India.'],
  [Headphones, 'Customer First', 'Your wellness matters to us. Our team is always happy to help.']
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: topics[0],
    message: ''
  })
  const [agree, setAgree] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [reference, setReference] = useState(null)
  const [error, setError] = useState('')
  const { subscribe, submitting, subscribed } = useNewsletter('contact')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agree || status === 'sending' || !form.name.trim() || !form.email || !form.message.trim()) return
    setStatus('sending')
    setError('')
    try {
      const result = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          subject: form.topic
        })
      })
      setReference(result?.referenceId || null)
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', topic: topics[0], message: '' })
    } catch (err) {
      setError(err.message || 'Unable to send your message. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div className="contact-reference">
      <section className="contact-banner" aria-labelledby="contact-heading">
        <img src="/images/contact-ayurveda-hero.png" alt="Ayurvedic herbs, amla and a brass mortar beside a green and gold botanical medallion" fetchPriority="high" />
        <div className="contact-reference-inner contact-banner-content"><div>
          <nav aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span>Contact Us</nav>
          <h1 id="contact-heading">CONTACT US</h1>
          <p className="contact-banner-lead">We&apos;re here to help you on your<br />wellness journey.</p>
          <div className="contact-flourish"><span /><Leaf size={15} /><span /></div>
          <p className="contact-banner-description">Have a question, need guidance or want to share your experience?<br />We&apos;d love to hear from you.</p>
        </div></div>
      </section>
      <div className="contact-reference-inner">
        <section className="contact-main" aria-label="Contact our team">
          <div className="contact-reference-card">
            <h2>Send Us a Message</h2>
            {status === 'sent' ? (
              <div className="contact-success" role="status">
                <CheckCircle2 size={46} className="text-[#3b7a48]" />
                <h2 className="font-serif text-2xl font-bold text-[#153b26]">Thank You!</h2>
                <p className="text-sm text-[#546554]">
                  Your message has been received. Our care team will get back to you soon.
                </p>
                {reference && (
                  <p className="text-xs text-[#768274]">
                    Reference ID: <code className="font-mono font-bold text-[#1b3d29]">{reference}</code>
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="contact-submit mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <fieldset disabled={status === 'sending'}>
                  <div className="contact-field-row">
                    <label>
                      Full Name *
                      <input
                        required
                        type="text"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </label>
                    <label>
                      Email Address *
                      <input
                        required
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="contact-field-row">
                    <label>
                      Phone Number (Optional)
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </label>
                    <label>
                      Choose a Topic
                      <select
                        value={form.topic}
                        onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      >
                        {topics.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label>
                    Your Message *
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you today?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </label>

                  <div className="contact-privacy">
                    <input
                      type="checkbox"
                      id="contact-agree"
                      required
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />
                    <label htmlFor="contact-agree" className="cursor-pointer text-[10px]">
                      I agree to the{' '}
                      <Link to="/privacy" className="underline text-[#245b34]">
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link to="/terms" className="underline text-[#245b34]">
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>

                  {error && <p className="contact-error" role="alert">{error}</p>}

                  <button
                    type="submit"
                    disabled={!agree || status === 'sending'}
                    className="contact-submit"
                  >
                    <Send size={14} />
                    {status === 'sending' ? 'Sending Message…' : 'Send Message'}
                  </button>
                </fieldset>
              </form>
            )}

            <p className="contact-private"><ShieldCheck size={13} />Your information is safe with us. We respect your privacy.</p>
          </div>
          <aside className="contact-details">
            <h2>Get in Touch</h2>
            <div className="contact-detail"><span><Phone /></span><div><h3>Call Us</h3><a href="tel:+919747007253">+91 97470 07253</a><p>For product enquiries & order support</p></div></div>
            <div className="contact-detail"><span><Mail /></span><div><h3>Email Us</h3><a href="mailto:divyaswasth@gmail.com">divyaswasth@gmail.com</a><p>We&apos;d love to hear from you</p></div></div>
            <div className="contact-detail"><span><MapPin /></span><div><h3>Our Office</h3><p>Pocket 1, Okhla Phase 1,<br />New Delhi, Delhi 110020,<br />India</p></div></div>
            <div className="contact-detail"><span><MessageCircle /></span><div><h3>WhatsApp Support</h3><a href="https://wa.me/919747007253" target="_blank" rel="noreferrer">+91 97470 07253</a><p>Chat with our customer care team</p></div></div>
          </aside>
        </section>
        <section className="contact-promises" aria-label="Customer support benefits">
          {benefits.map(([Icon, title, text]) => <article key={title}><span><Icon /></span><h2>{title}</h2><p>{text}</p></article>)}
        </section>
        <section className="contact-bottom" aria-label="Frequently asked questions and location">
          <div className="contact-faq"><h2>Frequently Asked Questions</h2><div className="contact-faq-list">
            <details><summary>How can I track my order?<ChevronDown /></summary><p>Visit <Link to="/orders">Track Your Order</Link> and enter your order details to see delivery updates.</p></details>
            <details><summary>How do I choose the right product?<ChevronDown /></summary><p>Explore our <Link to="/shop">products</Link> or contact our team for information about ingredients and product use.</p></details>
            <details><summary>Do you deliver across India?<ChevronDown /></summary><p>We offer delivery across India. See our <Link to="/shipping">shipping policy</Link> for availability and delivery details.</p></details>
            <details><summary>What is your return policy?<ChevronDown /></summary><p>Check our <Link to="/returns">returns and refunds policy</Link> for eligibility and how to request a return.</p></details>
            <details><summary>How can I contact customer support?<ChevronDown /></summary><p>Call +91 97470 07253, email divyaswasth@gmail.com, or use the message form above.</p></details>
          </div><Link className="contact-faq-link" to="/faq">View All FAQs <ArrowRight size={13} /></Link></div>
          <div className="contact-location"><h2>Our Location</h2><div className="contact-map">
            <iframe title="Divya Swasth office location in Okhla, New Delhi" src="https://maps.google.com/maps?q=Pocket%201%2C%20Okhla%20Phase%201%2C%20New%20Delhi%20110020&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="contact-map-card"><h3>Divya Swasth Wellness</h3><p>Pocket 1, Okhla Phase 1,<br />New Delhi, Delhi 110020</p><a href="https://www.google.com/maps/search/?api=1&query=Pocket%201%2C%20Okhla%20Phase%201%2C%20New%20Delhi%20110020" target="_blank" rel="noreferrer">Get Directions <ArrowRight size={12} /></a></div>
          </div></div>
        </section>
      </div>
      <section className="contact-newsletter" aria-label="Newsletter">
        <div className="contact-reference-inner contact-newsletter-inner">
          <span className="contact-newsletter-icon"><Leaf /></span><div className="contact-newsletter-copy"><h2>Stay Connected with Us</h2><p>Get wellness tips, exclusive offers and updates.<br />Join our community and embrace a healthier you.</p></div>
          {subscribed ? <p className="contact-subscribed" role="status"><CheckCircle2 />Thank you for joining our wellness community!</p> : <form onSubmit={subscribe}><div className="contact-newsletter-input"><input type="email" aria-label="Newsletter email address" autoComplete="email" placeholder="Enter your email address" required disabled={submitting} /><button disabled={submitting}>{submitting ? 'Joining...' : 'Subscribe'}<ArrowRight size={14} /></button></div><p><ShieldCheck size={11} />By subscribing, you agree to our <Link to="/privacy">Privacy Policy</Link>.</p></form>}
        </div>
      </section>
    </div>
  )
}
