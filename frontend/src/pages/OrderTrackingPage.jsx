import { useSiteContent } from '../context/SiteContentContext.jsx'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CircleHelp,
  Clock3,
  CreditCard,
  ExternalLink,
  LoaderCircle,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import OrderTimeline from '../components/OrderTimeline.jsx'
import DeliveryTracking from '../delivery/DeliveryTracking.jsx'
import { ORDER_FLOW, formatOrderDate, orderStepIndex, statusTone } from '../data/orderTracking.js'

export default function OrderTrackingPage() {
  const siteContent = useSiteContent('order-tracking', siteIcons)

  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState('Ordered by mistake')

  useEffect(() => {
    let active = true
    const refresh = () => apiRequest(`/orders/${id}`)
      .then(({ order: fetched }) => { if (active) { setOrder(fetched); setError('') } })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    refresh()
    const timer = setInterval(refresh, 20000)
    return () => { active = false; clearInterval(timer) }
  }, [id])

  const events = useMemo(() => {
    if (!order) return []
    const history = order.trackingEvents?.length ? order.trackingEvents : [{
      _id: 'placed', status: 'Processing', title: 'Order placed', message: 'We have received your order.', timestamp: order.createdAt, location: '',
    }]
    return [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [order])

  if (loading) return <div className="flex min-h-[520px] items-center justify-center gap-3 bg-[#f4f5ef] text-xs text-[#748078]"><LoaderCircle className="h-5 w-5 animate-spin text-[#a1711b]" />{siteContent.text.loading_tracking_details}</div>
  if (error || !order) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><CircleHelp className="mx-auto h-10 w-10 text-[#a1711b]" /><h1 className="mt-5 font-display text-4xl text-[#183524]">{siteContent.text.order_not_available}</h1><p className="mt-3 text-sm text-[#748078]">{error || 'We could not find this order.'}</p><Link to={siteContent.media.to_1} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#123b2a] px-6 py-3 text-[9px] font-black uppercase tracking-wider text-white"><ArrowLeft className="h-3.5 w-3.5" />{siteContent.text.back_to_account}</Link></div>

  const delivered = order.orderStatus === 'Delivered'
  const cancelled = order.orderStatus === 'Cancelled'
  const currentIndex = orderStepIndex(order.orderStatus)
  const currentStep = ORDER_FLOW[Math.max(0, currentIndex)]
  const nextStep = currentIndex >= 0 ? ORDER_FLOW[currentIndex + 1] : null
  const canCancel = ['Processing', 'Confirmed', 'Packed'].includes(order.orderStatus)

  const cancelOrder = async () => {
    setCancelling(true)
    try {
      const { order: updated } = await apiRequest(`/orders/${order._id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason: cancelReason }) })
      setOrder(updated)
      setCancelOpen(false)
      toast.success('Your order has been cancelled')
    } catch (requestError) {
      toast.error(requestError.message)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <section className="min-h-[calc(100svh-76px)] bg-[#f3f4ee] pb-16">
      <div className="relative overflow-hidden bg-[#0a281b] px-4 pb-20 pt-10 text-white sm:px-6 lg:px-8">
        <img src={siteContent.media.src_2} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[.12]" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#082219_0%,rgba(8,34,25,.95)_55%,rgba(8,34,25,.72)_100%)]" />
        <Truck className="absolute -bottom-8 right-[8%] h-44 w-44 text-white/[.035]" strokeWidth={0.7} />
        <div className="relative mx-auto max-w-7xl">
          <Link to={siteContent.media.to_3} className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[.14em] text-white/50 transition hover:text-[#e4c16c]"><ArrowLeft className="h-3.5 w-3.5" />{siteContent.text.my_orders}</Link>
          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#e0b85f]">{siteContent.text.live_order_tracking}</p><h1 className="mt-2 font-display text-4xl text-[#fff5dc] sm:text-5xl">{delivered ? 'Delivered with care.' : cancelled ? 'Order cancelled.' : 'Your order is on its way.'}</h1><p className="mt-3 text-sm text-white/55">{siteContent.text.order}<strong className="text-white/80">#{order._id.slice(-8).toUpperCase()}</strong>{siteContent.text._placed}{formatOrderDate(order.createdAt)}</p></div>
            <div className="sm:text-right"><p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-white/40">{siteContent.text.current_order_status}</p><span className={`inline-flex w-fit rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[.1em] ${statusTone(order.orderStatus)}`}>{order.orderStatus}</span></div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-12 grid max-w-7xl items-start gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="min-w-0 space-y-5">
          <DeliveryTracking key={order._id + String(order.deliveryAssignedAt)} order={order} />
          <div className="rounded-[1.75rem] border border-[#dde2da] bg-white p-5 shadow-[0_18px_48px_rgba(31,52,37,.08)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ebe5] pb-5"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f3ead6] text-[#a1711b]"><Truck className="h-5 w-5" /></span><div><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#a1711b]">{siteContent.text.delivery_progress}</p><h2 className="font-display text-3xl text-[#193725]">{siteContent.text.your_order_journey}</h2><p className="mt-1 text-[11px] text-[#7a867e]">{siteContent.text.follow_every_stage_from_confirmation_to_doors}</p></div></div>{order.estimatedDelivery && !cancelled && <div className="rounded-xl bg-[#f3f6f0] px-4 py-3 text-right"><p className="text-[8px] font-black uppercase tracking-wider text-[#87928a]">{delivered ? 'Delivered on' : 'Expected by'}</p><p className="mt-1 text-sm font-bold text-[#31513a]">{formatOrderDate(delivered ? order.deliveredAt : order.estimatedDelivery, { weekday: 'short' })}</p></div>}</div>
            <div className="mt-7"><OrderTimeline status={order.orderStatus} detailed /></div>

            {!cancelled && <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#d6e1d3] bg-[#f2f7ef] p-4 sm:flex-row sm:items-center sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#123b2a] text-[#e6c46f] shadow-sm"><PackageCheck className="h-5 w-5" /></span>
              <div className="flex-1"><p className="text-[9px] font-black uppercase tracking-[.13em] text-[#648169]">{siteContent.text.current_update}</p><h3 className="mt-1 text-base font-bold text-[#213d2a]">{currentStep.label}</h3><p className="mt-1 text-xs leading-5 text-[#68776e]">{currentStep.description}</p></div>
              <div className="rounded-xl border border-[#dce5d9] bg-white px-4 py-3 sm:max-w-[260px]"><p className="text-[8px] font-black uppercase tracking-wider text-[#9c6e1b]">{nextStep ? 'What happens next?' : 'Order complete'}</p><p className="mt-1 text-[10px] leading-5 text-[#657269]">{currentStep.nextMessage}</p></div>
            </div>}

            {(order.courierName || order.trackingNumber || order.currentLocation) && <div className="mt-6 grid gap-4 rounded-2xl border border-[#dce3d9] bg-[#f8f9f6] p-5 sm:grid-cols-3">
              <TrackingFact icon={Truck} label="Delivery partner" value={order.courierName || 'Being assigned'} />
              <TrackingFact icon={ReceiptText} label="Tracking / AWB" value={order.trackingNumber || 'Being generated'} />
              <TrackingFact icon={MapPin} label="Current location" value={order.currentLocation || 'In transit'} />
              {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#123b2a] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white sm:col-span-3">{siteContent.text.track_on_courier_website}<ExternalLink className="h-4 w-4" /></a>}
            </div>}
          </div>

          <div className="rounded-[1.75rem] border border-[#dde2da] bg-white p-5 shadow-[0_14px_38px_rgba(31,52,37,.05)] sm:p-7">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf2e9] text-[#4c7251]"><Clock3 className="h-5 w-5" /></span><div><p className="text-[9px] font-black uppercase tracking-[.15em] text-[#a1711b]">{siteContent.text.tracking_history}</p><h2 className="font-display text-3xl text-[#193725]">{siteContent.text.package_updates}</h2><p className="mt-1 text-[11px] text-[#7d8981]">{siteContent.text.newest_delivery_update_appears_first}</p></div></div>
            <div className="mt-6">
              {events.map((event, index) => <div key={event._id || `${event.status}-${event.timestamp}`} className="relative grid grid-cols-[40px_1fr] gap-4 pb-7 last:pb-0">{index < events.length - 1 && <span className="absolute bottom-0 left-[19px] top-10 w-px bg-[#dfe4dc]" />}<span className={`relative z-10 grid h-10 w-10 place-items-center rounded-full ${index === 0 ? 'bg-[#123b2a] text-[#e5c46e] ring-4 ring-[#123b2a]/10' : 'bg-[#edf1ea] text-[#728078]'}`}><PackageCheck className="h-4 w-4" /></span><div><div className="flex flex-wrap items-baseline justify-between gap-2"><div className="flex items-center gap-2"><p className="text-sm font-bold text-[#2f4636]">{event.title}</p>{index === 0 && <span className="rounded-full bg-[#e8f2e5] px-2 py-1 text-[7px] font-black uppercase tracking-wider text-[#47704e]">{siteContent.text.latest}</span>}</div><time className="text-[10px] font-medium text-[#89948d]">{new Date(event.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</time></div><p className="mt-1 text-xs leading-5 text-[#6f7c74]">{event.message}</p>{event.location && <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#9a6b1a]"><MapPin className="h-3.5 w-3.5" /> {event.location}</p>}</div></div>)}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#dde2da] bg-white p-5 shadow-[0_14px_38px_rgba(31,52,37,.05)] sm:p-7">
            <div className="flex items-center gap-3 border-b border-[#e9ebe6] pb-4"><ShoppingBag className="h-5 w-5 text-[#a1711b]" /><div><h2 className="font-display text-3xl text-[#193725]">{siteContent.text.items_in_this_order}</h2><p className="mt-1 text-[11px] text-[#7d8981]">{siteContent.text.review_the_products_included_in_this_delivery}</p></div></div>
            <div className="divide-y divide-[#e9ebe6]">{order.items.map((item) => <div key={`${item.product}-${item.slug}`} className="flex items-center gap-4 py-5"><div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e3e7df] bg-[#f5f6f2]">{item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-1 mix-blend-multiply" /> : <PackageCheck className="h-7 w-7 text-[#8da08f]" />}</div><div className="min-w-0 flex-1"><Link to={`/products/${item.slug}`} className="text-sm font-bold text-[#2d4434] hover:text-[#9a6b1a]">{item.name}</Link><p className="mt-1 text-[11px] text-[#7d8981]">{siteContent.text.quantity}{item.quantity} · ₹{item.price.toLocaleString('en-IN')}{siteContent.text.per_item}</p></div><p className="shrink-0 font-display text-xl font-bold text-[#173524]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p></div>)}</div>
          </div>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[1.75rem] bg-[#10291d] p-6 text-white shadow-[0_18px_45px_rgba(17,43,30,.18)]">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[.08] text-[#dfba65]"><ReceiptText className="h-4 w-4" /></span><div><p className="text-[9px] font-black uppercase tracking-[.17em] text-[#dfba65]">{siteContent.text.order_summary}</p><p className="mt-0.5 text-[10px] text-white/45">#{order._id.slice(-8).toUpperCase()}</p></div></div>
            <div className="mt-6 space-y-4 text-xs text-white/60"><div className="flex justify-between"><span>{siteContent.text.product_total}</span><span className="font-bold text-white">₹{order.itemsPrice.toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span>{siteContent.text.delivery_charge}</span><span className="font-bold text-white">{order.shippingPrice ? `₹${order.shippingPrice}` : 'Free'}</span></div><div className="flex items-center justify-between border-t border-white/10 pt-5"><span className="font-bold text-white/80">{siteContent.text.order_total}</span><span className="font-display text-3xl font-bold text-[#e6c26d]">₹{order.totalPrice.toLocaleString('en-IN')}</span></div></div>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[.05] p-4"><div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-white/45"><CreditCard className="h-4 w-4 text-[#d8b45f]" />{siteContent.text.payment_details}</div><p className="mt-2 text-xs font-bold">{order.paymentMethod} · {order.paymentStatus}</p></div>
          </div>

          <div className="rounded-[1.5rem] border border-[#dde2da] bg-white p-5">
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[#a1711b]" /><h3 className="text-[10px] font-black uppercase tracking-wider text-[#33483a]">{siteContent.text.delivering_to}</h3></div><p className="mt-4 text-sm font-bold text-[#34493b]">{order.shippingAddress.fullName}</p><p className="mt-2 text-xs leading-6 text-[#6f7c74]">{order.shippingAddress.addressLine}<br />{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}<br />{order.shippingAddress.country}</p><div className="mt-4 space-y-2 border-t border-[#e8ebe5] pt-4 text-[11px] text-[#627168]"><p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#9f701a]" />{order.shippingAddress.phone}</p>{order.shippingAddress.email && <p className="flex items-center gap-2 break-all"><Mail className="h-3.5 w-3.5 shrink-0 text-[#9f701a]" />{order.shippingAddress.email}</p>}</div>
          </div>

          {canCancel && <div className="rounded-[1.5rem] border border-[#ecd7d2] bg-white p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0ed] text-[#a24f44]"><X className="h-4 w-4" /></span><div><h3 className="text-sm font-bold text-[#4b3733]">{siteContent.text.need_to_cancel}</h3><p className="mt-1 text-[11px] leading-5 text-[#7d6d69]">{siteContent.text.you_can_cancel_this_order_before_it_is_shippe}</p></div></div><button type="button" onClick={() => setCancelOpen(true)} className="mt-4 w-full rounded-xl border border-[#dfb8b1] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-[#9b493f] transition hover:bg-[#fff1ee]">{siteContent.text.cancel_this_order}</button></div>}

          {!canCancel && !delivered && !cancelled && <div className="rounded-[1.5rem] border border-[#e2d2aa] bg-[#fff9e9] p-5"><AlertTriangle className="h-5 w-5 text-[#9f701a]" /><h3 className="mt-3 text-sm font-bold text-[#493c20]">{siteContent.text.online_cancellation_closed}</h3><p className="mt-2 text-[11px] leading-5 text-[#74633e]">{siteContent.text.this_package_has_already_been_shipped_contact}</p></div>}

          <div className="rounded-[1.5rem] border border-[#e2d2aa] bg-[#fff9e9] p-5"><ShieldCheck className="h-6 w-6 text-[#9f701a]" /><h3 className="mt-3 font-display text-2xl text-[#3b321e]">{siteContent.text.need_order_support}</h3><p className="mt-2 text-xs leading-6 text-[#74633e]">{siteContent.text.share_order}{order._id.slice(-8).toUpperCase()}{siteContent.text.with_our_care_team_for_quick_delivery_assista}</p><Link to={siteContent.media.to_4} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#ddc389] bg-white/60 px-4 py-3 text-[9px] font-black uppercase tracking-wider text-[#8f6218] transition hover:bg-white">{siteContent.text.contact_support}<ArrowUpRight className="h-4 w-4" /></Link></div>
        </aside>
      </div>

      {cancelOpen && <div className="fixed inset-0 z-[80] grid place-items-center bg-[#04120c]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cancel-order-title">
        <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/60 bg-[#fffdf8] shadow-[0_30px_90px_rgba(0,0,0,.3)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#ece8df] p-5 sm:p-6"><div className="flex gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fff0ed] text-[#a24f44]"><AlertTriangle className="h-5 w-5" /></span><div><p className="text-[8px] font-black uppercase tracking-[.15em] text-[#a24f44]">{siteContent.text.confirm_cancellation}</p><h2 id="cancel-order-title" className="mt-1 font-display text-2xl text-[#2f3f34]">{siteContent.text.cancel_this_order_2}</h2></div></div><button type="button" onClick={() => setCancelOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1f2ee] text-[#718078]" aria-label="Close cancellation dialog"><X className="h-4 w-4" /></button></div>
          <div className="p-5 sm:p-6">
            <div className="rounded-xl border border-[#eed5cf] bg-[#fff5f2] p-4 text-[11px] leading-5 text-[#78534d]">{siteContent.text.cancellation_cannot_be_undone}{order.paymentStatus === 'Paid' ? 'Your paid amount will be marked for refund processing.' : 'No payment refund is required for this order.'}</div>
            <label className="mt-5 block"><span className="mb-2 block text-[9px] font-black uppercase tracking-wider text-[#56655c]">{siteContent.text.why_are_you_cancelling}</span><select value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} className="w-full rounded-xl border border-[#d8ded5] bg-white px-4 py-3 text-sm text-[#34483b] outline-none focus:border-[#a8751d] focus:ring-4 focus:ring-[#a8751d]/10"><option>Ordered by mistake</option><option>Need to change delivery address</option><option>Chose wrong product or quantity</option><option>Payment-related issue</option><option>No longer needed</option></select></label>
            <div className="mt-6 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => setCancelOpen(false)} className="rounded-xl border border-[#d7ddd4] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-[#5f6d64]">{siteContent.text.keep_my_order}</button><button type="button" onClick={cancelOrder} disabled={cancelling} className="flex items-center justify-center gap-2 rounded-xl bg-[#9c493f] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#7e372f] disabled:opacity-60">{cancelling ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} {cancelling ? 'Cancelling...' : 'Yes, cancel order'}</button></div>
          </div>
        </div>
      </div>}
    </section>
  )
}

function TrackingFact({ icon: Icon, label, value }) {
  return <div className="flex min-w-0 items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f0eadb]"><Icon className="h-3.5 w-3.5 text-[#a1711b]" /></span><div className="min-w-0"><p className="text-[8px] font-black uppercase tracking-wider text-[#87928a]">{label}</p><p className="mt-1 break-words text-[11px] font-bold text-[#34493b]">{value}</p></div></div>
}

const siteIcons = {  }
