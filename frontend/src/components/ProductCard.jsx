import { ArrowRight, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import ProductVisual from './ProductVisual.jsx'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const purchasable = product.availableForPurchase !== false && product.countInStock > 0 && product.price > 0
  const buyNow = () => { if (!purchasable) return; addToCart(product); navigate('/checkout') }

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-[#dfe5d8] bg-white p-2 transition duration-500 hover:-translate-y-1 hover:border-[#c8a452]/60 hover:shadow-[0_20px_50px_rgba(31,58,39,0.11)]">
      <Link to={`/products/${product.slug}`} className="relative block"><ProductVisual product={product} compact />{product.badge && <span className="absolute left-4 top-4 rounded-full bg-[#123b2a] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#f5e4aa]">{product.badge}</span>}</Link>
      <div className="px-3 pb-3 pt-4">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8b6927]">{product.category}</p>
        <Link to={`/products/${product.slug}`} className="mt-1.5 block font-display text-2xl font-bold tracking-wide text-[#173824] transition group-hover:text-[#986818]">{product.name}</Link>
        <p className="mt-1 min-h-9 text-xs leading-5 text-[#6a756d]">{product.subtitle}</p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#738078]">{product.size}</p>
        <div className="mt-3 border-t border-[#edf0e9] pt-3"><p className="text-lg font-black text-[#123b2a]">{product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price to be confirmed'}</p><p className="mt-1 text-[8px] uppercase tracking-wider text-[#8b938d]">MRP inclusive of taxes</p></div>
        <div className="mt-4 grid grid-cols-2 gap-2"><Link to={`/products/${product.slug}`} className="flex items-center justify-center gap-1.5 rounded-full border border-[#d5ddd0] py-3 text-[9px] font-black uppercase tracking-wider text-[#31503a] transition hover:border-[#a87922] hover:text-[#936519]">View product <ArrowRight className="h-3 w-3" /></Link><button type="button" onClick={buyNow} disabled={!purchasable} className="flex items-center justify-center gap-1.5 rounded-full bg-[#123b2a] py-3 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#b98524] disabled:cursor-not-allowed disabled:bg-[#a9afa9]"><ShoppingBag className="h-3 w-3" /> {purchasable ? 'Buy now' : 'Coming soon'}</button></div>
      </div>
    </article>
  )
}
