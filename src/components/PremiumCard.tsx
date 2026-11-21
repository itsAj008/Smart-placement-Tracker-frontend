import { cn } from '../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'stat' | 'section' | 'border'
  title?: string
  gradient?: boolean
}

/**
 * PremiumCard - Consistent card component with refined styling
 * Uses the premium design system: large border radius, subtle shadows, intentional spacing
 */
export function PremiumCard({
  children,
  variant = 'elevated',
  title,
  className,
  gradient = false,
  ...props
}: CardProps) {
  const baseClasses = cn(
    'overflow-hidden border bg-surface p-6 transition-all hover:border-stroke-focus',
    'rounded-[24px]',
    'shadow-sm',
    className
  )

  const variants = {
    elevated: `${baseClasses} shadow-sm`,
    stat: cn(
      baseClasses,
      'group relative overflow-hidden',
      'min-h-[160px] flex flex-col justify-between',
      // Subtle gradient background accent
      gradient && `before:absolute before:-right-4 before:-top-4 before:h-32 before:w-32 before:rotate-45 before:rounded-[100%] before:bg-status-interview/10 before:blur-xl before:transition-all before:group-hover:scale-150`
    ),
    section: cn(
      baseClasses,
      'flex flex-col gap-3.5'
    ),
    border: `${baseClasses} shadow-sm`,
  }

  return (
    <div className={variants[variant]} {...props}>
      {title && (
        <h2
          className="text-sm font-semibold uppercase tracking-wide text-text-muted/80"
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

export default PremiumCard
