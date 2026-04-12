import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../stores/appStore'
import { cn } from '../lib/utils'

export function AuthPage() {
  const { token, login, signup } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signup(name, email, password)
        toast.success('Account created. Welcome!')
      } else {
        await login(email, password)
        toast.success('Signed in.')
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-4 py-12 text-zinc-900 dark:text-zinc-100">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
          <Briefcase className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Placement Tracker</h1>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border-app bg-surface-elevated p-8 shadow-xl">
        <div className="mb-6 flex rounded-xl bg-black/4 p-1 dark:bg-white/6">
          <button
            type="button"
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors',
              mode === 'login'
                ? 'bg-white text-blue-700 shadow dark:bg-zinc-800 dark:text-blue-300'
                : 'text-text-muted',
            )}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors',
              mode === 'signup'
                ? 'bg-white text-blue-700 shadow dark:bg-zinc-800 dark:text-blue-300'
                : 'text-text-muted',
            )}
            onClick={() => setMode('signup')}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' ? (
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                autoComplete="name"
                className="w-full rounded-lg border border-border-app bg-surface px-3 py-2.5 text-sm outline-none ring-blue-500/30 focus:ring-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === 'signup'}
              />
            </div>
          ) : null}
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-border-app bg-surface px-3 py-2.5 text-sm outline-none ring-blue-500/30 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              className="w-full rounded-lg border border-border-app bg-surface px-3 py-2.5 text-sm outline-none ring-blue-500/30 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                onClick={() => setMode('signup')}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                onClick={() => setMode('login')}
              >
                Login
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-xs text-text-muted">
          JWT auth will connect to your API — this screen stores a mock token for
          now.
        </p>
      </div>
    </div>
  )
}
