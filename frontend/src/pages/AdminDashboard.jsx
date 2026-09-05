import {
  ArrowRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  Link2,
  LoaderCircle,
  MapPin,
  PackageCheck,
  RefreshCcw,
  Save,
  ShoppingCart,
  Truck,
  UserRound,
  UsersRound,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import OrderTimeline from '../components/OrderTimeline.jsx'
import { NEXT_ORDER_STATUS, ORDER_FILTERS, PAYMENT_STATUSES, formatOrderDate, statusTone } from '../data/orderTracking.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [filter, setFilter] = useState('Active')

  const load = async () => {
    setLoading(true)
    try {
      const [dashboard, orderData] = await Promise.all([apiRequest('/admin/dashboard'), apiRequest('/orders/admin/all')])
      setStats(dashboard.stats)
      setOrders(orderData.orders)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredOrders = useMemo(() => orders.filter((order) => {
    if (filter === 'All') return true
    if (filter === 'Active') return !['Delivered', 'Cancelled'].includes(order.orderStatus)
    return order.orderStatus === filter
  }), [filter, orders])

  const updateOrder = async (id, payload) => {
    setSavingId(id)
    try {
      const { order: updated } = await apiRequest(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) })
      setOrders((current) => current.map((order) => order._id === id ? { ...updated, user: order.user } : order))
      if (payload.orderStatus && payload.orderStatus !== orders.find((order) => order._id === id)?.orderStatus) {
        const dashboard = await apiRequest('/admin/dashboard')
        setStats(dashboard.stats)
      }
      toast.success(payload.orderStatus === orders.find((order) => order._id === id)?.orderStatus ? 'Delivery details saved' : `Order marked ${payload.orderStatus}`)
      return true
    } catch (error) {
      toast.error(error.message)
      return false
    } finally {
      setSavingId('')
    }
  }

  const cards = [
    [IndianRupee, 'Revenue', `₹${stats.revenue.toLocaleString('en-IN')}`],
    [ShoppingCart, 'Orders', stats.orders],
    [Boxes, 'Products', stats.products],
    [UsersRound, 'Customers', stats.users],
  ]

  return (
    <section className="min-h-[calc(100svh-76px)] bg-[#f1f3ed] pb-16">
      <div className="relative overflow-hidden bg-[#0b281c] px-4 pb-20 pt-12 text-white sm:px-6 lg:px-8">
        <div className="absolute -right-20 -top-40 h-[430px] w-[430px] rounded-full border border-[#d9ae54]/15" />
        <Truck className="absolute bottom-2 right-[10%] h-36 w-36 text-white/[.035]" strokeWidth={0.7} />
        <div className="relative mx-auto flex max-w-7xl items-end justify-between gap-5">
          <div><p className="text-[9px] font-black uppercase tracking-[.24em] text-[#dfb75e]">Fulfilment command centre</p><h1 className="mt-3 font-display text-5xl text-[#fff5dc]">Orders & delivery</h1><p className="mt-3 max-w-xl text-xs leading-6 text-white/50">Confirm, pack, dispatch and deliver every customer order with a complete tracking history.</p></div>
          <button type="button" onClick={load} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[.06] text-[#e5c16b] transition hover:bg-white/10" aria-label="Refresh dashboard"><RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>

      <div className="relative mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([Icon, label, value]) => <div key={label} className="rounded-[1.3rem] border border-[#e0e3dc] bg-white p-5 shadow-[0_15px_38px_rgba(31,52,37,.08)]"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3ead6]"><Icon className="h-4.5 w-4.5 text-[#9f701a]" /></span><div><p className="text-[8px] font-black uppercase tracking-wider text-[#89948c]">{label}</p><p className="mt-0.5 font-display text-2xl font-bold text-[#183524]">{value}</p></div></div></div>)}
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#dfe3db] bg-white shadow-[0_18px_48px_rgba(31,52,37,.07)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#e6e9e2] p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf3e9] text-[#47704e]"><ClipboardList className="h-5 w-5" /></span><div><p className="text-[8px] font-black uppercase tracking-[.16em] text-[#a1711b]">Live operations</p><h2 className="font-display text-2xl text-[#193725]">Order fulfilment queue</h2></div></div>
            <div className="flex flex-wrap gap-1.5">{ORDER_FILTERS.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded-full px-3 py-2 text-[8px] font-black uppercase tracking-wider transition ${filter === item ? 'bg-[#123b2a] text-white' : 'bg-[#f1f3ee] text-[#748078] hover:bg-[#e7ece4]'}`}>{item}</button>)}</div>
          </div>

          <div className="space-y-4 bg-[#f7f8f4] p-4 sm:p-6">
            {loading ? <div className="flex min-h-52 items-center justify-center gap-3 text-xs text-[#748078]"><LoaderCircle className="h-5 w-5 animate-spin text-[#a1711b]" /> Loading orders...</div> : filteredOrders.length ? filteredOrders.map((order) => <FulfilmentCard key={order._id} order={order} saving={savingId === order._id} onUpdate={updateOrder} />) : <div className="rounded-2xl border border-dashed border-[#ccd5c9] bg-white py-14 text-center"><PackageCheck className="mx-auto h-8 w-8 text-[#8fa092]" /><p className="mt-3 font-display text-2xl text-[#294332]">No {filter.toLowerCase()} orders</p><p className="mt-1 text-[10px] text-[#818b84]">Orders matching this filter will appear here.</p></div>}
          </div>
        </div>
      </div>
    </section>
  )
}

function FulfilmentCard({ order, saving, onUpdate }) {
  const [form, setForm] = useState(() => formFromOrder(order))
  const nextStatus = NEXT_ORDER_STATUS[order.orderStatus]
  const final = ['Delivered', 'Cancelled'].includes(order.orderStatus)
  const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  useEffect(() => { setForm(formFromOrder(order)) }, [order])

  const payload = (orderStatus = order.orderStatus) => ({ ...form, orderStatus })
  const saveDetails = async () => { await onUpdate(order._id, payload()) }
  const advance = async () => { if (nextStatus) await onUpdate(order._id, payload(nextStatus)) }
  const cancel = async () => {
    if (!window.confirm('Cancel this order and restore its stock?')) return
    await onUpdate(order._id, payload('Cancelled'))
  }

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[#dfe4dc] bg-white shadow-[0_10px_28px_rgba(31,52,37,.05)]">
      <div className="flex flex-col justify-between gap-4 border-b border-[#e8ebe5] p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf2e9] text-[#4b7250]"><PackageCheck className="h-5 w-5" /></span><div><p className="text-[8px] font-black uppercase tracking-[.13em] text-[#909a93]">Order #{order._id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs font-bold text-[#2a4031]">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><p className="mt-1 text-[9px] text-[#859088]">Placed {formatOrderDate(order.createdAt)} · ₹{order.totalPrice.toLocaleString('en-IN')}</p></div></div>
        <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-wider ${statusTone(order.orderStatus)}`}>{order.orderStatus}</span>
      </div>

      <details className="group" open={!final}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-[8px] font-black uppercase tracking-[.14em] text-[#7d8880] hover:bg-[#fafaf7]"><span>Manage fulfilment</span><ChevronToggle /></summary>
        <div className="border-t border-[#eceee9] p-5">
          <OrderTimeline status={order.orderStatus} />

          <div className="mt-6 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            <div className="space-y-3">
              <InfoBlock icon={UserRound} label="Customer" value={order.user?.name || order.shippingAddress?.fullName} detail={`${order.user?.email || order.shippingAddress?.email} · ${order.shippingAddress?.phone}`} />
              <InfoBlock icon={MapPin} label="Delivery address" value={`${order.shippingAddress.addressLine}, ${order.shippingAddress.city}`} detail={`${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`} />
              <InfoBlock icon={IndianRupee} label="Payment" value={`${order.paymentMethod} · ${form.paymentStatus}`} detail={`Items ₹${order.itemsPrice.toLocaleString('en-IN')} ${order.shippingPrice ? `+ shipping ₹${order.shippingPrice}` : '· Free shipping'}`} />
            </div>

            <div className="rounded-2xl border border-[#dfe4dc] bg-[#fafbf8] p-4">
              <div className="mb-4 flex items-center gap-2"><Truck className="h-4 w-4 text-[#9f701a]" /><h3 className="text-[9px] font-black uppercase tracking-[.13em] text-[#33483a]">Dispatch & tracking details</h3></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField icon={Truck} label="Courier / delivery partner"><input value={form.courierName} onChange={setField('courierName')} placeholder="e.g. Delhivery or Self delivery" className={inputClass} /></AdminField>
                <AdminField icon={ClipboardList} label="Tracking / AWB number"><input value={form.trackingNumber} onChange={setField('trackingNumber')} placeholder="Tracking number" className={inputClass} /></AdminField>
                <AdminField icon={CalendarDays} label="Estimated delivery"><input type="date" value={form.estimatedDelivery} onChange={setField('estimatedDelivery')} className={inputClass} /></AdminField>
                <AdminField icon={MapPin} label="Current location"><input value={form.currentLocation} onChange={setField('currentLocation')} placeholder="e.g. Jaipur hub" className={inputClass} /></AdminField>
                <AdminField icon={Link2} label="Courier tracking URL"><input type="url" value={form.trackingUrl} onChange={setField('trackingUrl')} placeholder="https://courier.example/track" className={inputClass} /></AdminField>
                <AdminField icon={IndianRupee} label="Payment status"><select value={form.paymentStatus} onChange={setField('paymentStatus')} className={inputClass}>{PAYMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></AdminField>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-[7px] font-black uppercase tracking-wider text-[#79857d]">Customer-visible update note</span><textarea rows="2" maxLength="300" value={form.note} onChange={setField('note')} placeholder="Optional delivery update shown in the customer timeline" className={`${inputClass} resize-none`} /></label>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e8e2] pt-4">
                <button type="button" onClick={saveDetails} disabled={saving} className="flex items-center gap-2 rounded-full border border-[#cad3c8] px-4 py-2.5 text-[8px] font-black uppercase tracking-wider text-[#526158] transition hover:bg-white disabled:opacity-50"><Save className="h-3.5 w-3.5" /> Save details</button>
                <div className="flex flex-wrap gap-2">
                  {!final && <button type="button" onClick={cancel} disabled={saving} className="flex items-center gap-1.5 rounded-full px-3 py-2.5 text-[8px] font-black uppercase tracking-wider text-[#a04f44] hover:bg-[#fff0ed] disabled:opacity-50"><XCircle className="h-3.5 w-3.5" /> Cancel order</button>}
                  {nextStatus && <button type="button" onClick={advance} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#123b2a] px-5 py-2.5 text-[8px] font-black uppercase tracking-[.1em] text-white shadow-sm transition hover:bg-[#a8751d] disabled:opacity-50">{saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />} {nextAction(order.orderStatus)}</button>}
                  {order.orderStatus === 'Delivered' && <span className="flex items-center gap-2 rounded-full bg-[#e7f3e8] px-4 py-2.5 text-[8px] font-black uppercase tracking-wider text-[#397045]"><CheckCircle2 className="h-3.5 w-3.5" /> Fulfilment complete</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
    </article>
  )
}

const inputClass = 'w-full rounded-xl border border-[#d9e0d6] bg-white px-3 py-2.5 text-[10px] text-[#2d4134] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#b4862d] focus:ring-3 focus:ring-[#b4862d]/10'

function formFromOrder(order) {
  return {
    courierName: order.courierName || '',
    trackingNumber: order.trackingNumber || '',
    trackingUrl: order.trackingUrl || '',
    currentLocation: order.currentLocation || '',
    estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().slice(0, 10) : '',
    paymentStatus: order.paymentStatus || 'Pending',
    note: '',
  }
}

function nextAction(status) {
  return { Processing: 'Confirm order', Confirmed: 'Mark packed', Packed: 'Dispatch order', Shipped: 'Out for delivery', 'Out for Delivery': 'Mark delivered' }[status]
}

function InfoBlock({ icon: Icon, label, value, detail }) {
  return <div className="flex gap-3 rounded-2xl bg-[#f5f6f1] p-4"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9d711d]" /><div className="min-w-0"><p className="text-[7px] font-black uppercase tracking-wider text-[#8b958e]">{label}</p><p className="mt-1 text-[10px] font-bold leading-4 text-[#33483a]">{value}</p><p className="mt-0.5 break-words text-[9px] leading-4 text-[#78837c]">{detail}</p></div></div>
}

function AdminField({ icon: Icon, label, children }) {
  return <label><span className="mb-1.5 flex items-center gap-1.5 text-[7px] font-black uppercase tracking-wider text-[#79857d]"><Icon className="h-3 w-3 text-[#a4751e]" />{label}</span>{children}</label>
}

function ChevronToggle() {
  return <span className="grid h-6 w-6 place-items-center rounded-full bg-[#eff2ec] text-sm transition group-open:rotate-180">⌄</span>
}
