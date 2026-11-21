import { cn } from '../lib/utils'

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: number | string
  accent?: 'blue' | 'emerald' | 'cyan' | 'rose' | 'amber'
  icon?: React.ReactNode
  showTrend?: boolean
  trendData?: { change: number; period: string }
}

/**
 * PremiumStatCard - Refined stat card with gradient accent, large typography
 */
export function PremiumStatCard({
  title,
  value,
  accent = 'blue',
  icon,
  showTrend = false,
  trendData,
  className,
  ...props
}: StatCardProps) {
  const colors = {
    blue: { bg: '#6366F1', glow: 'rgba(99,102,241,0.3)', label: 'var(--status-interview)' },
    emerald: { bg: '#34D391', glow: 'rgba(52,211,145,0.3)', label: 'var(--status-success)' },
    cyan: { bg: '#22D3EE', glow: 'rgba(34,211,238,0.3)', label: 'var(--status-pending)' },
    rose: { bg: '#F43F5E', glow: 'rgba(244,63,94,0.3)', label: 'var(--status-rejection)' },
    amber: { bg: '#FBBF24', glow: 'rgba(251,191,36,0.3)', label: 'var(--status-urgent)' },
  }

  const current = colors[accent]

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-stroke bg-surface p-4 min-h-[120px]',
        'transition-all hover:border-stroke-focus hover:shadow-lg',
        'flex flex-col justify-between gap-2',
        className
      )}
      {...props}
    >
      {/* Subtle gradient background accent on right edge */}
      <div
        className={cn(
          'absolute -right-3 -top-3 h-24 w-24 rounded-[100%] blur-xl transition-all group-hover:scale-150',
          'opacity-10',
          'before:bg-current',
          current.glow
        )}
        style={{ background: current.glow }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 ">
        {icon && (
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-xl text-text-muted transition-transform group-hover:rotate-12',
              'mb-1.5 mx-auto',
              current.bg,
              text('#ffffff')
            )}
          >
            {icon}
          </div>
        )}

        <p className={cn(
          'text-xs font-medium uppercase tracking-wide text-text-muted/70',
          icon ? 'mb-1 text-center' : ''
        )}>
          {title}
        </p>
      </div>

      {/* Large value display */}
      <div className="relative z-10">
        <p className={cn(
          'text-3xl font-semibold tabular-nums tracking-tight',
          text(current.label)
        )}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>

        {/* Trend indicator if provided */}
        {showTrend && trendData && (
          <div className={cn(
            'mt-1 inline-flex items-center gap-1 rounded-[8px] px-2 py-0.5 text-xs font-medium',
            trendData.change >= 0 ? 'bg-status-success/10' : 'bg-status-rejection/10',
            trendData.change >= 0 ? 'text-status-success' : 'text-status-rejection'
          )}>
            <span>{trendData.change > 0 ? '+' : ''}{trendData.change}%</span>
            <span className={cn('text-text-muted/60', { opacity: 0.8 })}>{trendData.period}</span>
          </div>
        )}
      </div>

      {/* Status gradient indicator on right edge (grouped with accent) */}
      <div
        className={cn(
          'absolute -bottom-4 right-2 h-12 w-24 rounded-[50%] blur-xl transition-all group-hover:scale-125',
          current.label
        )}
        style={{ background: `linear-gradient(180deg, ${current.bg}, transparent)` }}
      />
    </div>
  )
}

function text(className: string) {
  return (c: string) => `${className} ${c}`
}

export default PremiumStatCard
