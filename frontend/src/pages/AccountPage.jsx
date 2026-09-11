import { useSiteContent } from '../context/SiteContentContext.jsx'
import { dashboardFor, roleOf } from '../data/roles.js'
import {
  ArrowRight,
  BadgeCheck,
  Box,
  ChevronRight,
  Headphones,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { statusTone } from '../data/orderTracking.js'
import './AccountPage.css'

export default function AccountPage() {
  const siteContent = useSiteContent('account', siteIcons)

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (roleOf(user) !== 'customer') return
    apiRequest('/orders/my')
      .then(({ orders: fetched }) => setOrders(fetched))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const userRole = roleOf(user)
  const dashboardPath = dashboardFor(user)

  const isStaff = userRole !== 'customer'
  const roleLabel = {
    super_admin: 'Super Admin Dashboard',
    admin: 'Admin Dashboard',
    delivery_boy: 'Delivery Hub',
  }[userRole] || 'Dashboard'

  const firstName = user?.name ? user.name.split(' ')[0] : 'User'
  const initials = user?.name ? user.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : 'SA'
  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + order.totalPrice, 0), [orders])
  const signOut = () => { logout(); navigate('/') }

  if (isStaff) return <Navigate to={dashboardPath} replace />

  return (
    <section className="member-dashboard min-h-[calc(100svh-76px)] bg-[#f5f2e9]">
      <header className="member-hero">
        <img className="member-hero-image" src={siteContent.media.account_hero || '/images/account-wellness-hero.png'} alt="Herbal tea, fresh amla and Ayurvedic botanicals in warm sunlight" fetchPriority="high" />
        <div className="member-hero-shade" />
        <div className="member-hero-inner">
          <div className="member-hero-top"><span><Sparkles size={14} />{siteContent.text.your_wellness_space}</span><button type="button" onClick={signOut}><LogOut size={15} />{siteContent.text.sign_out}</button></div>
          <div className="member-welcome">
            <p className="member-eyebrow">A little care. Every single day.</p>
            <h1>{siteContent.text.namaste}{firstName}.</h1>
            <p className="member-welcome-description">{siteContent.text.everything_for_your_wellness_journey_orders_a}</p>
            <div className="member-hero-actions">
              {isStaff && (
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-full bg-[#e8be5b] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#102a1d] shadow-lg transition hover:bg-[#dfb249] hover:scale-105"
                >
                  {userRole === 'super_admin' ? <ShieldCheck size={18} /> : userRole === 'delivery_boy' ? <Truck size={18} /> : <ShieldCheck size={18} />}
                  Go to {roleLabel} <ArrowRight size={16} />
                </Link>
              )}
              <Link to="/shop">Explore wellness <ArrowRight size={16} /></Link>
              <a href="#member-orders">View my orders <ChevronRight size={15} /></a>
            </div>
          </div>
        </div>
      </header>

      <div className="member-content relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="member-stats mb-5 grid gap-3 sm:grid-cols-3">
          <SummaryCard icon={Box} label="Total orders" value={loading ? '—' : orders.length.toString()} />
          <SummaryCard icon={ShoppingBag} label="Total spent" value={loading ? '—' : `₹${totalSpent.toLocaleString('en-IN')}`} />
          <SummaryCard icon={LockKeyhole} label="Account access" value={userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin' ? 'Store Admin' : userRole === 'delivery_boy' ? 'Delivery Partner' : 'Protected'} accent />
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
                    <p className="text-[8px] font-black uppercase tracking-[.18em] text-[#dfbd69]">{userRole === 'super_admin' ? 'Super Admin Profile' : userRole === 'admin' ? 'Store Admin Profile' : userRole === 'delivery_boy' ? 'Delivery Profile' : 'Member Profile'}</p>
                    <h2 className="mt-1 truncate font-display text-2xl text-[#fff5dc]">{user?.name}</h2>
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <ContactRow icon={Mail} label="Email address" value={user?.email} />
                <ContactRow icon={Phone} label="Mobile number" value={user?.phone || 'Not provided'} />
                <div className="flex items-center gap-2 rounded-xl border border-[#dce7da] bg-[#f1f6ef] px-3 py-2.5 text-[9px] font-bold text-[#47704e]">
                  <ShieldCheck className="h-4 w-4" />
                  {userRole === 'super_admin' ? 'Super Admin Session Active' : userRole === 'admin' ? 'Admin Session Active' : userRole === 'delivery_boy' ? 'Delivery Partner Session Active' : siteContent.text.secure_member_session_active}
                </div>
                {isStaff && (
                  <Link
                    to={dashboardPath}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#123b2a] py-3.5 px-4 text-xs font-black uppercase tracking-wider text-[#efc96d] shadow-md transition hover:bg-[#1a4a36] hover:text-white"
                  >
                    {userRole === 'super_admin' ? <ShieldCheck className="h-4 w-4 text-[#efc96d]" /> : userRole === 'delivery_boy' ? <Truck className="h-4 w-4 text-[#efc96d]" /> : <ShieldCheck className="h-4 w-4 text-[#efc96d]" />}
                    Go to {roleLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <nav className="overflow-hidden rounded-[1.5rem] border border-[#dfdfd7] bg-white p-2 shadow-[0_14px_38px_rgba(30,51,36,.05)]" aria-label="Account quick links">
              {siteContent.sections.quickLinks.map(([Icon, title, text, href]) => (
                <Link key={title} to={href} className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-[#f3f5ee]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#edf2e9] text-[#4b7051] transition group-hover:bg-[#123b2a] group-hover:text-[#e8c56e]"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><strong className="block text-[10px] text-[#233b2b]">{title}</strong><small className="mt-0.5 block text-[8px] text-[#859088]">{text}</small></span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#a6afa9] transition group-hover:translate-x-0.5 group-hover:text-[#9c6d1a]" />
                </Link>
              ))}
            </nav>
          </aside>

          <div id="member-orders" className="member-orders min-w-0 rounded-[1.75rem] border border-[#dedfd7] bg-white p-5 shadow-[0_20px_55px_rgba(30,51,36,.07)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e9e9e2] pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f4ead2] text-[#a6751d]"><Box className="h-5 w-5" /></span>
                <div><p className="text-[8px] font-black uppercase tracking-[.18em] text-[#a1711b]">{siteContent.text.order_history}</p><h2 className="mt-0.5 font-display text-2xl text-[#173524]">{siteContent.text.recent_orders}</h2></div>
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
  const siteContent = useSiteContent('account', siteIcons)

  return (
    <div className="member-empty relative mt-5 flex min-h-[350px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-[#ced7cb] bg-[radial-gradient(circle_at_50%_48%,#fffef9_0%,#f7f6ef_72%,#f1f1e9_100%)] px-5 py-10 text-center">
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-[#c99b3b]/10" />
      <div className="absolute -bottom-24 -left-14 h-56 w-56 rounded-full border border-[#123b2a]/[.07]" />
      <div className="relative max-w-md">
        <div className="relative mx-auto h-24 w-24">
          <div className="animate-soft-pulse absolute inset-0 rounded-full border border-[#d1ae5d]/35" />
          <div className="absolute inset-3 grid place-items-center rounded-full bg-[#123b2a] shadow-[0_16px_35px_rgba(18,59,42,.2)]"><PackageCheck className="h-8 w-8 text-[#e5c46f]" strokeWidth={1.5} /></div>
        </div>
        <p className="mt-6 text-[8px] font-black uppercase tracking-[.2em] text-[#a1711b]">{siteContent.text.your_journey_starts_here}</p>
        <h3 className="mt-2 font-display text-3xl text-[#173524]">{siteContent.text.no_orders_yet}</h3>
        <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#748078]">{siteContent.text.discover_thoughtfully_selected_wellness_essen}</p>
        <Link to={siteContent.media.to_3} className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#b47b1d,#dbb254)] px-6 py-3.5 text-[8px] font-black uppercase tracking-[.14em] text-[#14251a] shadow-[0_12px_26px_rgba(180,123,29,.18)] transition hover:-translate-y-0.5">{siteContent.text.explore_products}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

function OrdersLoading() {
  const siteContent = useSiteContent('account', siteIcons)

  return (
    <div className="mt-5 space-y-3">
      {siteContent.sections.cards2.map((item) => <div key={item} className="flex animate-pulse items-center gap-4 rounded-2xl border border-[#e7e9e3] p-4"><span className="h-12 w-12 rounded-xl bg-[#edf0ea]" /><span className="flex-1"><span className="block h-2.5 w-28 rounded bg-[#e7eae4]" /><span className="mt-2 block h-2.5 w-2/3 rounded bg-[#eff1ed]" /></span><LoaderCircle className="h-4 w-4 animate-spin text-[#a1711b]" /></div>)}
    </div>
  )
}

function OrderCard({ order }) {
  const siteContent = useSiteContent('account', siteIcons)

  return (
    <article className="group rounded-[1.25rem] border border-[#e2e5de] bg-[#fcfcf9] p-4 transition hover:border-[#d2bd87] hover:bg-white hover:shadow-[0_10px_28px_rgba(30,51,36,.06)] sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf2e9] text-[#4a704f]"><PackageCheck className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[.13em] text-[#929b95]">{siteContent.text.order}{order._id.slice(-8).toUpperCase()}</p>
            <p className="mt-1.5 truncate text-xs font-bold text-[#2a4031]">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
            <p className="mt-1 text-[9px] text-[#869089]">{siteContent.text.placed}{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {order.paymentMethod}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#eceee9] pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <p className="font-display text-xl font-bold text-[#173524]">₹{order.totalPrice.toLocaleString('en-IN')}</p>
          <span className={`mt-0 inline-flex rounded-full border px-3 py-1 text-[7px] font-black uppercase tracking-[.1em] sm:mt-1.5 ${statusTone(order.orderStatus)}`}>{order.orderStatus}</span>
          <Link to={`/orders/${order._id}`} className="mt-0 flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#936719] sm:mt-2 sm:justify-end">{siteContent.text.track_manage}<ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
    </article>
  )
}

const siteIcons = { Headphones, ShieldCheck, ShoppingBag }
