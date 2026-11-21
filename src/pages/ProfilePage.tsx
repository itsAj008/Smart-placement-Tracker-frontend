import { LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth, useTheme } from '../stores/appStore'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success('Signed out.')
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {/* Welcome header with avatar */}
      <div className="text-center">
        <span
          className={cn(
            'flex h-20 w-20 mx-auto shrink-0 items-center justify-center rounded-[24px] text-xl font-semibold tracking-tight text-white shadow-lg',
            'bg-gradient-to-br from-sky-500 to-cyan-600'
          )}
        >
          {initials || '?'}
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-muted">
          {user?.name || 'User'}
        </h1>
        <p className="text-sm text-text-muted/60">{user?.email || '—'}</p>
      </div>

      {/* Account details card */}
      <section className="rounded-[24px] border border-stroke bg-surface p-6">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-text-muted/80">
          Account Details
        </h2>

        <div className="space-y-5">
          {/* Name row */}
          <div className="flex items-center justify-between gap-3.5">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-text-muted">Full Name</span>
              <span className="text-xs text-text-muted/60">Your registered name</span>
            </div>
            <span
              className="text-base font-semibold tracking-tight text-text-muted"
            >
              {user?.name}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-stroke opacity-50" />

          {/* Email row */}
          <div className="flex items-center justify-between gap-3.5">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-text-muted">Email Address</span>
              <span className="text-xs text-text-muted/60">Contact email</span>
            </div>
            <span
              className="text-base font-semibold tracking-tight max-w-[250px] truncate text-text-muted"
            >
              {user?.email}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-stroke opacity-50" />

          {/* Role/Title row (placeholder) */}
          <div className="flex items-center justify-between gap-3.5">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-text-muted">Current Role</span>
              <span className="text-xs text-text-muted/60">Your current job title</span>
            </div>
            <span
              className="text-base font-semibold tracking-tight text-stroke-focus"
            >
              Student
            </span>
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-3">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted/80">
          Preferences
        </h2>

        {/* Theme toggle as pill button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'group relative flex w-full items-center justify-between rounded-[16px] border border-stroke bg-surface-muted px-4 py-3.5 text-left text-sm font-medium transition-all hover:bg-black/3 dark:hover:bg-white/5',
            theme === 'dark' ? 'text-text-muted' : 'text-text-muted'
          )}
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </>
            )}
          </div>

          {/* Indicator circle */}
          <span
            className={cn(
              'h-2 w-2 rounded-full transition-transform group-hover:scale-125',
              theme === 'dark' ? 'bg-status-interview' : 'bg-status-success'
            )}
          />
        </button>

        {/* Notification settings placeholder */}
        <div className="rounded-[16px] border border-stroke bg-surface-muted px-4 py-3.5 text-sm">
          <p className="text-text-muted/60">Notification preferences coming soon</p>
        </div>
      </section>

      {/* Logout button - prominent but subtle */}
      <button
        type="button"
        onClick={handleLogout}
        className="group relative flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-3.5 text-sm font-semibold tracking-tight transition-colors hover:bg-red-500/10"
        style={{ color: '#F43F5E' }}
      >
        <span>Sign out</span>
        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      </button>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
