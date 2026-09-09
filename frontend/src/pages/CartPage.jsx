import { useSiteContent } from '../context/SiteContentContext.jsx'
import { calculateShipping } from '../../../shared/shipping.js'
import { ArrowLeft, ArrowRight, Camera, Check, Leaf, LockKeyhole, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import './CartPage.css'

const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export default function CartPage() {
  const siteContent = useSiteContent('cart')
  const { shipping: shippingSettings } = useSiteContent('settings')
  const { items, itemCount, subtotal, updateQuantity, removeFromCart } = useCart()
  const shipping = calculateShipping(subtotal, items.length, shippingSettings)
  const remaining = Math.max(0, shippingSettings.freeAbove - subtotal)
  const progress = shippingSettings.freeAbove > 0 ? Math.min(100, subtotal / shippingSettings.freeAbove * 100) : 100

  return (
    <section className="wellness-cart">
      <div className="cart-container">
        <nav className="cart-breadcrumb" aria-label="Breadcrumb"><Link to="/shop">Our products</Link><span>/</span><span aria-current="page">Your bag</span></nav>
        <header className="cart-heading">
          <div><p className="cart-eyebrow"><Leaf size={15} />A little care, selected by you</p><h1>{siteContent.text.your_wellness_bag}</h1><p>{items.length ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your bag. A step closer to your daily wellness ritual.` : 'Make room for a little everyday wellness.'}</p></div>
          <ol className="cart-steps" aria-label="Checkout steps"><li aria-current="step"><span>1</span>Bag</li><li><span>2</span>Checkout</li><li><span>3</span>Confirmation</li></ol>
        </header>

        {!items.length ? (
          <div className="cart-empty"><span><ShoppingBag size={38} strokeWidth={1.3} /></span><h2>{siteContent.text.your_cart_is_waiting}</h2><p>{siteContent.text.add_a_wellness_product_and_begin_your_mindful}</p><Link className="cart-checkout" to={siteContent.media.to_1}>{siteContent.text.explore_products}<ArrowRight size={17} /></Link></div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-panel">
              <div className="cart-shipping-note"><Truck size={21} /><div><p>{remaining > 0 ? <>Add <strong>{money(remaining)}</strong> more for free shipping</> : <><strong>Free shipping unlocked</strong> for your wellness bag</>}</p><div className="cart-shipping-progress" role="progressbar" aria-label="Progress toward free shipping" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div></div>{remaining === 0 && <Check size={18} />}</div>
              <div className="cart-list-heading"><h2>Your selection <span>({items.length})</span></h2><span>Item total</span></div>
              <div className="cart-product-list">
                {items.map(item => (
                  <article className="cart-product" key={item._id || item.slug}>
                    <Link className="cart-product-image" to={`/products/${item.slug}`} aria-label={`View ${item.name}`}>
                      {item.images?.[0] ? <img src={item.images[0]} alt={item.name} /> : <Camera size={28} />}
                    </Link>
                    <div className="cart-product-info"><p className="cart-category">{item.category}</p><Link className="cart-product-name" to={`/products/${item.slug}`}>{item.name}</Link><p className="cart-product-subtitle">{item.subtitle}</p><p className="cart-unit-price">{money(item.price)} <span>/ unit</span></p>
                      <div className="cart-product-controls"><div className="cart-quantity"><button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={item.quantity <= 1} onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={14} /></button><output aria-live="polite" aria-label={`${item.name} quantity`}>{item.quantity}</output><button type="button" aria-label={`Increase ${item.name} quantity`} disabled={item.quantity >= Math.min(item.countInStock ?? 10, 10)} onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={14} /></button></div><button className="cart-remove" type="button" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item._id)}><Trash2 size={14} /><span>{siteContent.text.remove}</span></button></div>
                    </div>
                    <p className="cart-line-total">{money(item.price * item.quantity)}</p>
                  </article>
                ))}
              </div>
              <Link className="cart-back" to={siteContent.media.to_3}><ArrowLeft size={16} />{siteContent.text.continue_shopping}</Link>
              <div className="cart-care-note"><Leaf size={18} /><p>Thoughtful choices. Everyday wellness.<span>Check each product label for ingredients and directions.</span></p></div>
            </div>
            <aside className="cart-summary">
              <div className="cart-summary-title"><ShoppingBag size={21} /><h2>{siteContent.text.order_summary}</h2></div>
              <p className="cart-summary-caption">Your next step towards a mindful routine.</p>
              <dl><div><dt>{siteContent.text.subtotal} <span>({itemCount} items)</span></dt><dd>{money(subtotal)}</dd></div><div><dt>{siteContent.text.shipping}</dt><dd className={!shipping ? 'cart-free' : undefined}>{shipping ? money(shipping) : 'FREE'}</dd></div><div className="cart-grand-total"><dt>{siteContent.text.total}</dt><dd aria-live="polite">{money(subtotal + shipping)}</dd></div></dl>
              <Link className="cart-checkout" to={siteContent.media.to_2}>{siteContent.text.proceed_to_checkout}<ArrowRight size={18} /></Link>
              <p className="cart-secure"><LockKeyhole size={13} />Secure checkout</p>
              <div className="cart-summary-footer"><Truck size={19} /><p>Delivery details<span>Review your address and delivery options at checkout.</span></p></div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
