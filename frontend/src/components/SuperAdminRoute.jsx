import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { dashboardFor, roleOf } from '../data/roles.js'

export default function SuperAdminRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p role="status" className="p-10 text-center">Checking your session...</p>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname, message: 'Sign in with your Super Admin account.' }} replace />
  return roleOf(user) === 'super_admin' ? <Outlet /> : <Navigate to={dashboardFor(user)} replace />
}
