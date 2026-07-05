# EduKeep — School Facility Condition & Repair Tracking Portal
### Comprehensive Project Overview

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Tech Stack](#2-tech-stack)
3. [Project Goals & Purpose](#3-project-goals--purpose)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Application Architecture](#5-application-architecture)
6. [Directory Structure](#6-directory-structure)
7. [Pages & Routes](#7-pages--routes)
8. [Database Models & Data Layer](#8-database-models--data-layer)
9. [Authentication & Security](#9-authentication--security)
10. [Server Actions (Backend Logic)](#10-server-actions-backend-logic)
11. [Components Reference](#11-components-reference)
12. [Type System](#12-type-system)
13. [Utility Library](#13-utility-library)
14. [Design System & Theming](#14-design-system--theming)
15. [Issue Lifecycle & Status Workflow](#15-issue-lifecycle--status-workflow)
16. [Issue Categories & Priorities](#16-issue-categories--priorities)
17. [Media Upload (ImageKit)](#17-media-upload-imagekit)
18. [Seed Data & Demo Accounts](#18-seed-data--demo-accounts)
19. [Environment Variables](#19-environment-variables)
20. [Development Scripts](#20-development-scripts)
21. [Deployment Notes](#21-deployment-notes)

---

## 1. Project Summary

**EduKeep** is a production-grade, full-stack web application built for schools to digitally report, track, and resolve facility infrastructure issues. It targets transparency and accountability — giving parents, teachers, and administrators a single unified platform instead of paper forms or fragmented emails.

| Attribute | Value |
|---|---|
| **App Name** | EduKeep |
| **Full Title** | School Facility Condition & Repair Tracking Portal |
| **Platform** | Web (Desktop + Tablet + Mobile) |
| **Framework** | Next.js 16 (App Router) |
| **Database** | MongoDB (with local JSON fallback) |
| **Auth** | Custom JWT (cookie-based) |
| **Media** | ImageKit CDN |
| **Deployment** | Vercel-ready |

The platform solves real problems like:
- Broken desks, damaged classrooms, electrical hazards
- Water leakage and toilet/plumbing maintenance
- Playground damage and safety hazards
- Poor sanitation near cafeteria and common areas
- Broken fans, lights, or AV projectors

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | `16.2.10` | App Router, SSR, Server Components |
| **React** | `19.2.4` | UI rendering |
| **TypeScript** | `^5` | Static typing |
| **Tailwind CSS** | `^4` | Utility-first styling |
| **Framer Motion** | `^12.42.2` | Animations & page transitions |
| **Lucide React** | `^1.23.0` | Icon library |
| **Recharts** | `^3.9.2` | Data visualization (charts) |
| **clsx** | `^2.1.1` | Conditional class names |
| **tailwind-merge** | `^3.6.0` | Safe Tailwind class merging |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js Server Actions** | `16.2.10` | Mutations & business logic |
| **bcryptjs** | `^3.0.3` | Password hashing |
| **jsonwebtoken** | `^9.0.3` | JWT token signing & verification |
| **mongodb** | `^7.4.0` | Primary database driver |
| **imagekit** | `^6.0.0` | Secure media upload signatures |

### Dev Tools
| Tool | Purpose |
|---|---|
| `eslint` + `eslint-config-next` | Code quality linting |
| `@tailwindcss/postcss` | PostCSS integration for Tailwind v4 |
| TypeScript type packages | Type safety for Node, React, JWT, bcrypt |

---

## 3. Project Goals & Purpose

The application is designed to feel like a **premium enterprise SaaS platform** (comparable to Linear, Jira, Notion, or the Vercel Dashboard) — not a student project. Core design goals:

- **Transparency**: Every reported issue is publicly trackable by the reporter in real-time.
- **Accountability**: Status changes, assignments, and comments are logged in a full timeline.
- **Efficiency**: Admins can manage all issues from one dashboard with search, filter, and bulk workflows.
- **Responsiveness**: Fully functional on desktop, tablet, and mobile with an animated sidebar.
- **Dark Mode**: Full light/dark theme switch persisted to `localStorage`, respecting system preference.

---

## 4. User Roles & Permissions

The system has three distinct roles, enforced both at the **middleware** level and within **Server Actions**.

### `parent`
- Register & log in to the portal
- Submit new facility issue reports (with photo/video uploads)
- View their own submitted reports
- Track repair progress and status changes in real-time
- Receive in-app notifications when status changes

### `teacher`
- Everything a parent can do, plus:
- Report classroom-specific issues with room numbers
- View school-wide issue data

### `admin`
- Access the **Admin Panel** (`/admin/*` routes)
- Manage all submitted reports across all users
- Assign repair staff/technicians to issues
- Change issue status through all workflow stages
- Set estimated completion dates
- Manage all portal users (view, role info)
- View rich analytics dashboards with charts
- Delete issues

> **Note**: Admin users are redirected to `/admin/dashboard` upon login. Non-admin users who attempt to visit `/admin/*` are redirected to `/dashboard` by the middleware.

---

## 5. Application Architecture

```
Browser (Client Components)
       |
Next.js App Router (Server Components + Server Actions)
       |
Authentication Layer (JWT + httpOnly Cookies)
       |
DB Abstraction Layer (src/lib/db.ts — DB class)
       |          |
MongoDB Atlas     JSON File (src/data/db.json — fallback)
                  |
            ImageKit CDN (Media Storage)
```

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **Server Actions for all mutations** | Avoids building a separate REST API layer; keeps auth and DB logic server-side |
| **Dual DB strategy** | `MONGODB_URI` in env → MongoDB Atlas; missing → auto-falls back to `src/data/db.json`, making local dev zero-config |
| **Custom JWT (not NextAuth)** | Lighter weight; full control over token payload and cookie settings |
| **Edge-compatible middleware** | Custom `decodeJwt()` in middleware uses `atob()` to avoid Node.js dependencies in the Edge Runtime |
| **`DB` static class** | Single abstraction point; swap MongoDB & JSON without touching any page/action code |

---

## 6. Directory Structure

```
School Facility Condition Reporting/
|-- src/
|   |-- app/                          # Next.js App Router
|   |   |-- layout.tsx                # Root layout (fonts, ThemeProvider)
|   |   |-- globals.css               # Global CSS, design tokens, dark mode
|   |   |-- page.tsx                  # Public landing page (/)
|   |   |-- actions.ts                # All Server Actions (auth, issues, notifications)
|   |   |-- login/
|   |   |   |-- page.tsx              # Login page
|   |   |-- register/
|   |   |   |-- page.tsx              # Registration page
|   |   |-- dashboard/                # User dashboard (parent/teacher)
|   |   |   |-- layout.tsx            # Dashboard layout (loads user & notifications)
|   |   |   |-- page.tsx              # User dashboard home
|   |   |   |-- report/
|   |   |   |   |-- page.tsx          # Report a new issue (full form)
|   |   |   |-- my-reports/
|   |   |   |   |-- page.tsx          # My reports listing page
|   |   |   |   |-- MyReportsClient.tsx
|   |   |   |-- reports/
|   |   |   |   |-- [id]/
|   |   |   |       |-- page.tsx      # Report detail (server)
|   |   |   |       |-- ReportDetailsClient.tsx
|   |   |   |-- notifications/
|   |   |       |-- page.tsx          # Notifications page
|   |   |       |-- NotificationsClient.tsx
|   |   |-- admin/                    # Admin panel
|   |       |-- layout.tsx            # Admin layout (admin-only guard)
|   |       |-- dashboard/
|   |       |   |-- page.tsx
|   |       |   |-- AdminDashboardClient.tsx
|   |       |-- issues/
|   |       |   |-- page.tsx
|   |       |   |-- AdminIssuesClient.tsx
|   |       |-- users/
|   |       |   |-- page.tsx
|   |       |   |-- AdminUsersClient.tsx
|   |       |-- analytics/
|   |           |-- page.tsx
|   |           |-- AdminAnalyticsClient.tsx
|-- components/
|   |-- layout/
|   |   |-- DashboardLayout.tsx   # Wrapper: sidebar + navbar + toast
|   |   |-- Sidebar.tsx           # Left sidebar with nav & role-based menu
|   |   |-- TopNavbar.tsx         # Top bar: title, search, notifications, profile
|   |-- ui/
|       |-- Badge.tsx             # Status & priority badge component
|       |-- Card.tsx              # Reusable card wrapper
|       |-- Modal.tsx             # Generic modal dialog
|       |-- Timeline.tsx          # Issue history/timeline display
|       |-- Toast.tsx             # Toast notification system (context + component)
|-- context/
|   |-- ThemeContext.tsx          # Light/dark theme context + provider
|-- data/
|   |-- db.json                   # Local JSON database (auto-created from seed)
|-- lib/
|   |-- auth.ts                   # JWT sign/verify, cookie helpers, getCurrentUser()
|   |-- constants.ts              # Shared constants (DEFAULT_AVATAR URL)
|   |-- db.ts                     # DB class — MongoDB + JSON dual-mode data layer
|   |-- seedData.ts               # Demo user, issue, timeline & notification data
|   |-- utils.ts                  # cn(), formatDate(), formatTimeAgo()
|-- middleware.ts                  # Route protection + role-based redirects (Edge)
|-- types/
    |-- index.ts                  # All TypeScript interfaces and type aliases
|-- public/                           # Static assets (favicon, etc.)
|-- .env.example                      # Environment variable template
|-- .env.local                        # Local secrets (gitignored)
|-- next.config.ts                    # Next.js configuration
|-- tsconfig.json                     # TypeScript configuration
|-- eslint.config.mjs                 # ESLint config
|-- postcss.config.mjs                # PostCSS (Tailwind v4)
|-- package.json                      # Dependencies & scripts
|-- Project_Idea.md                   # Original design specification
|-- School_Facility_Condition_Reporting_PRD.md  # Product Requirements Document
|-- PROJECT_OVERVIEW.md               # This file
```

---

## 7. Pages & Routes

### Public Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing page — hero, features, how it works, statistics, CTA |
| `/login` | `src/app/login/page.tsx` | Login form — email, password, validation, role-aware redirect |
| `/register` | `src/app/register/page.tsx` | Registration — name, email, password, role, school code |

### User Dashboard Routes (`/dashboard/*`)
> Requires authentication. All layouts load the current user + notifications via Server Components.

| Route | File | Description |
|---|---|---|
| `/dashboard` | `src/app/dashboard/page.tsx` | Home dashboard — stats cards, charts, recent issues, quick actions |
| `/dashboard/report` | `src/app/dashboard/report/page.tsx` | Report Issue form — full multi-section form with ImageKit upload |
| `/dashboard/my-reports` | `src/app/dashboard/my-reports/` | My submitted reports — searchable, filterable table with status badges |
| `/dashboard/reports/[id]` | `src/app/dashboard/reports/[id]/` | Report detail — full info, status, timeline, images, comments |
| `/dashboard/notifications` | `src/app/dashboard/notifications/` | Notification feed — unread/read, mark-as-read |

### Admin Panel Routes (`/admin/*`)
> Requires authentication **and** `role === 'admin'`. Non-admins are redirected to `/dashboard`.

| Route | File | Description |
|---|---|---|
| `/admin/dashboard` | `src/app/admin/dashboard/` | Admin overview — system-wide stats, charts, recent activity |
| `/admin/issues` | `src/app/admin/issues/` | Issue management — all reports, assign staff, update status, delete |
| `/admin/users` | `src/app/admin/users/` | User management — all registered users, roles, school info |
| `/admin/analytics` | `src/app/admin/analytics/` | Analytics — bar/pie/area/line charts, category & priority breakdown |

---

## 8. Database Models & Data Layer

### TypeScript Interfaces (`src/types/index.ts`)

#### `User`
```typescript
interface User {
  id: string;           // "usr_" + random 8-char UUID slice
  name: string;
  email: string;
  password?: string;    // bcrypt hash (omitted from returned objects)
  role: UserRole;       // 'parent' | 'teacher' | 'admin'
  schoolId: string;     // Must match "SCH-88291" to register
  avatar: string;       // URL — defaults to DEFAULT_AVATAR from constants.ts
  createdAt: string;    // ISO date string
}
```

#### `Issue`
```typescript
interface Issue {
  id: string;                    // "iss_" + random 8-char UUID slice
  title: string;
  description: string;
  category: IssueCategory;       // see section 16
  priority: IssuePriority;       // 'low' | 'medium' | 'high' | 'critical'
  location: string;              // Free text, e.g. "Block B, 1st Floor"
  building: string;
  room: string;
  status: IssueStatus;           // see section 15
  images: string[];              // Array of ImageKit URLs
  videos: string[];              // Array of ImageKit URLs
  createdBy: string;             // User ID
  createdByName?: string;        // Cached for display
  createdByRole?: UserRole;      // Cached for display
  assignedTo?: string;           // Staff/technician name
  estimatedCompletion?: string;  // ISO date string
  createdAt: string;             // ISO date string
}
```

#### `TimelineEvent`
```typescript
interface TimelineEvent {
  id: string;          // "tm_" + random 8-char UUID slice
  issueId: string;
  action: string;      // Human-readable e.g. "Assigned to John Doe"
  updatedBy: string;   // User's display name
  timestamp: string;   // ISO date string
}
```

#### `Notification`
```typescript
interface Notification {
  id: string;          // "not_" + random 8-char UUID slice
  userId: string;      // Recipient user ID
  title: string;
  message: string;
  read: boolean;
  createdAt: string;   // ISO date string
}
```

### DB Class (`src/lib/db.ts`)

The `DB` static class provides a unified API that automatically routes between **MongoDB** and the **local JSON file** depending on whether `MONGODB_URI` is set.

| Method | Description |
|---|---|
| `DB.getUsers()` | Fetch all users |
| `DB.getUser(id)` | Fetch single user by ID |
| `DB.getUserByEmail(email)` | Fetch user by email (case-insensitive) |
| `DB.addUser(user)` | Insert a new user |
| `DB.updateUser(id, updates)` | Partial update on a user |
| `DB.getIssues()` | Fetch all issues |
| `DB.getIssue(id)` | Fetch single issue |
| `DB.addIssue(issue)` | Insert a new issue |
| `DB.updateIssue(id, updates)` | Partial update on an issue |
| `DB.deleteIssue(id)` | Delete issue + all its timeline events |
| `DB.getTimelines(issueId)` | Fetch timeline events for an issue (sorted desc) |
| `DB.addTimeline(event)` | Insert a timeline event |
| `DB.getNotifications(userId)` | Fetch user's notifications (sorted desc) |
| `DB.addNotification(notif)` | Insert a notification |
| `DB.markNotificationAsRead(id)` | Mark single notification as read |
| `DB.markAllNotificationsAsRead(userId)` | Mark all of a user's notifications as read |

**MongoDB Details:**
- Database name: `school_facilities`
- Collections: `users`, `issues`, `timelines`, `notifications`
- Auto-seeded on first connection (if `users` collection is empty)
- Custom DNS override to `8.8.8.8` / `1.1.1.1` to prevent `querySrv ECONNREFUSED` on some local setups

**JSON Fallback Details:**
- Path: `src/data/db.json`
- Auto-created from `getSeedData()` if the file does not exist
- Corrupted JSON resets automatically to seed data

---

## 9. Authentication & Security

### JWT Authentication (`src/lib/auth.ts`)

- **Algorithm**: HS256 (jsonwebtoken default)
- **Secret**: `JWT_SECRET` env var (falls back to hardcoded dev key)
- **Expiry**: 7 days
- **Cookie**: `school_facility_session` (httpOnly, SameSite: lax, Secure in production)

#### Token Payload
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'parent' | 'teacher' | 'admin';
  name: string;
}
```

#### Helper Functions
| Function | Purpose |
|---|---|
| `signToken(payload)` | Create a signed JWT |
| `verifyToken(token)` | Verify and decode a JWT |
| `getCurrentUser()` | Read cookie → verify → fetch full user from DB |
| `setAuthCookie(token)` | Write the session cookie |
| `removeAuthCookie()` | Delete the session cookie (logout) |

### Middleware (`src/middleware.ts`)

The middleware runs on the **Edge Runtime** and protects all dashboard and admin routes.

```
Matcher: /dashboard/:path*, /admin/:path*, /login, /register
```

**Logic flow:**
1. Check for `school_facility_session` cookie
2. If accessing `/dashboard` or `/admin` without a valid token — redirect to `/login?callbackUrl=...`
3. If token is expired — delete cookie + redirect to `/login`
4. If accessing `/admin` with a non-admin role — redirect to `/dashboard`
5. If accessing `/login` or `/register` while already authenticated — redirect to appropriate dashboard

> **Edge compatibility note**: A custom `decodeJwt()` using `atob()` is used instead of `jsonwebtoken` because the middleware runs in the Next.js Edge Runtime which does not have full access to Node.js APIs.

### School Registration Code

Registration requires a valid **School Registration Code**. Currently hardcoded as:

```
SCH-88291
```

This acts as a school-scoped access gate. Invalid codes return: *"Invalid School Registration Code. Please contact school administration."*

---

## 10. Server Actions (Backend Logic)

All mutations go through Next.js Server Actions defined in `src/app/actions.ts`.

### Auth Actions

| Action | Description |
|---|---|
| `loginAction(formData)` | Validate credentials, sign JWT, set cookie, redirect by role |
| `logoutAction()` | Delete session cookie, redirect to `/login` |
| `registerAction(formData)` | Validate school code, hash password, create user, auto-login |

### Issue Actions

| Action | Description |
|---|---|
| `createIssueAction(data)` | Create issue, add timeline event, notify all admins |
| `assignTechnicianAction(issueId, staffName, estimatedCompletion)` | Admin: assign staff, update status to `assigned`, notify reporter |
| `updateIssueStatusAction(issueId, status, actionDetails?)` | Update status, log timeline, notify reporter (if updated by admin) |
| `addCommentAction(issueId, message)` | Add comment as a timeline event, notify counterpart |

### Notification Actions

| Action | Description |
|---|---|
| `markNotificationReadAction(id)` | Mark one notification as read, revalidate paths |
| `markAllNotificationsReadAction(userId)` | Mark all as read, revalidate paths |

### Media Action

| Action | Description |
|---|---|
| `getImageKitAuthenticationAction()` | Generate HMAC-SHA1 signature for client-side ImageKit uploads |

### Path Revalidation

After each mutation, `revalidatePath()` is called on all affected Next.js routes to ensure Server Components re-fetch fresh data without a full page reload.

---

## 11. Components Reference

### Layout Components (`src/components/layout/`)

#### `DashboardLayout.tsx`
The root shell for all authenticated pages. Wraps content with:
- `<ToastProvider>` — global toast notification system
- `<Sidebar>` — left navigation
- `<TopNavbar>` — top bar
- `<motion.div>` — page enter animation (fade + slide up, 0.35s ease-out)

Props: `user`, `notifications`, `children`

#### `Sidebar.tsx`
Fixed left sidebar (`w-64`) with:
- **Logo**: School icon + "EduKeep" brand name
- **User card**: Avatar, name, role badge
- **Navigation**: Role-filtered menu items with active-state highlighting
- **Bottom panel**: Light/Dark mode toggle + Sign Out button
- **Mobile**: Translates off-screen; toggled by hamburger; overlay backdrop

**Navigation Items by Role:**

| Item | Route | Roles |
|---|---|---|
| Dashboard | `/dashboard` or `/admin/dashboard` | All |
| Report Issue | `/dashboard/report` | parent, teacher |
| My Reports | `/dashboard/my-reports` | parent, teacher |
| Notifications | `/dashboard/notifications` | All |
| Issue Management | `/admin/issues` | admin |
| User Management | `/admin/users` | admin |
| Analytics & Reports | `/admin/analytics` | admin |

#### `TopNavbar.tsx`
Sticky top header (`h-16`) with:
- Hamburger button (mobile only)
- Dynamic page title (derived from current `pathname`)
- Search input (desktop — placeholder UI)
- **Notifications popover**: Unread count badge (animated bounce), dropdown with mark-as-read per item
- **Profile dropdown**: User name/email, "My Account" link, Sign Out button

---

### UI Components (`src/components/ui/`)

#### `Badge.tsx`
Multi-variant badge component used throughout tables and detail views.

| Variant | Usage |
|---|---|
| `default` | Generic primary-colored label |
| `outline` | Neutral bordered label |
| `status` | Color-coded by `IssueStatus` |
| `priority` | Color-coded by `IssuePriority` |

**Status badge colors:**
| Status | Color |
|---|---|
| `reported` | Blue |
| `under_review` | Purple |
| `assigned` | Cyan |
| `in_progress` | Amber |
| `resolved` | Green |
| `closed` | Gray |

**Priority badge colors:**
| Priority | Color | Extra |
|---|---|---|
| `low` | Slate | — |
| `medium` | Blue | — |
| `high` | Orange | — |
| `critical` | Red | `animate-pulse` |

#### `Card.tsx`
Reusable styled card container with border, shadow, and background tokens.

#### `Modal.tsx`
Generic modal dialog with backdrop overlay and close button.

#### `Timeline.tsx`
Renders a vertical list of `TimelineEvent` objects for issue detail pages. Shows action text, actor name, and formatted timestamp.

#### `Toast.tsx`
Context-based toast notification system.
- `ToastProvider` wraps the layout
- `useToast()` hook returns `showToast(message, type)` where type is `success | error | info | warning`
- Auto-dismisses after a timeout

---

## 12. Type System

All TypeScript types and interfaces are exported from `src/types/index.ts`:

```typescript
// Role union
type UserRole = 'parent' | 'teacher' | 'admin';

// Issue categories (10 options)
type IssueCategory =
  | 'Furniture' | 'Electrical' | 'Water Supply'
  | 'Toilets' | 'Sanitation' | 'Playground'
  | 'Building Damage' | 'Classroom' | 'Security' | 'Others';

// Priority levels (4 levels)
type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

// Status workflow (6 stages)
type IssueStatus =
  | 'reported' | 'under_review' | 'assigned'
  | 'in_progress' | 'resolved' | 'closed';

// Main interfaces
interface User { ... }
interface Issue { ... }
interface TimelineEvent { ... }
interface Notification { ... }
```

---

## 13. Utility Library

Located in `src/lib/utils.ts` and `src/lib/constants.ts`.

### `cn(...inputs)` — Class Name Merger
```typescript
// Combines clsx + tailwind-merge for safe conditional Tailwind class application
cn('base-class', condition && 'conditional-class', 'override-class')
```

### `formatDate(dateString)` — Full Date & Time
```typescript
// Output: "Jul 5, 2026, 08:30 AM"
formatDate('2026-07-05T08:30:00Z')
```

### `formatTimeAgo(dateString)` — Relative Time
```typescript
// Output: "just now" | "5m ago" | "3h ago" | "2d ago" | "Jun 15"
formatTimeAgo('2026-07-05T08:25:00Z')
```

### `DEFAULT_AVATAR` — Fallback Avatar URL
```typescript
// Used when user.avatar is empty/null
export const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/1f/a1/66/1fa166b8be7105927a3af53cc8891458.jpg';
```

---

## 14. Design System & Theming

### Fonts
- **Sans**: Geist (Google Fonts) via `next/font/google`
- **Mono**: Geist Mono

### CSS Custom Properties (Design Tokens)

Defined in `src/app/globals.css` using Tailwind v4's `@theme` directive:

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--background` | `#f8fafc` | `#0b0f19` |
| `--foreground` | `#0f172a` | `#f8fafc` |
| `--card` | `#ffffff` | `#151c2c` |
| `--card-foreground` | `#0f172a` | `#f8fafc` |
| `--border` | `#e2e8f0` | `#222d44` |
| `--primary` | `#2563eb` | `#3b82f6` |
| `--primary-hover` | `#1d4ed8` | `#2563eb` |
| `--success` | `#16a34a` | `#22c55e` |
| `--warning` | `#f59e0b` | `#f59e0b` |
| `--danger` | `#dc2626` | `#ef4444` |
| `--muted` | `#64748b` | `#94a3b8` |
| `--muted-background` | `#f1f5f9` | `#1e293b` |

### Dark Mode

Managed by `ThemeContext` (`src/context/ThemeContext.tsx`):
- Reads `localStorage.getItem('theme')` on mount
- Falls back to system preference via `window.matchMedia('(prefers-color-scheme: dark)')`
- Toggles the `dark` class on `<html>` element
- `toggleTheme()` exposed to the entire app via `useTheme()` hook
- Toggle button in the Sidebar bottom panel

### Glassmorphism
A `.glass-panel` utility class is provided:
```css
/* Light: white glass */
.glass-panel { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); }

/* Dark: dark glass */
.dark .glass-panel { background: rgba(21,28,44,0.7); backdrop-filter: blur(10px); }
```
Used in the TopNavbar notifications dropdown.

### Animations
- **Page transitions**: Framer Motion fade + Y slide in `DashboardLayout`
- **Sidebar**: CSS `transition-transform duration-300 ease-in-out`
- **Notification badge**: `animate-bounce` on unread count
- **Critical priority badge**: `animate-pulse` on the badge
- **Body theme transition**: `transition: background-color 0.2s ease, color 0.2s ease`

---

## 15. Issue Lifecycle & Status Workflow

Issues progress through these states, each with admin-controlled transitions:

```
Reported  →  Under Review  →  Assigned  →  In Progress  →  Resolved  →  Closed
```

| Status | Trigger | Actor |
|---|---|---|
| `reported` | Issue submitted | Parent / Teacher |
| `under_review` | Admin reviews the submission | Admin |
| `assigned` | Admin assigns a technician | Admin (via `assignTechnicianAction`) |
| `in_progress` | Repair work has started | Admin |
| `resolved` | Repair is complete | Admin |
| `closed` | Issue is officially closed | Admin only |

Every status transition automatically:
1. Updates the issue document in the database
2. Appends an entry to the issue's timeline
3. Sends an in-app notification to the original reporter

---

## 16. Issue Categories & Priorities

### Categories (10 options)
`Furniture` · `Electrical` · `Water Supply` · `Toilets` · `Sanitation` · `Playground` · `Building Damage` · `Classroom` · `Security` · `Others`

### Priorities
| Priority | Use Case |
|---|---|
| `low` | Minor cosmetic or convenience issues |
| `medium` | Issues affecting comfort or minor functionality |
| `high` | Issues impacting teaching or learning |
| `critical` | Safety hazards requiring immediate attention |

---

## 17. Media Upload (ImageKit)

Media uploads (images and videos) use **ImageKit** as the CDN.

### Upload Flow
1. User selects files in the Report Issue form
2. Client calls `getImageKitAuthenticationAction()` (Server Action)
3. Server generates an HMAC-SHA1 signature using the private key
4. Client uploads directly to ImageKit CDN with the token/signature/expire triplet
5. ImageKit returns a URL, which is stored in the `Issue.images[]` or `Issue.videos[]` array

### Required Environment Variables
```
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxx
IMAGEKIT_PRIVATE_KEY=private_xxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxxx
```

> If ImageKit is not configured, media upload features will return an error but the rest of the application functions normally.

---

## 18. Seed Data & Demo Accounts

On first run (no `db.json` / empty MongoDB), the app auto-seeds realistic demo data via `src/lib/seedData.ts`.

### Demo User Accounts

| Role | Email | Password | Name |
|---|---|---|---|
| **Admin** | `admin@school.com` | `admin123` | Principal Sarah Jenkins |
| **Teacher** | `teacher@school.com` | `teacher123` | Mr. David Miller |
| **Parent** | `parent@school.com` | `parent123` | Elena Rostova |

All demo users belong to school `SCH-88291`.

### Sample Issues Included in Seed Data
- Water leakage in Block B Girls restroom (Critical, In Progress)
- Broken classroom fan in Grade 7-A (High, Assigned)
- Damaged desks in Grade 5 classroom (Medium, Reported)
- Electrical short circuit near science lab (Critical, Resolved)
- Broken playground swing (High, Reported)
- Poor sanitation near cafeteria (Medium, Under Review)
- Broken classroom projector in Hall C (Low, Closed)
- Cracked wall in Building D corridor (Medium, In Progress)

---

## 19. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

```bash
# MongoDB (leave blank to use local JSON file fallback)
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/school_facilities

# JWT Secret (change in production!)
JWT_SECRET=your_secret_key_here

# ImageKit (required for media uploads)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxxxx
```

| Variable | Required | Default / Notes |
|---|---|---|
| `MONGODB_URI` | Optional | Falls back to `src/data/db.json` if absent |
| `JWT_SECRET` | Recommended | Hardcoded dev key (NOT safe for production) |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | For uploads | — |
| `IMAGEKIT_PRIVATE_KEY` | For uploads | — |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | For uploads | — |

---

## 20. Development Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Run ESLint
npm run lint
```

The app runs on **http://localhost:3000** by default.

---

## 21. Deployment Notes

The project is configured for **Vercel** deployment:

- No special `next.config.ts` changes are required
- Set all environment variables in the Vercel project settings
- MongoDB Atlas is the recommended database for production
- ImageKit is required for media uploads in production
- The `src/data/db.json` local file fallback will **not** persist between Vercel serverless function invocations — always use MongoDB in production

### Production Checklist
- [ ] Set a strong, unique `JWT_SECRET`
- [ ] Configure `MONGODB_URI` pointing to Atlas
- [ ] Add ImageKit credentials if media uploads are needed
- [ ] Ensure `NODE_ENV=production` (Vercel sets this automatically)
- [ ] Change the hardcoded school registration code `SCH-88291` if deploying for multiple schools

---

*Last updated: July 2026 — EduKeep v0.1.0*
