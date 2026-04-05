# Project Analysis: FlatMate Dashboard

---

## Project Overview

- Next.js 16 (App Router) TypeScript project named "FlatMate" — a flatmate / rental management dashboard.
- Client-first architecture: UI in `app/`, Firebase Firestore for data, lightweight client-side auth (localStorage), currency rates via an external REST API.
- Primary user flows implemented: login, dashboard, exchange rates, expenses, cleaning schedule, tasks, roommates management.

## Tech Stack & Dependencies

- Frameworks / runtime:
  - next 16.2.2, react 19.2.4, typescript 5
- UI / styling / UX:
  - tailwindcss v4, custom `globals.css` (uses `@theme inline`), framer-motion, lucide-react, sonner (toasts)
- Data / networking:
  - firebase 12.x (Firestore), external fetch to open.er-api.com for exchange rates
- Dev / tooling:
  - eslint, eslint-config-next, @tailwindcss/postcss, turbopack (configured in `next.config.ts`)
- Scripts: `dev` (next dev), `build` (next build), `start` (next start), `lint` (eslint)

## Directory Structure (summary)

- /.env.* (configuration files exist — contain environment variables)
- AGENTS.md, CLAUDE.md, README.md, package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs
- /app
  - layout.tsx (RootLayout — font + Providers)
  - providers.tsx (ThemeProvider, Toaster)
  - globals.css (theme tokens, fm-* classes, animations)
  - login/page.tsx (Login UI + Firestore query)
  - /dashboard
    - layout.tsx (Sidebar + Topbar + frame)
    - page.tsx (Dashboard home: metrics, announcements, activity)
    - rates/page.tsx (Exchange rates + converter)
    - expenses/page.tsx (Expense CRUD + summary)
    - cleaning/page.tsx (Cleaning schedule)
    - tasks/page.tsx (Tasks list + add)
    - roommates/page.tsx (Profiles + admin add/edit)
- /lib
  - firebase.ts (Firebase init using NEXT_PUBLIC_* env vars)
- /public (static assets)

## Architecture & Data Flow

- Routing: Next.js App Router. Most pages are client components (`'use client'`).
- State: local React state (`useState`, `useEffect`). No global state library used.
- Auth: client-side login checks `users` collection in Firestore, stores user object in `localStorage`, pages read `localStorage` to guard routes and show admin controls.
- Data layer: `lib/firebase.ts` initializes Firestore. Pages perform `getDocs`, `query`, `onSnapshot`, `addDoc`, `updateDoc`, `deleteDoc` directly from client.
- Real-time updates: `onSnapshot` used for announcements, tasks, expenses, etc.
- External API: Currency rates fetched from `open.er-api.com` (polled every 10 minutes in rates page).
- UI: Layout includes desktop sidebar and mobile overlay, theme toggle via `next-themes`, toasts via `sonner`.

## Key Patterns & Conventions

- AGENTS.md documents style conventions: import order, `'use client'` placement, naming conventions, Tailwind theme approach.
- Pages are default-exported React functions (PascalCase naming in many places).
- Repeated patterns:
  - Firestore queries inline in components
  - `localStorage` for user identity
  - `any` used frequently — limited TypeScript types
- Custom CSS helpers: `.fm-card`, `.fm-btn`, `.fm-input`, and animation helpers declared in `globals.css`.

## Major Features / Modules Summary

- Authentication (app/login/page.tsx)
  - Client-side credential check against Firestore `users` collection; stores user in `localStorage` on success.
- Root & Providers
  - `RootLayout` loads font and wraps children with `Providers` (ThemeProvider + Toaster).
- Dashboard (app/dashboard/page.tsx)
  - Aggregates quick stats (rent due, monthly expenses, USD/UZS), announcements (admin can post/pin), recent activity. Uses `onSnapshot` and `getDocs`.
- Exchange rates (app/dashboard/rates/page.tsx)
  - Fetches latest and previous-day rates from `open.er-api.com`; shows pair changes and provides a converter.
- Expenses (app/dashboard/expenses/page.tsx)
  - Real-time transactions via `onSnapshot`, add expense form, category summary for current month.
- Cleaning schedule (app/dashboard/cleaning/page.tsx)
  - Weekly schedule, admin can add tasks, toggle done with `updateDoc`.
- Tasks (app/dashboard/tasks/page.tsx)
  - Add/update tasks, badges for Upcoming/Today/Overdue, uses `onSnapshot`.
- Roommates (app/dashboard/roommates/page.tsx)
  - Manage users (admin can add with username/password), edit profiles, display contact links.
- Firebase setup (lib/firebase.ts)
  - Initializes using `NEXT_PUBLIC_FIREBASE_*` env vars and exports Firestore `db`.

## High-Level Observations & Suggestions

1. Authentication & Security (urgent):
   - Current approach uses plaintext password checks in Firestore and client-side auth (localStorage) — insecure. Recommend migrating to Firebase Authentication or server-side auth flows; never store plaintext passwords or rely solely on client checks.
   - Verify Firestore security rules to prevent unauthorized reads/writes.
2. Sensitive configuration:
   - Project uses environment variables; ensure secrets are not committed and are provided securely in CI/deployment.
3. Type safety & maintainability:
   - Introduce TypeScript interfaces for core models (User, Expense, Task, CleaningItem, Announcement) to reduce `any` usage.
4. Performance & data access:
   - Several pages fetch full collections and filter client-side. For scale, prefer indexed queries, pagination, and server-side aggregation where appropriate.
5. Error handling & UX:
   - Some try/catch blocks swallow details. Centralize API/error handling and show user-friendly messages.
6. Testing & CI:
   - No tests configured. Add unit tests and integration tests for critical flows (auth, expense add, task lifecycle).
7. External API resilience:
   - Add caching/fallbacks for rates API and handle rate limiting / network failures gracefully.
8. Accessibility & i18n:
   - Run a11y audits. Dates are locale-specific — consider internationalization if needed.
9. Code organization:
   - Consider extracting shared UI components (Avatar, MetricCard) if duplication increases.
10. Data privacy:
   - Roommate contact details are stored/displayed; ensure proper access controls and consent.

## Current Project State

- Functionally rich demo: most dashboard features implemented and connected to Firestore.
- Ready to run locally if Firestore is configured and `NEXT_PUBLIC_FIREBASE_*` env vars provided.
- Missing production hardening: secure auth, Firestore rules, tests, and monitoring.

## Any Other Relevant Insights

- AGENTS.md provides a thorough style guide relevant for contributors (imports, `'use client'` rule, naming, Tailwind usage).
- UI is polished with Tailwind + Framer Motion and good UX foundations.
- Next steps recommended: (1) prioritize migrating authentication to Firebase Auth, (2) add TypeScript models, and (3) lock down Firestore rules before deployment.

---

Files inspected (read-only): package.json, tsconfig.json, next.config.ts, AGENTS.md, README.md, app/* (layout, providers, globals.css, login, dashboard and subpages), lib/firebase.ts, public/*.

No files were modified during analysis.

*Report generated on 2026-04-04.*