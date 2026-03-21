import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function RequireAuth({ children }) {
  const { isAuthenticated, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    // Avoid redirect flashes while we restore token from localStorage.
    return <div className="py-20 text-center text-sm text-gray-500">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || '/' }}
      />
    )
  }

  return children
}

