# Wadah Design Guidelines

## Design Approach
**Reference-Based Approach**: Modern SaaS dashboard aesthetic inspired by Vercel, Railway, and Supabase - clean, fast, developer-focused interfaces with emphasis on data visibility and quick actions.

## Core Design Principles
- **Simplicity First**: Complex operations made visually simple and intuitive
- **Speed**: Fast, responsive, minimal loading states
- **Developer-Focused**: Clear information hierarchy, monospace where appropriate
- **Data-Dense**: Maximize useful information without clutter

## Color System
- **Brand Primary**: #0EA5E9 (Ocean Blue) - CTAs, links, active states
- **Supporting Ocean Theme**: Blue/cyan gradients for backgrounds and accents
- **Dark Mode**: Primary interface mode with light mode support
- **Semantic Colors**: Green (success/running), Red (error/stopped), Yellow (warning/paused), Gray (neutral/inactive)

## Typography Hierarchy
**Font Stack**: Inter (primary), SF Mono/JetBrains Mono (code)

- **Hero/Display**: 2.5rem (40px), bold, tight leading
- **Page Titles**: 2rem (32px), semibold
- **Section Headers**: 1.5rem (24px), semibold
- **Card Titles**: 1.125rem (18px), medium
- **Body Text**: 0.875rem (14px), regular
- **Labels/Meta**: 0.75rem (12px), medium, uppercase tracking
- **Code/Terminal**: SF Mono, 0.875rem, regular

## Layout System
**Spacing Scale**: Use Tailwind units - 2, 4, 6, 8, 12, 16, 24 for consistent rhythm

- **Page Padding**: px-6 md:px-8 lg:px-12
- **Section Spacing**: py-8 md:py-12 lg:py-16
- **Card Padding**: p-6
- **Component Gaps**: gap-4 (standard), gap-6 (sections)
- **Max Container Width**: max-w-7xl for dashboard content

**Grid Patterns**:
- Dashboard Stats: 4-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Agent Cards: 3-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Two-Column Layouts: grid-cols-1 lg:grid-cols-2 for forms/details

## Component Library

### Navigation
- **Sidebar**: Fixed left navigation (w-64), collapsible on mobile
- **Top Bar**: Logo + search + quick actions + user menu, sticky positioning
- **Breadcrumbs**: Small text with chevron separators for deep navigation

### Cards & Containers
- **Stat Cards**: Icon + metric + label + trend indicator, rounded-lg borders
- **Agent Cards**: Thumbnail + name + version + status badge + quick actions
- **Info Panels**: Bordered containers with subtle background, rounded corners

### Data Display
- **Tables**: Zebra striping, hover states, sortable headers, pagination
- **Status Badges**: Rounded-full pills with dot indicators (running, paused, stopped)
- **Progress Bars**: Thin horizontal bars showing completion/usage
- **Charts**: Recharts with matching color scheme, tooltips, legends

### Interactive Elements
- **Primary Button**: Filled with brand color, medium rounded corners
- **Secondary Button**: Outlined or ghost style
- **Icon Buttons**: Square, transparent with hover background
- **Search Input**: Magnifying glass icon, rounded-lg, placeholder text

### Code & Terminal
- **Monaco Editor**: Full-height panels with line numbers, syntax highlighting for YAML
- **Log Viewer**: Dark terminal aesthetic, auto-scroll, timestamp prefixes
- **Code Blocks**: Syntax highlighted, copy button, rounded borders

### Modals & Overlays
- **Dialogs**: Centered overlay with backdrop blur, max-w-2xl
- **Slide-overs**: Right-side panels for forms/details, w-1/3 of viewport
- **Tooltips**: Small, subtle on hover with arrow pointer

## Page Layouts

### Dashboard (/)
- 4 stat cards in top row
- Recent runs timeline (list view with status indicators)
- Quick action buttons
- System health indicators footer

### Agents List (/agents)
- Search bar + filters + view toggle (grid/list)
- 3-column grid of agent cards with thumbnails
- Floating "New Agent" button (bottom-right)
- Load more pagination

### Agent Builder (/agents/new)
- Multi-step wizard with progress indicator
- Left panel: Form inputs
- Right panel: Live YAML preview with Monaco editor
- Bottom: Back/Next/Deploy buttons

### Run Monitor (/runs/[id])
- Top: Status banner + metadata (agent, start time, duration)
- Split view: Trace tree (left) + log stream (right)
- Bottom: Token usage chart + cost breakdown

### Template Library (/templates)
- Category filters in sidebar
- 3-column grid of template cards with preview images
- Search bar with tag filters
- "Clone" button on hover

### Settings (/settings)
- Tab navigation (API Keys, Models, Team, Billing)
- Form layouts with labeled sections
- Save/Cancel buttons at bottom

## Animations
**Minimal & Purposeful**: Use sparingly for feedback

- Page transitions: Subtle fade-in (150ms)
- Status changes: Smooth color transitions (200ms)
- Loading states: Skeleton screens, no spinners unless real-time data
- Hover effects: Scale 1.02 on cards, background opacity changes
- **No**: Excessive animations, parallax, unnecessary motion

## Images
**Strategic Placement**:
- **Agent Cards**: Small square thumbnails/icons representing agent type
- **Template Cards**: Preview screenshots of agent configurations
- **Empty States**: Illustrations for "no agents yet" states
- **No Hero Images**: This is a data-dense dashboard, not a marketing site - prioritize information over imagery

## Responsive Behavior
- **Desktop (lg+)**: Full sidebar, multi-column grids, split panels
- **Tablet (md)**: Collapsible sidebar, 2-column grids
- **Mobile (base)**: Hidden sidebar (hamburger menu), single column, stacked layouts

## Accessibility
- WCAG 2.1 AA contrast ratios
- Keyboard navigation for all interactive elements
- Focus indicators on all inputs/buttons
- ARIA labels for icons and status indicators
- Screen reader-friendly table structures