import { useMemo, useState } from "react";
import {
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Link as LinkIcon,
  Plus,
} from "lucide-react";
import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import { toast } from "sonner";
import { useApplications } from "../stores/appStore";
import type { Application, ApplicationStatus } from "../types/application";
import { APPLICATION_STATUSES } from "../types/application";
import { AddEditApplicationModal } from "../components/AddEditApplicationModal";
import { PremiumCard } from "../components/PremiumCard";
import { STATUS_STYLES } from "../lib/statusStyles";
import { cn } from "../lib/utils";

const PAGE_SIZE = 9;

type SortMode = "applied-desc" | "deadline-asc" | "company-asc";

export function ApplicationsPage() {
  const { applications, addApplication, updateApplication, deleteApplication } =
    useApplications();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [sort, setSort] = useState<SortMode>("applied-desc");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);

  // Filter and sort applications
  const filtered = useMemo(() => {
    let list = [...applications];

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role?.toLowerCase().includes(q) ||
          a.notes?.toLowerCase().includes(q),
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      list = list.filter((a) => a.status === statusFilter);
    }

    // Sort
    const sorted = [...list];
    switch (sort) {
      case "applied-desc":
        sorted.sort(
          (a, b) =>
            parseISO(b.appliedDate).getTime() -
            parseISO(a.appliedDate).getTime(),
        );
        break;
      case "deadline-asc":
        sorted.sort(
          (a, b) =>
            parseISO(a.deadline || "9999-12-31").getTime() -
            parseISO(b.deadline || "9999-12-31").getTime(),
        );
        break;
      case "company-asc":
        sorted.sort((a, b) => a.company.localeCompare(b.company));
        break;
    }

    return sorted;
  }, [applications, search, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(a: Application) {
    setEditing(a);
    setModalOpen(true);
  }

  async function handleSave(data: Omit<Application, "id" | "createdAt">) {
    try {
      if (editing) {
        await updateApplication(editing.id, data);
        toast.success("Application updated.");
      } else {
        await addApplication(data);
        toast.success("Application added.");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save application.",
      );
    }
  }

  async function handleDelete(a: Application) {
    if (!window.confirm(`Delete ${a.company}?`)) return;
    try {
      await deleteApplication(a.id);
      toast.success("Deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete application.",
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-muted">
            Applications
          </h1>
          <p className="mt-1.5 text-sm text-text-muted/60">
            Search, filter, and manage your job applications
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="group relative inline-flex text-text-muted cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl from-green-500 to-red-600 px-5 py-3.5
           text-sm font-semibold tracking-tight shadow-lg shadow-green-500/55 transition-all hover:shadow-cyan-500/70 hover:scale-[1.02]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Plus className="h-4 w-4" />
          </span>
          <span>Add Application</span>

          {/* Background highlight */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-20"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(255,255,255,0.5))",
            }}
          />
        </button>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div
          className={cn(
            "relative max-w-md flex-1 rounded-2xl border border-stroke bg-surface-muted pl-10 pr-3 py-2.5 text-sm transition-all focus-within:border-stroke-focus",
            "hover:shadow-sm",
          )}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted/60" />
          <input
            type="search"
            placeholder="Search by company, role, or notes..."
            className="w-full bg-transparent py-1.5 outline-none placeholder:text-text-muted/60 text-text-muted"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div
            className={cn(
              "group relative",
              "rounded-[16px] border border-stroke bg-surface-muted py-2 px-3 text-sm",
            )}
          >
            <label className="text-xs font-medium text-text-muted/70 mb-1.5 block">
              Status
            </label>
            <select
              className="w-full appearance-none bg-transparent py-1 outline-none cursor-pointer text-text-muted"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ApplicationStatus | "All");
                setPage(1);
              }}
            >
              <option value="All">All statuses</option>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_STYLES[s]?.label || s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort filter */}
          <div
            className={cn(
              "group relative",
              "rounded-[16px] border border-stroke bg-surface-muted py-2 px-3 text-sm",
            )}
          >
            <label className="text-xs font-medium text-text-muted/70 mb-1.5 block">
              Sort by
            </label>
            <select
              className="w-full appearance-none bg-transparent py-1 outline-none cursor-pointer text-text-muted"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
            >
              <option value="applied-desc">Latest applied</option>
              <option value="deadline-asc">Deadline nearest</option>
              <option value="company-asc">Company A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications grid */}
      {filtered.length === 0 ? (
        <PremiumCard
          variant="border"
          className="flex h-64 items-center justify-center text-sm"
        >
          <p className="text-text-muted/60">
            No applications match your filters.
          </p>
        </PremiumCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((a) => (
            <ApplicationCard
              key={a.id}
              application={a}
              onEdit={() => openEdit(a)}
              onDelete={() => handleDelete(a)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && pageItems.length === PAGE_SIZE && (
        <div className="flex items-center justify-between rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm">
          <span className="text-text-muted/70">
            Page {currentPage} of {totalPages} · {filtered.length} results
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[12px] px-3 py-2 transition-all",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "hover:border-stroke-focus hover:bg-black/3 dark:hover:bg-white/5",
                "border border-stroke",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[12px] px-3 py-2 transition-all",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "hover:border-stroke-focus hover:bg-black/3 dark:hover:bg-white/5",
                "border border-stroke",
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditApplicationModal
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          initial={editing}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Individual application card component
function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: {
  application: Application;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const urgency = deadlineUrgency(application.deadline);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-stroke bg-surface-muted/50 p-5 transition-all hover:border-stroke-focus",
        "hover:shadow-lg",
      )}
    >
      {/* Status gradient indicator on left */}
      <div
        className="absolute left-0 top-0 h-full w-[4px] rounded-r-[8px]"
        style={{ background: STATUS_STYLES[application.status].bg }}
      />

      <div className="flex flex-col gap-3.5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {/* Company avatar with gradient */}
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] font-medium text-sm tracking-tight text-white shadow-md transition-transform group-hover:scale-110",
                companyAvatarColor(application.company),
              )}
            >
              {application.company.substring(0, 2).toUpperCase()}
            </span>

            <div>
              <h3 className="font-semibold tracking-tight text-text-muted">
                {application.company}
              </h3>
              <p className="text-xs text-text-muted/60">
                {application.role || "Position"}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span
            className={cn(
              "rounded-full",
              STATUS_STYLES[application.status].chip,
              `inline-flex items-center gap-1.5`,
            )}
            style={{ background: STATUS_STYLES[application.status].bg }}
          >
            <span aria-hidden>{STATUS_STYLES[application.status].emoji}</span>
            <span className="text-xs font-medium">{application.status}</span>
          </span>
        </div>

        {/* Timeline details */}
        <div className="flex flex-wrap items-center gap-3.5 rounded-[12px] border border-stroke bg-surface-muted/30 p-2">
          {/* Applied date */}
          <div className="flex items-center gap-1.5 text-xs text-text-muted/70">
            <Clock className="h-3.5 w-3.5" />
            <span>Applied {formatDate(application.appliedDate)}</span>
          </div>

          {/* Website */}
          {application.website && (
            <>
              <Globe className="h-3.5 w-3.5 text-text-muted/50" />
              <Link
                href={application.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 rounded-[8px] px-1.5 py-0.5 bg-black/3 dark:bg-white/6 text-xs font-medium transition-all hover:bg-stroke-focus/20"
              >
                Website
                <LinkIcon className="h-3 w-3" />
              </Link>
            </>
          )}

          {/* Deadline */}
          {application.deadline && (
            <>
              <span className="mx-1 text-text-muted/40">|</span>
              <div
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  urgency === "urgent"
                    ? "text-status-urgent font-medium"
                    : "text-text-muted/70",
                )}
              >
                {application.deadline && <Clock className="h-3.5 w-3.5" />}
                {formatDate(application.deadline)}
                {urgency === "urgent" && (
                  <span className="text-[10px] text-status-urgent ml-0.5">
                    URGENT
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Notes preview */}
        {application.notes && (
          <div className="group/notes rounded-xl border border-stroke/60 bg-black/3 dark:bg-white/6 p-2.5 text-xs text-text-muted/80 transition-all hover:border-stroke-focus">
            <p>{truncateText(application.notes, 120)}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-0.5">
          <button
            onClick={onEdit}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              "hover:bg-status-interview/10 hover:text-status-interview",
            )}
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className={cn(
              "inline-flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-xs font-medium transition-all",
              "hover:bg-status-rejection/10",
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Utility: Company avatar colors
function companyAvatarColor(company: string) {
  const colors = [
    "bg-gradient-to-br from-sky-500 to-cyan-600 shadow-cyan-500/20",
    "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20",
    "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20",
    "bg-gradient-to-br from-orange-500 to-pink-600 shadow-pink-500/20",
    "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20",
  ];

  const hash = company
    .toLowerCase()
    .split("")
    .reduce((a, b) => {
      return ((a << 5) - a + b.charCodeAt(0)) | 0;
    }, 0);

  const index = Math.abs(hash % colors.length);
  return colors[index];
}

function formatDate(iso: string): string {
  try {
    const d = parseISO(iso);
    const today = startOfDay(new Date());
    const days = differenceInCalendarDays(startOfDay(d), today);

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 0) return `${Math.abs(days)}d ago`;
    if (days < 7)
      return `${deadlineLabel(iso)} • ${d.toLocaleDateString(undefined, { weekday: "short" })}`;

    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: days > 365 ? "numeric" : "2-digit",
    });
  } catch {
    return iso;
  }
}

// Calculate urgency of deadline
function deadlineUrgency(iso: string): "urgent" | "normal" {
  try {
    const d = startOfDay(parseISO(iso));
    const today = startOfDay(new Date());
    const days = differenceInCalendarDays(d, today);

    if (days < 0) return "normal";
    if (days <= 3) return "urgent";
    return "normal";
  } catch {
    return "normal";
  }
}

// Get relative deadline label
function deadlineLabel(iso: string): string {
  try {
    const d = parseISO(iso);
    const today = startOfDay(new Date());
    const days = differenceInCalendarDays(startOfDay(d), today);

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days > 0) return `${days} days`;
    return "Past";
  } catch {
    return "Unknown";
  }
}

// Truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.substring(0, lastSpace + 1) + "…";
}

// Link component
function Link({
  href,
  children,
  className,
  onClick,
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  );
}
