import { ArrowUpRight, Boxes, FileText, Image, LayoutDashboard, Leaf, LogOut, Mail, Menu, Settings, ShoppingBag, UsersRound, X } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Overview from './Overview.jsx'
import ProductsPanel from './ProductsPanel.jsx'
import ContentPanel from './ContentPanel.jsx'
import MediaLibrary from './MediaLibrary.jsx'
import PeoplePanel from './PeoplePanel.jsx'
import OrderManagement from './OrderManagement.jsx'
import DeliveryPanel from './DeliveryPanel.jsx'
import './Admin.css'

const tabs = [
  ['overview', 'Overview', LayoutDashboard, 'A clear view of your wellness business.'],
  ['orders', 'Orders', ShoppingBag, 'Manage orders, payments and delivery updates.'],
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
  const tab = tabs.find(item => item[0] === params.get('tab')) || tabs[0]
  const select = key => { setParams({ tab: key }); setMobile(false) }
  return <div className="admin-app">{mobile && <button className="admin-nav-backdrop" aria-label="Close menu" onClick={() => setMobile(false)} />}<aside className={`admin-sidebar ${mobile ? 'open' : ''}`}><Link to="/admin" className="admin-brand"><span><Leaf size={26} /></span><div>DIVYA <b>SWASTH</b><small>STORE ADMINISTRATION</small></div></Link><button className="admin-mobile-close" aria-label="Close navigation" onClick={() => setMobile(false)}><X /></button><p className="admin-nav-label">WORKSPACE</p><nav aria-label="Administration">{tabs.map(([key, label, Icon]) => <button key={key} className={tab[0] === key ? 'active' : ''} aria-current={tab[0] === key ? 'page' : undefined} onClick={() => select(key)}><Icon size={18} /><span>{label}</span>{tab[0] === key && <i />}</button>)}</nav><div className="admin-sidebar-bottom"><div className="admin-sidebar-note"><Leaf size={22} /><strong>Rooted in care.</strong><p>Growing your store, one thoughtful detail at a time.</p></div><Link to="/" target="_blank">View storefront <ArrowUpRight size={16} /></Link><button onClick={() => { logout(); navigate('/login') }}><LogOut size={16} /> Sign out</button></div></aside>
    <div className="admin-workspace"><header className="admin-topbar"><div><button className="admin-mobile-toggle" aria-label="Open navigation" onClick={() => setMobile(true)}><Menu /></button><span>Workspace <b>/ {tab[1]}</b></span></div><div className="admin-user"><span className="admin-live-dot" /><small>Store management</small><span className="admin-avatar">{user?.name?.slice(0, 1).toUpperCase()}</span><div><strong>{user?.name}</strong><small>Administrator</small></div></div></header><main className="admin-main"><div className="admin-page-heading"><div><span className="admin-eyebrow">DIVYA SWASTH / ADMIN</span><h1>{tab[1]}</h1><p>{tab[3]}</p></div><span className="admin-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
      {tab[0] === 'overview' && <Overview navigate={select} />}
      {tab[0] === 'orders' && <OrderManagement />}
      {tab[0] === 'delivery' && <DeliveryPanel />}
      {tab[0] === 'products' && <ProductsPanel />}
      {['customers', 'messages', 'subscribers'].includes(tab[0]) && <PeoplePanel key={tab[0]} type={tab[0]} />}
      {tab[0] === 'content' && <ContentPanel key="content" />}
      {tab[0] === 'settings' && <ContentPanel key="settings" settingsOnly />}
      {tab[0] === 'media' && <section className="admin-panel admin-padded"><MediaLibrary /></section>}
    </main><footer className="admin-footer">© {new Date().getFullYear()} Divya Swasth <span>Made for mindful business.</span></footer></div></div>
}
