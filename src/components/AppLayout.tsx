import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { useDashboard } from '../stores/appStore'

export function AppLayout() {
  const { fetchDashboardData } = useDashboard()

  useEffect(() => {
    void fetchDashboardData()
  }, [fetchDashboardData])


  return (
    <div className="flex min-h-dvh flex-col bg-surface text-text-muted">
      <Header />

      <main className="mx-auto max-w-6xl w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
