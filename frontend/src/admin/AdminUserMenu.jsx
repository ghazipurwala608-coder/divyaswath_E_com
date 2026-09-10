import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminUserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const container = useRef(null)
  const trigger = useRef(null)

  useEffect(() => {
    if (!open) return
    const outside = event => {
      if (!container.current?.contains(event.target)) setOpen(false)
    }
    const escape = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return <div className="admin-profile-menu" ref={container} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }}>
    <button ref={trigger} className="admin-profile-trigger" aria-label="Account options" aria-expanded={open} aria-controls="admin-profile-options" onClick={() => setOpen(value => !value)}>
      <span className="admin-avatar">{user?.name?.slice(0, 1).toUpperCase() || 'A'}</span>
      <span className="admin-profile-name"><strong>{user?.name || 'Admin'}</strong><small>Administrator</small></span>
      <ChevronDown size={16} className={open ? 'is-open' : ''} />
    </button>
    {open && <div id="admin-profile-options" className="admin-profile-dropdown">
      <div className="admin-profile-details"><strong>{user?.name || 'Admin'}</strong><span>{user?.email}</span></div>
      <Link to="/account" onClick={() => setOpen(false)}><UserRound size={17} />Manage profile</Link>
      <button className="admin-profile-logout" onClick={() => { setOpen(false); onLogout() }}><LogOut size={17} />Logout</button>
    </div>}
  </div>
}
