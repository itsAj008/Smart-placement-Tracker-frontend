import { useEffect } from 'react'
import { Briefcase, Clock, Award, XCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'
import { useApplications, useDashboard } from '../stores/appStore'
import { PremiumStatCard } from '../components/PremiumStatCard'
import { PremiumCard } from '../components/PremiumCard'
import type { Application } from '../types/application'
import { STATUS_STYLES } from '../lib/statusStyles'
import { cn } from '../lib/utils'

export function DashboardPage() {
  const { applications } = useApplications()
  const { dashboardStats, upcomingDeadlines, fetchDashboardData } = useDashboard()

  useEffect(() => {
    void fetchDashboardData()
  }, [fetchDashboardData])

  const total = dashboardStats.total
  const interviews = dashboardStats.interviews
  const offers = dashboardStats.offers
  const rejections = dashboardStats.rejections

  const chartData = monthlyApplicationCounts(applications, 5)

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-muted">
          Dashboard
        </h1>
        <p className="text-sm text-text-muted/60">
          Overview of your placement pipeline
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PremiumStatCard
          title="Total Applications"
          value={total}
          accent="blue"
          icon={<Briefcase className="h-5 w-5" />}
        />
        <PremiumStatCard
          title="Interviews Scheduled"
          value={interviews}
          accent="blue"
          icon={<Clock className="h-5 w-5" />}
          showTrend={true}
          trendData={{ change: total > 0 ? 12 : 0, period: 'vs last month' }}
        />
        <PremiumStatCard
          title="Offers Received"
          value={offers}
          accent="emerald"
          icon={<Award className="h-5 w-5" />}
          showTrend={true}
          trendData={{ change: offers > 0 ? 25 : 0, period: 'vs last month' }}
        />
        <PremiumStatCard
          title="Rejections"
          value={rejections}
          accent="rose"
          icon={<XCircle className="h-5 w-5" />}
          showTrend={true}
          trendData={{ change: rejections > 0 ? -8 : 0, period: 'vs last month' }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming deadlines */}
        <PremiumCard variant="section" title="Upcoming Deadlines" className="h-[360px] min-h-0">
          {upcomingDeadlines.length === 0 ? (
            <p className="flex h-40 items-center justify-center text-sm text-text-muted/60">
              No upcoming deadlines — you're all caught up!
            </p>
          ) : (
            <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto">
              {upcomingDeadlines.map((a) => (
                <li
                  key={a.id}
                  className={`group flex items-center justify-between gap-2.5 rounded-[16px] border border-stroke bg-surface-muted/50 p-3 transition-all hover:border-stroke-focus ${
                    deadlineUrgency(a.deadline) === 'urgent' ? 'shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Company avatar */}
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] font-medium text-xs tracking-tight transition-transform group-hover:scale-110',
                        companyColor(a.company)
                      )}
                      style={{ color: '#FFFFFF' }}
                    >
                      {a.company.substring(0, 2).toUpperCase()}
                    </span>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-medium tracking-tight text-text-muted">{a.company}</p>
                      <p className="text-xs text-text-muted/60 mt-0.5">
                        {a.role || 'Position'} • {formatDate(a.deadline)}
                      </p>
                    </div>
                  </div>

                  {/* Status + Days remaining */}
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        'rounded-full',
                        STATUS_STYLES[a.status].chip,
                        `inline-flex items-center gap-1.5`
                      )}
                      style={{ background: STATUS_STYLES[a.status].bg }}
                    >
                      <span aria-hidden>{STATUS_STYLES[a.status].emoji}</span>
                      {a.status}
                    </span>

                    <span
                      className={cn(
                        'tabular-nums font-medium',
                        deadlineUrgency(a.deadline) === 'urgent' ? 'text-status-urgent' : 'text-text-muted/70'
                      )}
                    >
                      {deadlineLabel(a.deadline)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </PremiumCard>

        {/* Applications chart */}
        <PremiumCard variant="section" title="Applications Overview" className="h-[360px] min-h-0">
          <p className="text-xs text-text-muted/60">Last 6 months</p>

          <div className="h-44 w-full shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 12, left: -8, bottom: 6 }}>
                {/* Custom grid with subtle lines */}
                <CartesianGrid strokeDasharray="0 0" horizontal={false} />

                {/* Y axis */}
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 500 }}
                  width={32}
                  tickFormatter={(v) => `${Math.floor(Number(v))}`}
                  allowDecimals={false}
                  hide={true}
                />

                {/* X axis with month labels */}
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 500 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />

                {/* Enhanced tooltip */}
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-surface-elevated)'
                  }}
                  labelStyle={{ fontWeight: 500, marginBottom: '4px', fontSize: 13 }}
                />

                {/* Gradient bar with rounded ends */}
                <Bar
                  dataKey="count"
                  name="Applications"
                  fill="var(--status-interview)"
                  radius={[8, 8, 8, 8]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-xs font-medium text-text-muted/60">
            Track your monthly application activity
          </p>
        </PremiumCard>
      </div>
    </div>
  )
}

// Helper function for company avatar colors
function companyColor(company: string) {
  const colors = [
    'bg-gradient-to-br',
    'from-sky-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-blue-600',
    'from-orange-500 to-pink-600',
    'from-blue-500 to-blue-600',
    'from-amber-500 to-yellow-600',
  ]

  const hash = company.toLowerCase().split('').reduce((a, b) => {
    return ((a << 5) - a + b.charCodeAt(0)) | 0
  }, 0)

  const index = Math.abs(hash % colors.length)
  const colorOptions = [
    'from-sky-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-blue-600',
    'from-orange-500 to-pink-600',
    'from-blue-500 to-blue-600',
  ]
  return colorOptions[index]
}


function deadlineUrgency(iso: string): 'urgent' | 'normal' {
  try {
    const d = startOfDay(parseISO(iso))
    const today = startOfDay(new Date())
    const days = differenceInCalendarDays(d, today)
    return days >= 0 && days <= 3 ? 'urgent' : 'normal'
  } catch {
    return 'normal'
  }
}

// Format deadline label with days remaining
function deadlineLabel(iso: string): string {
  const d = parseISO(iso)
  const today = startOfDay(new Date())
  const days = differenceInCalendarDays(startOfDay(d), today)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 0) return `${Math.abs(days)}d ago`
  return `${days} days left`
}

// Format date for display
function formatDate(iso: string): string {
  const d = parseISO(iso)
  const today = startOfDay(new Date())
  const days = differenceInCalendarDays(startOfDay(d), today)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 7) return `${deadlineLabel(iso)} • ${d.toLocaleDateString(undefined, { weekday: 'short' })}`

  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: days > 365 ? 'numeric' : '2-digit'
  })
}

// Monthly application counts helper
function monthlyApplicationCounts(applications: Application[], months: number) {
  const now = new Date()
  const data: { label: string; count: number }[] = []

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(monthStart)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    const count = applications.filter(app => {
      const appliedDate = parseISO(app.appliedDate)
      return appliedDate >= monthStart && appliedDate < monthEnd
    }).length

    data.push({
      label: monthStart.toLocaleDateString(undefined, { month: 'short' }),
      count
    })
  }

  return data
}
