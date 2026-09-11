import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  Phone,
  MapPin,
  Navigation,
  LogOut,
  RefreshCw,
  ShieldCheck,
  PackageCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  IndianRupee,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LocateFixed,
  Send,
  Sparkles,
  Layers,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../api/client.js'
import { roleOf } from '../data/roles.js'
import './Delivery.css'

export default function DeliveryPage() {
  const { user, login, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('Active')
  const [search, setSearch] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/delivery/orders')
      setOrders(data.orders || [])
      setError('')
      setAccessDenied(false)
      setUpdatedAt(new Date())
    } catch (err) {
      setError(err.message)
      if (err.statusCode === 403) {
        setAccessDenied(true)
        setOrders([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setOrders([])
    setAccessDenied(false)
    if (roleOf(user) !== 'delivery_boy') return
    let alive = true
    const refresh = () =>
      apiRequest('/delivery/orders')
        .then((data) => {
          if (alive) {
            setOrders(data.orders || [])
            setError('')
            setAccessDenied(false)
            setUpdatedAt(new Date())
          }
        })
        .catch((err) => {
          if (alive) {
            setError(err.message)
            if (err.statusCode === 403) {
              setAccessDenied(true)
              setOrders([])
            }
          }
        })
        .finally(() => {
          if (alive) setLoading(false)
        })

    setLoading(true)
    refresh()
    const timer = setInterval(refresh, 20000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [user?._id, user?.role, user?.isDriver])

  const signIn = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try {
      await login({ ...values, portal: 'delivery' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Not signed in
  if (!user) {
    return (
      <div className="delivery-ui delivery-portal delivery-signin-page">
        <div className="delivery-signin-shell">
          <aside className="delivery-signin-story">
            <span className="delivery-eyebrow">DIVYA SWASTH / DELIVERY HUB</span>
            <div className="story-hero-icon">
              <Truck size={42} strokeWidth={1.5} />
            </div>
            <h1>
              Doorstep Care.<br />
              <em>Verified Delivery.</em>
            </h1>
            <p>Your dedicated workspace for pickups, route location updates, and verified OTP completions.</p>
            <ol>
              {[
                'Sign in with your admin-assigned partner account',
                'Pick up packed orders and mark route updates',
                'Verify customer OTP and collect COD payments',
              ].map((text, index) => (
                <li key={text}>
                  <span>{index + 1}</span>
                  {text}
                </li>
              ))}
            </ol>
            <Link to="/" className="story-back-link">
              ← Return to Divya Swasth Store
            </Link>
          </aside>

          <form className="delivery-signin-form" onSubmit={signIn}>
            <span className="delivery-badge-pill">DELIVERY PARTNER ACCESS</span>
            <h2>Sign in to Partner Hub</h2>
            <p className="delivery-muted">Enter the credentials provided by your store administrator.</p>

            <label htmlFor="driver-email">Partner Login Email</label>
            <input
              id="driver-email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="delivery@divyaswasth.in"
              required
            />

            <label htmlFor="driver-password">Password</label>
            <input
              id="driver-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />

            {error && (
              <p role="alert" className="delivery-error-box">
                <AlertCircle size={16} />
                {error}
              </p>
            )}

            <button className="btn-primary-delivery" disabled={loading}>
              {loading ? 'Signing in...' : 'Open Delivery Dashboard'}
              <ArrowRight size={17} />
            </button>

            <div className="delivery-signin-help">
              <ShieldCheck size={20} />
              <p>
                Need account activation or password reset?<br />
                <strong>Contact your store administrator.</strong>
              </p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Not a delivery boy account
  if (roleOf(user) !== 'delivery_boy') {
    return (
      <div className="delivery-ui delivery-portal flex items-center justify-center min-h-screen">
        <div className="delivery-card text-center max-w-md p-8">
          <div className="mx-auto w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-4">
            <Truck size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Delivery Account Required</h2>
          <p className="text-sm text-gray-600 mb-6">
            You are logged in as <strong>{user.name}</strong> ({roleOf(user).replace('_', ' ')}). Please use a dedicated delivery partner account.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={logout} className="btn-primary-delivery">
              Sign in with another account
            </button>
            <Link
              to={roleOf(user) === 'admin' ? '/admin?tab=delivery' : roleOf(user) === 'super_admin' ? '/super-admin' : '/'}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              ← Back to {roleOf(user) === 'admin' ? 'Admin Panel' : roleOf(user) === 'super_admin' ? 'Super Admin' : 'Store'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Access Paused / Disabled
  if (accessDenied) {
    return (
      <div className="delivery-ui delivery-portal flex items-center justify-center min-h-screen">
        <div className="delivery-card text-center max-w-md p-8">
          <div className="mx-auto w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Delivery Access Paused</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your delivery partner account or your store admin subscription is currently paused. Contact your admin to reactivate access.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={logout} className="btn-cancel">
              Sign out
            </button>
            <button onClick={load} disabled={loading} className="btn-primary-delivery">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Check again
            </button>
          </div>
          {error && <p className="delivery-error-box mt-4">{error}</p>}
        </div>
      </div>
    )
  }

  // Stats calculation
  const readyPickupCount = orders.filter((o) => o.orderStatus === 'Packed').length
  const onTheRoadCount = orders.filter((o) => ['Shipped', 'Out for Delivery'].includes(o.orderStatus)).length
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length
  const pendingCodAmount = orders
    .filter((o) => o.orderStatus !== 'Delivered' && o.paymentMethod === 'COD' && o.paymentStatus !== 'Paid')
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const shown = orders
    .filter((order) => {
      if (filter === 'All') return true
      if (filter === 'Active') return !['Delivered', 'Cancelled'].includes(order.orderStatus)
      if (filter === 'Packed') return order.orderStatus === 'Packed'
      if (filter === 'Shipped') return order.orderStatus === 'Shipped'
      if (filter === 'Out for Delivery') return order.orderStatus === 'Out for Delivery'
      if (filter === 'Delivered') return order.orderStatus === 'Delivered'
      return true
    })
    .filter((order) =>
      [
        order._id,
        order.shippingAddress?.fullName,
        order.shippingAddress?.city,
        order.shippingAddress?.postalCode,
        order.shippingAddress?.addressLine,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  return (
    <div className="delivery-ui delivery-portal-dashboard">
      <div className="delivery-dashboard-wrap">
        {/* ── TOP NAV BAR ── */}
        <nav className="delivery-top-navbar">
          <div className="delivery-nav-brand">
            <div className="delivery-brand-icon">
              <Truck size={22} />
            </div>
            <div>
              <span className="brand-name">Divya Swasth</span>
              <span className="brand-badge">PARTNER HUB</span>
            </div>
          </div>

          <div className="delivery-nav-actions">
            <div className="live-status-pill">
              <span className="pulse-dot" />
              <span>Active Partner Hub</span>
            </div>
            <button type="button" onClick={logout} className="delivery-signout-btn">
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        {/* ── HERO BANNER ── */}
        <header className="delivery-agent-hero">
          <div className="hero-welcome-text">
            <span className="delivery-eyebrow">YOUR DELIVERY WORKSPACE</span>
            <h1>Namaste, {user.name.split(' ')[0]}.</h1>
            <p>Pick up orders on time, keep customers updated, and verify doorstep delivery with OTP.</p>
          </div>

          <div className="delivery-agent-profile-pill">
            <div className="agent-avatar">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="agent-meta">
              <strong>{user.name}</strong>
              <span>
                <MapPin size={12} /> {user.deliveryArea || 'Assigned Delivery Area'}
              </span>
              <small>● Active Delivery Partner</small>
            </div>
          </div>
        </header>

        {/* ── KPI METRICS CARDS ── */}
        <section className="delivery-metrics-grid">
          <div className="delivery-metric-card">
            <div className="metric-icon pickup">
              <PackageCheck size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Ready for Pickup</span>
              <h3 className="metric-value">{readyPickupCount}</h3>
              <span className="metric-subtext">Packed at warehouse</span>
            </div>
          </div>

          <div className="delivery-metric-card">
            <div className="metric-icon road">
              <Truck size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">On The Road</span>
              <h3 className="metric-value">{onTheRoadCount}</h3>
              <span className="metric-subtext">Shipped / Out for delivery</span>
            </div>
          </div>

          <div className="delivery-metric-card">
            <div className="metric-icon delivered">
              <CheckCircle2 size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Delivered Orders</span>
              <h3 className="metric-value">{deliveredCount}</h3>
              <span className="metric-subtext">Successfully verified with OTP</span>
            </div>
          </div>

          <div className="delivery-metric-card">
            <div className="metric-icon cod">
              <IndianRupee size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Pending COD Collection</span>
              <h3 className="metric-value text-amber-700">₹{pendingCodAmount.toLocaleString('en-IN')}</h3>
              <span className="metric-subtext">Cash to collect upon delivery</span>
            </div>
          </div>
        </section>

        {/* ── WORKFLOW STEPPER ── */}
        <div className="delivery-stepper-bar">
          <div className="stepper-item">
            <span className="step-num">1</span>
            <span>Admin Packs & Assigns</span>
          </div>
          <div className="stepper-divider" />
          <div className="stepper-item">
            <span className="step-num">2</span>
            <span>You Pick Up Order</span>
          </div>
          <div className="stepper-divider" />
          <div className="stepper-item">
            <span className="step-num">3</span>
            <span>Out for Delivery & GPS</span>
          </div>
          <div className="stepper-divider" />
          <div className="stepper-item">
            <span className="step-num">4</span>
            <span>Customer OTP & Cash</span>
          </div>
        </div>

        {/* ── MAIN DELIVERIES LIST & TOOLBAR ── */}
        <section className="delivery-orders-container">
          <div className="delivery-toolbar-header">
            <div>
              <h2>Assigned Deliveries ({orders.length})</h2>
              <p className="delivery-muted">
                {updatedAt
                  ? `Last synced at ${updatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                  : 'Syncing assignments...'} · Auto-refreshes every 20s
              </p>
            </div>

            <button type="button" onClick={load} disabled={loading} className="btn-refresh-deliveries">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="delivery-filter-search-row">
            <div className="delivery-filter-pills">
              {[
                ['Active', `Active (${orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.orderStatus)).length})`],
                ['Packed', `Pickup Ready (${readyPickupCount})`],
                ['Shipped', `In Transit (${orders.filter((o) => o.orderStatus === 'Shipped').length})`],
                ['Out for Delivery', `Out for Delivery (${orders.filter((o) => o.orderStatus === 'Out for Delivery').length})`],
                ['Delivered', `Delivered (${deliveredCount})`],
                ['All', `All (${orders.length})`],
              ].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  className={filter === val ? 'active' : ''}
                  onClick={() => setFilter(val)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="delivery-search-input">
              <Search size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, address, PIN code..."
              />
            </div>
          </div>

          {error && (
            <div className="delivery-error-box mt-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Deliveries Cards Grid */}
          <div className="delivery-cards-grid">
            {shown.map((order) => (
              <DeliveryJobCard
                key={order._id}
                order={order}
                onUpdated={(updated) =>
                  setOrders((current) => current.map((item) => (item._id === updated._id ? updated : item)))
                }
              />
            ))}

            {!shown.length && (
              <div className="delivery-empty-state">
                <PackageCheck size={44} />
                <h3>{loading ? 'Loading deliveries...' : 'No Deliveries Found'}</h3>
                <p>
                  {search || filter !== 'Active'
                    ? 'No orders match this filter or search query.'
                    : 'Orders assigned by your store admin will appear here automatically.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function DeliveryJobCard({ order, onUpdated }) {
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  const [otp, setOtp] = useState('')
  const [cashCollected, setCashCollected] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const address = order.shippingAddress || {}
  const closed = ['Delivered', 'Cancelled'].includes(order.orderStatus)
  const nextStatus = { Packed: 'Shipped', Shipped: 'Out for Delivery' }[order.orderStatus]

  const submit = async (complete = false, status = order.orderStatus) => {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const locText = location.trim() || (status === 'Shipped' ? 'Store / Warehouse Pickup' : order.currentLocation || 'In Transit')
      const body = complete
        ? { otp, cashCollected }
        : { location: locText, note: note.trim(), status, ...(coordinates && { coordinates }) }
      const data = await apiRequest(
        `/delivery/orders/${order._id}/${complete ? 'complete' : 'update'}`,
        { method: complete ? 'POST' : 'PUT', body: JSON.stringify(body) }
      )
      onUpdated(data.order)
      setOtp('')
      setCoordinates(null)
      setNote('')
      setMessage(complete ? '🎉 Delivery successfully verified and completed!' : '✓ Tracking update shared with customer.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const captureGps = () => {
    setError('')
    if (!navigator.geolocation) {
      setError('GPS is unavailable on this device. Please enter area manually.')
      return
    }
    setBusy(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setBusy(false)
      },
      () => {
        setError('Unable to fetch GPS. Allow location access in browser or enter area manually.')
        setBusy(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  return (
    <article className={`delivery-job-card status-border-${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Top Header */}
      <div className="job-card-header">
        <div className="order-id-tag">
          <span>ORDER #{order._id.slice(-8).toUpperCase()}</span>
        </div>
        <span className={`job-status-pill status-${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Customer Info */}
      <div className="job-customer-info">
        <h3 className="customer-name">{address.fullName || 'Customer Name'}</h3>
        <p className="customer-address">
          <MapPin size={15} />
          <span>
            {address.addressLine}, {address.city}, {address.state} — <strong>{address.postalCode}</strong>
          </span>
        </p>

        {/* Quick Action Dial / Map Buttons */}
        <div className="job-quick-actions">
          {address.phone && (
            <a href={`tel:${address.phone}`} className="btn-action-call">
              <Phone size={15} />
              <span>Call Customer</span>
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              [address.addressLine, address.city, address.state, address.postalCode].join(', ')
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn-action-directions"
          >
            <Navigation size={15} />
            <span>Map Directions</span>
          </a>
        </div>
      </div>

      {/* Package Items & Amount */}
      <div className="job-items-summary">
        <div className="items-text">
          {order.items?.map((item) => `${item.name} (×${item.quantity})`).join(' · ')}
        </div>
        <div className="payment-badge-row">
          <span className="total-price">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
          <span className="payment-method">
            {order.paymentMethod} · {order.paymentStatus}
          </span>
          {order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid' && (
            <span className="cod-alert">💰 COLLECT CASH ON DELIVERY</span>
          )}
        </div>
      </div>

      {/* Last Known Location */}
      {order.currentLocation && (
        <div className="last-location-box">
          <Clock size={13} />
          <span>Last update: <strong>{order.currentLocation}</strong></span>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="delivery-error-box mt-3">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="delivery-success-box mt-3">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Step Actions */}
      {!closed && (
        <div className="job-actions-panel">
          {['Processing', 'Confirmed', 'Packed'].includes(order.orderStatus) && (
            <div className="action-step-card">
              <p className="step-prompt">Order is assigned to you. Confirm pickup to begin transit:</p>
              <label htmlFor={`loc-${order._id}`}>Current Area / Pickup Location (Optional)</label>
              <input
                id={`loc-${order._id}`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={120}
                placeholder="e.g. Warehouse pickup / Sector 62 Noida"
              />
              <button
                type="button"
                className="btn-step-action"
                disabled={busy}
                onClick={() => submit(false, 'Shipped')}
              >
                <PackageCheck size={16} />
                <span>Confirm Pickup (Mark Shipped)</span>
              </button>
            </div>
          )}

          {order.orderStatus === 'Shipped' && (
            <div className="action-step-card">
              <p className="step-prompt">Order picked up. Heading towards destination:</p>
              <label htmlFor={`loc-${order._id}`}>Current Area / Landmark *</label>
              <input
                id={`loc-${order._id}`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={120}
                placeholder="e.g. Near City Center Metro"
              />
              <label htmlFor={`note-${order._id}`}>Route Note (Optional)</label>
              <input
                id={`note-${order._id}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
                placeholder="e.g. On the way, reaching in 15 mins"
              />
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={captureGps} disabled={busy} className="btn-gps">
                  <LocateFixed size={15} />
                  <span>{coordinates ? 'GPS Attached ✓' : 'Attach GPS'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => submit(false, 'Out for Delivery')}
                  disabled={busy || !location.trim()}
                  className="btn-step-action flex-1"
                >
                  <Truck size={16} />
                  <span>Mark Out for Delivery</span>
                </button>
              </div>
            </div>
          )}

          {order.orderStatus === 'Out for Delivery' && (
            <form
              className="action-otp-card"
              onSubmit={(e) => {
                e.preventDefault()
                submit(true)
              }}
            >
              <div className="otp-header">
                <ShieldCheck size={20} className="text-emerald-700" />
                <div>
                  <h4>Verify Doorstep Delivery</h4>
                  <p>Ask the customer for the 6-digit OTP shown on their order tracking page.</p>
                </div>
              </div>

              <label htmlFor={`otp-${order._id}`}>Customer 6-Digit Delivery OTP *</label>
              <input
                id={`otp-${order._id}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                className="otp-input-field"
                placeholder="• • • • • •"
              />

              {order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid' && (
                <label className="cod-confirm-checkbox">
                  <input
                    type="checkbox"
                    checked={cashCollected}
                    onChange={(e) => setCashCollected(e.target.checked)}
                    required
                  />
                  <span>
                    I confirm I have collected <strong>₹{order.totalPrice?.toLocaleString('en-IN')}</strong> cash from customer
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="btn-verify-delivered"
                disabled={busy || otp.length !== 6 || (order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid' && !cashCollected)}
              >
                <CheckCircle2 size={18} />
                <span>{busy ? 'Verifying...' : 'Verify OTP & Mark Delivered'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Expandable History */}
      <div className="job-history-accordion">
        <button type="button" onClick={() => setShowHistory(!showHistory)} className="history-toggle-btn">
          <span>Tracking Timeline ({order.trackingEvents?.length || 0})</span>
          {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showHistory && (
          <div className="history-timeline-list">
            {[...(order.trackingEvents || [])].reverse().map((event, idx) => (
              <div key={event._id || idx} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <strong>{event.title}</strong>
                  <p>{event.message} {event.location && `· ${event.location}`}</p>
                  <small>{new Date(event.timestamp).toLocaleString('en-IN')}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
