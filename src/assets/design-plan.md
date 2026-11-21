# Smart Placement Tracker - Premium Minimal UI Design Plan

## Subject Matter Analysis

**Product:** Job/Career Placement Tracking Dashboard
- **Audience:** Students and job seekers tracking applications to companies
- **Primary Goal:** Organize, monitor, and follow up on job applications efficiently
- **Industry:** Career development / EdTech / Recruitment
- **Materials:** Clean typography, subtle gradients, micro-interactions, data visualization

## Design Philosophy: Premium Minimal

### Core Principles
1. **Essential elegance** — every element serves a clear purpose, nothing decorative or cliché
2. **Confident whitespace** — breathing room creates luxury, not emptiness
3. **Refined typography hierarchy** — one strong type family with intentional weight contrasts
4. **Subtle motion** — single orchestrated reveals, no scattered micro-animations
5. **Tactile quality** — subtle borders, soft shadows, smooth gradients as accents only

---

## Color System

### Base Palette (Neutral Foundation)
- `--color-surface`: `oklch(0.998 0.004 260)` — Almost pure white, warm undertone
- `--color-surface-elevated`: `oklch(0.975 0.012 260)` — Very subtle elevation tint
- `--color-surface-muted`: `oklch(0.93 0.018 260)` — Secondary surface for cards

### Dark Mode Palette
- `--color-surface`: `oklch(0.14 0.02 260)` — Deep warm charcoal, not pure black
- `--color-surface-elevated`: `oklch(0.19 0.025 260)` — Slightly lighter for elevated areas
- `--color-surface-muted`: `oklch(0.24 0.02 260)` — Card surfaces in dark mode

### Accent Colors (Status System)
Using refined, sophisticated tones — muted and balanced, not neon or aggressive:

| Status | Color | Usage |
|--------|-------|-------|
| Success/Offers | `#34D391` (Emerade 300) | Primary green — calm, confident |
| Interviews | `#60A5FA` (Blue 400) | Soft blue — thoughtful |
| Pending/Applied | `#A78BFA` (Violet 300) | Purple tone — neutral processing |
| Rejections | `#F87171` (Rose 300) | Gentle red — not alarming |
| Urgent/Deadline | `#FBBF24` (Amber 400) | Warm amber — attention without panic |

**Gradients:** Minimal usage. Single subtle radial as primary accent only:
- Primary gradient: `radial-gradient(60% 60% at 50% 10%, var(--color-surface-elevated), transparent)`

### Borders & Shadows
- **Border weight:** `1px` — not hairline, substantial enough to feel premium
- **Border radius:** `24px` for primary containers, `16px` for inner elements
- **Shadow:** `0 2px 8px rgba(0,0,0,0.04)` — extremely subtle, barely there

---

## Typography System

### Typeface Choice: DM Sans (keeping existing)
Single type family with intentional scale and weight distribution.

**Type Scale:**
```
Display (H1): text-5xl / font-extrabold / tracking-tight / line-height 1.1
Section H2:   text-3xl / font-semibold / tracking-tight / line-height 1.2
Card Title:   text-lg / font-semibold / line-height 1.3
Body:         text-sm / font-normal / line-height 1.6 / leading-snug
Label:        text-xs / font-medium / uppercase / tracking-wide / line-height 1.4
```

**Font Weights:** `200` (light), `400` (regular), `500` (medium), `700` (bold)
- Never use `800`+ — reserved for tiny status indicators only

### Text Treatment Principles
1. **No accenting single words** — entire headline or nothing
2. **Never all-caps except labels** — uppercase feels cheap, small and spaced
3. **Tracking on display text:** `tracking-tight` or `-0.02em` — not tight, but cohesive
4. **Body text alignment:** Left-aligned only (no justify)

---

## Layout Architecture

### Grid System
- Container max-width: `1280px` centered
- Gutter: `24px` (large breathing room)
- Gap between items: `32px` — generous, not cramped
- Page padding: `64px 24px` top/bottom, `24px` sides

### Hero Section Pattern
```
┌─────────────────────────────────────┐
│ [Logo] Placement Tracker            │
│                                     │
│    Tracking your placements         │
│                                    ──┤
│     Total Applications: 24          │
└─────────────────────────────────────┘
```

### Card System
- Primary containers: `rounded-[32px]` / `border-stroke` / `p-6`
- Hierarchy: Large radius on main, smaller (16px) on nested elements
- No drop shadows — use background tint or subtle border instead
- Hover state: Border color shift + very subtle scale (`scale-[1.02]`)

---

## Component-by-Component Redesign

### 1. Header / Navigation

**Current issues:**
- Compact, crowded feel
- Generic blue primary
- Standard hover states

**Redesign:**
```tsx
// Logo area
<span className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-[var(--color-primary)] text-white">
  <Briefcase className="h-5 w-5" />
</span>
<span className="hidden sm:inline text-lg font-semibold tracking-tight">Placement Tracker</span>

// Nav
<nav className="flex flex-1 justify-center gap-2 border-b-[0.5px] pt-4">
  {['Dashboard', 'Applications', 'Profile'].map((item) => (
    <NavLink active={isActive} key={item}>
      <span className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-[var(--color-surface-elevated)] text-text-muted'
          : 'text-text-muted/60 hover:text-text-muted'
      }`}>
        <Icon className="h-4 w-4" />
        {item}
      </span>
    </NavLink>
  ))}
</nav>

// Right actions (notifications, theme, logout) - stacked vertically on mobile
<div className="flex items-center gap-2 border-b-[0.5px] pt-4 sm:flex-col sm:gap-1 sm:pt-0">
  {/* notification bell */}
  {/* theme toggle */}
  {/* logout */}
</div>
```

### 2. Dashboard Stats Cards

**Current issues:**
- Generic stat card template
- Basic ring accent system (blue/amber/emerald/rose)
- Small labels, large numbers — good direction but needs refinement
- Hover states feel generic

**Redesign:**
```tsx
const stats = [
  { title: 'Total Applications', value: total, icon: Briefcase, color: '#3B82F6' },
  { title: 'Interviews Scheduled', value: interviews, icon: Clock, color: '#10B981' },
  { title: 'Offers Received', value: offers, icon: CheckCircle, color: '#8B5CF6' },
  { title: 'Rejections', value: rejections, icon: X, color: '#F43F5E' },
]

{stats.map(({ title, value, icon: Icon, color }) => (
  <div 
    key={title}
    className="group relative overflow-hidden rounded-[24px] border border-stroke bg-surface-muted p-6 hover:border-stroke-focus"
  >
    {/* Background gradient accent on right edge */}
    <div 
      className="absolute -right-4 -top-4 h-32 w-32 rotate-45 rounded-[100%] opacity-10 blur-xl transition-all group-hover:scale-150"
      style={{ 
        background: color, 
        width: '64px', 
        height: '64px',
        filter: 'blur(24px)'
      }}
    />
    
    <div className="relative z-10">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted/70">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        {title}
      </div>
      <p className="mt-1.5 flex items-baseline gap-1">
        <span 
          className="text-4xl font-semibold tabular-nums tracking-tight"
          style={{ color: color }}
        >
          {value.toLocaleString()}
        </span>
        <span className="text-xs font-medium text-text-muted/50">
          {/* Could add trend here */}
        </span>
      </p>
    </div>
  </div>
))
```

### 3. Upcoming Deadlines Section

**Current issues:**
- Uppercase section title (generic)
- Basic list layout
- No clear hierarchy of urgency

**Redesign:**
```tsx
<section className="rounded-[24px] border border-stroke bg-surface p-6">
  {/* Progress indicator + heading */}
  <div className="flex items-center justify-between gap-4">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted/80">Upcoming Deadlines</h2>
    {count > 0 && (
      <div 
        className="h-[2px] flex-1 rounded-full bg-stroke"
        style={{ background: `linear-gradient(90deg, ${urgentColor}, transparent)` }}
      />
    )}
  </div>

  {/* Deadline list */}
  {upcomingDeadlines.length === 0 ? (
    <p className="flex h-32 items-center justify-center text-sm text-text-muted/60">
      No upcoming deadlines — you're all caught up!
    </p>
  ) : (
    <ul className="space-y-3">
      {upcomingDeadlines.map((a) => (
        <li 
          key={a.id}
          className={`group flex items-center justify-between rounded-[16px] border border-stroke bg-surface p-4 transition-colors hover:border-stroke-focus ${
            deadlineUrgency(a.deadline) === 'urgent' ? 'border-red-500/20' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Company avatar */}
            <span 
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] font-medium text-sm tracking-tight"
              style={{ 
                background: `linear-gradient(135deg, ${a.color}, ${a.darkColor})`,
                color: '#FFFFFF'
              }}
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
              className={`rounded-full px-2.5 py-1 font-medium ${
                STATUS_STYLES[a.status].chip
              }`}
            >
              {STATUS_STYLES[a.status].emoji} {a.status}
            </span>
            <span 
              className={`tabular-nums font-medium ${
                deadlineUrgency(a.deadline) === 'urgent' 
                  ? 'text-red-500' 
                  : 'text-text-muted/70'
              }`}
            >
              {deadlineLabel(a.deadline)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )}
</section>
```

### 4. Applications Chart Section

**Current issues:**
- Standard Recharts bar with generic grid
- Dashed grid lines feel dated
- Tooltip styling is basic

**Redesign:**
```tsx
<section className="rounded-[24px] border border-stroke bg-surface p-6">
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted/80">Applications Overview</h2>
    <span className="text-xs text-text-muted/70">Last 6 months</span>
  </div>

  <div className="mt-4">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 12, right: 12, left: -8, bottom: 6 }}>
        {/* Custom grid with subtle lines */}
        <CartesianGrid strokeDasharray="0 0" horizontal={false} />
        
        {/* Y axis without labels, just ticks */}
        <YAxis 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 500 }}
          width={32}
          tickFormatter={(v) => Math.floor(v)}
          allowDecimals={false}
        />
        
        {/* X axis with month labels */}
        <XAxis 
          dataKey="label"
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 500 }}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={interval}
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
          labelStyle={{ fontWeight: 500, marginBottom: '4px' }}
        />

        {/* Gradient bar with rounded ends */}
        <Bar 
          dataKey="count"
          fill="#6366F1"
          radius={[8, 8, 8, 8]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <p className="mt-3 text-center text-xs font-medium text-text-muted/60">
    Track your monthly application activity
  </p>
</section>
```

### 5. Applications Page (Table View)

**Current issues:**
- Standard table with generic styling
- Basic hover rows
- Plain action buttons

**Redesign - Card Grid Layout instead of Table:**
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {pageItems.map((a) => (
    <ApplicationCard key={a.id} application={a} />
  ))}
</div>

// Card component
function ApplicationCard({ application }) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-stroke bg-surface p-5 transition-all hover:border-stroke-focus">
      {/* Status gradient indicator on top */}
      <div 
        className={`absolute left-0 top-0 h-full w-[4px] rounded-r-[8px] ${
          STATUS_STYLES[application.status].bg
        }`}
      />

      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] font-medium text-sm tracking-tight"
              style={{ background: `linear-gradient(135deg, ${application.color}, ${application.darkColor})`, color: '#FFFFFF' }}
            >
              {application.company.substring(0, 2).toUpperCase()}
            </span>
            <div>
              <h3 className="font-semibold tracking-tight text-text-muted">{application.company}</h3>
              <p className="text-xs text-text-muted/60">{application.role || 'Position'}</p>
            </div>
          </div>

          {/* Status badge */}
          <span className={`rounded-full ${STATUS_STYLES[application.status].chip}`}>
            {STATUS_STYLES[application.status].emoji}
            <span className="ml-1 text-xs font-medium">{application.status}</span>
          </span>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 rounded-[12px] border border-stroke bg-surface-muted/50 p-2">
          <Clock className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
          <span className="text-xs text-text-muted">Applied {formatDate(application.appliedDate)}</span>
          {application.deadline && (
            <>
              <span className="mx-1 text-text-muted/30">•</span>
              <span className={`text-xs ${deadlineUrgency(application.deadline) === 'urgent' ? 'font-medium text-red-500' : 'text-text-muted/70'}`}>
                Due {formatDate(application.deadline)}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button 
            onClick={() => openEdit(application)}
            className="inline-flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-blue-600/10"
            style={{ color: '#3B82F6' }}
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </button>
          <button 
            onClick={() => deleteApplication(application.id)}
            className="inline-flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-red-500/10"
            style={{ color: '#F43F5E' }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Empty state */}
      {pageItems.length === 0 && (
        <p className="flex h-64 items-center justify-center text-sm text-text-muted/60">
          No applications match your filters
        </p>
      )}
    </div>
  )
}
```

### 6. Add/Edit Modal

**Redesign:**
```tsx
function AddEditApplicationModal({ open, onClose, initial, onSave }) {
  const formRef = useRef<HTMLFormElement>(null)
  
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-text-muted">
            {initial ? 'Edit Application' : 'New Application'}
          </h2>
          <button onClick={onClose} className="rounded-[12px] p-2 hover:bg-black/5 dark:hover:bg-white/10">
            <X className="h-4 w-4 text-text-muted" />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="space-y-3.5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-muted/80">Company</span>
                <input 
                  type="text"
                  placeholder="e.g., Google, Meta..."
                  className="w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none ring-2 ring-blue-500/30 transition-all focus:ring-2"
                  style={{ color: '#FFFFFF' }}
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3.5">
                  <label>
                    <span className="mb-2 block text-sm font-medium text-text-muted/80">Role</span>
                    <input type="text" placeholder="Software Engineer..." 
                      className="w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all focus:ring-2"
                      style={{ color: '#FFFFFF' }}
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-medium text-text-muted/80">Deadline</span>
                    <input type="date" 
                      className="w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all focus:ring-2"
                      style={{ color: '#FFFFFF' }}
                    />
                  </label>
                </div>

                <div className="space-y-3.5">
                  <label>
                    <span className="mb-2 block text-sm font-medium text-text-muted/80">Status</span>
                    <select 
                      className="w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all focus:ring-2"
                      style={{ color: '#FFFFFF' }}
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-medium text-text-muted/80">Applied Date</span>
                    <input type="date" 
                      className="w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all focus:ring-2"
                      style={{ color: '#FFFFFF' }}
                    />
                  </label>
                </div>

                <div className="space-y-3.5">
                  <label>
                    <span className="mb-2 block text-sm font-medium text-text-muted/80">Website</span>
                    <input type="url" placeholder="https://" 
                      className="w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm font-medium tracking-tight outline-none transition-all focus:ring-2"
                      style={{ color: '#FFFFFF' }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3.5">
                <label>
                  <span className="mb-2 block text-sm font-medium text-text-muted/80">Notes</span>
                  <textarea 
                    placeholder="Company info, next steps, contact details..."
                    rows={4}
                    className="w-full rounded-[16px] border border-stroke bg-surface-muted px-4 py-3 text-sm leading-relaxed tracking-tight outline-none transition-all focus:ring-2"
                    style={{ color: '#FFFFFF' }}
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center rounded-[16px] px-5 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                style={{ color: '#FFFFFF' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-[16px] bg-gradient-to-r from-blue-500 to-blue-600 px-6 text-sm font-medium tracking-tight text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                {initial ? 'Update' : 'Add'} Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### 7. Profile Page

**Current issues:**
- Generic section cards
- Uppercase labels
- Basic button styling

**Redesign:**
```tsx
<div className="mx-auto max-w-lg space-y-8">
  {/* Welcome header */}
  <div className="flex items-center gap-4">
    <span 
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-semibold tracking-tight text-white shadow-lg"
    >
      {user?.name?.charAt(0).toUpperCase() || '?'}
    </span>
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-text-muted">
        {user?.name || 'User'}
      </h1>
      <p className="text-sm text-text-muted/60">{user?.email || '—'}</p>
    </div>
  </div>

  {/* Settings card - not separate sections */}
  <section className="rounded-[24px] border border-stroke bg-surface p-6">
    <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-text-muted/80">Account & Preferences</h2>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-muted">Name</span>
          <span className="text-xs text-text-muted/60">Your full name</span>
        </div>
        <span className="font-medium tracking-tight">{user?.name}</span>
      </div>

      <div className="h-px bg-stroke" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-muted">Email</span>
          <span className="text-xs text-text-muted/60">Contact address</span>
        </div>
        <span className="font-medium tracking-tight">{user?.email}</span>
      </div>
    </div>
  </section>

  {/* Theme toggle as interactive pill */}
  <button 
    onClick={toggleTheme}
    className="flex w-full items-center justify-between rounded-[16px] border border-stroke bg-surface-muted px-4 py-3.5 text-left text-sm font-medium transition-all hover:bg-black/3 dark:hover:bg-white/5"
  >
    <span>Appearance</span>
    <span className="flex items-center gap-2">
      {theme === 'dark' ? (
        <>
          <Moon className="h-4 w-4" /> Dark Mode
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" /> Light Mode
        </>
      )}
    </span>
  </button>

  {/* Logout as distinctive button */}
  <button 
    onClick={handleLogout}
    className="group relative flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-3.5 text-sm font-semibold tracking-tight transition-colors hover:bg-red-500/10"
    style={{ color: '#F43F5E' }}
  >
    <span>Sign out</span>
    <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
  </button>
</div>
```

### 8. Add Application Button (Hero CTA)

**Current:** Blue button with generic hover
**Redesign:** Premium pill design

```tsx
<button
  onClick={openAdd}
  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[16px] bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-sm font-semibold tracking-tight text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
>
  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
  <span>Add Application</span>

  {/* Background highlight */}
  <div 
    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-20"
    style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.5))' }}
  />
</button>
```

---

## Design Tokens Summary

### Colors (Tailwind CSS variables)
```css
--color-primary: oklch(63% 0.24 260)
--color-primary-accent: oklch(79% 0.18 260)
--color-surface: oklch(99.8% 0 260)
--color-surface-elevated: oklch(97.5% 0.01 260)
--color-surface-muted: oklch(93% 0.02 260)
--color-text-muted: oklch(45% 0.02 260)
--color-border-stroke: oklch(88% 0.01 260)
--color-border-focus: oklch(63% 0.24 260)

/* Dark mode */
html.dark {
  --color-surface: oklch(14% 0.02 260)
  --color-surface-elevated: oklch(19% 0.03 260)
  --color-surface-muted: oklch(24% 0.02 260)
  --color-text-muted: oklch(72% 0.02 260)
  --color-border-stroke: oklch(32% 0.02 260)
}

/* Status colors */
--status-success: #34D391
--status-interview: #60A5FA
--status-pending: #A78BFA
--status-rejection: #F87171
--status-urgent: #FBBF24
```

### Spacing Scale
- Base unit: `8px`
- Gutter: `24px` (between cards)
- Item gap: `32px` (within grid)
- Page padding: `64px 24px`
- Card padding: `p-6` (24px)
- Section padding: `p-5` or `p-6`

### Border Radius System
- Large containers: `rounded-[24px]`
- Nested elements: `rounded-[16px]`
- Small touches: `rounded-[8px]`
- Buttons: `rounded-[16px]`
- Inputs: `rounded-[16px]`

### Shadows
- Primary elevation: `shadow-lg shadow-blue-500/25`
- Subtle surface: `shadow-sm opacity-40`
- Modal: `shadow-xl` with color tint
- Card hover: `transition-shadow` + border color shift

### Typography Scale
```css
--text-display: text-5xl font-extrabold tracking-tight leading-none
--text-heading: text-3xl font-semibold tracking-tight leading-snug
--text-card-title: text-lg font-medium leading-tight
--text-body: text-sm font-normal leading-relaxed
--text-label: text-xs font-medium uppercase tracking-wide
```

---

## Implementation Priority

1. **Design tokens** — update `index.css` with new color system
2. **Header & navigation** — most visible change, sets the tone
3. **Dashboard stat cards** — immediate visual impact
4. **Application cards** — main content area transformation
5. **Modal forms** — user input experience
6. **Profile page** — personal settings flow

---

## Visual Mockup (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│  [ ] Placement Tracker                    🔔(2) ☀️ 👤      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   Dashboard                         Applications    Profile  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                          TRACKING YOUR                      │
│                         PLACEMENT PIPELINE                   │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ TOTAL        │  │ INTERVIEWS  │  │ OFFERS      │          │
│  │    24       │  │     5       │  │     2       │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                               │
├───────────────────────────┬─────────────────────────────────┤
│ UPCOMING DEADLINES        APPLICATIONS OVERVIEW             │
│ ┌────────────────────────┐                                   │
│ │ Google      🟢 Active  • 3 days left                      │
│ ├────────────────────────┤                                   │
│ │ Amazon      🔵 Interview• Due in 1 week                    │
│ ├────────────────────────┤                                   │
│ │ Stripe      🟣 Pending • Tomorrow                          │
│ └────────────────────────┘                                   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                              [Bar Chart]                    │
│  Applications count over last 6 months                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

ADDITION APPLICATIONS  → (gradient pill CTA)
```

---

## Key Differences from Current Design

| Aspect | Current | Premium Minimal |
|--------|---------|-----------------|
| Border radius | `2xl/rounded-2xl` | Custom `rounded-[24px]` |
| Backgrounds | Generic grays | Warm neutral base, surface-muted system |
| Shadows | Subtle but present | Refined with color tint + opacity control |
| Typography | Good foundation | Tighter tracking on display, cleaner hierarchy |
| Status colors | Neon/bright | Muted, sophisticated tones |
| Spacing | Standard gaps | Generous breathing room (`32px` gutter) |
| Gradient usage | Accent rings only | Subtle radial background + primary accents |
| Animations | Generic transitions | Single orchestrated reveals on load |

---

## Final Notes

**What makes this premium:**
1. Generous whitespace throughout — no cramming
2. Consistent border radius — creates unified visual system
3. Refined color palette — not too many shades of gray, intentional warmth
4. Tight tracking on headings — feels modern and cohesive
5. Rounded corners everywhere — softens the interface uniformly

**What to cut:**
- No more dashed grid lines — they feel dated
- No generic "text-muted" labels — use context for clarity
- No basic blue hover states — use gradient shifts + opacity
- No scattered animations — one entrance animation max, then static
