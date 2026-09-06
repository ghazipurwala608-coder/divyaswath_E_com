import { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Leaf,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const topics = [
  'Choose a topic',
  'Product question',
  'Order & tracking',
  'Returns & refunds',
  'Wholesale / partnership',
  'Something else',
]

function refId() {
  return 'REF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: topics[0],
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [reference, setReference] = useState(null)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      // TODO: replace with your real API call, e.g.
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })
      await new Promise((r) => setTimeout(r, 900))
      setReference(refId())
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', topic: topics[0], message: '' })
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div>
      <style>{`
        @keyframes floatY { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes popIn { from { opacity: 0; transform: scale(.7) } to { opacity: 1; transform: scale(1) } }
        .animate-fadeUp { animation: fadeUp .7s ease both }
        .animate-cardIn { animation: cardIn .5s cubic-bezier(.22,.61,.36,1) both }
        .animate-floatSlow { animation: floatY 7s ease-in-out infinite }
        .animate-floatSlower { animation: floatY 9s ease-in-out infinite }
        .animate-popIn { animation: popIn .4s cubic-bezier(.34,1.56,.64,1) both }
      `}</style>

      <section className="relative min-h-[300px] overflow-hidden border-b border-[#e5ddca] bg-[#fbf9f4] py-16 sm:min-h-[350px] sm:py-28 lg:min-h-[350px]">
        <img src="/images/conac/con image.png" alt="Herbs and botanical ingredients" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1240px] items-center px-[6%] sm:px-[7%] lg:px-[8%]">
          <div className="max-w-[55%] lg:max-w-[650px]">
            <p className="text-xs font-bold uppercase tracking-[.1em] text-[#4c5b4f] sm:text-sm lg:text-base">Home <span className="mx-1.5 text-[#a8b3ac]">/</span> Contact us</p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-none tracking-tight text-[#0f3d28] sm:text-6xl lg:text-[80px]">Contact Us</h1>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-[#2a3c2e] sm:text-xl lg:text-2xl">We&apos;re here to help you on your<br />wellness journey.</p>
            <div className="my-8 flex max-w-[75%] items-center"><div className="h-px flex-1 bg-[#d8cfae]" /><Leaf className="mx-4 h-5 w-5 text-[#8f6b26] sm:h-6 sm:w-6" fill="currentColor" strokeWidth={1} /><div className="h-px flex-1 bg-[#d8cfae]" /></div>
            <p className="text-sm font-medium leading-relaxed text-[#4c5b4f] sm:text-base lg:text-lg">Have a question, suggestion or need support?<br />Our team would love to hear from you.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf7] px-4 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:gap-16">
          <div className="animate-cardIn rounded-sm border border-[#e1dfd6] bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-popIn flex h-16 w-16 items-center justify-center rounded-full bg-[#0b271b]">
                  <CheckCircle2 className="h-8 w-8 text-[#d9b45f]" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-[#1c2e20]">
                  Message received.
                </h3>
                <p className="mt-2 max-w-sm text-base leading-6 text-[#738078]">
                  Our care team will get back to you shortly. Keep this
                  reference for your records:
                </p>
                <p className="mt-4 rounded-full border border-dashed border-[#d9b45f]/60 bg-[#fbf3de] px-5 py-2 font-mono text-sm font-bold text-[#a37622]">
                  {reference}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-base font-bold text-[#a16e18] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#193923]">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-[#738078]">
                  Have a question or need help? Fill out the form below.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={update('name')}
                      required
                      placeholder="Full name"
                      className="w-full rounded-sm border border-[#dfe4da] bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:bg-white focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                    <input
                      value={form.email}
                      onChange={update('email')}
                      required
                      type="email"
                      placeholder="Email address"
                      className="w-full rounded-sm border border-[#dfe4da] bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:bg-white focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="Phone number (optional)"
                      className="w-full rounded-sm border border-[#dfe4da] bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:bg-white focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                    <select
                      value={form.topic}
                      onChange={update('topic')}
                      className="w-full appearance-none rounded-sm border border-[#dfe4da] bg-[#fdfdfc] px-4 py-3 text-sm text-[#1c2e20] outline-none transition-colors focus:border-[#b58529] focus:bg-white focus:ring-2 focus:ring-[#d9b45f]/20"
                    >
                      {topics.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={form.message}
                    onChange={update('message')}
                    required
                    rows={5}
                    placeholder="How can we help?"
                    className="w-full resize-none rounded-sm border border-[#dfe4da] bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:bg-white focus:ring-2 focus:ring-[#d9b45f]/20"
                  />

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-[#0b3c26] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#123526] hover:shadow-[0_8px_20px_rgba(11,39,27,.2)] disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      'Sending…'
                    ) : (
                      <>
                        Send message
                        <Send className="h-4 w-4" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="animate-cardIn pt-4 lg:pt-8" style={{ animationDelay: '120ms' }}>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#193923]">Get in touch</h2>
            <p className="mt-2 text-sm text-[#738078]">We&apos;re always happy to help.</p>
            <div className="mt-8 space-y-5">
              {[
                [Phone, 'Call us', '+91 00000 00000'],
                [Mail, 'Email us', 'hello@divyaswasth.com'],
                [MapPin, 'Visit us', 'New Delhi, India'],
                [Clock, 'Opening hours', 'Mon - Sat, 10:00 AM - 6:00 PM'],
              ].map(([Icon, title, value]) => (
                <div key={title} className="flex items-start gap-4 border-b border-[#ece8dc] pb-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0b3c26] text-[#e6bd58]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-[#193923]">{title}</p>
                    <p className="mt-1 text-sm text-[#647066]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#e6e0d2] bg-[#fbfaf5] px-4 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-8 sm:grid-cols-4">
          {[['Fast response', 'We reply within 24 hours'], ['Quality assured', 'Support you can trust'], ['Expert advice', 'Guidance for your routine'], ['Customer first', 'Here for your wellness']].map(([title, text], index) => {
            const Icon = [Clock, CheckCircle2, Leaf, CheckCircle2][index]
            return (
              <div key={title} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-[#d5bd78] text-[#a27622]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-[#193923]">{title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#68736a]">{text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-[#fffdf7] px-4 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#193923]">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-[#e4e0d4] border-y border-[#e4e0d4]">
              {['How quickly will I receive a response?', 'Can I track my order?', 'Which product is right for me?', 'How can I return an item?'].map((question) => (
                <details key={question} className="group py-4">
                  <summary className="flex cursor-pointer list-none justify-between text-sm sm:text-base font-bold text-[#405044]">
                    {question}<span className="text-[#a27622] group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#778178]">
                    Our care team will guide you with the latest verified information.
                  </p>
                </details>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#193923]">Our location</h2>
            <div className="relative mt-6 min-h-[260px] overflow-hidden rounded-sm border border-[#dcd8cb] bg-[#e4eadf]">
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(25deg, transparent 46%, #a9bca4 47%, #a9bca4 49%, transparent 50%), linear-gradient(115deg, transparent 46%, #b9c9b4 47%, #b9c9b4 49%, transparent 50%)', backgroundSize: '75px 55px' }} />
              <div className="absolute left-[54%] top-[42%] grid h-10 w-10 place-items-center rounded-full bg-[#0b3c26] text-[#e6bd58] shadow-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="absolute bottom-5 left-5 rounded-sm bg-white/95 px-5 py-4 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-[#193923]">Divya Swasth Wellness</p>
                <p className="mt-1 text-sm text-[#69766c]">New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#003c23] px-4 py-3 text-white sm:px-8"><img src="/images/ingredients/hero intge.png" alt="Botanical ingredients" className="absolute inset-0 h-full w-full object-cover object-[28%_center] opacity-35" /><div className="relative mx-auto flex max-w-[1050px] flex-col items-center justify-between gap-2 sm:flex-row"><div><h2 className="font-display text-[13px] font-bold uppercase text-[#e4bd58]">Stay connected with us</h2><p className="mt-1 text-[8px] text-white/75">Follow our wellness journey and get helpful updates.</p></div><Link to="/shop" className="inline-flex items-center gap-2 rounded-[2px] bg-[#d7a944] px-4 py-1.5 text-[8px] font-black uppercase text-[#173921]">Explore products <Send className="h-3 w-3" /></Link></div></section>
    </div>
  )
}
