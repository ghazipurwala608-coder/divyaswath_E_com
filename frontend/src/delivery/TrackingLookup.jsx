import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck } from 'lucide-react'
import './Delivery.css'

export default function TrackingLookup() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  return <div className="delivery-ui delivery-portal"><div className="delivery-wrap"><div className="delivery-hero"><div><span className="delivery-eyebrow">DIVYA SWASTH / ORDER TRACKING</span><h1>Follow your order, every step.</h1><p>Delivery progress, location updates and secure doorstep verification.</p></div><Truck size={64} strokeWidth={1} /></div><form className="delivery-card" style={{ maxWidth: 640, margin: '40px auto' }} onSubmit={event => { event.preventDefault(); if (query.trim()) navigate(`/orders/${encodeURIComponent(query.trim())}`) }}><h2>Where is my order?</h2><p className="delivery-muted">Sign in with the account used to place your order to see its delivery details.</p><label htmlFor="order-lookup">Order ID or tracking number</label><input id="order-lookup" value={query} onChange={event => setQuery(event.target.value)} required placeholder="Paste your order ID or tracking number" /><div className="delivery-actions"><button className="primary">Track order</button><Link className="delivery-action" to="/account">My orders</Link></div></form></div></div>
}
