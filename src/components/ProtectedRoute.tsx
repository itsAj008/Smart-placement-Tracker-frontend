import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../stores/appStore'
import { AppLayout } from './AppLayout'

/** JWT gate + shell; nested routes render in `AppLayout`'s `<Outlet />`. */
export function ProtectedLayout() {
  const { token, initializeSession } = useAuth()
  const location = useLocation()

  useEffect(() => {
    void initializeSession()
  }, [initializeSession])

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <AppLayout />
}
