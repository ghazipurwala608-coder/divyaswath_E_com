import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductVisual from './ProductVisual.jsx'

export default function ProductCard({ product }) {
  return (
    <article className="group flex min-h-[270px] overflow-hidden rounded-2xl border border-[#e5ddce] bg-[#fffdfa] p-2 shadow-[0_8px_22px_rgba(40,47,32,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#c8a452] hover:shadow-[0_18px_34px_rgba(31,58,39,.13)]">
      <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="relative flex w-[45%] shrink-0 items-center overflow-hidden rounded-xl bg-[#f1eee4]">
        <ProductVisual product={product} compact />
        {product.badge && <span className="absolute left-2 top-2 rounded-full bg-[#123b2a] px-2 py-1 text-[7px] font-extrabold uppercase tracking-[.1em] text-[#f5e4aa]">{product.badge}</span>}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2 sm:px-4">
        <Link to={`/products/${product.slug}`} className="font-sans text-lg font-black leading-[1.05] tracking-tight text-[#263027] transition group-hover:text-[#8e651c] sm:text-xl">{product.name}</Link>
        <p className="mt-2 text-[11px] font-semibold leading-4 text-[#596058] sm:text-xs">{product.subtitle}</p>
        <p className="mt-3 text-[10px] font-black uppercase tracking-[.07em] text-[#353b35]">{product.size}</p>
        <p className="mt-1 text-xl font-black leading-none text-[#1e3023]">{product.price ? `₹${product.price.toLocaleString('en-IN')}/-` : 'Coming soon'}</p>
        <Link to={`/products/${product.slug}`} className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#123b2a] px-3 py-2 text-[8px] font-black uppercase tracking-[.08em] text-white transition hover:bg-[#a87922]">View details <ArrowRight className="h-3 w-3" /></Link>
      </div>
    </article>
  )
}
