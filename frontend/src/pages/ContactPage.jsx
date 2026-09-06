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

      <section className="relative aspect-[3.45/1] min-h-[115px] overflow-hidden border-b border-[#e5ddca] bg-[#fbf9f4] sm:min-h-[135px]">
        <img src="/images/conac/con image.png" alt="Herbs and botanical ingredients" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1240px] items-center px-[6%] sm:px-[7%] lg:px-[8%]">
          <div className="max-w-[31%]">
            <p className="text-[clamp(4px,.42vw,6px)] font-bold uppercase tracking-[.08em] text-[#4c5b4f]">Home <span className="mx-1 text-[#a8b3ac]">/</span> Contact us</p>
            <h1 className="mt-1 font-display text-[clamp(16px,2.1vw,30px)] font-bold uppercase leading-none text-[#0f3d28]">Contact Us</h1>
            <p className="mt-[clamp(3px,.4vw,6px)] text-[clamp(5px,.55vw,8px)] font-semibold leading-[1.25] text-[#2a3c2e]">We&apos;re here to help you on your<br />wellness journey.</p>
            <div className="my-[clamp(4px,.55vw,8px)] flex max-w-[80%] items-center"><div className="h-px flex-1 bg-[#d8cfae]" /><Leaf className="mx-2 h-[clamp(7px,.7vw,11px)] w-[clamp(7px,.7vw,11px)] text-[#8f6b26]" fill="currentColor" strokeWidth={1} /><div className="h-px flex-1 bg-[#d8cfae]" /></div>
            <p className="text-[clamp(4px,.45vw,7px)] font-medium leading-[1.25] text-[#4c5b4f]">Have a question, suggestion or need support?<br />Our team would love to hear from you.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf7] px-4 py-5 sm:px-8 lg:px-10 lg:py-6">
        <div className="mx-auto grid max-w-[1050px] gap-5 lg:grid-cols-[1.18fr_.82fr]">
          <div className="animate-cardIn border border-[#e1dfd6] bg-white p-3.5 sm:p-4">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-popIn flex h-16 w-16 items-center justify-center rounded-full bg-[#0b271b]">
                  <CheckCircle2 className="h-8 w-8 text-[#d9b45f]" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-xl text-[#1c2e20]">
                  Message received.
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#738078]">
                  Our care team will get back to you shortly. Keep this
                  reference for your records:
                </p>
                <p className="mt-3 rounded-full border border-dashed border-[#d9b45f]/60 bg-[#fbf3de] px-4 py-1.5 font-mono text-xs font-bold text-[#a37622]">
                  {reference}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-sm font-bold text-[#a16e18] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-[15px] font-bold uppercase text-[#193923]">
                  Send us a message
                </h2>
                <p className="mt-1 text-[9px] text-[#738078]">
                  Have a question or need help? Fill out the form below.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={update('name')}
                      required
                      placeholder="Full name"
                      className="w-full rounded-[2px] border border-[#dfe4da] px-3 py-2 text-[10px] outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                    <input
                      value={form.email}
                      onChange={update('email')}
                      required
                      type="email"
                      placeholder="Email address"
                      className="w-full rounded-[2px] border border-[#dfe4da] px-3 py-2 text-[10px] outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="Phone number (optional)"
                      className="w-full rounded-[2px] border border-[#dfe4da] px-3 py-2 text-[10px] outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                    <select
                      value={form.topic}
                      onChange={update('topic')}
                      className="w-full appearance-none rounded-[2px] border border-[#dfe4da] bg-white px-3 py-2 text-[10px] text-[#1c2e20] outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
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
                    rows={4}
                    placeholder="How can we help?"
                    className="w-full resize-none rounded-[2px] border border-[#dfe4da] px-3 py-2 text-[10px] outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                  />

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#064321] px-6 py-2 text-[10px] font-bold text-white transition-all duration-300 hover:bg-[#123526] hover:shadow-[0_10px_24px_rgba(11,39,27,.25)] disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      'Sending…'
                    ) : (
                      <>
                        Send message
                        <Send className="h-3.5 w-3.5" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="animate-cardIn" style={{ animationDelay: '120ms' }}>
            <h2 className="font-display text-[15px] font-bold uppercase text-[#193923]">Get in touch</h2>
            <p className="mt-1 text-[9px] text-[#738078]">We&apos;re always happy to help.</p>
            <div className="mt-4 space-y-3">
              {[
                [Phone, 'Call us', '+91 00000 00000'],
                [Mail, 'Email us', 'hello@divyaswasth.com'],
                [MapPin, 'Visit us', 'New Delhi, India'],
                [Clock, 'Opening hours', 'Mon - Sat, 10:00 AM - 6:00 PM'],
              ].map(([Icon, title, value]) => (
                <div key={title} className="flex items-center gap-3 border-b border-[#ece8dc] pb-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#064321] text-[#e6bd58]"><Icon className="h-3.5 w-3.5" /></span>
                  <div><p className="text-[9px] font-bold uppercase text-[#193923]">{title}</p><p className="mt-0.5 text-[9px] text-[#647066]">{value}</p></div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#e6e0d2] bg-[#fbfaf5] px-4 py-3 sm:px-8">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-4 sm:grid-cols-4">
          {[['Fast response', 'We reply within 24 hours'], ['Quality assured', 'Support you can trust'], ['Expert advice', 'Guidance for your routine'], ['Customer first', 'Here for your wellness']].map(([title, text], index) => {
            const Icon = [Clock, CheckCircle2, Leaf, CheckCircle2][index]
            return <div key={title} className="text-center"><span className="mx-auto grid h-7 w-7 place-items-center rounded-full border border-[#d5bd78] text-[#a27622]"><Icon className="h-3.5 w-3.5" /></span><h3 className="mt-2 text-[8px] font-black uppercase text-[#193923]">{title}</h3><p className="mt-1 text-[8px] text-[#68736a]">{text}</p></div>
          })}
        </div>
      </section>

      <section className="bg-[#fffdf7] px-4 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1050px] gap-5 md:grid-cols-2">
          <div><h2 className="font-display text-[15px] font-bold uppercase text-[#193923]">Frequently asked questions</h2><div className="mt-3 divide-y divide-[#e4e0d4] border-y border-[#e4e0d4]">{['How quickly will I receive a response?', 'Can I track my order?', 'Which product is right for me?', 'How can I return an item?'].map((question) => <details key={question} className="group py-2"><summary className="flex cursor-pointer list-none justify-between text-[9px] font-bold text-[#405044]">{question}<span className="text-[#a27622]">+</span></summary><p className="mt-1 text-[8px] leading-4 text-[#778178]">Our care team will guide you with the latest verified information.</p></details>)}</div></div>
          <div><h2 className="font-display text-[15px] font-bold uppercase text-[#193923]">Our location</h2><div className="relative mt-3 h-[125px] overflow-hidden border border-[#dcd8cb] bg-[#e4eadf]"><div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(25deg, transparent 46%, #a9bca4 47%, #a9bca4 49%, transparent 50%), linear-gradient(115deg, transparent 46%, #b9c9b4 47%, #b9c9b4 49%, transparent 50%)', backgroundSize: '75px 55px' }} /><div className="absolute left-[54%] top-[42%] grid h-7 w-7 place-items-center rounded-full bg-[#064321] text-[#e6bd58] shadow-lg"><MapPin className="h-4 w-4" /></div><div className="absolute bottom-3 left-3 bg-white/90 px-3 py-2"><p className="text-[9px] font-bold text-[#193923]">Divya Swasth Wellness</p><p className="text-[8px] text-[#69766c]">New Delhi, India</p></div></div></div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#003c23] px-4 py-3 text-white sm:px-8"><img src="/images/ingredients/hero intge.png" alt="Botanical ingredients" className="absolute inset-0 h-full w-full object-cover object-[28%_center] opacity-35" /><div className="relative mx-auto flex max-w-[1050px] flex-col items-center justify-between gap-2 sm:flex-row"><div><h2 className="font-display text-[13px] font-bold uppercase text-[#e4bd58]">Stay connected with us</h2><p className="mt-1 text-[8px] text-white/75">Follow our wellness journey and get helpful updates.</p></div><Link to="/shop" className="inline-flex items-center gap-2 rounded-[2px] bg-[#d7a944] px-4 py-1.5 text-[8px] font-black uppercase text-[#173921]">Explore products <Send className="h-3 w-3" /></Link></div></section>
    </div>
  )
}
