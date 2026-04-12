/** One-time merge from pre–Zustand localStorage keys into the persisted app store. */
const PERSIST_KEY = 'placement-tracker-app'

export function migrateLegacyStorage() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(PERSIST_KEY)) return

  try {
    const applicationsRaw = localStorage.getItem('placement-tracker-applications')
    const token = localStorage.getItem('placement-tracker-token')
    const userRaw = localStorage.getItem('placement-tracker-user')
    const theme = localStorage.getItem('placement-tracker-theme')

    const state: Record<string, unknown> = {}
    if (applicationsRaw) state.applications = JSON.parse(applicationsRaw)
    if (token) state.token = token
    if (userRaw) state.user = JSON.parse(userRaw)
    if (theme === 'light' || theme === 'dark') state.theme = theme

    if (Object.keys(state).length === 0) return

    localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({ state, version: 0 }),
    )
  } catch {
    /* ignore corrupt legacy data */
  }
}
