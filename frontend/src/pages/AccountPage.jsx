import {
  ArrowRight,
  BadgeCheck,
  Box,
  ChevronRight,
  Headphones,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { statusTone } from '../data/orderTracking.js'

const quickLinks = [
  [ShoppingBag, 'Explore wellness', 'Browse all products', '/shop'],
  [Headphones, 'Need some help?', 'Talk to our care team', '/contact'],
  [ShieldCheck, 'Shipping & returns', 'Read our store policies', '/shipping'],
]

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/orders/my')
      .then(({ orders: fetched }) => setOrders(fetched))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const firstName = user.name.split(' ')[0]
  const initials = user.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + order.totalPrice, 0), [orders])
  const signOut = () => { logout(); navigate('/') }

  return (
    <section className="min-h-[calc(100svh-76px)] bg-[#f5f2e9]">
      <div className="grain relative overflow-hidden bg-[#092419] px-4 pb-20 pt-10 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
        <img src="/images/botanical-hero-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-[.16]" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,#071d14_0%,rgba(7,29,20,.96)_48%,rgba(7,29,20,.7)_100%)]" />
        <div className="animate-soft-pulse absolute -right-20 -top-32 h-96 w-96 rounded-full border border-[#d5ad51]/20" />
        <div className="absolute right-[13%] top-12 h-32 w-32 rounded-full bg-[#d4a742]/10 blur-3xl" />
        <HeartPulse className="animate-drift absolute bottom-7 right-[8%] h-28 w-28 text-white/[.035]" strokeWidth={0.7} aria-hidden="true" />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div className="animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dab45b]/25 bg-[#d4a848]/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[.2em] text-[#e5c36f] backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> Your wellness space
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,5vw,4.4rem)] leading-none tracking-[-.025em] text-[#fff6df]">Namaste, {firstName}.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Everything for your wellness journey—orders, account details and secure access—in one thoughtful space.</p>
          </div>
          <button type="button" onClick={signOut} className="group flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-5 py-3 text-[9px] font-black uppercase tracking-[.13em] text-white/65 backdrop-blur-md transition hover:border-[#ddba69]/40 hover:bg-[#ddba69]/10 hover:text-[#f0ce7e]">
            <LogOut className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /> Sign out
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <SummaryCard icon={Box} label="Total orders" value={loading ? '—' : orders.length.toString()} />
          <SummaryCard icon={ShoppingBag} label="Total spent" value={loading ? '—' : `₹${totalSpent.toLocaleString('en-IN')}`} />
          <SummaryCard icon={LockKeyhole} label="Account access" value="Protected" accent />
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[310px_1fr]">
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-[1.75rem] border border-[#dedfd7] bg-white shadow-[0_20px_55px_rgba(30,51,36,.08)]">
              <div className="relative bg-[linear-gradient(135deg,#123b2a,#0b281c)] px-6 pb-7 pt-6 text-white">
                <div className="absolute -right-7 -top-9 h-28 w-28 rounded-full border border-[#d9af55]/20" />
                <div className="relative flex items-center gap-4">
                  <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#efc96d,#c9922c)] font-display text-2xl font-bold text-[#143121] shadow-[0_10px_25px_rgba(0,0,0,.2)]">
                    {initials}
                    <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-[#123b2a] bg-[#f6f2e7]"><BadgeCheck className="h-3.5 w-3.5 text-[#47704e]" /></span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-[.18em] text-[#dfbd69]">Member profile</p>
                    <h2 className="mt-1 truncate font-display text-2xl text-[#fff5dc]">{user.name}</h2>
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <ContactRow icon={Mail} label="Email address" value={user.email} />
                <ContactRow icon={Phone} label="Mobile number" value={user.phone || 'Not provided'} />
                <div className="flex items-center gap-2 rounded-xl border border-[#dce7da] bg-[#f1f6ef] px-3 py-2.5 text-[9px] font-bold text-[#47704e]"><ShieldCheck className="h-4 w-4" /> Secure member session active</div>
                {user.isAdmin && <Link to="/admin" className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#c99a38] py-3 text-[8px] font-black uppercase tracking-[.13em] text-[#8a6017] transition hover:bg-[#fff7e2]">Open admin dashboard <ArrowRight className="h-3.5 w-3.5" /></Link>}
              </div>
            </div>

            <nav className="overflow-hidden rounded-[1.5rem] border border-[#dfdfd7] bg-white p-2 shadow-[0_14px_38px_rgba(30,51,36,.05)]" aria-label="Account quick links">
              {quickLinks.map(([Icon, title, text, href]) => (
                <Link key={title} to={href} className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-[#f3f5ee]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#edf2e9] text-[#4b7051] transition group-hover:bg-[#123b2a] group-hover:text-[#e8c56e]"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><strong className="block text-[10px] text-[#233b2b]">{title}</strong><small className="mt-0.5 block text-[8px] text-[#859088]">{text}</small></span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#a6afa9] transition group-hover:translate-x-0.5 group-hover:text-[#9c6d1a]" />
                </Link>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 rounded-[1.75rem] border border-[#dedfd7] bg-white p-5 shadow-[0_20px_55px_rgba(30,51,36,.07)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e9e9e2] pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f4ead2] text-[#a6751d]"><Box className="h-5 w-5" /></span>
                <div><p className="text-[8px] font-black uppercase tracking-[.18em] text-[#a1711b]">Order history</p><h2 className="mt-0.5 font-display text-2xl text-[#173524]">Recent orders</h2></div>
              </div>
              {!loading && orders.length > 0 && <span className="rounded-full bg-[#edf3e9] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#4d7253]">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>}
            </div>

            {loading ? <OrdersLoading /> : orders.length ? (
              <div className="mt-5 space-y-3">
                {orders.map((order) => <OrderCard key={order._id} order={order} />)}
              </div>
            ) : <EmptyOrders />}
          </div>
        </div>
      </div>
    </section>
  )
}

function SummaryCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className={`flex items-center gap-3 rounded-[1.25rem] border p-4 shadow-[0_12px_35px_rgba(30,51,36,.07)] ${accent ? 'border-[#d3ad54]/30 bg-[#123b2a] text-white' : 'border-[#e1e2dc] bg-white text-[#183524]'}`}>
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accent ? 'bg-white/10 text-[#e3bd63]' : 'bg-[#f1ead9] text-[#a3721b]'}`}><Icon className="h-4.5 w-4.5" /></span>
      <div><p className={`text-[8px] font-black uppercase tracking-[.13em] ${accent ? 'text-white/45' : 'text-[#879189]'}`}>{label}</p><p className={`mt-0.5 font-display text-xl ${accent ? 'text-[#fff1cf]' : ''}`}>{value}</p></div>
    </div>
  )
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#f7f7f2] px-3 py-3">
      <Icon className="h-4 w-4 shrink-0 text-[#a6751d]" />
      <div className="min-w-0"><p className="text-[7px] font-black uppercase tracking-[.13em] text-[#929b95]">{label}</p><p className="mt-0.5 truncate text-[10px] font-semibold text-[#425249]">{value}</p></div>
    </div>
  )
}

function EmptyOrders() {
  return (
    <div className="relative mt-5 flex min-h-[350px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-[#ced7cb] bg-[radial-gradient(circle_at_50%_48%,#fffef9_0%,#f7f6ef_72%,#f1f1e9_100%)] px-5 py-10 text-center">
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-[#c99b3b]/10" />
      <div className="absolute -bottom-24 -left-14 h-56 w-56 rounded-full border border-[#123b2a]/[.07]" />
      <div className="relative max-w-md">
        <div className="relative mx-auto h-24 w-24">
          <div className="animate-soft-pulse absolute inset-0 rounded-full border border-[#d1ae5d]/35" />
          <div className="absolute inset-3 grid place-items-center rounded-full bg-[#123b2a] shadow-[0_16px_35px_rgba(18,59,42,.2)]"><PackageCheck className="h-8 w-8 text-[#e5c46f]" strokeWidth={1.5} /></div>
        </div>
        <p className="mt-6 text-[8px] font-black uppercase tracking-[.2em] text-[#a1711b]">Your journey starts here</p>
        <h3 className="mt-2 font-display text-3xl text-[#173524]">No orders yet</h3>
        <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#748078]">Discover thoughtfully selected wellness essentials and your orders will appear here with delivery updates.</p>
        <Link to="/shop" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#b47b1d,#dbb254)] px-6 py-3.5 text-[8px] font-black uppercase tracking-[.14em] text-[#14251a] shadow-[0_12px_26px_rgba(180,123,29,.18)] transition hover:-translate-y-0.5">
          Explore products <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

function OrdersLoading() {
  return (
    <div className="mt-5 space-y-3">
      {[1, 2, 3].map((item) => <div key={item} className="flex animate-pulse items-center gap-4 rounded-2xl border border-[#e7e9e3] p-4"><span className="h-12 w-12 rounded-xl bg-[#edf0ea]" /><span className="flex-1"><span className="block h-2.5 w-28 rounded bg-[#e7eae4]" /><span className="mt-2 block h-2.5 w-2/3 rounded bg-[#eff1ed]" /></span><LoaderCircle className="h-4 w-4 animate-spin text-[#a1711b]" /></div>)}
    </div>
  )
}

function OrderCard({ order }) {
  return (
    <article className="group rounded-[1.25rem] border border-[#e2e5de] bg-[#fcfcf9] p-4 transition hover:border-[#d2bd87] hover:bg-white hover:shadow-[0_10px_28px_rgba(30,51,36,.06)] sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf2e9] text-[#4a704f]"><PackageCheck className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[.13em] text-[#929b95]">Order #{order._id.slice(-8).toUpperCase()}</p>
            <p className="mt-1.5 truncate text-xs font-bold text-[#2a4031]">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
            <p className="mt-1 text-[9px] text-[#869089]">Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {order.paymentMethod}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#eceee9] pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <p className="font-display text-xl font-bold text-[#173524]">₹{order.totalPrice.toLocaleString('en-IN')}</p>
          <span className={`mt-0 inline-flex rounded-full border px-3 py-1 text-[7px] font-black uppercase tracking-[.1em] sm:mt-1.5 ${statusTone(order.orderStatus)}`}>{order.orderStatus}</span>
          <Link to={`/orders/${order._id}`} className="mt-0 flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#936719] sm:mt-2 sm:justify-end">Track / manage <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
    </article>
  )
}
