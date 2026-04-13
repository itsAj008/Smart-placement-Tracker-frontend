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

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-muted">Profile</h1>
        <p className="mt-1 text-sm text-text-muted">
          Your account and preferences
        </p>
      </div>

      <section className="rounded-2xl border border-border-app bg-surface-elevated dark:bg-amber-400 p-6 shadow-sm">
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Name
            </dt>
            <dd className="mt-1 text-sm font-medium text-text-muted">{user?.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Email
            </dt>
            <dd className="mt-1 text-sm font-medium text-text-muted">{user?.email ?? '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-border-app bg-surface-elevated p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text-muted">Appearance</h2>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center text-text-muted justify-between rounded-xl border border-border-app bg-surface px-4 py-3 text-left text-sm font-medium hover:bg-black/3 dark:hover:bg-white/5"
        >
          <span>Theme</span>
          <span className="flex items-center gap-2 text-text-muted">
            {theme === 'dark' ? (
              <>
                <Moon className="h-4 w-4" />
                Dark
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                Light
              </>
            )}
          </span>
        </button>
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-600/10 px-4 py-3 text-sm font-semibold text-rose-700 cursor-pointer hover:bg-red-300/20 dark:text-red-500"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  )
}
