import { useSiteContent } from '../context/SiteContentContext.jsx'
import { ChevronDown, Clock, Menu, ShoppingCart, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { fallbackProducts } from '../data/products.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../hooks/useProducts.js'
import BrandLogo from './BrandLogo.jsx'





const navLinkClass = ({ isActive }) =>
  `relative text-[11px] font-bold tracking-[0.08em] uppercase transition-colors duration-200 py-1 ${
    isActive
      ? 'text-[#1a3a1a] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c8973a] after:rounded-full'
      : 'text-[#2d4a2d] hover:text-[#c8973a]'
  }`

export default function Header() {
  const siteContent = useSiteContent('header', siteIcons)

  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const { itemCount } = useCart()
  const { user } = useAuth()
  const { products } = useProducts()
  const displayProducts = products?.length ? products : fallbackProducts

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── TOP BAR ── */}
      <div className="bg-[#1a2e1a]">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Trust badges */}
          <div className="flex items-center gap-4 sm:gap-6">
            {siteContent.sections.TRUST_BADGES.map(({ icon, label }) => (
              <span key={label} className="hidden items-center gap-1.5 text-[10px] font-semibold text-white/85 sm:flex">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#c8973a] text-[#c8973a] text-[8px] font-black leading-none">
                  {icon}
                </span>
                {label}
              </span>
            ))}
            {/* Mobile - show short version */}
            <span className="flex items-center gap-1 text-[9px] font-semibold text-white/75 sm:hidden">
              <span className="text-[#c8973a]">✓</span>{siteContent.text["100_natural_vegetarian"]}</span>
          </div>
          {/* Right side - Track Order, Support, Cart */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to={siteContent.media.to_1}
              className="hidden items-center gap-1.5 text-[10px] font-semibold text-white/80 transition hover:text-[#c8973a] sm:flex"
            >
              <Clock className="h-3 w-3" />{siteContent.text.track_order}</Link>
            <Link
              to={siteContent.media.to_2}
              className="hidden text-[10px] font-semibold text-white/80 transition hover:text-[#c8973a] sm:block"
            >{siteContent.text.support}</Link>
            <Link
              to={siteContent.media.to_3}
              className="relative flex items-center text-white/80 transition hover:text-[#c8973a]"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#c8973a] px-1 text-[8px] font-black text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">
            {/* HOME */}
            <NavLink to={siteContent.media.to_4} className={navLinkClass}>{siteContent.text.home}</NavLink>

            {/* OUR PRODUCTS dropdown */}
            <div
              className="group relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false) }}
              onKeyDown={(event) => { if (event.key === 'Escape') { setProductsOpen(false); event.currentTarget.querySelector('button').focus() } }}
            >
              <button type="button" className={`${navLinkClass({ isActive: productsOpen })} cursor-pointer`} aria-expanded={productsOpen} aria-controls="products-dropdown" onClick={() => setProductsOpen(value => !value)}>{siteContent.text.our_products}<ChevronDown className="ml-1 inline h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {/* Dropdown */}
              <div id="products-dropdown" className={`${productsOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'} absolute left-1/2 top-full w-72 -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-2 shadow-xl transition-all duration-200`}>
                <Link
                  to={siteContent.media.to_5}
                  onClick={() => setProductsOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#c8973a] hover:bg-[#fdf6ea]"
                >{siteContent.text.explore_all_products}</Link>
                {displayProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/products/${product.slug}`}
                    onClick={() => setProductsOpen(false)}
                    className="block rounded-lg px-4 py-2.5 transition hover:bg-[#fdf6ea]"
                  >
                    <span className="block text-[11px] font-bold text-[#1a3a1a]">{product.name}</span>
                    <span className="mt-0.5 block text-[10px] text-gray-400">{product.subtitle}</span>
                  </Link>
                ))}
              </div>
            </div>

            {siteContent.sections.NAV_LINKS.slice(1).map(([label, href]) => (
              <NavLink key={label} to={href} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Link
              to={user ? '/account' : '/login'}
              className="rounded-full p-2 text-[#2d4a2d] transition hover:bg-[#f0f5ec] hover:text-[#c8973a]"
              aria-label={user ? 'My account' : 'Sign in'}
            >
              <UserRound className="h-5 w-5" />
            </Link>
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-2 text-[#2d4a2d] transition hover:bg-[#f0f5ec] hover:text-[#c8973a] xl:hidden"
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-lg xl:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink
              to={siteContent.media.to_6}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#2d4a2d] hover:bg-[#f0f5ec] hover:text-[#c8973a]"
            >{siteContent.text.home_2}</NavLink>
            <NavLink
              to={siteContent.media.to_7}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#2d4a2d] hover:bg-[#f0f5ec] hover:text-[#c8973a]"
            >{siteContent.text.our_products_2}</NavLink>
            {displayProducts.map(product => <NavLink key={product.slug} to={`/products/${product.slug}`} onClick={() => setOpen(false)} className={({ isActive }) => `ml-4 rounded-lg px-4 py-2 text-[11px] ${isActive ? 'bg-[#fdf6ea] text-[#9b7027]' : 'text-[#2d4a2d] hover:bg-[#fdf6ea]'}`}><span className="block font-bold">{product.name}</span><span className="mt-1 block text-[10px] text-gray-400">{product.subtitle}</span></NavLink>)}
            {siteContent.sections.NAV_LINKS.slice(1).map(([label, href]) => (
              <NavLink
                key={label}
                to={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#2d4a2d] hover:bg-[#f0f5ec] hover:text-[#c8973a]"
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to={user ? '/account' : '/login'}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg border border-[#c8973a] px-4 py-2.5 text-center text-[12px] font-bold text-[#c8973a] transition hover:bg-[#c8973a] hover:text-white"
            >
              {user ? 'My Account' : 'Login / Register'}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  )
}

const siteIcons = {  }
