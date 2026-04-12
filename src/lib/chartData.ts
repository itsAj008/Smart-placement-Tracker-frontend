import { format, parseISO, startOfMonth, subMonths } from 'date-fns'
import type { Application } from '../types/application'

export function monthlyApplicationCounts(
  applications: Application[],
  monthsBack = 5,
): { month: string; label: string; count: number }[] {
  const now = new Date()
  const buckets: { key: string; label: string; count: number }[] = []
  for (let i = monthsBack; i >= 0; i--) {
    const m = subMonths(startOfMonth(now), i)
    const key = format(m, 'yyyy-MM')
    buckets.push({ key, label: format(m, 'MMM'), count: 0 })
  }
  const keyIndex = new Map(buckets.map((b, i) => [b.key, i]))
  for (const a of applications) {
    try {
      const d = parseISO(a.appliedDate)
      const key = format(startOfMonth(d), 'yyyy-MM')
      const idx = keyIndex.get(key)
      if (idx !== undefined) buckets[idx].count += 1
    } catch {
      /* skip */
    }
  }
  return buckets.map((b) => ({ month: b.key, label: b.label, count: b.count }))
}
