import { ChevronDown, Clock, Menu, ShoppingCart, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { fallbackProducts } from '../data/products.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import BrandLogo from './BrandLogo.jsx'

const TRUST_BADGES = [
  { icon: '✓', label: '100% Natural' },
  { icon: '✓', label: 'GMP Certified' },
  { icon: '✓', label: '100% Vegetarian' },
  { icon: '✓', label: 'No Added Preservatives' },
]

const NAV_LINKS = [
  ['HOME', '/'],
  ['OUR INGREDIENTS', '/ingredients'],
  ['OUR STORY', '/about'],
  ['WELLNESS QUIZ', '/wellness'],
  ['BLOG', '/blog'],
  ['CONTACT', '/contact'],
]

const navLinkClass = ({ isActive }) =>
  `relative text-[11px] font-bold tracking-[0.08em] uppercase transition-colors duration-200 py-1 ${
    isActive
      ? 'text-[#1a3a1a] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c8973a] after:rounded-full'
      : 'text-[#2d4a2d] hover:text-[#c8973a]'
  }`

export default function Header() {
  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const { itemCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── TOP BAR ── */}
      <div className="bg-[#1a2e1a]">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Trust badges */}
          <div className="flex items-center gap-4 sm:gap-6">
            {TRUST_BADGES.map(({ icon, label }) => (
              <span key={label} className="hidden items-center gap-1.5 text-[10px] font-semibold text-white/85 sm:flex">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#c8973a] text-[#c8973a] text-[8px] font-black leading-none">
                  {icon}
                </span>
                {label}
              </span>
            ))}
            {/* Mobile - show short version */}
            <span className="flex items-center gap-1 text-[9px] font-semibold text-white/75 sm:hidden">
              <span className="text-[#c8973a]">✓</span> 100% Natural &amp; Vegetarian
            </span>
          </div>
          {/* Right side - Track Order, Support, Cart */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/orders"
              className="hidden items-center gap-1.5 text-[10px] font-semibold text-white/80 transition hover:text-[#c8973a] sm:flex"
            >
              <Clock className="h-3 w-3" />
              Track Order
            </Link>
            <Link
              to="/contact"
              className="hidden text-[10px] font-semibold text-white/80 transition hover:text-[#c8973a] sm:block"
            >
              Support
            </Link>
            <Link
              to="/cart"
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
            <NavLink to="/" className={navLinkClass}>
              HOME
            </NavLink>

            {/* OUR PRODUCTS dropdown */}
            <div
              className="group relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <NavLink to="/shop" className={navLinkClass}>
                OUR PRODUCTS
                <ChevronDown className="ml-1 inline h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
              </NavLink>
              {/* Dropdown */}
              <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-2 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  to="/shop"
                  className="block rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#c8973a] hover:bg-[#fdf6ea]"
                >
                  Explore all products
                </Link>
                {fallbackProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/products/${product.slug}`}
                    className="block rounded-lg px-4 py-2.5 transition hover:bg-[#fdf6ea]"
                  >
                    <span className="block text-[11px] font-bold text-[#1a3a1a]">{product.name}</span>
                    <span className="mt-0.5 block text-[10px] text-gray-400">{product.subtitle}</span>
                  </Link>
                ))}
              </div>
            </div>

            {NAV_LINKS.slice(1).map(([label, href]) => (
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
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#2d4a2d] hover:bg-[#f0f5ec] hover:text-[#c8973a]"
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#2d4a2d] hover:bg-[#f0f5ec] hover:text-[#c8973a]"
            >
              Our Products
            </NavLink>
            {NAV_LINKS.slice(1).map(([label, href]) => (
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
