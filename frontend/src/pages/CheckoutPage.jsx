import { Check, CreditCard, MapPin, ShieldCheck, Truck } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [address, setAddress] = useState({ fullName: user?.name || '', email: user?.email || '', phone: user?.phone || '', addressLine: '', city: '', state: '', postalCode: '', country: 'India' })
  const shippingPrice = subtotal >= 999 ? 0 : 99
  const totalPrice = subtotal + shippingPrice
  const fieldClass = 'w-full rounded-xl border border-[#dce2d9] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b58428] focus:ring-4 focus:ring-[#b58428]/10'
  const update = (field) => (event) => setAddress((current) => ({ ...current, [field]: event.target.value }))
  const placeOrder = async (event) => {
    event.preventDefault()
    if (!items.length) return toast.error('Your cart is empty')
    setPlacing(true)
    try {
      const { order } = await apiRequest('/orders', { method: 'POST', body: JSON.stringify({ items: items.map((item) => ({ product: item._id, slug: item.slug, quantity: item.quantity })), shippingAddress: address, paymentMethod }) })
      clearCart()
      navigate(`/order-success/${order._id}`)
    } catch (error) { toast.error(error.message) } finally { setPlacing(false) }
  }
  return <section className="bg-[#f4f5ef] px-4 py-14 sm:px-6 lg:px-8"><form onSubmit={placeOrder} className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_400px]"><div><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#a1711b]">Secure checkout</p><h1 className="mt-2 font-display text-5xl text-[#183222]">Complete your order</h1><div className="mt-9 rounded-[2rem] border border-[#dce2d8] bg-white p-6 sm:p-8"><h2 className="flex items-center gap-3 font-display text-2xl"><MapPin className="h-5 w-5 text-[#a77820]" /> Delivery information</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><input required value={address.fullName} onChange={update('fullName')} className={fieldClass} placeholder="Full name" /><input type="email" required value={address.email} onChange={update('email')} className={fieldClass} placeholder="Email address" /><input required pattern="[0-9]{10}" value={address.phone} onChange={update('phone')} className={fieldClass} placeholder="10 digit mobile number" /><input required pattern="[0-9]{6}" value={address.postalCode} onChange={update('postalCode')} className={fieldClass} placeholder="6 digit PIN code" /><input required value={address.addressLine} onChange={update('addressLine')} className={`${fieldClass} sm:col-span-2`} placeholder="House number, street and area" /><input required value={address.city} onChange={update('city')} className={fieldClass} placeholder="City" /><input required value={address.state} onChange={update('state')} className={fieldClass} placeholder="State" /><input required value={address.country} onChange={update('country')} className={fieldClass} placeholder="Country" /></div></div><div className="mt-5 rounded-[2rem] border border-[#dce2d8] bg-white p-6 sm:p-8"><h2 className="flex items-center gap-3 font-display text-2xl"><CreditCard className="h-5 w-5 text-[#a77820]" /> Payment method</h2><div className="mt-5 grid gap-3">{[['COD', 'Cash on delivery', 'Pay when your order arrives.'], ['UPI', 'UPI / online payment', 'Creates a payment-pending order. Connect a verified payment gateway before live use.']].map(([value, title, text]) => <label key={value} className={`flex cursor-pointer gap-4 rounded-2xl border p-4 ${paymentMethod === value ? 'border-[#b58428] bg-[#fffaf0]' : 'border-[#e1e5dd]'}`}><input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} className="accent-[#1e492e]" /><span><strong className="block text-sm">{title}</strong><span className="mt-1 block text-xs leading-5 text-[#7a857e]">{text}</span></span></label>)}</div></div></div><aside className="h-fit rounded-[2rem] bg-[#10291d] p-7 text-white lg:sticky lg:top-28"><h2 className="font-display text-2xl text-[#f4e6bc]">Your order</h2><div className="mt-6 max-h-64 space-y-4 overflow-auto pr-1">{items.map((item) => <div key={item._id} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4"><div><p className="text-sm font-bold">{item.name} <span className="text-white/40">× {item.quantity}</span></p><p className="mt-1 text-[9px] uppercase tracking-wider text-white/40">{item.subtitle}</p></div><p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p></div>)}</div><div className="mt-6 space-y-3 text-sm text-white/60"><div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shippingPrice ? `₹${shippingPrice}` : 'Free'}</span></div><div className="flex justify-between border-t border-white/15 pt-4 text-white"><span>Total</span><span className="text-2xl font-black text-[#e1ba61]">₹{totalPrice.toLocaleString('en-IN')}</span></div></div><button disabled={placing || !items.length} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b67d1e] to-[#e0b652] py-4 text-[10px] font-black uppercase tracking-[.13em] text-[#172319] disabled:opacity-50">{placing ? 'Placing order...' : <><Check className="h-4 w-4" /> Place order</>}</button><div className="mt-5 flex justify-center gap-5 text-[8px] font-bold uppercase tracking-wider text-white/40"><span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> JWT protected</span><span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Tracked</span></div></aside></form></section>
}
