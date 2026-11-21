import { useRef, useState, type FormEvent } from 'react'
import { X, Calendar, Globe, Edit2 } from 'lucide-react'
import { parseISO } from 'date-fns'
import type { Application, ApplicationStatus } from '../types/application'
import { APPLICATION_STATUSES } from '../types/application'
import { cn } from '../lib/utils'

interface AddEditApplicationModalProps {
  onClose: () => void
  initial?: Omit<Application, 'id' | 'createdAt'> | null
  onSave: (data: Omit<Application, 'id' | 'createdAt'>) => Promise<void>
}

type ApplicationFormData = Omit<Application, 'id' | 'createdAt'>

function emptyApplicationForm(): ApplicationFormData {
  return {
    company: '',
    role: '',
    status: 'Applied',
    deadline: '',
    appliedDate: '',
    notes: '',
    website: '',
  }
}

function applicationFormData(initial?: ApplicationFormData | null): ApplicationFormData {
  return {
    ...emptyApplicationForm(),
    ...initial,
    deadline: initial?.deadline ?? '',
    appliedDate: initial?.appliedDate ?? '',
    notes: initial?.notes ?? '',
    website: initial?.website ?? '',
  }
}

export function AddEditApplicationModal({ onClose, initial, onSave }: AddEditApplicationModalProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [data, setData] = useState<ApplicationFormData>(() => applicationFormData(initial))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!initial

  const handleChange = <K extends keyof ApplicationFormData>(field: K, value: ApplicationFormData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    // Get values with sensible defaults
    const company = String(fd.get('company') || '').trim()
    const role = String(fd.get('role') || '').trim()
    const status = String(fd.get('status')) as ApplicationStatus
    const deadline = String(fd.get('deadline') || '')
    const appliedDate = String(fd.get('appliedDate') || '')
    const website = String(fd.get('website') || '')
    const notes = String(fd.get('notes') || '')

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!company) newErrors.company = 'Company is required'
    if (!role) newErrors.role = 'Role is required'
    if (!status) newErrors.status = 'Status is required'

    // Check valid date for deadline if provided
    if (deadline && Number.isNaN(parseISO(deadline).getTime())) {
      newErrors.deadline = 'Invalid date format'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const saveData: Omit<Application, 'id' | 'createdAt'> = {
      company,
      role,
      status,
      deadline,
      appliedDate,
      website: website.trim() || undefined,
      notes: notes.trim() || undefined,
    }

    try {
      await onSave(saveData)
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Failed to save' })
    }
  }

  function hasError(field: keyof typeof errors) {
    return !!errors[field]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-in fade-in duration-200"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl transform overflow-hidden rounded-[32px] border border-stroke bg-surface p-6 md:p-8 shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-text-muted">
            {isEditing ? 'Edit Application' : 'New Application'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <p className="rounded-[12px] bg-red-500/10 px-4 py-3 text-xs text-status-rejection">
              {errors.form}
            </p>
          )}

          {/* Company & Role - large input group */}
          <div className={cn(
            'group grid gap-5 sm:grid-cols-2',
            errors.company && 'sm:col-span-1'
          )}>
            <div className="space-y-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-muted/80">Company</span>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g., Google, Meta, Stripe..."
                  className={cn(
                    'w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all',
                    hasError('company') ? 'border-red-500' : 'border-stroke hover:border-stroke-focus focus:ring-2 focus:ring-blue-500/30',
                    'text-text-muted placeholder:text-text-muted/40'
                  )}
                  value={data.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-muted/80">Role / Position</span>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g., Software Engineer, Product Designer..."
                  className={cn(
                    'w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all',
                    hasError('role') ? 'border-red-500' : 'border-stroke hover:border-stroke-focus focus:ring-2 focus:ring-blue-500/30',
                    'text-text-muted placeholder:text-text-muted/40'
                  )}
                  value={data.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Status, Deadline, Applied Date */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-muted/80">Status</span>
                <select
                  name="status"
                  className={cn(
                    'w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all',
                    'cursor-pointer appearance-none text-text-muted hover:border-stroke-focus focus:ring-2 focus:ring-blue-500/30'
                  )}
                  value={data.status}
                  onChange={(e) => handleChange('status', e.target.value as ApplicationStatus)}
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-muted/80 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Deadline
                </span>
                <input
                  type="date"
                  name="deadline"
                  className={cn(
                    'w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all',
                    'text-text-muted hover:border-stroke-focus focus:ring-2 focus:ring-blue-500/30'
                  )}
                  value={data.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-muted/80 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Applied Date
                </span>
                <input
                  type="date"
                  name="appliedDate"
                  className={cn(
                    'w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all',
                    'text-text-muted hover:border-stroke-focus focus:ring-2 focus:ring-blue-500/30'
                  )}
                  value={data.appliedDate}
                  onChange={(e) => handleChange('appliedDate', e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-muted/80 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </span>
                <input
                  type="url"
                  name="website"
                  placeholder="https://example.com"
                  className={cn(
                    'w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all',
                    'text-text-muted hover:border-stroke-focus focus:ring-2 focus:ring-blue-500/30'
                  )}
                  value={data.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-muted/80 flex items-center gap-1.5">
                <Edit2 className="h-3.5 w-3.5" />
                Notes & Details
              </span>
              <textarea
                name="notes"
                placeholder="Company info, next steps, contact details, interview feedback..."
                rows={4}
                className={cn(
                  'w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm leading-relaxed tracking-tight outline-none transition-all',
                  'text-text-muted placeholder:text-text-muted/40 resize-none hover:border-stroke-focus focus:ring-2 focus:ring-blue-500/30'
                )}
                value={data.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </label>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-[16px] px-5 text-sm font-medium tracking-tight text-text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-blue-500 from-blue-500 to-cyan-600 shadow-green-500/55 px-6 text-sm font-semibold tracking-tight text-white shadow-md transition-transform hover:scale-[1.02]"
            >
              <Edit2 className="h-4 w-4" />
              {isEditing ? 'Update' : 'Add'} Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
