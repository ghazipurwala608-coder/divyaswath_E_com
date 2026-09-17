import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Truck, RefreshCw, UserPlus, UsersRound, MapPin, ExternalLink, CheckCircle2, Clock, Check } from 'lucide-react'
import { apiRequest } from '../api/client.js'
import { Badge, EmptyState } from './AdminUI.jsx'
import DeliveryTeamMember from './DeliveryTeamMember.jsx'

export default function DeliveryPanel() {
  const [drivers, setDrivers] = useState([])
  const [orders, setOrders] = useState([])
  const [area, setArea] = useState('')
  const [filter, setFilter] = useState('Active')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [team, data] = await Promise.all([
        apiRequest('/delivery/team'),
        apiRequest('/orders/admin/all')
      ])
      setDrivers(team.drivers || [])
      setOrders(data.orders || [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let alive = true
    const refresh = async () => {
      try {
        const [team, data] = await Promise.all([
          apiRequest('/delivery/team'),
          apiRequest('/orders/admin/all')
        ])
        if (alive) {
          setDrivers(team.drivers || [])
          setOrders(data.orders || [])
          setError('')
        }
      } catch (err) {
        if (alive) setError(err.message)
      } finally {
        if (alive) setLoading(false)
      }
    }
    refresh()
    const timer = setInterval(refresh, 20000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [])

  const mutate = async (path, body, method = 'PUT') => {
    setBusy(true)
    setError('')
    try {
      await apiRequest(path, { method, body: JSON.stringify(body) })
      await load()
      toast.success('Delivery team updated successfully.')
      return true
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  const addDriver = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (await mutate('/delivery/team', Object.fromEntries(new FormData(form)), 'POST')) {
      form.reset()
    }
  }

  const activePartnersCount = drivers.filter(d => d.deliveryActive).length
  const awaitingAssignmentCount = orders.filter(o => !o.deliveryPerson && !['Delivered', 'Cancelled'].includes(o.orderStatus)).length
  const outForDeliveryCount = orders.filter(o => o.orderStatus === 'Out for Delivery').length

  const shown = orders.filter(order => {
    const matchesFilter = 
      filter === 'All' ? true :
      filter === 'Active' ? !['Delivered', 'Cancelled'].includes(order.orderStatus) :
      filter === 'Unassigned' ? (!order.deliveryPerson && !['Delivered', 'Cancelled'].includes(order.orderStatus)) :
      order.orderStatus === filter

    const matchesArea = [
      order.shippingAddress?.city,
      order.shippingAddress?.state,
      order.shippingAddress?.postalCode,
      order.currentLocation,
      order.shippingAddress?.fullName
    ].join(' ').toLowerCase().includes(area.toLowerCase())

    return matchesFilter && matchesArea
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ── Top Operations Banner ── */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #09281e 0%, #14533d 100%)', 
          color: '#ffffff', 
          borderRadius: '16px',
          padding: '24px 28px',
          border: '1px solid rgba(214, 177, 96, 0.3)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.14em', color: '#f5d580', textTransform: 'uppercase' }}>
              YOUR TEAM. EVERY DOORSTEP.
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
              Delivery Operations & Partner Fleet
            </h2>
            <p style={{ fontSize: '13px', color: '#d0e3d7', marginTop: '4px', maxWidth: '620px', lineHeight: '1.5' }}>
              Assign orders by area PIN codes, follow live GPS progress, and verify doorstep delivery with customer OTP.
            </p>
          </div>

          <Link
            to="/delivery"
            target="_blank"
            style={{ 
              backgroundColor: '#c59738', 
              color: '#09281e', 
              padding: '10px 20px', 
              borderRadius: '10px', 
              fontWeight: '700', 
              fontSize: '13px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              textDecoration: 'none' 
            }}
          >
            <Truck size={16} /> Open Driver Portal <ExternalLink size={14} />
          </Link>
        </div>

        {/* 4-Step Process Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          {["1. Create partner login", "2. Confirm & pack order", "3. Assign delivery partner", "4. Partner delivers with OTP"].map((label) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e2ede7' }}>
              <CheckCircle2 size={15} color="#ecd07e" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 Stat Cards using Admin.css Standard Classes ── */}
      <div className="admin-stats">
        {/* Stat 1 */}
        <div className="admin-stat-card customers">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Active Partners</span>
            <div className="admin-stat-icon-wrapper customers">
              <UsersRound size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{activePartnersCount}</strong>
          <span className="admin-stat-description">Verified drivers on duty</span>
        </div>

        {/* Stat 2 */}
        <div className="admin-stat-card products">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Awaiting Assignment</span>
            <div className="admin-stat-icon-wrapper products">
              <Clock size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{awaitingAssignmentCount}</strong>
          <span className="admin-stat-description">Packed orders needing drivers</span>
        </div>

        {/* Stat 3 */}
        <div className="admin-stat-card orders">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Out for Delivery</span>
            <div className="admin-stat-icon-wrapper orders">
              <Truck size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{outForDeliveryCount}</strong>
          <span className="admin-stat-description">Live on doorstep routes</span>
        </div>

        {/* Stat 4 */}
        <div className="admin-stat-card revenue">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Total Fleet Orders</span>
            <div className="admin-stat-icon-wrapper revenue">
              <Check size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{orders.length}</strong>
          <span className="admin-stat-description">Tracked lifetime deliveries</span>
        </div>
      </div>

      {/* ── 2-Column Management Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: Add Delivery Person Form */}
        <section className="admin-panel admin-padded">
          <div className="admin-panel-heading">
            <div>
              <h2>Add Delivery Person</h2>
              <p>Create a partner login and assign servicing PIN codes</p>
            </div>
            <UserPlus size={20} color="#14533d" />
          </div>

          <form onSubmit={addDriver} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>
                Full Name *
              </label>
              <input 
                name="name" 
                maxLength={80} 
                placeholder="e.g. Ramesh Kumar"
                required 
                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>
                  Login Email *
                </label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="partner@divyaswasth.in"
                  required 
                  style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>
                  Phone Number (10 Digits) *
                </label>
                <input 
                  name="phone" 
                  type="tel" 
                  pattern="[0-9]{10}" 
                  maxLength={10} 
                  placeholder="9876543210"
                  required 
                  style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>
                Servicing Area / PIN Codes *
              </label>
              <input 
                name="deliveryArea" 
                maxLength={120} 
                placeholder="e.g. Delhi NCR / Noida · 201301, 201309" 
                required 
                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>
                Temporary Password *
              </label>
              <input 
                name="password" 
                type="password" 
                minLength={8} 
                maxLength={72} 
                placeholder="Min. 8 characters"
                autoComplete="new-password" 
                required 
                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
              />
            </div>

            <div style={{ marginTop: '8px' }}>
              <button 
                type="submit" 
                className="admin-button" 
                disabled={busy}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <Plus size={16} /> Add Delivery Partner
              </button>
            </div>
          </form>
        </section>

        {/* Card 2: Your Delivery Team List */}
        <section className="admin-panel admin-padded">
          <div className="admin-panel-heading">
            <div>
              <h2>Your Delivery Team ({drivers.length})</h2>
              <p>Active partners who have portal login and route assignment</p>
            </div>
            <Badge tone="green">{activePartnersCount} Active</Badge>
          </div>

          <div style={{ maxHeight: '460px', overflowY: 'auto', paddingRight: '4px', marginTop: '16px' }}>
            {drivers.map(driver => (
              <DeliveryTeamMember 
                key={driver._id} 
                driver={driver} 
                activeDeliveries={orders.filter(order => order.deliveryPerson === driver._id && !['Delivered', 'Cancelled'].includes(order.orderStatus)).length} 
                busy={busy} 
                mutate={mutate} 
              />
            ))}

            {!drivers.length && (
              <EmptyState 
                title="No Delivery Partners Yet" 
                text={loading ? 'Loading team…' : 'Add your first delivery partner using the form on the left.'} 
              />
            )}
          </div>
        </section>
      </div>

      {/* ── Dispatch & Tracking Section ── */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Dispatch & Order Tracking</h2>
            <p>Assign drivers to confirmed orders and view real-time GPS locations</p>
          </div>
          <button 
            type="button" 
            className="admin-button secondary" 
            onClick={load} 
            disabled={busy}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="admin-toolbar" style={{ padding: '0 24px', margin: '16px 0' }}>
          <label className="admin-search" style={{ flex: '1', minWidth: '260px' }}>
            <MapPin size={17} />
            <input 
              value={area} 
              onChange={e => setArea(e.target.value)} 
              placeholder="Search by customer, city, PIN code, or current location…" 
            />
          </label>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Active', 'Unassigned', 'Out for Delivery', 'Delivered', 'All'].map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`admin-button ${filter === value ? '' : 'secondary'}`}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div style={{ padding: '0 24px 24px' }}>
          {shown.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              {shown.map(order => {
                const assignedDriver = drivers.find(d => d._id === order.deliveryPerson)
                return (
                  <article 
                    key={order._id}
                    style={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0', 
                      backgroundColor: '#ffffff', 
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                        <Link to={`/orders/${order._id}/details`} style={{ fontWeight: '700', color: '#14533d', textDecoration: 'none', fontSize: '14px' }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                        <Badge tone={order.orderStatus === 'Delivered' ? 'green' : order.orderStatus === 'Out for Delivery' ? 'blue' : ''}>
                          {order.orderStatus}
                        </Badge>
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <strong style={{ fontSize: '15px', color: '#0f172a' }}>{order.shippingAddress.fullName}</strong>
                        <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                          📍 {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}
                        </p>
                      </div>

                      <div style={{ marginTop: '12px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid #f1f5f9' }}>
                        <p style={{ color: '#334155' }}>
                          <strong>Assigned Partner:</strong> {assignedDriver?.name ? `${assignedDriver.name} (${assignedDriver.deliveryArea})` : (order.deliveryPerson ? 'Former Partner' : '⚠️ Unassigned')}
                        </p>
                        <p style={{ color: '#64748b', marginTop: '4px' }}>
                          <strong>Current Location:</strong> {order.currentLocation || 'Awaiting update'}
                        </p>
                        {order.deliveryCoordinates?.updatedAt && (
                          <p style={{ marginTop: '6px' }}>
                            <a 
                              target="_blank" 
                              rel="noreferrer" 
                              href={`https://www.google.com/maps?q=${order.deliveryCoordinates.latitude},${order.deliveryCoordinates.longitude}`}
                              style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: '700' }}
                            >
                              📍 View Live GPS Location
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Driver Assignment Form */}
                    {!['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                      <form 
                        onSubmit={e => {
                          e.preventDefault()
                          mutate(`/delivery/orders/${order._id}/assign`, { driverId: new FormData(e.currentTarget).get('driverId') })
                        }}
                        style={{ marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}
                      >
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                          Assign / Reassign Delivery Partner:
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select 
                            key={order.deliveryPerson || 'none'} 
                            name="driverId" 
                            required 
                            defaultValue={order.deliveryPerson || ''}
                            style={{ flex: '1', fontSize: '13px', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
                          >
                            <option value="">Select a partner & area</option>
                            {drivers.filter(d => d.deliveryActive).map(driver => (
                              <option value={driver._id} key={driver._id}>
                                {driver.name} — {driver.deliveryArea}
                              </option>
                            ))}
                          </select>
                          <button 
                            type="submit" 
                            className="admin-button" 
                            disabled={busy || !drivers.some(d => d.deliveryActive)}
                            style={{ padding: '8px 14px', fontSize: '12px' }}
                          >
                            Assign
                          </button>
                        </div>
                      </form>
                    )}
                  </article>
                )
              })}
            </div>
          ) : (
            <EmptyState 
              title="No Orders Match This Filter" 
              text={area || filter !== 'Active' ? 'Try changing your search query or status filter.' : 'New orders placed by customers will appear here for dispatch assignment.'} 
            />
          )}
        </div>
      </section>
    </div>
  )
}
