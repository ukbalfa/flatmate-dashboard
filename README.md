# FlatMate Dashboard

> A modern shared-apartment management dashboard — track rent, split expenses, coordinate cleaning, manage tasks, and stay connected with your roommates.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Contributing](#contributing)

---

## Overview

**FlatMate** is a full-featured household management web application designed for shared apartments. It eliminates awkward conversations about money and chores by giving every roommate a single, real-time dashboard — accessible from any device.

Key goals:
- Automated rent reminders and countdowns
- Fair, transparent expense splitting by category
- Auto-rotating cleaning schedules
- Live USD / UZS / EUR exchange rates (refreshed every 10 minutes)
- Shared task management with due dates and assignments
- Roommate contact profiles with Telegram and Instagram links

---

## Features

| Module | Description |
|---|---|
| 🏠 **Dashboard** | Overview of rent due, monthly spending, live exchange rate, announcements, and recent activity |
| 💸 **Expenses** | Add, view, and categorise shared expenses; real-time monthly summary per category |
| 🧹 **Cleaning Schedule** | Weekly cleaning task list; admins can add tasks, anyone can mark them done |
| ✅ **Tasks** | Shared to-do list with due dates, assignees, and Upcoming / Today / Overdue badges |
| 👥 **Roommates** | Profile cards with contact links; admins can create and edit accounts |
| 💱 **Exchange Rates** | Live currency rates from `open.er-api.com` with a built-in converter |
| ⚖️ **Balances** | Overview of who owes what across shared expenses |
| ⚙️ **Settings** | Household configuration managed by admins |
| 🌙 **Dark / Light Mode** | Full theme support via `next-themes` |
| 📱 **Responsive** | Desktop sidebar + mobile overlay navigation |

---

## Tech Stack

### Core

| Package | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2.2 | App Router, Turbopack, SSR/CSR |
| [React](https://react.dev) | 19.2.4 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety (strict mode) |

### UI & Styling

| Package | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first CSS (`@theme inline` in `globals.css`) |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Page transitions, card animations, sidebar |
| [Lucide React](https://lucide.dev) | 1.7.0 | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6 | Dark / light mode |
| [sonner](https://sonner.emilkowal.ski/) | 2 | Toast notifications |

### Backend & Data

| Package | Version | Purpose |
|---|---|---|
| [Firebase](https://firebase.google.com) | 12 | Firestore client SDK |
| [firebase-admin](https://firebase.google.com/docs/admin/setup) | 13 | Server Actions (privileged ops) |
| [open.er-api.com](https://open.er-api.com) | — | Live exchange rates |

---

## Project Structure

```
flatmate-dashboard/
├── app/
│   ├── layout.tsx              # Root layout — Inter font + Providers
│   ├── providers.tsx           # ThemeProvider + Sonner Toaster
│   ├── globals.css             # Tailwind v4 @theme tokens, fm-* classes, animations
│   ├── page.tsx                # Public landing page
│   ├── not-found.tsx           # 404 page
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   ├── layout.tsx          # Sidebar + topbar + theme toggle
│   │   ├── page.tsx            # Dashboard home (metrics, announcements, activity)
│   │   ├── expenses/page.tsx   # Expense tracker
│   │   ├── cleaning/page.tsx   # Cleaning schedule
│   │   ├── tasks/page.tsx      # Task manager
│   │   ├── roommates/page.tsx  # Roommate profiles
│   │   ├── rates/page.tsx      # Exchange rates & converter
│   │   ├── balances/page.tsx   # Expense balances
│   │   └── settings/page.tsx   # Household settings
│   ├── actions/                # Server Actions (firebase-admin)
│   └── components/             # Shared UI components
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── LanguageSwitcher.tsx
│       ├── NotificationsDropdown.tsx
│       ├── Skeleton.tsx
│       └── Spinner.tsx
├── context/
│   └── AuthContext.tsx         # Auth state via React context
├── lib/
│   └── firebase.ts             # Firebase initialisation + exports db
├── firestore.rules             # Firestore security rules
├── firebase.json               # Firebase project config
├── next.config.ts              # Next.js config (Turbopack)
├── tsconfig.json               # TypeScript config (strict)
└── .env.local                  # Firebase credentials (not committed)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- A **Firebase** project with Firestore enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ukbalfa/flatmate-dashboard.git
cd flatmate-dashboard

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Then fill in your Firebase credentials (see below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Environment Variables

Create a `.env.local` file in the project root and populate it with your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Never commit `.env.local` to version control.** It is listed in `.gitignore` by default.

---

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Cloud Firestore** in production mode.
3. Deploy the included Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Create a `users` collection. Each document represents one roommate and should include at minimum:

   | Field | Type | Description |
   |---|---|---|
   | `username` | string | Login username |
   | `password` | string | Login password |
   | `name` | string | Display name |
   | `role` | `"admin"` \| `"roommate"` | Access level |
   | `color` | string | Avatar colour (hex) |
   | `joinedAt` | string | ISO date string |

5. Copy your Firebase project's web app credentials into `.env.local`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create an optimised production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |

---

## Architecture

### Data Flow

```
Browser (React Client Components)
    │
    ├── Firebase Firestore (real-time via onSnapshot / getDocs)
    │       collections: users, expenses, tasks, cleaning,
    │                    announcements, settings
    │
    ├── Server Actions (firebase-admin) — privileged ops only
    │
    └── open.er-api.com — live exchange rates (polled every 10 min)
```

### Auth Model

Authentication is handled client-side:

1. User submits credentials on `/login`.
2. Credentials are verified against the `users` Firestore collection.
3. On success the user document is stored in `localStorage` under the key `"user"`.
4. Every protected page reads `localStorage` on mount and redirects to `/login` if no session is found.
5. Role-based UI (admin vs. roommate) is controlled via the `role` field.

### Theming

- Tailwind CSS v4 theme tokens are defined via `@theme inline` in `app/globals.css`.
- Dark / light mode is managed by `next-themes` through the `ThemeProvider` in `app/providers.tsx`.
- The brand accent colour is `#1D9E75` (`var(--color-accent)`).

### Animations

- **Framer Motion** handles page transitions, card hover effects, staggered list entries, and the mobile sidebar.
- CSS helper classes (`animate-fade-in`, `animate-slide-down`, `stagger-1`–`stagger-4`) are defined in `globals.css` for simpler cases.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Follow the coding conventions in [`AGENTS.md`](./AGENTS.md).
3. Run `npm run lint` before submitting a pull request.
4. Open a pull request with a clear description of your changes.

---

*Built with ❤️ for shared living.*
