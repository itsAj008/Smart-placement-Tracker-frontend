import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'
import { toast } from 'sonner'
import { useApplications } from '../stores/appStore'
import type { Application, ApplicationStatus } from '../types/application'
import { APPLICATION_STATUSES } from '../types/application'
import { AddEditApplicationModal } from '../components/AddEditApplicationModal'
import { STATUS_STYLES } from '../lib/statusStyles'
import { cn } from '../lib/utils'

const PAGE_SIZE = 8

type SortMode = 'applied-desc' | 'deadline-asc'

export function ApplicationsPage() {
  const {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useApplications()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>(
    'All',
  )
  const [sort, setSort] = useState<SortMode>('applied-desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)

  const filtered = useMemo(() => {
    let list = applications
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => a.company.toLowerCase().includes(q))
    }
    if (statusFilter !== 'All') {
      list = list.filter((a) => a.status === statusFilter)
    }
    const sorted = [...list]
    if (sort === 'applied-desc') {
      sorted.sort(
        (a, b) =>
          parseISO(b.appliedDate).getTime() - parseISO(a.appliedDate).getTime(),
      )
    } else {
      sorted.sort(
        (a, b) =>
          parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime(),
      )
    }
    return sorted
  }, [applications, search, statusFilter, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function openAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(a: Application) {
    setEditing(a)
    setModalOpen(true)
  }

  async function handleSave(data: Omit<Application, 'id' | 'createdAt'>) {
    try {
      if (editing) {
        await updateApplication(editing.id, data)
        toast.success('Application updated.')
      } else {
        await addApplication(data)
        toast.success('Application added.')
      }
      setModalOpen(false)
      setEditing(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save application.')
    }
  }

  async function handleDelete(a: Application) {
    if (!window.confirm(`Delete application for ${a.company}?`)) return
    try {
      await deleteApplication(a.id)
      toast.success('Deleted successfully.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete application.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-muted">Applications</h1>
          <p className="mt-1 text-sm text-text-muted">
            Search, filter, and manage your applications
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add application
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            placeholder="Search by company…"
            className="w-full rounded-xl border border-border-app bg-surface-elevated py-2.5 pl-10 pr-3 text-sm outline-none ring-blue-500/30 focus:ring-2 text-text-muted"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-text-muted">Filter</label>
          <select
            className="rounded-xl border border-border-app text-text-muted bg-surface-elevated px-2 py-2 text-sm outline-none"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ApplicationStatus | 'All')
              setPage(1)
            }}
          >
            <option value="All">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <label className="ml-2 text-sm text-text-muted">
            Sort
          </label>
          <select
            className="rounded-xl border border-border-app text-text-muted bg-surface-elevated px-2 py-2 text-sm outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
          >
            <option value="applied-desc">Latest applied first</option>
            <option value="deadline-asc">Deadline nearest first</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-app bg-surface-elevated shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border-app bg-black/2 dark:bg-white/3 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Deadline</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-text-muted"
                  >
                    No applications match your filters.
                  </td>
                </tr>
              ) : (
                pageItems.map((a) => (
                  <tr
                    key={a.id}
                    className={cn(
                      'border-b border-border-app last:border-0',
                      deadlineUrgency(a.deadline) === 'soon' &&
                        'bg-amber-500/6',
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-text-muted">{a.company}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {a.role}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          STATUS_STYLES[a.status].chip +
                          ' inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium'
                        }
                      >
                        <span aria-hidden>{STATUS_STYLES[a.status].emoji}</span>
                        {STATUS_STYLES[a.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      <span
                        className={
                          deadlineUrgency(a.deadline) === 'soon'
                            ? 'font-semibold text-amber-700 dark:text-amber-300'
                            : 'text-text-muted'
                        }
                      >
                        {formatDate(a.deadline)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
                          aria-label="Edit"
                          onClick={() => openEdit(a)}
                        >
                          <Pencil className="h-4 w-4 cursor-pointer" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                          aria-label="Delete"
                          onClick={() => handleDelete(a)}
                        >
                          <Trash2 className="h-4 w-4 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE ? (
          <div className="flex items-center justify-between border-t border-border-app px-4 py-3 text-sm">
            <span className="text-text-muted">
              Page {currentPage} of {totalPages} · {filtered.length} results
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-border-app px-3 py-1.5 font-medium disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-border-app px-3 py-1.5 font-medium disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <AddEditApplicationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return parseISO(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function deadlineUrgency(iso: string): 'normal' | 'soon' | 'past' {
  try {
    const d = startOfDay(parseISO(iso))
    const today = startOfDay(new Date())
    const days = differenceInCalendarDays(d, today)
    if (days < 0) return 'past'
    if (days <= 3) return 'soon'
    return 'normal'
  } catch {
    return 'normal'
  }
}
