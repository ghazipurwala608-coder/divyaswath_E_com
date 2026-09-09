import { useSiteContent } from '../context/SiteContentContext.jsx'
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Headphones,
  Leaf,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'

export default function OrderSuccessPage() {
  const siteContent = useSiteContent('order-success', siteIcons)
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    apiRequest(`/orders/${id}`)
      .then(({ order: fetched }) => setOrder(fetched))
      .catch(() => {})
  }, [id])

  const copyOrderId = () => {
    if (!id) return
    const orderRef = id.slice(-8).toUpperCase()
    navigator.clipboard.writeText(orderRef)
    setCopied(true)
    toast.success(`Order ID #${orderRef} copied!`)
    setTimeout(() => setCopied(false), 2000)
  }

  const orderNumber = id ? id.slice(-8).toUpperCase() : ''
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#1a3824] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* ── CELEBRATION HERO ── */}
        <div className="text-center">
          {/* Animated Success Badge */}
          <div className="relative mx-auto mb-6 inline-flex items-center justify-center">
            <div className="absolute -inset-3 rounded-full bg-[#3d7949]/10 animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#c2ddbd] bg-gradient-to-br from-[#f1faee] to-[#e4f3e0] shadow-[0_8px_30px_rgba(61,121,73,0.18)]">
              <CheckCircle2 className="h-12 w-12 text-[#2e6d3a]" strokeWidth={1.75} />
            </div>
          </div>

          {/* Kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9c595] bg-[#fffaf0] px-4 py-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#b28128]" />
            <span className="text-[11px] font-black uppercase tracking-[.2em] text-[#9a6a16]">
              {siteContent.text?.order_confirmed || 'Order Confirmed'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#11311d] sm:text-5xl">
            {siteContent.text?.thank_you_for_choosing_wellness || 'Thank you for choosing wellness.'}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#516356]">
            {siteContent.text?.your_order_has_been_placed_successfully_deliv ||
              'Your order has been placed successfully. Delivery updates will use the verified details supplied at checkout.'}
          </p>

          {/* Order Reference Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#e4dccb] bg-white/90 px-5 py-2.5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1f3d29]">
              <span className="text-[#8d9a90]">ORDER ID:</span>
              <span className="font-mono text-sm tracking-wider text-[#9a6a16]">#{orderNumber}</span>
            </div>
            <span className="hidden h-4 w-px bg-[#dcd5c4] sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-[#637267]">
              <Calendar className="h-3.5 w-3.5 text-[#9a6a16]" />
              <span>{orderDate}</span>
            </div>
            <button
              type="button"
              onClick={copyOrderId}
              className="inline-flex items-center gap-1 rounded-md bg-[#f6f2e8] px-2.5 py-1 text-[11px] font-semibold text-[#1f3d29] transition hover:bg-[#ebd9b4]"
              title="Copy Order ID"
            >
              {copied ? <Check className="h-3 w-3 text-[#2e6d3a]" /> : <Copy className="h-3 w-3 text-[#9a6a16]" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
        </div>

        {/* ── ORDER STEPPER TIMELINE ── */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#e5ded0] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[.18em] text-[#9a6a16]">Next Steps</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b432a] text-white shadow-md">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div className="mt-1 sm:mt-3">
                <p className="text-xs font-bold text-[#183623]">Order Placed</p>
                <p className="text-[11px] text-[#6d7c71]">Received & verified</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#b58428] bg-[#fffaf0] text-[#9a6a16]">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div className="mt-1 sm:mt-3">
                <p className="text-xs font-bold text-[#183623]">Packing</p>
                <p className="text-[11px] text-[#6d7c71]">Carefully packaged</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dedad0] bg-[#f8f6f0] text-[#8e9c91]">
                <Truck className="h-5 w-5" />
              </div>
              <div className="mt-1 sm:mt-3">
                <p className="text-xs font-semibold text-[#546559]">Dispatched</p>
                <p className="text-[11px] text-[#8e9c91]">Tracking SMS sent</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dedad0] bg-[#f8f6f0] text-[#8e9c91]">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="mt-1 sm:mt-3">
                <p className="text-xs font-semibold text-[#546559]">Delivered</p>
                <p className="text-[11px] text-[#8e9c91]">At your doorstep</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO COLUMN CARDS ── */}
        {order && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            {/* Left Card: Order Summary */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#e5ded0] bg-white p-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-[#f0ebe0] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5efe2] text-[#9a6a16]">
                      <PackageCheck className="h-4 w-4" />
                    </span>
                    <h2 className="text-[12px] font-black uppercase tracking-[.14em] text-[#183623]">
                      {siteContent.text?.order_summary || 'Order Summary'}
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#f2f6f1] px-2.5 py-0.5 text-[10px] font-bold text-[#2e6d3a]">
                    {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="mt-4 divide-y divide-[#f5f1e8]">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 py-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#e8e2d4] bg-[#fdfcf9] p-1">
                        <img
                          src={item.image || '/images/divyaswasth.png'}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#14321f]">{item.name}</p>
                        <p className="text-[11px] text-[#69796d]">
                          Qty: {item.quantity} · ₹{(item.price || 0).toLocaleString('en-IN')} each
                        </p>
                      </div>
                      <p className="font-display text-sm font-bold text-[#14321f]">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 border-t border-[#f0ebe0] pt-4">
                <div className="flex justify-between text-xs text-[#637267] py-1">
                  <span>Shipping</span>
                  <span className="font-bold text-[#2e6d3a]">FREE</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-[#183623]">Total Paid / Due</span>
                  <span className="font-display text-2xl font-bold text-[#10301c]">
                    ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#faf7f0] px-3 py-2 text-xs text-[#59685e]">
                  <CreditCard className="h-4 w-4 text-[#9a6a16]" />
                  <span>
                    Payment Method: <strong className="text-[#183623]">{order.paymentMethod || 'Cash on Delivery'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Delivery Information */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#e5ded0] bg-white p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2.5 border-b border-[#f0ebe0] pb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5efe2] text-[#9a6a16]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h2 className="text-[12px] font-black uppercase tracking-[.14em] text-[#183623]">
                    {siteContent.text?.delivery_information || 'Delivery Information'}
                  </h2>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b998f]">Recipient</p>
                    <p className="text-sm font-bold text-[#14321f]">{order.shippingAddress?.fullName || 'Valued Customer'}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b998f]">Delivery Address</p>
                    <p className="text-xs leading-relaxed text-[#4d5e53]">
                      {order.shippingAddress?.addressLine}
                      {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ''}
                      <br />
                      {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                    </p>
                  </div>

                  {order.shippingAddress?.phone && (
                    <div className="flex items-center gap-2 pt-1 text-xs text-[#4d5e53]">
                      <Phone className="h-3.5 w-3.5 text-[#9a6a16]" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Assurance & Help */}
              <div className="mt-6 rounded-xl border border-[#e8e2d2] bg-[#faf8f2] p-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#2e6d3a]" />
                  <div>
                    <p className="font-bold text-[#183623]">Estimated Delivery: 3–5 Business Days</p>
                    <p className="mt-0.5 text-[11px] text-[#69796e]">
                      We will notify you via SMS once your parcel is on its way.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── ACTION BUTTONS ── */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to={`/orders/${id}`}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#113822] px-8 py-4 text-xs font-black uppercase tracking-[.14em] text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#184e30] sm:w-auto"
          >
            <Truck className="h-4 w-4 text-[#e2ba5f]" />
            <span>{siteContent.text?.track_your_order || 'Track Your Order'}</span>
          </Link>

          <Link
            to={siteContent.media?.to_1 || '/shop'}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#b58428] bg-transparent px-8 py-3.5 text-xs font-black uppercase tracking-[.14em] text-[#9a6a16] transition duration-200 hover:bg-[#b58428]/10 sm:w-auto"
          >
            <span>{siteContent.text?.continue_shopping || 'Continue Shopping'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── ASSURANCE BADGES ── */}
        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-[#e5ded0] pt-8 sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f0faee] text-[#2e6d3a]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-[#183623]">100% Ayurvedic</p>
              <p className="text-[10px] text-[#78887d]">Natural formulations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff6e6] text-[#b28128]">
              <PackageCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-[#183623]">Sealed Packaging</p>
              <p className="text-[10px] text-[#78887d]">Tamper-proof safety</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f0faee] text-[#2e6d3a]">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-[#183623]">Free Delivery</p>
              <p className="text-[10px] text-[#78887d]">Across all pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff6e6] text-[#b28128]">
              <Headphones className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-[#183623]">Expert Care</p>
              <p className="text-[10px] text-[#78887d]">Always here to help</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const siteIcons = {}

