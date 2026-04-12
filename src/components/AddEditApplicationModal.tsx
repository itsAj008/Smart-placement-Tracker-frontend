import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Application, ApplicationStatus } from '../types/application'
import { APPLICATION_STATUSES } from '../types/application'
import { cn } from '../lib/utils'

type FormState = {
  company: string
  role: string
  status: ApplicationStatus
  appliedDate: string
  deadline: string
  notes: string
  resumeName: string
}

const empty: FormState = {
  company: '',
  role: '',
  status: 'Applied',
  appliedDate: new Date().toISOString().slice(0, 10),
  deadline: '',
  notes: '',
  resumeName: '',
}

type Props = {
  open: boolean
  onClose: () => void
  initial: Application | null
  onSave: (data: Omit<Application, 'id' | 'createdAt'>) => void
}

export function AddEditApplicationModal({
  open,
  onClose,
  initial,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>(empty)

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        company: initial.company,
        role: initial.role,
        status: initial.status,
        appliedDate: initial.appliedDate,
        deadline: initial.deadline,
        notes: initial.notes,
        resumeName: initial.resumeName ?? '',
      })
    } else {
      setForm(empty)
    }
  }, [open, initial])

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) {
      return
    }
    if (!form.deadline) {
      return
    }
    onSave({
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status,
      appliedDate: form.appliedDate,
      deadline: form.deadline,
      notes: form.notes.trim(),
      resumeName: form.resumeName || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-t-2xl border border-border-app bg-surface-elevated p-6 shadow-2xl sm:rounded-2xl',
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="app-modal-title" className="text-lg font-semibold text-text-muted">
            {initial ? 'Edit Application' : 'Add Application'}
          </h2>
          <button
            type="button"
            className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-muted" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              className="w-full rounded-lg border border-border-app bg-surface px-3 py-2 text-sm outline-none ring-blue-500/30 focus:ring-2"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-muted" htmlFor="role">
              Role
            </label>
            <input
              id="role"
              className="w-full rounded-lg border border-border-app bg-surface px-3 py-2 text-sm outline-none ring-blue-500/30 focus:ring-2"
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-muted" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="w-full rounded-lg border border-border-app text-text-muted bg-surface px-3 py-2 text-sm outline-none ring-blue-500/30 focus:ring-2"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as ApplicationStatus,
                }))
              }
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-text-muted"
                htmlFor="applied"
              >
                Applied date
              </label>
              <input
                id="applied"
                type="date"
                className="w-full rounded-lg border border-border-app text-text-muted bg-surface px-3 py-2 text-sm outline-none ring-blue-500/30 focus:ring-2"
                value={form.appliedDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, appliedDate: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-text-muted"
                htmlFor="deadline"
              >
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                className="w-full rounded-lg border border-border-app text-text-muted bg-surface px-3 py-2 text-sm outline-none ring-blue-500/30 focus:ring-2"
                value={form.deadline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, deadline: e.target.value }))
                }
                // required
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full resize-none rounded-lg border border-border-app bg-surface px-3 py-2 text-sm outline-none ring-blue-500/30 focus:ring-2"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="resume">
              Resume (attach)
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setForm((f) => ({
                  ...f,
                  resumeName: file ? file.name : '',
                }))
              }}
            />
            {form.resumeName ? (
              <p className="mt-1 text-xs text-text-muted">
                Selected: {form.resumeName}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium cursor-pointer text-text-muted hover:bg-black/5 dark:hover:bg-white/10"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold cursor-pointer text-white shadow-md shadow-blue-600/25 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
