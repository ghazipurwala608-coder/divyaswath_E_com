import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowRight, 
  Bell, 
  Check, 
  Clock, 
  ExternalLink, 
  Headphones, 
  Leaf, 
  LoaderCircle, 
  Mail, 
  MapPin, 
  Package, 
  PackageCheck, 
  Phone, 
  Search, 
  ShieldCheck, 
  Truck 
} from 'lucide-react'
import { apiRequest } from '../api/client.js'
import { formatOrderDate } from '../data/orderTracking.js'
import { initialProducts as products } from '../../../shared/catalog.js'
import './TrackingPage.css'

export default function TrackingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lookup, setLookup] = useState(id || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')

  // Default fallback sample order for pristine demonstration
  const sampleProduct = products[0] || {
    name: 'Sugar Shield - Blood Sugar Support',
    slug: 'sugar-shield-blood-sugar-support',
    image: '/images/wellness/sugar-shield.png',
    price: 899,
    capsules: '60 Veg Capsules'
  }

  const defaultOrder = {
    _id: 'DS24101034',
    orderStatus: 'Out for Delivery',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: new Date().toISOString(),
    paymentMethod: 'Online / UPI',
    paymentStatus: 'PAID',
    totalPrice: sampleProduct.price || 899,
    shippingPrice: 0,
    courierName: 'Delhivery Express',
    trackingNumber: 'DL7894561230',
    trackingUrl: 'https://www.delhivery.com',
    shippingAddress: {
      fullName: 'Aman Soni',
      addressLine: 'Pocket 1, Okhla Phase 1',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110020',
      country: 'India',
      phone: '+91 97470 07253'
    },
    items: [
      {
        product: sampleProduct.id || 'sugar-shield',
        name: sampleProduct.name || 'Sugar Shield - Blood Sugar Support',
        slug: sampleProduct.slug || 'sugar-shield-blood-sugar-support',
        image: sampleProduct.image || '/images/wellness/sugar-shield.png',
        quantity: 1,
        price: sampleProduct.price || 899,
        sizeInfo: '60 Veg Capsules'
      }
    ],
    timeline: [
      { title: 'Order Placed', date: 'May 10, 2024', time: '10:14 AM', completed: true, active: false },
      { title: 'Confirmed', date: 'May 10, 2024', time: '11:00 AM', completed: true, active: false },
      { title: 'Shipped', date: 'May 11, 2024', time: '04:20 PM', completed: true, active: false },
      { title: 'Out for Delivery', date: 'Today (May 12)', time: '09:30 AM', completed: true, active: true },
      { title: 'Delivered', date: 'Expected Today', time: 'by 07:00 PM', completed: false, active: false }
    ]
  }

  // Fetch live order details when tracking ID is provided
  useEffect(() => {
    let active = true
    if (!id) {
      setOrder(null)
      setError('')
      setLookup('')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    setLookup(id)
    apiRequest(`/orders/${encodeURIComponent(id)}`)
      .then((res) => {
        const fetched = res.order || res.data?.order
        if (active && fetched) {
          setOrder(fetched)
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Order not found with provided ID')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  const handleTrack = (e) => {
    e.preventDefault()
    if (lookup.trim()) {
      navigate(`/orders/${encodeURIComponent(lookup.trim())}`)
    }
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (newsletterEmail) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 5000)
      setNewsletterEmail('')
    }
  }

  // Active display data
  const displayOrder = order || defaultOrder
  const address = displayOrder.shippingAddress || defaultOrder.shippingAddress
  const destination = address 
    ? [address.addressLine, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(', ') 
    : 'Pocket 1, Okhla Phase 1, New Delhi, Delhi 110020, India'
  
  const isDelivered = displayOrder.orderStatus === 'Delivered'
  const isCancelled = displayOrder.orderStatus === 'Cancelled'
  
  const orderIdDisplay = displayOrder._id 
    ? (displayOrder._id.startsWith('DS') ? displayOrder._id : `DS-${displayOrder._id.slice(-8).toUpperCase()}`) 
    : 'DS-24101034'

  // Dynamic milestone dates calculation
  const computeDynamicSteps = (orderData) => {
    if (!orderData || !orderData.createdAt) return defaultOrder.timeline

    const created = new Date(orderData.createdAt)
    const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    const placedDate = formatDate(created)
    const placedTime = formatTime(created)

    const confirmedDate = formatDate(new Date(created.getTime() + 45 * 60000))
    const confirmedTime = formatTime(new Date(created.getTime() + 45 * 60000))

    const shippedDate = formatDate(new Date(created.getTime() + 24 * 3600000))
    const shippedTime = '04:20 PM'

    const estDate = orderData.estimatedDelivery ? new Date(orderData.estimatedDelivery) : new Date(created.getTime() + 3 * 86400000)
    const isEstToday = estDate.toDateString() === new Date().toDateString()
    const deliveryDateStr = isEstToday ? 'Today' : formatDate(estDate)

    const st = (orderData.orderStatus || 'Processing').toLowerCase()
    const hasConfirmed = ['confirmed', 'packed', 'shipped', 'out for delivery', 'delivered'].some(s => st.includes(s))
    const hasShipped = ['shipped', 'out for delivery', 'delivered'].some(s => st.includes(s))
    const hasOut = ['out for delivery', 'delivered'].some(s => st.includes(s))
    const hasDelivered = st === 'delivered'

    return [
      { 
        title: 'Order Placed', 
        date: placedDate, 
        time: placedTime, 
        completed: true, 
        active: st === 'processing' 
      },
      { 
        title: 'Confirmed', 
        date: confirmedDate, 
        time: confirmedTime, 
        completed: hasConfirmed, 
        active: st === 'confirmed' || st === 'packed' 
      },
      { 
        title: 'Shipped', 
        date: shippedDate, 
        time: shippedTime, 
        completed: hasShipped, 
        active: st === 'shipped' 
      },
      { 
        title: 'Out for Delivery', 
        date: hasOut ? 'Today' : deliveryDateStr, 
        time: '09:30 AM', 
        completed: hasOut, 
        active: st.includes('out') 
      },
      { 
        title: 'Delivered', 
        date: hasDelivered ? (orderData.deliveredAt ? formatDate(new Date(orderData.deliveredAt)) : 'Delivered') : `Expected ${deliveryDateStr}`, 
        time: 'by 07:00 PM', 
        completed: hasDelivered, 
        active: hasDelivered 
      }
    ]
  }

  const timelineSteps = order ? computeDynamicSteps(order) : defaultOrder.timeline
  const formattedLastUpdated = order?.updatedAt 
    ? new Date(order.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
    : 'Today, 11:30 AM'

  return (
    <div className="tracking-page">
      {/* Top Hero Banner */}
      <section className="tracking-hero">
        <div className="tracking-hero-container">
          <div className="tracking-hero-copy">
            <p className="tracking-hero-kicker">TRACK YOUR ORDER</p>
            <h1 className="tracking-hero-title">
              We're on the way to <br />
              <span className="tracking-hero-gold">your wellness!</span>
            </h1>
            <p className="tracking-hero-desc">
              Track your order in real-time and stay updated every step of the way.
            </p>
          </div>

          <div className="tracking-hero-artwork" aria-hidden="true">
            <div className="tracking-parcel-box">
              <span className="tracking-parcel-tape" />
              <img src="/images/divyaswasth.png" alt="Divya Swasth" className="tracking-parcel-emblem" />
            </div>
          </div>
        </div>
      </section>

      <div className="tracking-content-wrapper">
        {/* Box 1: Order Details Input */}
        <section className="tracking-card tracking-search-card">
          <h2 className="tracking-card-title">ENTER YOUR ORDER DETAILS</h2>
          <form onSubmit={handleTrack} className="tracking-search-form">
            <div className="tracking-input-group">
              <Package size={17} className="tracking-input-icon" />
              <input
                id="tracking-search-input"
                type="text"
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                placeholder="Enter your Order ID / AWB Number / Tracking ID"
                aria-label="Order Tracking Search"
                required
              />
            </div>
            <button type="submit" className="tracking-submit-btn">
              <Truck size={16} />
              TRACK ORDER
            </button>
          </form>
          <div className="tracking-search-footer">
            <span>You can find your Order ID in the order confirmation email.</span>
            <Link to="/contact" className="tracking-help-link">
              Need help finding your Order ID?
            </Link>
          </div>
        </section>

        {loading && (
          <div className="tracking-card tracking-state-card" role="status">
            <LoaderCircle className="animate-spin" size={28} />
            <p>Loading your order updates…</p>
          </div>
        )}

        {error && (
          <div className="tracking-card tracking-state-card tracking-error-card" role="alert">
            <PackageCheck size={32} />
            <h3>We couldn’t find an order matching that ID</h3>
            <p>{error}. Showing standard tracking preview below.</p>
          </div>
        )}

        {/* Box 2: Order Status Timeline */}
        <section className="tracking-card tracking-status-card">
          <div className="tracking-card-header">
            <h2 className="tracking-card-title">ORDER STATUS</h2>
            <span className="tracking-last-updated">Last updated: {formattedLastUpdated}</span>
          </div>

          <div className="tracking-timeline-container">
            <div className="tracking-timeline-track">
              {timelineSteps.map((step, idx) => {
                const isStepCompleted = step.completed
                const isStepActive = step.active
                const isStepPending = !isStepCompleted && !isStepActive

                return (
                  <div 
                    key={idx} 
                    className={`tracking-step ${isStepCompleted ? 'is-completed' : ''} ${isStepActive ? 'is-active' : ''} ${isStepPending ? 'is-pending' : ''}`}
                  >
                    <div className="tracking-step-node">
                      <div className="tracking-node-circle">
                        {isStepCompleted && !isStepActive ? (
                          <Check size={14} strokeWidth={3} />
                        ) : idx === 1 ? (
                          <PackageCheck size={14} />
                        ) : idx === 2 ? (
                          <Package size={14} />
                        ) : idx === 3 ? (
                          <Truck size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                      </div>
                      {idx < timelineSteps.length - 1 && (
                        <div className={`tracking-line ${step.completed ? 'is-done' : ''}`} />
                      )}
                    </div>
                    <div className="tracking-step-info">
                      <p className="tracking-step-name">{step.title}</p>
                      <span className="tracking-step-date">{step.date}</span>
                      <span className="tracking-step-time">{step.time}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Box 3: Order Details */}
        <section className="tracking-card tracking-details-card">
          <div className="tracking-card-header">
            <h2 className="tracking-card-title">ORDER DETAILS</h2>
            <span className="tracking-order-id-badge">Order ID: {orderIdDisplay}</span>
          </div>

          <div className="tracking-details-grid">
            {/* Product Item Column */}
            <div className="tracking-col-product">
              {displayOrder.items.map((item, index) => (
                <div key={index} className="tracking-product-item">
                  <div className="tracking-product-thumb">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <Package size={24} />
                    )}
                  </div>
                  <div className="tracking-product-meta">
                    <h4>{item.name}</h4>
                    <p className="tracking-product-sub">{item.sizeInfo || '60 Veg Capsules'}</p>
                    <p className="tracking-product-qty">Qty: {item.quantity || 1}</p>
                    <p className="tracking-product-price">₹{(item.price || 899).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Placed On */}
            <div className="tracking-col">
              <label className="tracking-col-label">ORDER PLACED ON</label>
              <p className="tracking-col-val font-semibold">
                {displayOrder.createdAt ? new Date(displayOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 10, 2024'}
              </p>
              <span className="tracking-col-sub">
                {displayOrder.createdAt ? new Date(displayOrder.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '10:14 AM'}
              </span>
            </div>

            {/* Payment Method */}
            <div className="tracking-col">
              <label className="tracking-col-label">PAYMENT METHOD</label>
              <p className="tracking-col-val font-semibold">{displayOrder.paymentMethod || 'Online / Prepaid'}</p>
              <span className="tracking-badge-paid">{displayOrder.paymentStatus || 'PAID'}</span>
            </div>

            {/* Shipping Address */}
            <div className="tracking-col">
              <label className="tracking-col-label">SHIPPING ADDRESS</label>
              <p className="tracking-col-val font-semibold">{address.fullName || 'Aman Soni'}</p>
              <p className="tracking-col-address">
                {address.addressLine || 'Pocket 1, Okhla Phase 1'}, {address.city || 'New Delhi'}, {address.state || 'Delhi'} {address.postalCode || '110020'}, {address.country || 'India'}
              </p>
            </div>

            {/* Shipping Partner */}
            <div className="tracking-col">
              <label className="tracking-col-label">SHIPPING PARTNER</label>
              <p className="tracking-col-val font-semibold">{displayOrder.courierName || 'Delhivery Express'}</p>
              <span className="tracking-col-sub">Tracking ID: {displayOrder.trackingNumber || 'DL7894561230'}</span>
              <a 
                href={displayOrder.trackingUrl || 'https://www.delhivery.com'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="tracking-courier-link"
              >
                View on Courier Site <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </section>

        {/* Box 4: Estimated Delivery & Route Map */}
        <section className="tracking-card tracking-delivery-route-card">
          <div className="tracking-route-grid">
            {/* Left ETA info */}
            <div className="tracking-eta-pane">
              <label className="tracking-col-label">ESTIMATED DELIVERY</label>
              <h3 className="tracking-eta-headline">
                {isDelivered ? 'Delivered' : isCancelled ? 'Order Cancelled' : 'Today, May 12, 2024'} <br />
                <span>{isDelivered ? 'Successfully' : isCancelled ? '' : 'by 07:00 PM'}</span>
              </h3>

              <div className="tracking-partner-pill">
                <Truck size={15} className="text-[#c59e47]" />
                <span>
                  {isDelivered 
                    ? 'Package delivered to recipient.' 
                    : isCancelled 
                    ? 'This delivery was cancelled.' 
                    : 'Our delivery partner is on the way to you.'}
                </span>
              </div>

              <Link to="/contact" className="tracking-need-help-btn">
                NEED HELP?
              </Link>
            </div>

            {/* Right Map Visual & Delivery Agent Overlay */}
            <div className="tracking-map-pane">
              <div className="tracking-map-view">
                <iframe
                  title="Delivery route map"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(destination)}&z=13&output=embed`}
                  className="tracking-map-frame"
                />
                
                {/* Floating Delivery Location Overlay Box */}
                <div className="tracking-delivery-floating-card">
                  <p className="tracking-float-title">Delivery Location</p>
                  <p className="tracking-float-name">{address.fullName || 'Aman Soni'}</p>
                  <p className="tracking-float-addr">
                    {address.addressLine || 'Pocket 1, Okhla Phase 1'}, {address.city || 'New Delhi'}, {address.postalCode || '110020'}
                  </p>
                  <a href={`tel:${(address.phone || '+919747007253').replace(/\s+/g, '')}`} className="tracking-call-agent-btn">
                    <Phone size={13} />
                    CALL DELIVERY AGENT
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Box 5: 4 Trust Badges */}
        <section className="tracking-trust-strip">
          <div className="tracking-trust-item">
            <div className="tracking-trust-icon-wrap">
              <Bell size={18} />
            </div>
            <div>
              <h4>Real-time Updates</h4>
              <p>Get live SMS updates for your order status.</p>
            </div>
          </div>

          <div className="tracking-trust-item">
            <div className="tracking-trust-icon-wrap">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4>Discreet & Safe</h4>
              <p>100% private packaging with tamper-evident seal.</p>
            </div>
          </div>

          <div className="tracking-trust-item">
            <div className="tracking-trust-icon-wrap">
              <Truck size={18} />
            </div>
            <div>
              <h4>Fast Delivery</h4>
              <p>Quick dispatch within 24 hours across India.</p>
            </div>
          </div>

          <div className="tracking-trust-item">
            <div className="tracking-trust-icon-wrap">
              <Headphones size={18} />
            </div>
            <div>
              <h4>Need Help?</h4>
              <p>24/7 customer support on WhatsApp & call.</p>
            </div>
          </div>
        </section>

        {/* Box 6: Support Banner */}
        <section className="tracking-support-banner">
          <div className="tracking-support-left">
            <div className="tracking-support-leaf-icon">
              <Leaf size={22} />
            </div>
            <div>
              <h3>Need help with your order?</h3>
              <p>Get in touch with us and we'll resolve your query in real-time.</p>
            </div>
          </div>

          <div className="tracking-support-channels">
            <a href="https://wa.me/919747007253" target="_blank" rel="noopener noreferrer" className="tracking-channel-link">
              <div className="tracking-channel-icon">
                <Phone size={14} />
              </div>
              <div>
                <span className="tracking-channel-tag">WhatsApp</span>
                <strong>+91 97470 07253</strong>
              </div>
            </a>

            <a href="mailto:divyaswasth@gmail.com" className="tracking-channel-link">
              <div className="tracking-channel-icon">
                <Mail size={14} />
              </div>
              <div>
                <span className="tracking-channel-tag">Email</span>
                <strong>divyaswasth@gmail.com</strong>
              </div>
            </a>
          </div>

          <Link to="/contact" className="tracking-contact-support-btn">
            CONTACT SUPPORT
          </Link>
        </section>

        {/* Box 7: Newsletter Strip */}
        <section className="tracking-newsletter-bar">
          <div className="tracking-news-left">
            <div className="tracking-news-icon">
              <Mail size={20} />
            </div>
            <div>
              <h3>STAY CONNECTED WITH WELLNESS</h3>
              <p>Subscribe for health tips, exclusive offers and new launch updates.</p>
            </div>
          </div>

          <form onSubmit={handleNewsletter} className="tracking-news-form">
            <div className="tracking-news-input-wrap">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="tracking-news-btn">
                {subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
              </button>
            </div>
            <span className="tracking-news-spam-note">🔒 100% spam-free. Unsubscribe anytime.</span>
          </form>
        </section>
      </div>
    </div>
  )
}
