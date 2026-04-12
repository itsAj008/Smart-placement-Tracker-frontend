import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { Application } from '../types/application'
import { migrateLegacyStorage } from './migrateLegacyStorage'

migrateLegacyStorage()

export type User = {
  name: string
  email: string
}

type Theme = 'light' | 'dark'

const PERSIST_KEY = 'placement-tracker-app'

const DEMO: Application[] = [
  {
    id: 'demo-1',
    company: 'Google',
    role: 'Software Engineer Intern',
    status: 'Interview',
    appliedDate: '2026-03-15',
    deadline: '2026-04-14',
    notes: 'Prep system design.',
    createdAt: '2026-03-15T10:00:00.000Z',
  },
  {
    id: 'demo-2',
    company: 'Amazon',
    role: 'SDE Intern',
    status: 'Applied',
    appliedDate: '2026-04-01',
    deadline: '2026-04-18',
    notes: '',
    createdAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 'demo-3',
    company: 'Stripe',
    role: 'Backend Intern',
    status: 'Offer',
    appliedDate: '2026-02-10',
    deadline: '2026-03-01',
    notes: 'Accepted elsewhere.',
    createdAt: '2026-02-10T09:00:00.000Z',
  },
]

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function mockJwt() {
  const payload = btoa(JSON.stringify({ sub: 'demo', iat: Date.now() }))
  return `mock.${payload}.signature`
}

type AppState = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void

  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void

  applications: Application[]
  addApplication: (input: Omit<Application, 'id' | 'createdAt'>) => Application
  updateApplication: (id: string, input: Partial<Application>) => void
  deleteApplication: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: systemTheme(),
      setTheme: (t) => {
        set({ theme: t })
        applyThemeClass(t)
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        applyThemeClass(next)
      },

      token: null,
      user: null,
      login: async (email, password) => {
        if (!email.trim() || !password) {
          throw new Error('Email and password are required.')
        }
        const trimmed = email.trim()
        const storedUser = get().user
        const u =
          storedUser?.email === trimmed
            ? storedUser
            : {
                name: trimmed.split('@')[0] || 'Student',
                email: trimmed,
              }
        set({ token: mockJwt(), user: u })
      },
      signup: async (name, email, password) => {
        if (!name.trim() || !email.trim() || !password) {
          throw new Error('Name, email, and password are required.')
        }
        set({
          token: mockJwt(),
          user: { name: name.trim(), email: email.trim() },
        })
      },
      logout: () => set({ token: null, user: null }),

      applications: DEMO,
      addApplication: (input) => {
        const row: Application = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ applications: [row, ...s.applications] }))
        return row
      },
      updateApplication: (id, input) => {
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, ...input, id: a.id } : a,
          ),
        }))
      },
      deleteApplication: (id) => {
        set((s) => ({
          applications: s.applications.filter((a) => a.id !== id),
        }))
      },
    }),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        token: s.token,
        user: s.user,
        applications: s.applications,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined
        if (!p) return current
        return {
          ...current,
          ...p,
          applications: Array.isArray(p.applications)
            ? p.applications
            : current.applications,
          theme: p.theme ?? current.theme,
          token: p.token ?? current.token,
          user: p.user !== undefined ? p.user : current.user,
        }
      },
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyThemeClass(state.theme)
      },
    },
  ),
)

/** Call once on startup so the first paint matches stored or system theme. */
export function syncThemeToDocument() {
  applyThemeClass(useAppStore.getState().theme)
}

/** Match previous Context hook shape — avoids rerenders when unrelated store fields change. */
export function useAuth() {
  return useAppStore(
    useShallow((s) => ({
      token: s.token,
      user: s.user,
      login: s.login,
      signup: s.signup,
      logout: s.logout,
    })),
  )
}

export function useTheme() {
  return useAppStore(
    useShallow((s) => ({
      theme: s.theme,
      setTheme: s.setTheme,
      toggleTheme: s.toggleTheme,
    })),
  )
}

export function useApplications() {
  return useAppStore(
    useShallow((s) => ({
      applications: s.applications,
      addApplication: s.addApplication,
      updateApplication: s.updateApplication,
      deleteApplication: s.deleteApplication,
    })),
  )
}
