import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from 'lucide-react'
import { useAuth, useDashboard, useTheme } from '../stores/appStore'
import { cn } from '../lib/utils'
import { parseISO, startOfDay } from 'date-fns'

export function AppLayout() {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { upcomingDeadlines, fetchDashboardData } = useDashboard()
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    void fetchDashboardData()
  }, [fetchDashboardData])

  const count = upcomingDeadlines.length

  const navCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/10',
    )

  return (
    <div className="min-h-dvh bg-surface text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-border-app bg-surface-elevated/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
              <Briefcase className="h-5 w-5" aria-hidden />
            </span>
            <span className="hidden sm:inline text-text-muted ">Placement Tracker</span>
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
            <NavLink to="/dashboard" className={navCls} end>
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </span>
            </NavLink>
            <NavLink to="/applications" className={navCls}>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                Applications
              </span>
            </NavLink>
            <NavLink to="/profile" className={navCls}>
              <span className="flex items-center gap-1.5">
                <UserRound className="h-4 w-4" />
                Profile
              </span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                type="button"
                className="relative rounded-lg p-2 text-text-muted hover:bg-blue-300/20"
                aria-expanded={notifOpen}
                aria-label="Notifications"
                onClick={() => setNotifOpen((o) => !o)}
              >
                <Bell className="h-5 w-5" />
                {count > 0 ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {count > 9 ? '9+' : count}
                  </span>
                ) : null}
              </button>
              {notifOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="Close"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border-app bg-surface-elevated p-3 shadow-xl">
                    <p className="mb-2 text-sm font-semibold ">
                      {count === 0
                        ? 'No upcoming deadlines'
                        : `You have ${count} upcoming deadline${count === 1 ? '' : 's'}`}
                    </p>
                    <ul className="max-h-64 space-y-2 overflow-auto text-sm">
                      {upcomingDeadlines.length === 0 ? (
                        <li className="text-text-muted">
                          You&apos;re all caught up.
                        </li>
                      ) : (
                        upcomingDeadlines.map((a) => (
                          <li
                            key={a.id}
                            className="flex justify-between gap-2 rounded-lg bg-black/3 px-2 py-1.5 dark:bg-white/6"
                          >
                            <span className="font-medium">{a.company}</span>
                            <span className="shrink-0 text-text-muted">
                              {formatRelativeDeadline(a.deadline)}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </>
              ) : null}
            </div>

            <button
              type="button"
              className="rounded-lg p-2  text-text-muted hover:bg-blue-300/20 cursor-pointer "
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 " />
              ) : (
                <Moon className="h-5 w-5 " />
              )}
            </button>

            <button
              type="button"
              className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-600"
              aria-label="Log out"
              onClick={() => {
                logout()
              }}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

function formatRelativeDeadline(iso: string) {
  const d = parseISO(iso)
  const today = startOfDay(new Date())
  const target = startOfDay(d)
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 1) return `${diffDays} days`
  return 'Past'
}
