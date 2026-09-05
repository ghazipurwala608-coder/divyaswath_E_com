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

const contactMethods = [
  {
    icon: Phone,
    label: 'Mobile / WhatsApp',
  },
  {
    icon: Mail,
    label: 'Support email',
  },
  {
    icon: MapPin,
    label: 'Registered address',
  },
  {
    icon: Clock,
    label: 'Support hours',
  },
]

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

// Small dashed "pending" stamp — echoes the same provisional-record
// language used across the site instead of inventing a new motif.
function PendingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d9b45f]/70 bg-[#fbf3de] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a37622]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#d9b45f]" />
      Pending official verification
    </span>
  )
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0b271b] px-4 py-20 text-center text-white">
        <FloatingLeaves />
        <div className="relative mx-auto max-w-2xl animate-fadeUp">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#dfba65]">
            We're here to help
          </p>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl">
            Talk to our care team.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/60">
            Questions about a product, an order or your daily routine? Send
            us a message through the secure form.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[380px_1fr]">
          {/* Left — contact methods */}
          <div className="space-y-4">
            {contactMethods.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className="animate-cardIn group flex items-start gap-4 rounded-2xl border border-[#e0e4da] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d9b45f]/50 hover:shadow-[0_10px_28px_rgba(28,55,36,.08)]"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e4d4a8] bg-[#fbf3de] text-[#a37622] transition-colors group-hover:bg-[#0b271b] group-hover:text-[#d9b45f]">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#526158]">
                    {label}
                  </p>
                  <div className="mt-2">
                    <PendingBadge />
                  </div>
                </div>
              </div>
            ))}

            <div className="animate-cardIn rounded-2xl border border-[#eddca3] bg-[#fdf6e3] p-5 text-xs leading-6 text-[#8a6b1f]" style={{ animationDelay: '380ms' }}>
              Official contact details and response times will be added only
              after the business locations (from the placeholder address or
              social account) is published.
            </div>
          </div>

          {/* Right — form */}
          <div className="animate-cardIn rounded-[1.75rem] border border-[#e0e4da] bg-white p-6 sm:p-8" style={{ animationDelay: '160ms' }}>
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="animate-popIn flex h-16 w-16 items-center justify-center rounded-full bg-[#0b271b]">
                  <CheckCircle2 className="h-8 w-8 text-[#d9b45f]" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-[#1c2e20]">
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
                <h2 className="font-serif text-2xl text-[#1c2e20]">
                  Send us a message
                </h2>
                <p className="mt-1.5 text-xs text-[#738078]">
                  Your enquiry is saved through the website API with a
                  reference ID.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={update('name')}
                      required
                      placeholder="Full name"
                      className="w-full rounded-xl border border-[#dfe4da] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                    <input
                      value={form.email}
                      onChange={update('email')}
                      required
                      type="email"
                      placeholder="Email address"
                      className="w-full rounded-xl border border-[#dfe4da] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="Phone number (optional)"
                      className="w-full rounded-xl border border-[#dfe4da] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                    />
                    <select
                      value={form.topic}
                      onChange={update('topic')}
                      className="w-full appearance-none rounded-xl border border-[#dfe4da] bg-white px-4 py-3 text-sm text-[#1c2e20] outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
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
                    rows={6}
                    placeholder="How can we help?"
                    className="w-full resize-none rounded-xl border border-[#dfe4da] px-4 py-3 text-sm outline-none transition-colors focus:border-[#b58529] focus:ring-2 focus:ring-[#d9b45f]/20"
                  />

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0b271b] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#123526] hover:shadow-[0_10px_24px_rgba(11,39,27,.25)] disabled:opacity-60"
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
        </div>
      </section>
    </div>
  )
}

function FloatingLeaves() {
  const leaf = (
    <path
      d="M2 20C2 8 14 2 30 2c2 18-8 30-20 30C6 32 2 26 2 20Z"
      stroke="#d9b45f"
      strokeWidth="1.2"
    />
  )
  return (
    <>
      <svg className="absolute left-[8%] top-10 h-14 w-14 animate-floatSlow opacity-15" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
      <svg className="absolute right-[10%] top-16 h-9 w-9 animate-floatSlower opacity-15" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
      <svg className="absolute bottom-6 left-[22%] h-7 w-7 animate-floatSlow opacity-10" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
      <svg className="absolute bottom-10 right-[20%] h-8 w-8 animate-floatSlower opacity-10" viewBox="0 0 40 40" fill="none" aria-hidden="true">{leaf}</svg>
    </>
  )
}