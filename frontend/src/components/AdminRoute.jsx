import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { dashboardFor, roleOf } from '../data/roles.js'
import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client.js'

export default function AdminRoute() {
  const { user, loading, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    setProfile(null)
    if (!user || roleOf(user) !== 'admin') return
    const check = async () => {
      try { const data = await apiRequest('/auth/profile'); if (active) { setProfile(data.user); setError('') } }
      catch (err) { if (active) setError(err.message) }
    }
    check()
    const timer = setInterval(check, 30000)
    window.addEventListener('focus', check)
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', check) }
  }, [user, retry])
  const location = useLocation()
  if (loading) return <p role="status" className="p-10 text-center">Checking your session...</p>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search, message: 'Please sign in with your admin account to continue.' }} replace />
  if (roleOf(user) !== 'admin') return <Navigate to={dashboardFor(user)} replace />
  if (error) return <div className="p-10 text-center"><p role="alert">{error}</p><button className="mt-4 underline" onClick={() => setRetry(value => value + 1)}>Retry access check</button></div>
  if (!profile) return <p className="p-10 text-center">Checking admin access...</p>
  if (roleOf(profile) !== 'admin') return <Navigate to={dashboardFor(profile)} replace />
  if (profile.accountActive === false || profile.subscription?.status === 'paused' || (profile.subscription?.expiresAt && new Date(profile.subscription.expiresAt) <= new Date())) return <div className="mx-auto my-16 max-w-lg rounded-2xl border border-[#e1dac7] bg-white p-8 text-center"><h1 className="text-2xl font-bold">Admin access inactive</h1><p className="my-4">Your subscription has expired or your account is paused. Contact the Super Admin to renew or enable access.</p><button onClick={() => setRetry(value => value + 1)} className="mr-5 underline">Check again</button><button onClick={logout} className="underline">Sign out</button></div>
  return <Outlet />
}
