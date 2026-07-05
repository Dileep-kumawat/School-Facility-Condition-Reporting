# 🏫 EduKeep — School Facility Condition & Repair Tracking Portal

[![Live Link](https://img.shields.io/badge/Live_Link-https%3A%2F%2Fedu--keep.vercel.app-00C9A7?style=for-the-badge&logo=vercel)](https://school-facility-condition-reporting.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-F024B6?style=for-the-badge&logo=framer)](https://framer.com/motion)

**EduKeep** is a professional-grade, full-stack web application designed for educational institutions to report, track, and resolve facility infrastructure issues in real-time. It eliminates fragmented emails, paper forms, and delays by providing parents, teachers, and school administrators with a unified, transparent, and accountability-driven maintenance management portal.

🔗 **Explore Live Application**: [https://school-facility-condition-reporting.vercel.app/](https://school-facility-condition-reporting.vercel.app/)

---

## 📌 Table of Contents
1. [Context & Problem Statement](#-context--problem-statement)
2. [Key Features](#-key-features)
3. [Demo Accounts](#-demo-accounts)
4. [System Architecture](#%EF%B8%8F-system-architecture)
5. [Tech Stack](#-tech-stack)
6. [Issue Lifecycle & Status Workflow](#-issue-lifecycle--status-workflow)
7. [Environment Variables](#-environment-variables)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
9. [Project Directory Layout](#-project-directory-layout)
10. [Deployment Notes](#-deployment-notes)

---

## 🔍 Context & Problem Statement

Many educational institutions struggle to maintain infrastructure due to a lack of structured reporting systems. Broken furniture, electrical hazards, water leakages, and classroom damages often go unnoticed or experience delayed repairs. 

**EduKeep** solves these challenges by providing:
* **Centralization**: A single, digital ledger of all school facility issues.
* **Accountability**: Real-time status logging and detailed transition timelines.
* **Efficiency**: Role-based views allowing administrators to immediately prioritize and assign issues to technicians.
* **Engagement**: Parents and teachers actively participating in the upkeep of their children's learning environments.

---

## ✨ Key Features

### 👥 Role-Based Portals & Permissions
EduKeep has three distinct user roles, protected securely via JWT middleware:
* **👨‍👩‍👦 Parents**:
  * Register & associate accounts with a specific school using a Registration Code.
  * Submit new facility reports with descriptions, locations, priorities, and photo/video attachments.
  * Monitor the repair status of their submitted issues and receive in-app notifications.
* **👩‍🏫 Teachers**:
  * Access all Parent features plus classroom-specific reporting capabilities (room/hall numbers).
  * Access a read-only list of all school-wide issue reports to coordinate classroom scheduling.
* **🛡️ School Administrators (Admins)**:
  * Redirected automatically to a dedicated Admin dashboard.
  * Track global metrics (open vs. resolved issues, average resolution times, category breakdowns).
  * Manage, assign technicians, update estimated completion dates, transition statuses, or delete issues.
  * Manage users and track user registration metrics.

### 🎨 Premium User Experience & Aesthetics
* **Dynamic Dark/Light Mode**: Full theme switching persisted to `localStorage` and synchronized with the system's preferences.
* **Glassmorphism Panels**: Modern UI layout with sleek backdrop blur, gradients, and curated color palettes.
* **Micro-Animations**: Page transitions, interactive sidebar items, pulsing critical alerts, and bouncy notification badges powered by `framer-motion`.
* **Responsive Layout**: Designed mobile-first, ensuring usability on smartphones, tablets, and desktops.

### ⚡ Technical Underpinnings
* **Zero-Config Fallback DB**: Connects to **MongoDB Atlas** in production but dynamically falls back to a **local JSON database** (`src/data/db.json`) during local development if no URI is supplied.
* **Secure Auth Layer**: HttpOnly cookie-based JWT authentication with edge-compatible base64 JWT decoding in Next.js Middleware.
* **On-Demand Media CDN**: Direct-to-provider upload via **ImageKit CDN** using secure server-side HMAC signatures, avoiding server bottlenecks.

---

## 🔑 Demo Accounts

To experience the platform instantly without registering a new school or user, log in using one of the pre-seeded credentials below:

| Role | Email Address | Password | Sample User Name | School ID |
|:---|:---|:---|:---|:---|
| **🛡️ Administrator** | `admin@school.com` | `admin123` | Principal Sarah Jenkins | `SCH-88291` |
| **👩‍🏫 Teacher** | `teacher@school.com` | `teacher123` | Mr. David Miller | `SCH-88291` |
| **👨‍👩‍👦 Parent** | `parent@school.com` | `parent123` | Elena Rostova | `SCH-88291` |

*Note: All demo accounts belong to the seed school code **`SCH-88291`**.*

---

## 🛠️ System Architecture

The following diagram illustrates how the frontend components, API Server Actions, authentication middleware, and database layers connect:

```
                  +----------------------------------------------+
                  |         Web Browser (React/Client)           |
                  +----------------------+-----------------------+
                                         |
                                         |  HTTPS Request & Cookies
                                         v
                  +----------------------------------------------+
                  |           Next.js Edge Middleware            |
                  |     (JWT Cookie Verification & Guard)        |
                  +----------------------+-----------------------+
                                         |
                                         |  Authorized Route Context
                                         v
                  +----------------------------------------------+
                  |        Next.js App Router & Actions          |
                  |     (Server Components & Mutations)          |
                  +-----------+----------------------+-----------+
                              |                      |
             Media Uploads    |                      | DB Queries &
             & Signatures     v                      v Connections
     +----------------------------------+  +----------------------------------+
     |     ImageKit Cloud Media CDN     |  |       DB Layer (Abstracted)      |
     |  (Direct client-to-cloud upload) |  |   (src/lib/db.ts DB Wrapper)     |
     +----------------------------------+  +--------+----------------+--------+
                                                    |                |
                                     (If MONGODB_URI|                | (No Env
                                         is present)|                |  Config)
                                                    v                v
                                           +----------------+ +---------------+
                                           | MongoDB Atlas  | |  Local Database|
                                           | (Production DB)| | (src/data/db.  |
                                           |                | |   json File)  |
                                           +----------------+ +---------------+
```

---

## 💻 Tech Stack

| Component | Technology | Purpose |
|:---|:---|:---|
| **Frontend Core** | [Next.js 16 (App Router)](https://nextjs.org/) | Framework for SSR, layouts, routing, and Server Actions |
| **Styling** | [Tailwind CSS v4.0](https://tailwindcss.com/) & CSS Variables | Utility-first responsive styling and HSL-based dark mode tokens |
| **Animations** | [Framer Motion v12](https://framer.com/motion) | Smooth page transitions, sidebars, and micro-interactions |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean SVG icons used throughout navigation and cards |
| **Charts** | [Recharts](https://recharts.org/) | Responsive SVG charts for the Admin analytics dashboard |
| **Database** | [MongoDB](https://www.mongodb.com/) / JSON File | Dual-mode data persistence for users, issues, notifications, and timelines |
| **Media CDN** | [ImageKit](https://imagekit.io/) | Fast media processing, hosting, and secure uploads |
| **Auth** | Custom JWT + BcryptJS | Secure password hashing and cookie-based authorization |

---

## 🔄 Issue Lifecycle & Status Workflow

Every reported issue undergoes a structured, admin-driven lifecycle. Status changes automatically record timeline events and push in-app alerts to the reporter.

```
+------------+      +---------------+      +------------+      +-------------+      +------------+      +----------+
|  Reported  | ---> | Under Review  | ---> |  Assigned  | ---> | In Progress | ---> |  Resolved  | ---> |  Closed  |
+------------+      +---------------+      +------------+      +-------------+      +------------+      +----------+
      ^                     ^                      |                  |                    |                  |
      |                     |                      |                  |                    |                  |
(User submits)       (Admin reviews)        (Technician        (Repair begins)       (Work done;          (Admin
                                             notified)                                user notified)       archives)
```

### 📋 Issue Details & Setup Configurations
* **10 Categories**: `Furniture`, `Electrical`, `Water Supply`, `Toilets`, `Sanitation`, `Playground`, `Building Damage`, `Classroom`, `Security`, `Others`.
* **4 Priorities**:
  * 🟢 **Low**: Minor cosmetic or non-functional items.
  * 🟡 **Medium**: Comfort issues, minor functionality impact.
  * 🟠 **High**: Directly affects teaching, learning, or accessibility.
  * 🔴 **Critical**: Safety/security hazard requiring immediate attention.

---

## ⚙️ Environment Variables

Copy `.env.example` to create `.env.local` in your root folder and set the following credentials:

```bash
# ==========================================
# Database Configuration
# ==========================================
# MongoDB URI for production. Leave blank to run with local JSON database fallback.
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/school_facilities

# ==========================================
# Authentication
# ==========================================
# Secret key used for signing JWT login tokens
JWT_SECRET=your-32-character-secret-key-goes-here

# ==========================================
# Media Storage (ImageKit Configuration)
# ==========================================
# Credentials required for photo and video attachments
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint_id
```

---

## 🚀 Getting Started & Local Setup

Get your local copy of EduKeep up and running in minutes by following these simple steps:

### 1. Prerequisites
Ensure you have **Node.js (v18.x or v20.x)** and **npm** installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/Dileep-kumawat/School-Facility-Condition-Reporting.git
cd School-Facility-Condition-Reporting
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Duplicate `.env.example` and name the new file `.env.local`:
```bash
cp .env.example .env.local
```
*Note: If you leave `MONGODB_URI` blank, the application automatically initializes and seeds a local JSON file (`src/data/db.json`) on your first boot, making local development zero-setup.*

### 5. Launch the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. The database will automatically seed with the default demo accounts and 8 sample issues if empty.

---

## 📂 Project Directory Layout

The workspace is organized following standard Next.js conventions with clean feature boundaries:

```
School-Facility-Condition-Reporting/
├── src/
│   ├── app/                          # Next.js App Router (Pages, Routing & Server Actions)
│   │   ├── actions.ts                # Server Actions (Auth mutations, issue reports, notifications)
│   │   ├── layout.tsx                # App root layout, fonts, and ThemeProvider
│   │   ├── page.tsx                  # Public marketing & Landing page
│   │   ├── login/                    # Login page logic
│   │   ├── register/                 # Register page logic
│   │   ├── dashboard/                # Main Parent & Teacher Dashboard routes
│   │   └── admin/                    # Admin analytics and ticket management panels
│   ├── components/                   # UI and layout component inventory
│   │   ├── layout/                   # Sidebar, Navbar, and Toast containers
│   │   └── ui/                       # Reusable Badges, Modals, Cards, and Timelines
│   ├── context/                      # Global UI providers (Theme Context)
│   ├── data/                         # Local database JSON file location (fallback mode)
│   ├── lib/                          # Backend utilities, DB connectors, and seed engines
│   │   ├── db.ts                     # Dual DB switcher engine (MongoDB vs JSON-file)
│   │   ├── auth.ts                   # Token signing, reading, and cookie storage logic
│   │   └── seedData.ts               # Core database seeder containing mock data
│   └── types/                        # Main TypeScript interfaces (Issue, User, Timeline, Alert)
├── public/                           # Static assets (favicons, public images)
├── middleware.ts                     # Edge-compatible security route guardian
├── next.config.ts                    # Next.js bundler settings
├── tailwind.config.ts                # Tailwind integration configuration
└── package.json                      # Dev scripts and dependency declarations
```

---

## ☁️ Deployment Notes

### Deplaying to Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. In the project settings, configure the environment variables:
   * Add `MONGODB_URI` (Vercel serverless functions are stateless, so the local JSON fallback `db.json` is not persistent in production).
   * Add `JWT_SECRET`.
   * Add ImageKit credentials (`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`).
4. Click **Deploy**.

---

*Made with ❤️ by [Dileep Kumawat](https://github.com/Dileep-kumawat)*
