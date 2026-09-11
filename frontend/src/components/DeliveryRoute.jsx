import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { dashboardFor, roleOf } from '../data/roles.js'

export default function DeliveryRoute() {
  const { user, loading } = useAuth()
  if (loading) return <p role="status" className="p-10 text-center">Checking your session...</p>
  if (!user) return <Outlet />
  return roleOf(user) === 'delivery_boy' ? <Outlet /> : <Navigate to={dashboardFor(user)} replace />
}
