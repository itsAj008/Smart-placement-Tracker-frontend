import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { Application } from '../types/application'
import { migrateLegacyStorage } from './migrateLegacyStorage'
import { apiRequest } from '../lib/api'

migrateLegacyStorage()

export type User = {
  name: string
  email: string
}

type Theme = 'light' | 'dark'

const PERSIST_KEY = 'placement-tracker-app'

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

type ApiUser = { id: string; name: string; email: string }
type AuthResponse = { token: string; user: ApiUser }
type ApplicationApi = Omit<Application, 'id'> & { id?: string; _id?: string }
type DashboardStatsResponse = {
  total: number
  byStatus: Record<string, number>
}

function toApplication(data: ApplicationApi): Application {
  const appliedDate = data.appliedDate ? String(data.appliedDate).slice(0, 10) : ''
  const deadline = data.deadline ? String(data.deadline).slice(0, 10) : ''
  return {
    id: data.id ?? data._id ?? crypto.randomUUID(),
    company: data.company,
    role: data.role,
    status: data.status,
    appliedDate,
    deadline,
    notes: data.notes,
    resumeName: data.resumeName,
    createdAt: data.createdAt,
  }
}

type DashboardStats = {
  total: number
  interviews: number
  offers: number
  rejections: number
}

type AppState = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void

  token: string | null
  user: User | null
  initializeSession: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void

  applications: Application[]
  fetchApplications: () => Promise<void>
  addApplication: (input: Omit<Application, 'id' | 'createdAt'>) => Promise<Application>
  updateApplication: (id: string, input: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>

  dashboardStats: DashboardStats
  upcomingDeadlines: Application[]
  fetchDashboardData: () => Promise<void>
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
      initializeSession: async () => {
        const token = get().token
        if (!token) return
        try {
          const data = await apiRequest<{ user: ApiUser }>('/api/auth/me', { token })
          set({ user: data.user })
          await get().fetchApplications()
          await get().fetchDashboardData()
        } catch {
          set({
            token: null,
            user: null,
            applications: [],
            upcomingDeadlines: [],
            dashboardStats: { total: 0, interviews: 0, offers: 0, rejections: 0 },
          })
        }
      },
      login: async (email, password) => {
        if (!email.trim() || !password) {
          throw new Error('Email and password are required.')
        }
        const data = await apiRequest<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: { email: email.trim(), password },
        })
        set({ token: data.token, user: data.user })
        await get().fetchApplications()
        await get().fetchDashboardData()
      },
      signup: async (name, email, password) => {
        if (!name.trim() || !email.trim() || !password) {
          throw new Error('Name, email, and password are required.')
        }
        const data = await apiRequest<AuthResponse>('/api/auth/register', {
          method: 'POST',
          body: {
            name: name.trim(),
            email: email.trim(),
            password,
          },
        })
        set({ token: data.token, user: data.user })
        await get().fetchApplications()
        await get().fetchDashboardData()
      },
      logout: () =>
        set({
          token: null,
          user: null,
          applications: [],
          upcomingDeadlines: [],
          dashboardStats: { total: 0, interviews: 0, offers: 0, rejections: 0 },
        }),

      applications: [],
      dashboardStats: { total: 0, interviews: 0, offers: 0, rejections: 0 },
      upcomingDeadlines: [],
      fetchApplications: async () => {
        const token = get().token
        if (!token) {
          set({ applications: [] })
          return
        }
        const data = await apiRequest<ApplicationApi[]>('/api/applications', { token })
        set({ applications: data.map(toApplication) })
      },
      addApplication: async (input) => {
        const token = get().token
        if (!token) throw new Error('Please login again.')
        const created = await apiRequest<ApplicationApi>('/api/applications', {
          method: 'POST',
          token,
          body: input,
        })
        const row = toApplication(created)
        set((s) => ({ applications: [row, ...s.applications] }))
        await get().fetchDashboardData()
        return row
      },
      updateApplication: async (id, input) => {
        const token = get().token
        if (!token) throw new Error('Please login again.')
        const updated = await apiRequest<ApplicationApi>(`/api/applications/${id}`, {
          method: 'PUT',
          token,
          body: input,
        })
        const next = toApplication(updated)
        set((s) => ({
          applications: s.applications.map((a) => (a.id === id ? next : a)),
        }))
        await get().fetchDashboardData()
      },
      deleteApplication: async (id) => {
        const token = get().token
        if (!token) throw new Error('Please login again.')
        await apiRequest<{ message: string }>(`/api/applications/${id}`, {
          method: 'DELETE',
          token,
        })
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) }))
        await get().fetchDashboardData()
      },
      fetchDashboardData: async () => {
        const token = get().token
        if (!token) {
          set({
            upcomingDeadlines: [],
            dashboardStats: { total: 0, interviews: 0, offers: 0, rejections: 0 },
          })
          return
        }

        const [statsResponse, upcomingResponse] = await Promise.all([
          apiRequest<DashboardStatsResponse>('/api/dashboard/stats', { token }),
          apiRequest<ApplicationApi[]>('/api/dashboard/upcoming', { token }),
        ])

        set({
          dashboardStats: {
            total: statsResponse.total ?? 0,
            interviews: statsResponse.byStatus?.Interview ?? 0,
            offers: statsResponse.byStatus?.Offer ?? 0,
            rejections: statsResponse.byStatus?.Rejected ?? 0,
          },
          upcomingDeadlines: upcomingResponse.map(toApplication),
        })
      },
    }),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        token: s.token,
        user: s.user,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined
        if (!p) return current
        return {
          ...current,
          ...p,
          applications: current.applications,
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
      initializeSession: s.initializeSession,
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
      fetchApplications: s.fetchApplications,
      addApplication: s.addApplication,
      updateApplication: s.updateApplication,
      deleteApplication: s.deleteApplication,
    })),
  )
}

export function useDashboard() {
  return useAppStore(
    useShallow((s) => ({
      dashboardStats: s.dashboardStats,
      upcomingDeadlines: s.upcomingDeadlines,
      fetchDashboardData: s.fetchDashboardData,
    })),
  )
}
