import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'
import { useApplications } from '../stores/appStore'
import { monthlyApplicationCounts } from '../lib/chartData'
import { STATUS_STYLES } from '../lib/statusStyles'

export function DashboardPage() {
  const { applications } = useApplications()

  const total = applications.length
  const interviews = applications.filter((a) => a.status === 'Interview').length
  const offers = applications.filter((a) => a.status === 'Offer').length
  const rejections = applications.filter((a) => a.status === 'Rejected').length

  const chartData = monthlyApplicationCounts(applications, 5)

  const today = startOfDay(new Date())
  const upcoming = [...applications]
    .filter((a) => {
      const d = parseISO(a.deadline)
      return differenceInCalendarDays(startOfDay(d), today) >= 0
    })
    .sort(
      (a, b) =>
        parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime(),
    )
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-muted">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Overview of your placement pipeline
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total applications" value={total} accent="blue" />
        <StatCard title="Interviews" value={interviews} accent="amber" />
        <StatCard title="Offers" value={offers} accent="emerald" />
        <StatCard title="Rejections" value={rejections} accent="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border-app bg-surface-elevated p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
            Upcoming deadlines
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-text-muted">
              No upcoming deadlines. Add applications with deadlines to see them
              here.
            </p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-black/10  px-3 py-2 text-sm "
                >
                  <span className="font-medium text-text-muted">{a.company}</span>
                  <span className="flex items-center gap-2 text-text-muted">
                    <span
                      className={
                        STATUS_STYLES[a.status].chip +
                        ' inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
                      }
                    >
                      {STATUS_STYLES[a.status].emoji} {a.status}
                    </span>
                    {formatDeadlineLabel(a.deadline)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border-app hover:border-blue-500 bg-surface-elevated p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
            Applications overview
          </h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-zinc-200 dark:stroke-zinc-700"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  className="text-zinc-500"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--color-border-app)',
                  }}
                  labelFormatter={(_, p) =>
                    p?.[0]?.payload?.month
                      ? String(p[0].payload.month)
                      : ''
                  }
                />
                <Bar
                  dataKey="count"
                  name="Applications"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-text-muted">
            Monthly count by applied date (last 6 months)
          </p>
        </section>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  accent,
}: {
  title: string
  value: number
  accent: 'blue' | 'amber' | 'emerald' | 'rose'
}) {
  const ring =
    accent === 'blue'
      ? 'ring-blue-400'
      : accent === 'amber'
        ? 'ring-amber-400'
        : accent === 'emerald'
          ? 'ring-emerald-400'
          : 'ring-rose-400'
  return (
    <div
      className={
        'rounded-2xl border border-border-app hover:border-blue-500 hover:ring-blue-500 bg-surface-elevated p-5 shadow-sm ring-1 ' +
        ring
      }
    >
      <p className="text-sm font-medium  text-black/40 dark:text-text-muted">{title}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-text-muted">{value}</p>
    </div>
  )
}

function formatDeadlineLabel(iso: string) {
  const d = parseISO(iso)
  const today = startOfDay(new Date())
  const days = differenceInCalendarDays(startOfDay(d), today)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `${days} days`
}
