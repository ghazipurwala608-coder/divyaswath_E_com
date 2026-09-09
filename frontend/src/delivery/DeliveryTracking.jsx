import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../api/client.js'
import './Delivery.css'

export default function DeliveryTracking({ order }) {
  const { user } = useAuth()
  const [code, setCode] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (!order?.deliveryPerson) return null
  const driver = order.deliveryPerson
  const owner = String(order.user?._id || order.user) === String(user?._id)
  const requestOtp = async () => {
    setBusy(true); setError(''); setCode(null)
    try { setCode(await apiRequest(`/delivery/orders/${order._id}/otp`, { method: 'POST' })) }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <section className="delivery-ui delivery-tracking"><div className="delivery-card"><div className="delivery-row"><h2>Your delivery partner</h2><span className="delivery-badge">{order.orderStatus}</span></div><p><strong>{driver.name || 'Divya Swasth Delivery'}</strong>{driver.phone && <> · <a href={`tel:${driver.phone}`}>Call {driver.phone}</a></>}</p><p>Current location: {order.currentLocation || 'Awaiting first update'}</p>{order.deliveryCoordinates?.updatedAt && <p><a href={`https://www.google.com/maps?q=${order.deliveryCoordinates.latitude},${order.deliveryCoordinates.longitude}`} target="_blank" rel="noreferrer">View last shared GPS location</a><br /><small>Updated {new Date(order.deliveryCoordinates.updatedAt).toLocaleString('en-IN')}</small></p>}<p className="delivery-muted">Tracking refreshes every 20 seconds. GPS shows the last location shared by your delivery partner.</p>{owner && order.orderStatus === 'Out for Delivery' && <div className="delivery-otp"><h3>Secure delivery code</h3><p>Share this code only after receiving your package.</p><button disabled={busy} onClick={requestOtp}>{busy ? 'Loading…' : code ? 'Refresh delivery code' : 'Get delivery OTP'}</button>{code && <div role="status"><p className="delivery-code">{code.otp}</p><p>Valid until {new Date(code.expiresAt).toLocaleTimeString('en-IN')}. Request again after expiry.</p></div>}{error && <p role="alert" className="delivery-error">{error}</p>}</div>}{order.deliveryOtpVerifiedAt && <p>Delivery confirmed with customer OTP on {new Date(order.deliveryOtpVerifiedAt).toLocaleString('en-IN')}.</p>}</div></section>
}
