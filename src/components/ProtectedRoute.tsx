import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../stores/appStore'
import { AppLayout } from './AppLayout'

/** JWT gate + shell; nested routes render in `AppLayout`'s `<Outlet />`. */
export function ProtectedLayout() {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <AppLayout />
}
