import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, Phone, MapPin, Navigation, LogOut, RefreshCw, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../api/client.js'
import './Delivery.css'

export default function DeliveryPage() {
  const { user, login, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('Active')
  const load = async () => {
    setLoading(true)
    try { const data = await apiRequest('/delivery/orders'); setOrders(data.orders); setError('') }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => {
    if (!user?.isDriver) return
    let alive = true
    const refresh = () => apiRequest('/delivery/orders').then(data => { if (alive) { setOrders(data.orders); setError('') } }).catch(err => { if (alive) setError(err.message) }).finally(() => { if (alive) setLoading(false) })
    setLoading(true); refresh()
    const timer = setInterval(refresh, 20000)
    return () => { alive = false; clearInterval(timer) }
  }, [user?._id, user?.isDriver])
  const signIn = async event => {
    event.preventDefault(); setLoading(true); setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try { await login(values) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  if (!user) return <div className="delivery-ui delivery-portal"><div className="delivery-login"><div className="delivery-hero"><div><Truck size={34} /><h1>Deliver with care.</h1><p>Divya Swasth delivery partner portal</p></div></div><form className="delivery-card" onSubmit={signIn}><h2>Delivery partner login</h2><p className="delivery-muted">Use the account provided by your store admin.</p><label htmlFor="driver-email">Email</label><input id="driver-email" name="email" type="email" autoComplete="username" required /><label htmlFor="driver-password">Password</label><input id="driver-password" name="password" type="password" autoComplete="current-password" required />{error && <p role="alert" className="delivery-error">{error}</p>}<div className="delivery-actions"><button className="primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in to deliveries'}</button><Link className="delivery-action" to="/">Back to store</Link></div></form></div></div>
  if (!user.isDriver) return <div className="delivery-ui delivery-portal"><div className="delivery-card delivery-login"><h2>Delivery account required</h2><p>Ask your admin for a delivery partner account.</p><button onClick={logout}>Sign in with another account</button><Link className="delivery-action" to={user.isAdmin ? '/admin?tab=delivery' : '/'}>Go back</Link></div></div>
  const shown = orders.filter(order => filter === 'All' || (filter === 'Active' ? !['Delivered', 'Cancelled'].includes(order.orderStatus) : order.orderStatus === filter))
  return <div className="delivery-ui delivery-portal"><div className="delivery-wrap"><header className="delivery-hero"><div><span className="delivery-eyebrow">DIVYA SWASTH / DELIVERY PARTNER</span><h1>Hello, {user.name.split(' ')[0]}.</h1><p>Your route, your deliveries. Bring wellness to their door.</p></div><button onClick={logout}><LogOut size={16} />Sign out</button></header><div className="delivery-stats">{[['Assigned', orders.filter(o => !['Delivered', 'Cancelled'].includes(o.orderStatus)).length], ['On the road', orders.filter(o => o.orderStatus === 'Out for Delivery').length], ['Delivered', orders.filter(o => o.orderStatus === 'Delivered').length]].map(([label, count]) => <div className="delivery-stat" key={label}><strong>{count}</strong><span>{label}</span></div>)}</div><div className="delivery-row"><div className="delivery-actions">{['Active', 'Delivered', 'All'].map(value => <button key={value} className={filter === value ? 'primary' : ''} onClick={() => setFilter(value)}>{value}</button>)}</div><button onClick={load} disabled={loading}><RefreshCw size={16} />Refresh</button></div><p className="delivery-muted">Assignments refresh every 20 seconds. Share a location update at each stop.</p>{error && <p role="alert" className="delivery-error">{error}</p>}<div className="delivery-grid" style={{ marginTop: 20 }}>{shown.map(order => <DeliveryCard key={order._id} order={order} onUpdated={updated => setOrders(current => current.map(item => item._id === updated._id ? updated : item))} />)}{!shown.length && <div className="delivery-card delivery-empty">{loading ? 'Loading your deliveries…' : 'No deliveries here yet.'}</div>}</div></div></div>
}

function DeliveryCard({ order, onUpdated }) {
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  const [otp, setOtp] = useState('')
  const [cashCollected, setCashCollected] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const address = order.shippingAddress
  const closed = ['Delivered', 'Cancelled'].includes(order.orderStatus)
  const next = { Packed: 'Shipped', Shipped: 'Out for Delivery' }[order.orderStatus]
  const submit = async (complete = false, status = order.orderStatus) => {
    setBusy(true); setError(''); setMessage('')
    try {
      const body = complete ? { otp, cashCollected } : { location, note, status, ...(coordinates && { coordinates }) }
      const data = await apiRequest(`/delivery/orders/${order._id}/${complete ? 'complete' : 'update'}`, { method: complete ? 'POST' : 'PUT', body: JSON.stringify(body) })
      onUpdated(data.order); setOtp(''); setCoordinates(null); setNote(''); setMessage(complete ? 'Delivery completed. Thank you!' : 'Tracking updated for the customer.')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const gps = () => {
    setError('')
    if (!navigator.geolocation) { setError('GPS is unavailable. Enter your area manually.'); return }
    setBusy(true)
    navigator.geolocation.getCurrentPosition(position => { setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude }); setBusy(false) }, () => { setError('Location unavailable. Allow browser location access or enter your area manually.'); setBusy(false) }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 })
  }
  return <article className="delivery-card"><div className="delivery-row"><span className="delivery-muted">#{order._id.slice(-8).toUpperCase()}</span><span className="delivery-badge">{order.orderStatus}</span></div><h2 style={{ marginTop: 16 }}>{address.fullName}</h2><p><MapPin size={16} style={{ display: 'inline' }} /> {address.addressLine}, {address.city}, {address.state} {address.postalCode}</p><div className="delivery-actions"><a className="delivery-action" href={`tel:${address.phone}`}><Phone size={16} />Call customer</a><a className="delivery-action" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([address.addressLine, address.city, address.state, address.postalCode].join(', '))}`} target="_blank" rel="noreferrer"><Navigation size={16} />Directions</a></div><p>{order.items.map(item => `${item.quantity} × ${item.name}`).join(' · ')}</p><div className="delivery-note">₹{order.totalPrice.toLocaleString('en-IN')} · {order.paymentMethod} · {order.paymentStatus}{order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid' && <strong> — Collect payment</strong>}</div>{order.currentLocation && <p className="delivery-muted">Last update: {order.currentLocation}</p>}{!closed && <><label htmlFor={`location-${order._id}`}>Current area / landmark</label><input id={`location-${order._id}`} value={location} onChange={e => { setLocation(e.target.value); setCoordinates(null) }} maxLength={120} placeholder="e.g. Sector 62, near metro station" /><label htmlFor={`note-${order._id}`}>Delivery update (optional)</label><input id={`note-${order._id}`} value={note} onChange={e => setNote(e.target.value)} maxLength={300} placeholder="Reached your area / customer unavailable" /><div className="delivery-actions"><button disabled={busy} onClick={gps}><MapPin size={16} />{coordinates ? 'GPS attached' : 'Attach current GPS'}</button><button disabled={busy || !location.trim()} onClick={() => submit()}>Share update</button>{next && <button className="primary" disabled={busy || !location.trim()} onClick={() => submit(false, next)}>{next === 'Shipped' ? 'Picked up order' : 'Out for Delivery'}</button>}</div>{['Processing', 'Confirmed'].includes(order.orderStatus) && <p className="delivery-muted">Waiting for admin to mark the order packed before pickup.</p>}{order.orderStatus === 'Out for Delivery' && <form className="delivery-otp" onSubmit={e => { e.preventDefault(); submit(true) }}><h3><ShieldCheck size={18} style={{ display: 'inline' }} /> Verify doorstep delivery</h3><p className="delivery-muted">After handing over the package, ask the customer for the code on their order tracking page.</p><label htmlFor={`otp-${order._id}`}>Customer delivery OTP</label><input id={`otp-${order._id}`} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="off" pattern="[0-9]{6}" required placeholder="6 digit code" />{order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid' && <label><input type="checkbox" checked={cashCollected} onChange={e => setCashCollected(e.target.checked)} required />I collected ₹{order.totalPrice.toLocaleString('en-IN')} from the customer</label>}<div className="delivery-actions"><button className="primary" disabled={busy || otp.length !== 6}>Verify OTP & mark delivered</button></div></form>}</>}{error && <p role="alert" className="delivery-error">{error}</p>}{message && <p role="status">{message}</p>}<details className="delivery-history"><summary>Delivery history</summary>{[...order.trackingEvents].reverse().map(event => <p key={event._id}><strong>{event.title}</strong><br />{event.message} {event.location && ` · ${event.location}`}<br /><small>{new Date(event.timestamp).toLocaleString('en-IN')}</small></p>)}</details></article>
}
