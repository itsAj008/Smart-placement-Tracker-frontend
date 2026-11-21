Completed comprehensive UI redesign transforming basic components to premium-minimal design.

## Changes Made

### Design System
- **index.css**: Added design tokens using oklch color space with warm neutral base
  - `--color-surface`, `--color-surface-elevated`, `--color-surface-muted`
  - `--color-text-muted`, `--color-border-app`
  - Status colors: `--status-success`, `--status-interview`, `--status-pending`, `--status-rejection`, `--status-urgent`
  - Border utilities: `--color-stroke`, `--color-stroke-focus`
  - Utility classes for status backgrounds and chip styling

### Components Updated
1. **Header** (new): Sticky header with backdrop blur, logo gradient, navigation links, notification dropdown, theme toggle, logout
2. **AppLayout**: Simplified to use Header component
3. **DashboardPage**: 
   - Stats grid using PremiumStatCard components
   - Company avatar color assignment via hash function
   - Refined timeline details for upcoming deadlines
   - Updated bar chart with improved tooltip

4. **ApplicationsPage** (table → card grid):
   - 3-column card layout instead of table
   - Company avatars with gradient backgrounds
   - Timeline details with icons
   - Notes preview section
   - Premium action buttons
   - Fixed STATUS_STYLES duplicate declaration error

5. **AddEditApplicationModal**: 
   - Fixed validation logic (was checking `undefined` property)
   - Modern modal design with centered overlay, backdrop blur
   - Input fields with [16px] border radius
   - Consistent form styling

6. **ProfilePage**:
   - Centered user avatar header with gradient
   - Card-based account details layout
   - Pill-style theme toggle button
   - Refined logout button

### PremiumStatCard Features
- Gradient background accents on right edge
- Icon with colored background (blue/emerald/violet/rose/amber)
- Trend indicators with success/rejection colors
- Subtle glow effects and hover interactions

### Applications Card Design
- [24px] border radius for premium feel
- Status gradient indicator on left edge
- Company avatar with hash-based gradient colors
- Timeline bar with icon labels (Clock, Globe, |)
- Notes preview section with subtle styling
- Edit/Delete buttons with status-interview/status-rejection colors

### Key Design Principles Applied
- Consistent [16px]-[24px] border radius hierarchy
- oklch color space for perceptually uniform colors
- Warm neutrals instead of generic grays
- Subtle motion (scale on hover, not overwhelming)
- Status indicators with emojis and consistent chip styling
- Large border radius ([16px]-[32px]) for modern, friendly feel

## Fixed Issues
- Removed duplicate STATUS_STYLES declarations from DashboardPage.tsx and ApplicationsPage.tsx
- Replaced hardcoded Tailwind colors (`bg-blue-500`, `fill:#6366F1`) with CSS custom properties where appropriate
- Kept intentional brand gradients (logo, company avatars)
