import {
  ArrowUpRight,
  Boxes,
  Calendar,
  FileText,
  Image,
  LayoutDashboard,
  Leaf,
  LogOut,
  Mail,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  Sparkles,
  UsersRound,
  X
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Overview from './Overview.jsx'
import ProductsPanel from './ProductsPanel.jsx'
import ContentPanel from './ContentPanel.jsx'
import MediaLibrary from './MediaLibrary.jsx'
import PeoplePanel from './PeoplePanel.jsx'
import LeadsPanel from './LeadsPanel.jsx'
import OrderManagement from './OrderManagement.jsx'
import DeliveryPanel from './DeliveryPanel.jsx'
import AdminUserMenu from './AdminUserMenu.jsx'
import BrandLogo from '../components/BrandLogo.jsx'
import './Admin.css'

const tabs = [
  ['overview', 'Overview', LayoutDashboard, 'A clear view of your wellness business.'],
  ['orders', 'Orders', ShoppingBag, 'Manage orders, payments and delivery updates.'],
  ['leads', 'Health Leads', Sparkles, 'Prospective patient assessment submissions and consultation follow-ups.'],
  ['delivery', 'Delivery team', UsersRound, 'Manage delivery partners, assign orders and follow every update.'],
  ['products', 'Products', Boxes, 'Your complete catalog, pricing and inventory.'],
  ['customers', 'Customers', UsersRound, 'Get to know the people behind your orders.'],
  ['content', 'Website content', FileText, 'The same beautiful design, with content you control.'],
  ['media', 'Media library', Image, 'Keep all your product and website photography together.'],
  ['messages', 'Enquiries', Mail, 'Thoughtful customer care starts here.'],
  ['subscribers', 'Subscribers', UsersRound, 'Stay connected with your wellness community.'],
  ['settings', 'Store settings', Settings, 'Manage shipping rules and product recommendations.'],
]

export default function AdminShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [mobile, setMobile] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const tab = tabs.find(item => item[0] === params.get('tab')) || tabs[0]
  const select = key => {
    setParams({ tab: key })
    setMobile(false)
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div className={`admin-app${collapsed ? ' admin-sidebar-collapsed' : ''}`}>
      {mobile && (
        <button
          className="admin-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setMobile(false)}
        />
      )}

      {/* Modern Sidebar */}
      <aside id="admin-navigation" className={`admin-sidebar ${mobile ? 'open' : ''}`}>
        <BrandLogo className="admin-sidebar-brand" />
        <button
          className="admin-mobile-close"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        >
          <X size={18} />
        </button>

        <p className="admin-nav-label">Workspace</p>
        <nav aria-label="Administration">
          {tabs.map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              title={label}
              aria-label={label}
              className={tab[0] === key ? 'active' : ''}
              aria-current={tab[0] === key ? 'page' : undefined}
              onClick={() => select(key)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {tab[0] === key && <i />}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-note">
            <Leaf size={20} />
            <strong>Rooted in Care</strong>
            <p>Cultivating authentic Ayurvedic wellness, one detail at a time.</p>
          </div>

          <Link to="/" target="_blank" title="View Storefront" aria-label="View Storefront">
            <span>View Storefront</span>
            <ArrowUpRight size={15} />
          </Link>

          <button type="button" title="Sign Out" aria-label="Sign Out" onClick={() => { logout(); navigate('/login') }}>
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="admin-workspace">
        {/* Sticky Header Topbar */}
        <header className="admin-topbar">
          <div>
            <button
              type="button"
              className="admin-sidebar-toggle"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls="admin-navigation"
              onClick={() => setCollapsed(value => !value)}
            >
              {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <button
              type="button"
              className="admin-mobile-toggle"
              aria-label="Open navigation"
              aria-expanded={mobile}
              aria-controls="admin-navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace <b>/ {tab[1]}</b></span>
          </div>

          <div className="admin-user">
            <div className="admin-live-badge">
              <span className="admin-live-dot" />
              <span>Live Sync Active</span>
            </div>
            <AdminUserMenu user={user} onLogout={() => { logout(); navigate('/login') }} />
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-main">
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">Divya Swasth Admin</span>
              <h1>{tab[1]}</h1>
              <p>{tab[3]}</p>
            </div>
            <span className="admin-date-badge">
              <Calendar size={15} />
              {currentDateFormatted}
            </span>
          </div>

          {tab[0] === 'overview' && <Overview navigate={select} />}
          {tab[0] === 'orders' && <OrderManagement />}
          {tab[0] === 'leads' && <LeadsPanel />}
          {tab[0] === 'delivery' && <DeliveryPanel />}
          {tab[0] === 'products' && <ProductsPanel />}
          {['customers', 'messages', 'subscribers'].includes(tab[0]) && <PeoplePanel key={tab[0]} type={tab[0]} />}
          {tab[0] === 'content' && <ContentPanel key="content" />}
          {tab[0] === 'settings' && <ContentPanel key="settings" settingsOnly />}
          {tab[0] === 'media' && (
            <section className="admin-panel admin-padded">
              <MediaLibrary />
            </section>
          )}
        </main>

        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} Divya Swasth Ayurveda. All rights reserved.</span>
          <span>Crafted for Mindful Commerce.</span>
        </footer>
      </div>
    </div>
  )
}
