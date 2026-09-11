import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p role="status" className="p-10 text-center">Checking your session...</p>
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
}
