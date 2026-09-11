import { useCallback, useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard,
  UsersRound,
  History,
  ShieldCheck,
  Plus,
  Pencil,
  RefreshCw,
  Search,
  LogOut,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Lock,
  Mail,
  Phone,
  User,
  ExternalLink,
  Filter,
  Sparkles,
  Activity,
  Layers,
  Clock,
  ShieldAlert,
  ChevronRight,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../api/client.js'
import './SuperAdmin.css'

const dateInput = (value) =>
  value ? new Date(new Date(value).getTime() + 19800000).toISOString().slice(0, 10) : ''

const dateLabel = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      })
    : 'No expiry (Legacy)'

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth()
  const [admins, setAdmins] = useState([])
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('admins') // 'admins' | 'audit' | 'subscriptions'
  const [time, setTime] = useState(new Date())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/super-admin/admins')
      setAdmins(data.admins || [])
      setEvents(data.events || [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [load])

  const save = async (body, id) => {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await apiRequest(`/super-admin/admins${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      setShowModal(false)
      setEditing(null)
      await load()
      setMessage(id ? 'Admin account & subscription updated successfully.' : 'New store admin created successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setShowModal(true)
    setMessage('')
  }

  const openEdit = (admin) => {
    setEditing(admin)
    setShowModal(true)
    setMessage('')
  }

  const toggleAccount = (admin) => {
    const action = admin.accountActive === false ? 'Enable' : 'Disable'
    if (window.confirm(`${action} ${admin.name}'s account? This will also affect their assigned delivery team.`)) {
      save({ accountActive: admin.accountActive === false }, admin._id)
    }
  }

  // Stats calculation
  const totalAdmins = admins.length
  const activeAdmins = admins.filter((a) => a.accessStatus === 'active').length
  const pausedAdmins = admins.filter((a) => a.accessStatus === 'paused').length
  const expiredAdmins = admins.filter((a) => a.accessStatus === 'expired').length
  const disabledAdmins = admins.filter((a) => a.accessStatus === 'disabled').length
  const attentionCount = totalAdmins - activeAdmins

  const filteredAdmins = admins
    .filter((admin) => {
      if (filter === 'all') return true
      if (filter === 'active') return admin.accessStatus === 'active'
      if (filter === 'paused') return admin.accessStatus === 'paused'
      if (filter === 'expired') return admin.accessStatus === 'expired'
      if (filter === 'disabled') return admin.accessStatus === 'disabled'
      if (filter === 'attention') return admin.accessStatus !== 'active'
      return true
    })
    .filter((admin) =>
      `${admin.name} ${admin.email} ${admin.phone} ${admin.subscription?.plan || ''}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )

  return (
    <div className="super-dashboard-shell">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="super-side-nav">
        <div className="super-nav-brand">
          <div className="super-brand-emblem">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2>Divya Swasth</h2>
            <span>SUPER ADMIN CONSOLE</span>
          </div>
        </div>

        <div className="super-nav-section-title">NAVIGATION</div>
        <nav className="super-nav-links">
          <button
            type="button"
            className={activeTab === 'admins' ? 'active' : ''}
            onClick={() => setActiveTab('admins')}
          >
            <UsersRound size={17} />
            <span>Store Admins</span>
            <span className="nav-badge">{totalAdmins}</span>
          </button>

          <button
            type="button"
            className={activeTab === 'subscriptions' ? 'active' : ''}
            onClick={() => setActiveTab('subscriptions')}
          >
            <CreditCard size={17} />
            <span>Subscriptions</span>
            <span className="nav-badge green">{activeAdmins} Active</span>
          </button>

          <button
            type="button"
            className={activeTab === 'audit' ? 'active' : ''}
            onClick={() => setActiveTab('audit')}
          >
            <History size={17} />
            <span>Access Audit Log</span>
            <span className="nav-badge">{events.length}</span>
          </button>
        </nav>

        <div className="super-nav-section-title">STOREFRONT</div>
        <div className="super-nav-links">
          <Link to="/" className="store-link">
            <ExternalLink size={16} />
            <span>View Public Store</span>
            <ArrowUpRight size={14} className="icon-end" />
          </Link>
        </div>

        <div className="super-nav-bottom-card">
          <div className="pulse-dot-wrap">
            <span className="pulse-dot" />
            <span className="pulse-text">System Active & Secure</span>
          </div>
          <p>Manual subscriptions with Indian Standard Time (IST) expiration.</p>
        </div>

        <div className="super-nav-user">
          <div className="super-user-avatar">
            <span>{user?.name?.slice(0, 2).toUpperCase() || 'SA'}</span>
          </div>
          <div className="super-user-meta">
            <strong>{user?.name || 'Super Admin'}</strong>
            <small>{user?.email || 'superadmin@divyaswasth.in'}</small>
          </div>
          <button type="button" onClick={logout} className="super-signout-btn" title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="super-main-content">
        {/* Top bar header */}
        <header className="super-topbar">
          <div>
            <div className="super-breadcrumbs">
              <span>WORKSPACE</span> / <strong>{activeTab.toUpperCase()}</strong>
            </div>
            <h1>Super Administrator Console</h1>
          </div>

          <div className="super-topbar-actions">
            <div className="super-clock">
              <Clock size={14} />
              <span>
                {time.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  timeZone: 'Asia/Kolkata',
                })}{' '}
                IST
              </span>
            </div>

            <button type="button" onClick={load} disabled={busy || loading} className="super-btn-refresh">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button type="button" onClick={openCreate} className="super-btn-primary">
              <Plus size={16} />
              <span>Create Store Admin</span>
            </button>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div className="super-alert error">
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button onClick={() => setError('')}><X size={14} /></button>
          </div>
        )}
        {message && (
          <div className="super-alert success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
            <button onClick={() => setMessage('')}><X size={14} /></button>
          </div>
        )}

        {/* ── OVERVIEW KPI CARDS ── */}
        <section className="super-kpi-grid">
          <div className="super-kpi-card">
            <div className="kpi-icon primary">
              <UsersRound size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Total Store Admins</span>
              <h3 className="kpi-value">{totalAdmins}</h3>
              <span className="kpi-subtext">Managing shared store operations</span>
            </div>
          </div>

          <div className="super-kpi-card">
            <div className="kpi-icon success">
              <CheckCircle2 size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Active Subscriptions</span>
              <h3 className="kpi-value text-emerald-600">{activeAdmins}</h3>
              <span className="kpi-subtext">Full operational access enabled</span>
            </div>
          </div>

          <div className="super-kpi-card">
            <div className={`kpi-icon ${attentionCount > 0 ? 'warning' : 'neutral'}`}>
              <ShieldAlert size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Needs Attention</span>
              <h3 className={`kpi-value ${attentionCount > 0 ? 'text-amber-600' : ''}`}>{attentionCount}</h3>
              <span className="kpi-subtext">
                {pausedAdmins} Paused · {expiredAdmins} Expired · {disabledAdmins} Disabled
              </span>
            </div>
          </div>

          <div className="super-kpi-card">
            <div className="kpi-icon audit">
              <Activity size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Audit Logs</span>
              <h3 className="kpi-value">{events.length}</h3>
              <span className="kpi-subtext">Recent access & permission events</span>
            </div>
          </div>
        </section>

        {/* ── TAB CONTENT: STORE ADMINS ── */}
        {activeTab === 'admins' && (
          <section className="super-content-panel">
            <div className="panel-header">
              <div>
                <h2>Store Administrators</h2>
                <p>Create, renew plans, and manage access permissions for store admins.</p>
              </div>

              <div className="panel-toolbar">
                {/* Search */}
                <div className="super-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, email, plan..."
                  />
                  {query && (
                    <button onClick={() => setQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter Buttons */}
                <div className="super-filter-pills">
                  {[
                    ['all', `All (${totalAdmins})`],
                    ['active', `Active (${activeAdmins})`],
                    ['paused', `Paused (${pausedAdmins})`],
                    ['expired', `Expired (${expiredAdmins})`],
                    ['disabled', `Disabled (${disabledAdmins})`],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      className={filter === val ? 'active' : ''}
                      onClick={() => setFilter(val)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Admins Grid */}
            <div className="super-admin-cards-grid">
              {filteredAdmins.map((admin) => (
                <div key={admin._id} className={`super-admin-card status-${admin.accessStatus}`}>
                  <div className="admin-card-header">
                    <div className="admin-avatar">
                      {admin.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div className="admin-card-title">
                      <h3>{admin.name}</h3>
                      <span className={`status-badge badge-${admin.accessStatus}`}>
                        {admin.accessStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="admin-contact-list">
                    <div className="contact-item">
                      <Mail size={14} />
                      <span>{admin.email}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={14} />
                      <span>{admin.phone || 'No phone'}</span>
                    </div>
                  </div>

                  {/* Plan Capsule */}
                  <div className="admin-plan-capsule">
                    <CreditCard size={16} className="plan-icon" />
                    <div className="plan-info">
                      <div className="plan-name-row">
                        <strong>{admin.subscription?.plan || 'Standard Plan'}</strong>
                        <span className={`plan-status-pill ${admin.subscription?.status || 'active'}`}>
                          {admin.subscription?.status || 'active'}
                        </span>
                      </div>
                      <small className="plan-expiry">
                        <Calendar size={12} />
                        Expires: {dateLabel(admin.subscription?.expiresAt)}
                      </small>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="admin-card-actions">
                    <button
                      type="button"
                      onClick={() => openEdit(admin)}
                      disabled={busy}
                      className="btn-edit-renew"
                    >
                      <Pencil size={14} />
                      <span>Edit & Renew</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAccount(admin)}
                      disabled={busy}
                      className={`btn-toggle-access ${admin.accountActive === false ? 'enable' : 'disable'}`}
                    >
                      {admin.accountActive === false ? 'Enable Account' : 'Disable Account'}
                    </button>
                  </div>
                </div>
              ))}

              {!filteredAdmins.length && (
                <div className="super-empty-state">
                  <UsersRound size={40} />
                  <h3>No Admin Accounts Found</h3>
                  <p>
                    {query || filter !== 'all'
                      ? 'Try clearing your search query or filter.'
                      : 'Create your first store admin to grant administrative access.'}
                  </p>
                  {!query && filter === 'all' && (
                    <button type="button" onClick={openCreate} className="super-btn-primary mt-4">
                      <Plus size={16} />
                      <span>Create Store Admin</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── TAB CONTENT: SUBSCRIPTIONS ── */}
        {activeTab === 'subscriptions' && (
          <section className="super-content-panel">
            <div className="panel-header">
              <div>
                <h2>Subscription & Access Control</h2>
                <p>Track store admin plans, validity periods, and account statuses.</p>
              </div>
            </div>

            <div className="super-table-wrap">
              <table className="super-data-table">
                <thead>
                  <tr>
                    <th>ADMINISTRATOR</th>
                    <th>CONTACT</th>
                    <th>PLAN NAME</th>
                    <th>SUBSCRIPTION STATUS</th>
                    <th>EXPIRY DATE (IST)</th>
                    <th>ACCOUNT ACCESS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>
                        <div className="table-user-cell">
                          <span className="user-dot" />
                          <strong>{admin.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-gray-600 block">{admin.email}</span>
                        <span className="text-[11px] text-gray-400">{admin.phone}</span>
                      </td>
                      <td>
                        <span className="plan-name-tag">{admin.subscription?.plan || 'Legacy'}</span>
                      </td>
                      <td>
                        <span className={`status-badge badge-${admin.accessStatus}`}>
                          {admin.accessStatus.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs font-medium text-gray-700">
                          {dateLabel(admin.subscription?.expiresAt)}
                        </span>
                      </td>
                      <td>
                        <span className={`access-pill ${admin.accountActive !== false ? 'active' : 'inactive'}`}>
                          {admin.accountActive !== false ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => openEdit(admin)}
                          className="table-action-btn"
                          title="Edit Plan"
                        >
                          <Pencil size={13} />
                          <span>Renew / Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB CONTENT: AUDIT LOG ── */}
        {activeTab === 'audit' && (
          <section className="super-content-panel">
            <div className="panel-header">
              <div>
                <h2>Access Change Audit Trail</h2>
                <p>Chronological log of admin creations, password resets, renewals, and status updates.</p>
              </div>
            </div>

            <div className="super-audit-feed">
              {events.map((event) => (
                <div key={event._id} className="audit-feed-item">
                  <div className="audit-feed-icon">
                    <Activity size={16} />
                  </div>
                  <div className="audit-feed-body">
                    <div className="audit-header-line">
                      <strong>{event.action}</strong>
                      <span className="audit-target">Target: {event.admin?.name || 'Admin'}</span>
                      <span className="audit-time">
                        {new Date(event.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </span>
                    </div>
                    <p className="audit-details">{event.details}</p>
                    <small className="audit-actor">Actor: {event.actor?.name || 'Super Admin'}</small>
                  </div>
                </div>
              ))}

              {!events.length && (
                <div className="super-empty-state">
                  <History size={36} />
                  <h3>No Access Events Recorded</h3>
                  <p>Audit events will automatically appear here when admins are created or updated.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ── MODAL: CREATE / EDIT ADMIN ── */}
      {showModal && (
        <div className="super-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="super-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon">
                  {editing ? <Pencil size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h2>{editing ? 'Edit Store Admin & Subscription' : 'Create Store Administrator'}</h2>
                  <p>Store admins can manage products, orders, content, and delivery teams.</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>

            <AdminForm
              admin={editing}
              busy={busy}
              save={save}
              cancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function AdminForm({ admin, busy, save, cancel }) {
  const [planPreset, setPlanPreset] = useState(admin?.subscription?.plan || 'Annual Enterprise')
  const [expiryPreset, setExpiryPreset] = useState(dateInput(admin?.subscription?.expiresAt))

  const setRelativeExpiry = (months) => {
    const d = new Date()
    d.setMonth(d.getMonth() + months)
    setExpiryPreset(d.toISOString().slice(0, 10))
  }

  const submit = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const body = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      subscription: {
        plan: values.plan.trim(),
        status: values.status,
        expiresAt: values.expiresAt,
      },
    }
    if (values.password) body.password = values.password
    save(body, admin?._id)
  }

  return (
    <form className="super-modal-form" onSubmit={submit}>
      <fieldset disabled={busy}>
        <div className="form-section-title">ADMIN ACCOUNT DETAILS</div>
        <div className="form-grid-2">
          <label>
            <span>Full Name *</span>
            <div className="input-with-icon">
              <User size={15} />
              <input
                name="name"
                defaultValue={admin?.name || ''}
                maxLength={80}
                placeholder="e.g. Rahul Verma"
                required
              />
            </div>
          </label>

          <label>
            <span>Email Address *</span>
            <div className="input-with-icon">
              <Mail size={15} />
              <input
                name="email"
                type="email"
                defaultValue={admin?.email || ''}
                maxLength={254}
                placeholder="admin@divyaswasth.in"
                required
              />
            </div>
          </label>
        </div>

        <div className="form-grid-2">
          <label>
            <span>Phone Number (10 Digits) *</span>
            <div className="input-with-icon">
              <Phone size={15} />
              <input
                name="phone"
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                defaultValue={admin?.phone || ''}
                placeholder="9876543210"
                required
              />
            </div>
          </label>

          <label>
            <span>{admin ? 'Reset Password (Optional)' : 'Password (Min 8 Characters) *'}</span>
            <div className="input-with-icon">
              <Lock size={15} />
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                placeholder={admin ? 'Leave blank to keep current' : 'Min 8 characters'}
                required={!admin}
              />
            </div>
          </label>
        </div>

        <div className="form-section-title mt-4">SUBSCRIPTION & ACCESS VALIDITY</div>
        <div className="form-grid-2">
          <label>
            <span>Subscription Plan Name *</span>
            <input
              name="plan"
              value={planPreset}
              onChange={(e) => setPlanPreset(e.target.value)}
              placeholder="e.g. Annual Enterprise or Monthly Standard"
              maxLength={80}
              required
            />
          </label>

          <label>
            <span>Subscription Status *</span>
            <select name="status" defaultValue={admin?.subscription?.status || 'active'}>
              <option value="active">Active (Access Allowed)</option>
              <option value="paused">Paused (Access Suspended)</option>
            </select>
          </label>
        </div>

        <label className="mt-3">
          <span>Expiry Date (India Time) *</span>
          <input
            name="expiresAt"
            type="date"
            value={expiryPreset}
            onChange={(e) => setExpiryPreset(e.target.value)}
            required
          />
        </label>

        {/* Quick Expiry Presets */}
        <div className="quick-presets-row">
          <small>Quick presets:</small>
          <button type="button" onClick={() => setRelativeExpiry(1)}>+1 Month</button>
          <button type="button" onClick={() => setRelativeExpiry(6)}>+6 Months</button>
          <button type="button" onClick={() => setRelativeExpiry(12)}>+1 Year</button>
          <button type="button" onClick={() => setRelativeExpiry(36)}>+3 Years</button>
        </div>

        <div className="modal-actions-footer">
          <button type="button" onClick={cancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? 'Saving...' : admin ? 'Update Admin & Subscription' : 'Create Store Admin'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
