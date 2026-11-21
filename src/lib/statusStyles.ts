import type { ApplicationStatus } from '../types/application'

export const STATUS_STYLES: Record<
  ApplicationStatus,
  { label: string; emoji: string; chip: string; dot: string; bg: string }
> = {
  Offer: {
    label: 'Offer',
    emoji: '🟢',
    chip: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30',
    dot: 'bg-emerald-500',
    bg: '#10b981',
  },
  Interview: {
    label: 'Interview',
    emoji: '🟡',
    chip: 'bg-amber-500/15 dark:text-amber-500 ring-1 ring-amber-500/30',
    dot: 'bg-amber-500',
    bg: '#f59e0b',
  },
  Rejected: {
    label: 'Rejected',
    emoji: '🔴',
    chip: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30',
    dot: 'bg-rose-500',
    bg: '#f43f5e',
  },
  Applied: {
    label: 'Applied',
    emoji: '🔵',
    chip: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 ring-1 ring-sky-500/30',
    dot: 'bg-sky-500',
    bg: '#0ea5e9',
  },
}
