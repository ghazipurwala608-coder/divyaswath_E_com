import {
  ArrowRight,
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
  Truck,
  UserRound,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import OrderTimeline from '../components/OrderTimeline.jsx'
import { NEXT_ORDER_STATUS, ORDER_FILTERS, PAYMENT_STATUSES, formatOrderDate, statusTone } from '../data/orderTracking.js'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')
  const [filter, setFilter] = useState('Active')
  const load = async () => {
    setLoading(true); setError('')
    try { const data = await apiRequest('/orders/admin/all'); setOrders(data.orders) }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  const filteredOrders = useMemo(() => orders.filter(order => filter === 'All' || (filter === 'Active' ? !['Delivered', 'Cancelled'].includes(order.orderStatus) : order.orderStatus === filter)), [filter, orders])
  const updateOrder = async (id, payload) => {
    setSavingId(id)
    try {
      const { order: updated } = await apiRequest('/orders/' + id + '/status', { method: 'PUT', body: JSON.stringify(payload) })
      setOrders(current => current.map(order => order._id === id ? { ...updated, user: order.user } : order))
      window.dispatchEvent(new Event('products-updated'))
      toast.success('Order updated')
      return true
    } catch (err) { toast.error(err.message); return false } finally { setSavingId('') }
  }
  return <section className="admin-orders"><div className="admin-toolbar"><div className="admin-order-filters">{ORDER_FILTERS.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="admin-button secondary" onClick={load}><RefreshCcw size={15} />Refresh</button></div>{error ? <div className="admin-state" role="alert"><p>{error}</p><button className="admin-button" onClick={load}>Try again</button></div> : loading ? <div className="admin-state"><LoaderCircle className="animate-spin" />Loading orders…</div> : filteredOrders.length ? <div className="admin-order-list">{filteredOrders.map(order => <FulfilmentCard key={order._id} order={order} saving={savingId === order._id} onUpdate={updateOrder} />)}</div> : <div className="admin-panel admin-state"><PackageCheck /><h2>No matching orders</h2><p>Orders matching this filter will appear here.</p></div>}</section>
}

function FulfilmentCard({ order, saving, onUpdate }) {
  const [form, setForm] = useState(() => formFromOrder(order))
  const nextStatus = order.deliveryPerson && ['Packed', 'Shipped', 'Out for Delivery'].includes(order.orderStatus) ? null : NEXT_ORDER_STATUS[order.orderStatus]
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
        <div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf2e9] text-[#4b7250]"><PackageCheck className="h-5 w-5" /></span><div><p className="text-[12px] font-black uppercase tracking-[.06em] text-[#637267]">Order #{order._id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs font-bold text-[#2a4031]">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><p className="mt-1 text-[12px] text-[#637267]">Placed {formatOrderDate(order.createdAt)} · ₹{order.totalPrice.toLocaleString('en-IN')}</p></div></div>
        <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-[12px] font-black uppercase tracking-wider ${statusTone(order.orderStatus)}`}>{order.orderStatus}</span>
      </div>

      <details className="group" open={!final}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-[12px] font-black uppercase tracking-[.06em] text-[#637267] hover:bg-[#fafaf7]"><span>Manage fulfilment</span><ChevronToggle /></summary>
        <div className="border-t border-[#eceee9] p-5">
          <OrderTimeline status={order.orderStatus} /><div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#eff4e9] p-3 text-xs"><span>{order.deliveryPerson ? "Delivery partner assigned. Pickup, location updates and customer OTP completion happen in the partner dashboard." : "Using your delivery team? Confirm and pack this order, then assign a partner."}</span><Link to="/admin?tab=delivery" className="font-bold underline">Manage delivery team</Link></div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            <div className="space-y-3">
              <InfoBlock icon={UserRound} label="Customer" value={order.user?.name || order.shippingAddress?.fullName} detail={`${order.user?.email || order.shippingAddress?.email} · ${order.shippingAddress?.phone}`} />
              <InfoBlock icon={MapPin} label="Delivery address" value={`${order.shippingAddress.addressLine}, ${order.shippingAddress.city}`} detail={`${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`} />
              <InfoBlock icon={IndianRupee} label="Payment" value={`${order.paymentMethod} · ${form.paymentStatus}`} detail={`Items ₹${order.itemsPrice.toLocaleString('en-IN')} ${order.shippingPrice ? `+ shipping ₹${order.shippingPrice}` : '· Free shipping'}`} />
            </div>

            <div className="rounded-2xl border border-[#dfe4dc] bg-[#fafbf8] p-4">
              <div className="mb-4 flex items-center gap-2"><Truck className="h-4 w-4 text-[#9f701a]" /><h3 className="text-[12px] font-black uppercase tracking-[.06em] text-[#33483a]">Dispatch & tracking details</h3></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField icon={Truck} label="Courier / delivery partner"><input value={form.courierName} onChange={setField('courierName')} placeholder="e.g. Delhivery or Self delivery" className={inputClass} /></AdminField>
                <AdminField icon={ClipboardList} label="Tracking / AWB number"><input value={form.trackingNumber} onChange={setField('trackingNumber')} placeholder="Tracking number" className={inputClass} /></AdminField>
                <AdminField icon={CalendarDays} label="Estimated delivery"><input type="date" value={form.estimatedDelivery} onChange={setField('estimatedDelivery')} className={inputClass} /></AdminField>
                <AdminField icon={MapPin} label="Current location"><input value={form.currentLocation} onChange={setField('currentLocation')} placeholder="e.g. Jaipur hub" className={inputClass} /></AdminField>
                <AdminField icon={Link2} label="Courier tracking URL"><input type="url" value={form.trackingUrl} onChange={setField('trackingUrl')} placeholder="https://courier.example/track" className={inputClass} /></AdminField>
                <AdminField icon={IndianRupee} label="Payment status"><select value={form.paymentStatus} onChange={setField('paymentStatus')} className={inputClass}>{PAYMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></AdminField>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-[12px] font-black uppercase tracking-wider text-[#79857d]">Customer-visible update note</span><textarea rows="2" maxLength="300" value={form.note} onChange={setField('note')} placeholder="Optional delivery update shown in the customer timeline" className={`${inputClass} resize-none`} /></label>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e8e2] pt-4">
                <button type="button" onClick={saveDetails} disabled={saving} className="flex items-center gap-2 rounded-full border border-[#cad3c8] px-4 py-2.5 text-[12px] font-black uppercase tracking-wider text-[#526158] transition hover:bg-white disabled:opacity-50"><Save className="h-3.5 w-3.5" /> Save details</button>
                <div className="flex flex-wrap gap-2">
                  {!final && <button type="button" onClick={cancel} disabled={saving} className="flex items-center gap-1.5 rounded-full px-3 py-2.5 text-[12px] font-black uppercase tracking-wider text-[#a04f44] hover:bg-[#fff0ed] disabled:opacity-50"><XCircle className="h-3.5 w-3.5" /> Cancel order</button>}
                  {nextStatus && <button type="button" onClick={advance} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#123b2a] px-5 py-2.5 text-[12px] font-black uppercase tracking-[.1em] text-white shadow-sm transition hover:bg-[#a8751d] disabled:opacity-50">{saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />} {nextAction(order.orderStatus)}</button>}
                  {order.orderStatus === 'Delivered' && <span className="flex items-center gap-2 rounded-full bg-[#e7f3e8] px-4 py-2.5 text-[12px] font-black uppercase tracking-wider text-[#397045]"><CheckCircle2 className="h-3.5 w-3.5" /> Fulfilment complete</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
    </article>
  )
}

const inputClass = 'w-full rounded-xl border border-[#d9e0d6] bg-white px-3 py-2.5 text-[12px] text-[#2d4134] outline-none transition placeholder:text-[#718177] focus:border-[#b4862d] focus:ring-3 focus:ring-[#b4862d]/10'

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
  return <div className="flex gap-3 rounded-2xl bg-[#f5f6f1] p-4"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9d711d]" /><div className="min-w-0"><p className="text-[12px] font-black uppercase tracking-wider text-[#637267]">{label}</p><p className="mt-1 text-[12px] font-bold leading-4 text-[#33483a]">{value}</p><p className="mt-0.5 break-words text-[12px] leading-4 text-[#637267]">{detail}</p></div></div>
}

function AdminField({ icon: Icon, label, children }) {
  return <label><span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-[#79857d]"><Icon className="h-3 w-3 text-[#a4751e]" />{label}</span>{children}</label>
}

function ChevronToggle() {
  return <span className="grid h-6 w-6 place-items-center rounded-full bg-[#eff2ec] text-sm transition group-open:rotate-180">⌄</span>
}
