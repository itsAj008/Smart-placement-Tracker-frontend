import { Link, NavLink } from 'react-router-dom'
import { Bell, Briefcase, LayoutDashboard, Moon, Sun, UserRound } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth, useDashboard, useTheme } from '../stores/appStore'

export function Header() {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { upcomingDeadlines } = useDashboard()
  const count = upcomingDeadlines.length

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/applications', label: 'Applications', icon: Briefcase },
    { path: '/profile', label: 'Profile', icon: UserRound },
  ]


  return (
    <header className="sticky top-0 z-50 bg-surface-elevated/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-md shadow-blue-500/20 transition-transform hover:scale-105">
            <Briefcase className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden sm:inline text-base font-semibold tracking-tight text-text-muted">
            Placement Tracker
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 justify-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const ActiveIcon = item.icon
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-surface-elevated text-text-muted'
                  : 'text-text-muted/60 hover:text-text-muted',
              )}>
                <ActiveIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Actions - right side */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative group">
            <button
              type="button"
              className="relative rounded-lg p-2 text-text-muted hover:bg-blue-300/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {count > 0 && (
                <span
                  className={cn(
                    'absolute -right-1 top-0 flex h-4 min-w-[1.25rem] items-center justify-center rounded-full',
                    'transition-all duration-300 group-hover:scale-110 group-hover:right-0',
                    count > 9 ? 'h-4 min-w-[1.25rem]' : 'h-6',
                    count > 9
                      ? 'bg-status-interview'
                      : `bg-status-${count < 3 ? 'success' : count < 7 ? 'interview' : 'pending'}`
                  )}
                >
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {count > 0 && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] scale-95 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                <div className="rounded-[16px] border border-stroke bg-surface-elevated p-3 shadow-xl">
                  <p className="mb-2 text-sm font-semibold tracking-tight text-text-muted">
                    {count === 1 ? 'Upcoming deadline' : `You have ${count} upcoming deadlines`}
                  </p>
                  <ul className="max-h-64 space-y-2 overflow-auto rounded-[8px] p-1 text-sm">
                    {upcomingDeadlines.slice(0, 5).map((app) => (
                      <li key={app.id} className="flex items-center justify-between gap-2 rounded-md bg-black/3 px-2 py-1.5 dark:bg-white/6 hover:bg-stroke-focus/10">
                        <span className="font-medium tracking-tight">{app.company}</span>
                        <span className={cn(
                          'shrink-0 text-xs',
                          deadlineUrgency(app.deadline) === 'urgent' ? 'text-status-urgent font-medium' : 'text-text-muted'
                        )}>
                          {formatRelativeDeadline(app.deadline)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-xs text-center text-text-muted/60">
                    View all in Applications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            className="rounded-lg p-2 text-text-muted hover:bg-blue-300/10 transition-colors"
            aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Logout */}
          <button
            type="button"
            className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-status-rejection transition-colors"
            aria-label="Log out"
            onClick={() => logout()}
          >
            <span className="text-sm font-medium tracking-tight">Log out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function deadlineUrgency(date: string): 'urgent' | 'normal' {
  const d = new Date(date)
  const today = new Date()
  const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 ? 'urgent' : 'normal'
}

function formatRelativeDeadline(date: string): string {
  const d = new Date(date)
  const today = new Date()
  const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 0) return `${diffDays} days`
  return 'Past'
}
