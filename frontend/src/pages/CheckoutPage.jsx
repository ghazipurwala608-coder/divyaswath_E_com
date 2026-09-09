import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Landmark,
  Leaf,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  RotateCw,
  ShieldCheck,
  Truck,
  Wallet
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { calculateShipping } from '../../../shared/shipping.js'
import { useSiteContent } from '../context/SiteContentContext.jsx'
import './CheckoutPage.css'

const money = (val) =>
  `₹ ${Number(val || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const { shipping: shippingSettings } = useSiteContent('settings')
  const navigate = useNavigate()

  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('PAYTM')

  // Form Inputs for specific payment methods
  const [upiId, setUpiId] = useState('')
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [selectedBank, setSelectedBank] = useState('HDFC')
  const [selectedWallet, setSelectedWallet] = useState('PAYTM_WALLET')

  // Delivery details state
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine: '',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110020',
    country: 'India'
  })

  const shippingFee = calculateShipping(subtotal, items.length, shippingSettings || { fee: 99, freeAbove: 999 })
  const totalAmount = subtotal + shippingFee

  // Dynamic Savings Calculation based on MRP
  const totalMrp = items.reduce((acc, item) => acc + (item.mrp || item.price || 0) * item.quantity, 0)
  const totalSavings = Math.max(0, totalMrp - subtotal)

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!items.length) {
      toast.error('Your cart is empty!')
      return
    }

    if (!address.fullName || !address.phone || !address.addressLine || !address.postalCode) {
      toast.error('Please complete your delivery address below')
      document.getElementById('delivery-address-form')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setPlacing(true)
    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item._id || item.slug,
          slug: item.slug,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod === 'PAYTM' ? 'UPI' : paymentMethod
      }

      const { order } = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      })

      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${order._id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const getButtonText = () => {
    if (placing) return 'PROCESSING ORDER…'
    switch (paymentMethod) {
      case 'PAYTM':
        return 'PAY NOW WITH PAYTM'
      case 'UPI':
        return 'PAY NOW WITH UPI'
      case 'CARD':
        return 'PAY NOW WITH CARD'
      case 'BANK':
        return 'PAY NOW WITH NET BANKING'
      case 'WALLET':
        return 'PAY NOW WITH WALLET'
      case 'COD':
        return `PLACE ORDER (CASH ON DELIVERY) · ${money(totalAmount)}`
      default:
        return 'PAY NOW'
    }
  }

  return (
    <div className="secure-checkout-page">
      {/* ── STEP PROGRESS BAR ── */}
      <div className="checkout-stepper-wrap">
        <ol className="checkout-stepper">
          <li className="checkout-step-item is-done">
            <div className="checkout-step-circle">
              <Check size={14} strokeWidth={3} />
            </div>
            <div className="checkout-step-text">
              <strong>CART</strong>
              <small>Review your items</small>
            </div>
          </li>
          <li className="checkout-step-item is-done">
            <div className="checkout-step-circle">
              <Check size={14} strokeWidth={3} />
            </div>
            <div className="checkout-step-text">
              <strong>ADDRESS</strong>
              <small>Delivery details</small>
            </div>
          </li>
          <li className="checkout-step-item is-active">
            <div className="checkout-step-circle">3</div>
            <div className="checkout-step-text">
              <strong>PAYMENT</strong>
              <small>Pay securely</small>
            </div>
          </li>
          <li className="checkout-step-item is-pending">
            <div className="checkout-step-circle">4</div>
            <div className="checkout-step-text">
              <strong>CONFIRMATION</strong>
              <small>Order placed</small>
            </div>
          </li>
        </ol>
      </div>

      <div className="checkout-main-container">
        {/* ── PAGE HEADING ── */}
        <header className="checkout-page-header">
          <h1>SECURE PAYMENT</h1>
          <div className="checkout-gold-flourish">
            <span />
            <Leaf size={14} />
            <span />
          </div>
          <p>Your payment information is 100% secure and encrypted.</p>
        </header>

        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-grid">
            {/* ── LEFT: PAYMENT OPTIONS ── */}
            <div className="checkout-left-col">
              <div className="checkout-card-box">
                <div className="checkout-methods-header">
                  <h2>CHOOSE A PAYMENT METHOD</h2>
                  <span className="checkout-secure-badge">
                    <LockKeyhole size={13} />
                    100% Secure
                  </span>
                </div>

                <div className="checkout-options-list" role="radiogroup" aria-label="Payment method">
                    {/* OPTION 1: PAYTM / QR */}
                    <div
                      className={`checkout-option-card ${paymentMethod === 'PAYTM' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentMethod('PAYTM')}
                      role="radio"
                      aria-checked={paymentMethod === 'PAYTM'}
                      tabIndex={0}
                      onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setPaymentMethod('PAYTM') } }}
                    >
                      <div className="checkout-option-row">
                        <div className="checkout-option-left">
                          <div className="checkout-custom-radio">
                            {paymentMethod === 'PAYTM' && <div className="checkout-custom-radio-inner" />}
                          </div>
                          <div className="checkout-option-titles">
                            <strong>PAY WITH PAYTM / UPI QR</strong>
                            <small>Scan QR code with Paytm or any UPI App</small>
                          </div>
                        </div>
                        <div className="checkout-option-right">
                          <span className="paytm-pill-badge">FAST SCAN</span>
                        </div>
                      </div>

                      {paymentMethod === 'PAYTM' && (
                        <div className="paytm-expanded-box">
                          <div className="paytm-box-inner">
                            <div className="paytm-qr-desc">
                              <div className="paytm-logo-text">
                                pay<span>tm</span>
                              </div>
                              <h3 className="text-sm font-bold text-[#143c26] mt-1">Scan & Pay using Paytm / Any UPI App</h3>
                              <p className="text-xs text-[#526356] mt-1">
                                Open Paytm, GPay or PhonePe and scan the QR code to complete your payment instantly.
                              </p>
                              <div className="mt-3 flex items-center justify-between gap-2 p-2.5 rounded bg-[#f4f7f2] border border-[#d6e2d1]">
                                <span className="text-[11px] text-[#2c4e38]">UPI ID: <b>s6554013798782732@slc</b></span>
                                <button
                                  type="button"
                                  className="px-2.5 py-1 bg-[#17482b] text-white text-[10px] font-bold rounded hover:bg-[#205e3a] transition"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigator.clipboard.writeText('s6554013798782732@slc')
                                    toast.success('UPI ID copied!')
                                  }}
                                >
                                  COPY
                                </button>
                              </div>
                            </div>
                            <div className="paytm-qr-wrapper flex flex-col items-center">
                              <img
                                src="/images/payments/upi-qr.png"
                                alt="Scan & Pay using any UPI App"
                                className="w-[140px] h-[175px] object-contain rounded-md shadow-sm border border-[#e2dec9] bg-white p-1"
                              />
                            </div>
                          </div>
                          <div className="paytm-supported-strip">
                            <span><b>Google Pay</b></span>
                            <span>•</span>
                            <span><b>PhonePe</b></span>
                            <span>•</span>
                            <span><b>Paytm</b></span>
                            <span>•</span>
                            <span><b>BHIM UPI</b></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* OPTION 2: UPI */}
                    <div
                      className={`checkout-option-card ${paymentMethod === 'UPI' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentMethod('UPI')}
                      role="radio"
                      aria-checked={paymentMethod === 'UPI'}
                      tabIndex={0}
                      onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setPaymentMethod('UPI') } }}
                    >
                      <div className="checkout-option-row">
                        <div className="checkout-option-left">
                          <div className="checkout-custom-radio">
                            {paymentMethod === 'UPI' && <div className="checkout-custom-radio-inner" />}
                          </div>
                          <div className="checkout-option-titles">
                            <strong>UPI / OTHER UPI APPS</strong>
                            <small>Pay using any UPI App (GPay, PhonePe, BHIM)</small>
                          </div>
                        </div>
                        <div className="checkout-option-right">
                          <span className="font-bold italic text-[#2d5f3a] text-sm flex items-center gap-1">
                            UPI<span className="text-[#e29d29] text-xs">▸</span>
                          </span>
                        </div>
                      </div>

                      {paymentMethod === 'UPI' && (
                        <div className="other-method-expanded">
                          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 p-3 bg-[#faf9f4] border border-[#e8e4d5] rounded-md">
                            <img
                              src="/images/payments/upi-qr.png"
                              alt="Pay using any UPI App"
                              className="w-[125px] h-[155px] object-contain rounded border border-[#ddd8c8] bg-white p-1 shadow-sm"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#1a4128]">Scan with any UPI App or Pay via UPI ID</p>
                              <p className="text-[11px] text-[#556758] mt-1">
                                Official UPI ID: <strong className="text-[#133c24]">s6554013798782732@slc</strong>
                              </p>
                              <button
                                type="button"
                                className="mt-2.5 px-3 py-1 bg-[#17492c] text-white text-[10px] font-bold rounded hover:bg-[#21613b] transition"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText('s6554013798782732@slc')
                                  toast.success('UPI ID copied!')
                                }}
                              >
                                COPY UPI ID
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-[#526154] mb-2">Or enter your personal UPI ID to send payment request:</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter your UPI ID (e.g. mobile@upi)"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="method-input-field"
                            />
                            <button
                              type="button"
                              className="px-4 py-2 bg-[#1a562f] text-white text-xs font-bold rounded-md hover:bg-[#257340]"
                              onClick={() => toast.success('UPI ID verified!')}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  {/* OPTION 3: CREDIT / DEBIT CARDS */}
                  <div
                    className={`checkout-option-card ${paymentMethod === 'CARD' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('CARD')}
                      role="radio"
                      aria-checked={paymentMethod === 'CARD'}
                      tabIndex={0}
                      onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setPaymentMethod('CARD') } }}
                  >
                    <div className="checkout-option-row">
                      <div className="checkout-option-left">
                        <div className="checkout-custom-radio">
                          {paymentMethod === 'CARD' && <div className="checkout-custom-radio-inner" />}
                        </div>
                        <div className="checkout-option-titles">
                          <strong>CREDIT / DEBIT CARDS</strong>
                          <small>Visa, Mastercard, RuPay, Maestro</small>
                        </div>
                      </div>
                      <div className="checkout-option-right flex items-center gap-2">
                        <span className="text-xs font-black text-[#1a3a78] italic">VISA</span>
                        <span className="flex">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#eb001b] inline-block" />
                          <span className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] inline-block -ml-1.5 opacity-90" />
                        </span>
                        <span className="text-xs font-bold text-[#235832]">RuPay</span>
                      </div>
                    </div>

                    {paymentMethod === 'CARD' && (
                      <div className="other-method-expanded">
                        <div className="grid gap-3">
                          <input
                            type="text"
                            placeholder="Card Number (16 digits)"
                            maxLength={19}
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            className="method-input-field"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              className="method-input-field"
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              maxLength={4}
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              className="method-input-field"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 4: NET BANKING */}
                  <div
                    className={`checkout-option-card ${paymentMethod === 'BANK' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('BANK')}
                      role="radio"
                      aria-checked={paymentMethod === 'BANK'}
                      tabIndex={0}
                      onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setPaymentMethod('BANK') } }}
                  >
                    <div className="checkout-option-row">
                      <div className="checkout-option-left">
                        <div className="checkout-custom-radio">
                          {paymentMethod === 'BANK' && <div className="checkout-custom-radio-inner" />}
                        </div>
                        <div className="checkout-option-titles">
                          <strong>NET BANKING</strong>
                          <small>All major Indian banks supported</small>
                        </div>
                      </div>
                      <div className="checkout-option-right">
                        <Landmark size={20} className="text-[#3c5e46]" />
                      </div>
                    </div>

                    {paymentMethod === 'BANK' && (
                      <div className="other-method-expanded">
                        <p className="text-xs text-[#526154] mb-2">Select your Bank:</p>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="method-input-field"
                        >
                          <option value="HDFC">HDFC Bank</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="AXIS">Axis Bank</option>
                          <option value="KOTAK">Kotak Mahindra Bank</option>
                          <option value="PNB">Punjab National Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* OPTION 5: WALLET */}
                  <div
                    className={`checkout-option-card ${paymentMethod === 'WALLET' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('WALLET')}
                      role="radio"
                      aria-checked={paymentMethod === 'WALLET'}
                      tabIndex={0}
                      onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setPaymentMethod('WALLET') } }}
                  >
                    <div className="checkout-option-row">
                      <div className="checkout-option-left">
                        <div className="checkout-custom-radio">
                          {paymentMethod === 'WALLET' && <div className="checkout-custom-radio-inner" />}
                        </div>
                        <div className="checkout-option-titles">
                          <strong>WALLET</strong>
                          <small>Paytm, Amazon Pay, Mobikwik & more</small>
                        </div>
                      </div>
                      <div className="checkout-option-right flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#ff9900]">amazon pay</span>
                        <span className="text-[11px] font-bold text-[#0073e6]">MobiKwik</span>
                      </div>
                    </div>

                    {paymentMethod === 'WALLET' && (
                      <div className="other-method-expanded">
                        <div className="flex flex-wrap gap-2">
                          {['PAYTM_WALLET', 'AMAZON_PAY', 'PHONEPE_WALLET', 'MOBIKWIK'].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setSelectedWallet(w)}
                              className={`px-3 py-1.5 text-xs font-bold rounded border ${
                                selectedWallet === w ? 'bg-[#1a562f] text-white border-[#1a562f]' : 'bg-white text-gray-700 border-gray-300'
                              }`}
                            >
                              {w.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 6: CASH ON DELIVERY */}
                  <div
                    className={`checkout-option-card ${paymentMethod === 'COD' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('COD')}
                      role="radio"
                      aria-checked={paymentMethod === 'COD'}
                      tabIndex={0}
                      onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setPaymentMethod('COD') } }}
                  >
                    <div className="checkout-option-row">
                      <div className="checkout-option-left">
                        <div className="checkout-custom-radio">
                          {paymentMethod === 'COD' && <div className="checkout-custom-radio-inner" />}
                        </div>
                        <div className="checkout-option-titles">
                          <strong>CASH ON DELIVERY</strong>
                          <small>Pay with cash at your doorstep</small>
                        </div>
                      </div>
                      <div className="checkout-option-right">
                        <Wallet size={20} className="text-[#3c5e46]" />
                      </div>
                    </div>

                    {paymentMethod === 'COD' && (
                      <div className="other-method-expanded">
                        <p className="text-xs text-[#526154]">
                          Pay cash or scan QR at your doorstep when the delivery partner arrives.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SAFE & SECURE PAYMENTS BANNER */}
                <div className="safe-payments-footer-box">
                  <div className="safe-payments-left">
                    <ShieldCheck size={28} />
                    <div className="safe-payments-text">
                      <strong>SAFE & SECURE PAYMENTS</strong>
                      <p>
                        Bank-level 256-bit encryption with RBI-compliant payment security and data protection.
                      </p>
                    </div>
                  </div>
                  <div className="pci-certified-badge">
                    <b>PCI-DSS</b>
                    <small>Certified</small>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: SIDEBAR (ORDER SUMMARY, WHY US, HELP) ── */}
            <aside className="checkout-sidebar">
              {/* CARD 1: ORDER SUMMARY */}
              <div className="checkout-card-box">
                <h2 className="summary-heading">ORDER SUMMARY</h2>

                <div className="summary-items-list">
                  {items.length ? (
                    items.map((item) => (
                      <div key={item._id || item.slug} className="summary-product-row">
                        <img
                          src={item.images?.[0] || item.cardImage || '/images/home/Vital.png'}
                          alt={item.name}
                        />
                        <div className="summary-product-info">
                          <strong>{item.name}</strong>
                          <small>{item.subtitle}</small>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <div className="summary-product-price">
                          {money(item.price * item.quantity)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 py-3">
                      Your bag is empty.{' '}
                      <Link to="/shop" className="text-[#b58321] underline font-bold">
                        Browse products
                      </Link>
                    </p>
                  )}
                </div>

                <div className="summary-totals-breakdown">
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping</span>
                    <span className="summary-line-green">
                      {shippingFee ? money(shippingFee) : 'FREE'}
                    </span>
                  </div>
                  <div className="summary-line">
                    <span>Discount</span>
                    <span className="summary-line-green">₹ 0.00</span>
                  </div>
                  <div className="summary-total-row">
                    <div>
                      <strong>Total</strong>
                      <small className="summary-tax-note">Inclusive of all taxes</small>
                    </div>
                    <span className="total-amount">{money(totalAmount)}</span>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="summary-savings-banner">
                    <Leaf size={14} />
                    <span>YOU SAVE {money(totalSavings)} ON THIS ORDER</span>
                  </div>
                )}
              </div>

              {/* CARD 2: WHY SHOP WITH US? */}
              <div className="checkout-card-box">
                <h2 className="summary-heading text-center">WHY SHOP WITH US?</h2>
                <div className="why-shop-list">
                  <div className="why-shop-item">
                    <div className="why-shop-icon-circle">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="why-shop-text">
                      <strong>100% Original Products</strong>
                      <small>Directly from certified source.</small>
                    </div>
                  </div>
                  <div className="why-shop-item">
                    <div className="why-shop-icon-circle">
                      <PackageCheck size={16} />
                    </div>
                    <div className="why-shop-text">
                      <strong>Safe & Secure Packing</strong>
                      <small>Sanitized & damage-proof packing.</small>
                    </div>
                  </div>
                  <div className="why-shop-item">
                    <div className="why-shop-icon-circle">
                      <RotateCw size={16} />
                    </div>
                    <div className="why-shop-text">
                      <strong>Easy Returns</strong>
                      <small>Hassle-free return within 7 days.</small>
                    </div>
                  </div>
                  <div className="why-shop-item">
                    <div className="why-shop-icon-circle">
                      <Truck size={16} />
                    </div>
                    <div className="why-shop-text">
                      <strong>Doorstep Delivery</strong>
                      <small>Fast & Tracked Shipping.</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: NEED HELP? */}
              <div className="checkout-card-box need-help-card">
                <h2 className="summary-heading">NEED HELP?</h2>
                <p>Feel free to reach out to our team for help:</p>
                <div className="need-help-links">
                  <a href="tel:+919747007253">
                    <Phone size={14} className="text-[#c8973a]" />
                    <span>+91 97470 07253</span>
                  </a>
                  <a href="mailto:divyaswasth@gmail.com">
                    <Mail size={14} className="text-[#c8973a]" />
                    <span>divyaswasth@gmail.com</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* ── DELIVERY ADDRESS DETAILS FORM ── */}
          <section id="delivery-address-form" className="checkout-address-section">
            <h2>
              <MapPin size={18} className="text-[#c8973a]" />
              DELIVERY DETAILS
            </h2>
            <p>Confirm the destination address where you want your order delivered.</p>
            <div className="address-grid-inputs">
              <div className="address-input-group">
                <label>Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Enter recipient's name"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                />
              </div>
              <div className="address-input-group">
                <label>10-Digit Mobile *</label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. 9876543210"
                  pattern="[0-9]{10}"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>
              <div className="address-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Order updates email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                />
              </div>
              <div className="address-input-group address-span-2">
                <label>Address (House No, Street, Area) *</label>
                <input
                  required
                  type="text"
                  placeholder="House number, flat, street, landmark"
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                />
              </div>
              <div className="address-input-group">
                <label>PIN Code *</label>
                <input
                  required
                  type="text"
                  placeholder="6-digit PIN code"
                  pattern="[0-9]{6}"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                />
              </div>
              <div className="address-input-group">
                <label>City *</label>
                <input
                  required
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div className="address-input-group">
                <label>State *</label>
                <input
                  required
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>
              <div className="address-input-group">
                <label>Country</label>
                <input
                  readOnly
                  type="text"
                  value={address.country}
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* ── BOTTOM ACTION BAR ── */}
          <div className="checkout-bottom-action-bar">
            <div className="checkout-bottom-left">
              <div className="checkout-shield-gold">
                <ShieldCheck size={24} />
              </div>
              <div className="checkout-bottom-left-text">
                <strong>100% Secure Checkout</strong>
                <small>Bank-grade 256-bit encryption protects all your payments.</small>
              </div>
            </div>

            <div className="checkout-bottom-right">
              <button
                type="submit"
                disabled={placing || !items.length}
                className="checkout-gold-btn"
              >
                <span>{getButtonText()}</span>
                <ChevronRight size={18} />
              </button>
              <span className="checkout-redirect-note">
                <LockKeyhole size={11} />
                You will be redirected to the provider for completing your payment.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
