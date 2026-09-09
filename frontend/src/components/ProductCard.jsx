import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const image = product.cardImage || product.images?.[0] || '/images/home/Vital.png'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#e3d9b8] bg-[#fffdf8] shadow-[0_7px_20px_rgba(49,68,40,.08)] transition duration-300 hover:-translate-y-1 hover:border-[#c8a452] hover:shadow-[0_16px_36px_rgba(49,68,40,.15)]">
      {/* Product Image */}
      <Link
        to={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#f5f0e3]"
      >
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-2.5 top-2.5 rounded-full bg-[#064321] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#e9c35e] shadow-sm">
          {product.badge || product.size || '60 CAPSULES'}
        </span>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5 text-center">
        <Link
          to={`/products/${product.slug}`}
          className="font-serif text-lg font-bold tracking-tight text-[#1c3827] transition hover:text-[#b58321] sm:text-xl"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-[#526355] line-clamp-1">
          {product.subtitle}
        </p>

        <div className="mt-3 mb-4">
          <p className="font-serif text-2xl font-bold text-[#1a3827]">
            {product.price ? `₹${product.price.toLocaleString('en-IN')}/-` : 'Coming soon'}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            to={`/products/${product.slug}`}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#064321] px-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#0a5c2f] shadow-sm"
          >
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
