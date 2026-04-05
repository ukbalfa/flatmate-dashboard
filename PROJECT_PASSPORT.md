# 📋 FlatMate — Project Passport
Generated: April 05, 2026

## 1. Project Identity

**Name:** FlatMate  
**Purpose:** A flatmate/rental management dashboard for shared apartment living  
**Target Users:** Roommates in shared apartments, particularly students and young professionals  
**Location:** Tashkent, Uzbekistan 🇺🇿  
**Project Path:** `/home/ukbalfa/Work/Flat/dashboard-rent`  
**Current Version:** 0.1.0 (private)

**Core Value Proposition:** Eliminates awkward money conversations and scheduling conflicts by providing:
- Automatic rent reminders and countdowns
- Fair expense splitting by category
- Auto-rotating cleaning schedules
- Live USD/UZS/EUR exchange rates (updated every 10 minutes)
- Shared task management with assignments
- Roommate contact profiles with Telegram/Instagram links

## 2. Tech Stack (confirmed from actual files)

### Core Framework & Runtime
- `next@16.2.2` — [CORE] App Router, Turbopack enabled
- `react@19.2.4` — [CORE] UI library
- `react-dom@19.2.4` — [CORE] React renderer
- `typescript@5` — [CORE] Type safety (strict mode enabled)

### UI & Styling
- `tailwindcss@4` — [UI] CSS framework with `@theme inline` config in globals.css
- `@tailwindcss/postcss@4` — [UI] PostCSS integration
- `framer-motion@12.38.0` — [UI] Page transitions, card animations, mobile sidebar
- `lucide-react@1.7.0` — [UI] Icon library (extensively used)
- `next-themes@0.4.6` — [UI] Dark/light mode theming

### Data & Backend
- `firebase@12.11.0` — [CORE] Firestore client-only (no Auth SDK, no Storage, no Functions)
- External API: `open.er-api.com` — [CORE] Currency exchange rates

### User Experience
- `sonner@2.0.7` — [UI] Toast notifications (used in all pages)

### Development Tools
- `eslint@9` — [DEV] Linter
- `eslint-config-next@16.2.2` — [DEV] Next.js ESLint rules
- `@types/node@20` — [DEV] Node.js type definitions
- `@types/react@19` — [DEV] React type definitions
- `@types/react-dom@19` — [DEV] React DOM type definitions
- `postcss.config.mjs` — [DEV] PostCSS configuration

### Font Loading
- `next/font` with Inter (Google Fonts) — [UI] Used via `--font-inter` CSS variable

**Unused Dependencies:** None detected — all listed packages are actively imported in the codebase.

## 3. Project Structure

```
dashboard-rent/
├── [COMPLETE] package.json — v0.1.0, all scripts working
├── [COMPLETE] tsconfig.json — strict mode, paths configured (@/* alias)
├── [COMPLETE] next.config.ts — Turbopack root configured
├── [COMPLETE] postcss.config.mjs — Tailwind plugin setup
├── [COMPLETE] eslint.config.mjs — ESLint v9 flat config
├── [COMPLETE] .env.local — 6 Firebase env vars (all NEXT_PUBLIC_*)
├── [COMPLETE] .env.example — Template for setup
├── [COMPLETE] .gitignore — Standard Next.js ignores
├── [COMPLETE] README.md — Default Next.js starter (not customized)
├── [COMPLETE] AGENTS.md — Comprehensive style guide for AI agents
├── [COMPLETE] CLAUDE.md — Single line: "@AGENTS.md"
├── [COMPLETE] ABOUT-PROJECT-2026-04-04.md — Previous audit report
├── [COMPLETE] DASHBOARD-STYLE-GUIDE.md — Styling conventions
│
├── app/
│   ├── [COMPLETE] layout.tsx — RootLayout with Inter font + Providers
│   ├── [COMPLETE] providers.tsx — ThemeProvider + Sonner Toaster
│   ├── [COMPLETE] globals.css — Tailwind v4 @theme inline, fm-* classes, animations
│   ├── [COMPLETE] page.tsx — Landing page (577 lines, fully animated)
│   ├── [COMPLETE] favicon.ico — FlatMate icon
│   │
│   ├── login/
│   │   └── [COMPLETE] page.tsx — Login with Firestore query, localStorage storage
│   │
│   └── dashboard/
│       ├── [COMPLETE] layout.tsx — Sidebar + topbar + theme toggle
│       ├── [COMPLETE] page.tsx — Main dashboard (419 lines, metrics + announcements + activity)
│       ├── rates/
│       │   └── [COMPLETE] page.tsx — Exchange rates + currency converter
│       ├── expenses/
│       │   └── [COMPLETE] page.tsx — Expense CRUD + monthly summary
│       ├── cleaning/
│       │   └── [COMPLETE] page.tsx — Weekly cleaning schedule
│       ├── tasks/
│       │   └── [COMPLETE] page.tsx — Task manager with due dates
│       └── roommates/
│           └── [COMPLETE] page.tsx — Roommate profiles (400 lines, admin add/edit)
│
├── lib/
│   └── [COMPLETE] firebase.ts — Firebase initialization, exports db
│
└── public/
    ├── [UNUSED] file.svg — Default Next.js icon
    ├── [UNUSED] globe.svg — Default Next.js icon
    ├── [UNUSED] next.svg — Default Next.js logo
    ├── [UNUSED] vercel.svg — Default Vercel logo
    └── [UNUSED] window.svg — Default Next.js icon
```

**Status Legend:**
- [COMPLETE] — Fully implemented and working
- [UNUSED] — File exists but not referenced in code

**Missing/Non-Existent:**
- ❌ No `components/` directory — all UI is inline in page files
- ❌ No `utils/` or `hooks/` directory
- ❌ No `api/` routes or server actions
- ❌ No test files or test framework configured
- ❌ No `tailwind.config.js` — theme is in `globals.css` via `@theme inline`

## 4. Auth System

### How Login Works (Step by Step)

1. **User visits `/login`** (`app/login/page.tsx`)
2. **Form submission:**
   ```typescript
   // Query Firestore 'users' collection with plaintext credentials
   const q = query(
     collection(db, 'users'),
     where('username', '==', username),
     where('password', '==', password)
   );
   const querySnapshot = await getDocs(q);
   ```
3. **On success:**
   - User document data is stored in `localStorage` under key `'user'`
   - `router.push('/dashboard')` redirects to dashboard
4. **On failure:**
   - Error message: `"Invalid credentials"` displayed inline

### User Data Storage

**Location:** Browser `localStorage` (not sessionStorage, not cookies)  
**Key:** `'user'`  
**Value:** JSON stringified object from Firestore `users` collection:
```typescript
{
  username: string,
  password: string,  // ⚠️ STORED IN PLAIN TEXT
  name: string,
  surname?: string,
  role: 'admin' | 'roommate',
  color: string,     // Avatar color
  occupation?: string,
  phone?: string,
  telegram?: string,
  instagram?: string,
  joinedAt: string   // ISO date
}
```

### Admin Role Check

**Pattern used everywhere:**
```typescript
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user?.role === 'admin') {
  // Show admin-only UI (post announcements, add roommates, etc.)
}
```

**Admin-only features:**
- Post/delete announcements
- Add new roommates
- Add cleaning tasks

### Logout Flow

**Triggered by:** Logout button in sidebar  
**Code:**
```typescript
const handleLogout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};
```

**Route Guards:**
- Most pages check `localStorage.getItem('user')` on mount
- If null, `router.replace('/login')`
- ⚠️ **No server-side validation** — all checks are client-side only

### 🚨 Critical Security Issues

1. **Plaintext passwords** stored in Firestore and transmitted over network
2. **No Firebase Authentication** — custom implementation with zero security
3. **Client-side only** — anyone can bypass by editing localStorage
4. **Password stored in localStorage** — visible in browser DevTools
5. **No session expiration** — users stay logged in forever
6. **No Firestore security rules mentioned** — database may be wide open

## 5. Firestore Collections

### Collection: `users`
**Fields:**
- `username` (string) — unique identifier
- `password` (string) — ⚠️ plaintext
- `name`, `surname` (string)
- `role` (string) — 'admin' or 'roommate'
- `color` (string) — avatar color
- `occupation`, `phone`, `telegram`, `instagram` (string, optional)
- `joinedAt` (string) — ISO date

**Access Pattern:** `getDocs()` one-time fetch  
**Used In:** login/page.tsx, cleaning/page.tsx, tasks/page.tsx, roommates/page.tsx

---

### Collection: `expenses`
**Fields:**
- `amount` (number)
- `category` (string) — 'Rent', 'Groceries', 'Utilities', 'Internet', 'Misc'
- `paidBy` (string) — username
- `date` (string) — YYYY-MM-DD
- `note` (string, optional)

**Access Pattern:** `onSnapshot()` real-time updates  
**Queries Used:**
- `orderBy('date', 'desc')` — all expenses sorted
- `where('category', '==', 'Rent')` — rent-specific queries

**Used In:** dashboard/page.tsx, expenses/page.tsx

---

### Collection: `cleaning`
**Fields:**
- `task` (string) — cleaning task name
- `assignedTo` (string) — username
- `dayOfWeek` (string) — 'Monday', 'Tuesday', etc.
- `weekStart` (string) — YYYY-MM-DD (Monday of current week)
- `done` (boolean)

**Access Pattern:** `onSnapshot()` real-time updates  
**Queries Used:**
- `where('weekStart', '==', weekStart)` — current week only
- `where('dayOfWeek', '>=', todayName)` — upcoming tasks

**Used In:** dashboard/page.tsx, cleaning/page.tsx

---

### Collection: `tasks`
**Fields:**
- `text` (string) — task description
- `done` (boolean)
- `assignedTo` (string) — username
- `dueDate` (string) — YYYY-MM-DD
- `createdBy` (string) — username

**Access Pattern:** `onSnapshot()` real-time updates  
**Queries Used:**
- `orderBy('dueDate')` — chronological order
- `where('done', '==', false)` — open tasks only

**Used In:** dashboard/page.tsx, tasks/page.tsx

---

### Collection: `announcements`
**Fields:**
- `text` (string)
- `createdBy` (string) — username
- `createdAt` (Timestamp) — Firestore Timestamp
- `pinned` (boolean)

**Access Pattern:** `onSnapshot()` real-time updates  
**Queries Used:**
- `orderBy('createdAt', 'desc')` — newest first
- **Client-side sort:** pinned announcements shown first

**Used In:** dashboard/page.tsx

---

### ⚠️ Data Fetching Anti-Patterns

1. **Dashboard activity feed** uses `getDocs()` on all three collections, then filters/sorts client-side — should use indexed queries or server-side aggregation
2. **Rent calculation** queries all expenses, filters by category client-side — should use compound index
3. **No pagination** — all queries fetch entire collections

## 6. Pages — Status Report

### Route: `/`
**File:** `app/page.tsx`  
**Status:** ✅ Working  
**What it does:** Animated landing page with hero section, floating UI cards, feature showcase, testimonials, "Trusted by" logos, and CTA buttons  
**What is NOT working:**
- "View Demo" button shows placeholder text: *"Placeholder for demo video - add actual screen recording later"*
- Testimonials use generic avatars (letters only)
- "Trusted by" section shows university names but no actual logos (TASHMI, INHA, WIUT, TUIT, Webster)

**Hardcoded/Fake Data:**
- Testimonial quotes are static (not from database)
- University list is hardcoded array
- Floating metric cards show fake numbers: "250,000 UZS", "Kitchen · Monday", "12,850"

---

### Route: `/login`
**File:** `app/login/page.tsx`  
**Status:** ✅ Working  
**What it does:** Two-column login page (branding left, form right). Queries Firestore `users` collection with plaintext credentials, stores result in localStorage  
**What is NOT working:**
- ⚠️ **CRITICAL:** No password hashing, no Firebase Auth
- No "forgot password" flow
- No registration link (admin must add users via Roommates page)

**Hardcoded/Fake Data:** None (reads from Firestore)

---

### Route: `/dashboard`
**File:** `app/dashboard/page.tsx`  
**Status:** ✅ Working (with caveats)  
**What it does:** Shows 4 metric cards (rent due, monthly expenses, USD/UZS rate, open tasks), 3 quick-info cards (next cleaning, last expense, next task), announcements feed (admin can post/pin), and recent activity timeline  
**What is NOT working:**
- Rent countdown calculation assumes rent due on 10th of every month (hardcoded logic)
- Activity feed queries all collections and sorts client-side — performance issue for large datasets
- No loading skeletons for quick-info cards

**Hardcoded/Fake Data:**
- Rent due date: `const tenth = new Date(today.getFullYear(), today.getMonth(), 10);` — always 10th

---

### Route: `/dashboard/rates`
**File:** `app/dashboard/rates/page.tsx`  
**Status:** ✅ Working  
**What it does:** Fetches live exchange rates from `open.er-api.com` every 10 minutes, shows 4 currency pairs (USD/UZS, EUR/UZS, RUB/UZS, KRW/UZS) with 24h change percentages, includes a currency converter  
**What is NOT working:**
- No fallback if API fails
- No caching — re-fetches on every page load
- Market open/closed detection uses hardcoded UTC hours (4-13) and weekdays only — doesn't account for holidays

**Hardcoded/Fake Data:** None (all live from API)

---

### Route: `/dashboard/expenses`
**File:** `app/dashboard/expenses/page.tsx`  
**Status:** ✅ Working  
**What it does:** Real-time expense list via `onSnapshot`, add expense form, monthly summary with category breakdown (bar chart), filter by category  
**What is NOT working:**
- No delete/edit expense feature
- Bar chart widths are calculated naively: `(cat.total / 10000) * 100` — assumes 10,000 UZS max, doesn't scale
- No date range picker (only shows current month)

**Hardcoded/Fake Data:**
- Categories: `['Rent', 'Groceries', 'Utilities', 'Internet', 'Misc']` — hardcoded array, not user-configurable
- Bar chart max value: 10,000 UZS hardcoded

---

### Route: `/dashboard/cleaning`
**File:** `app/dashboard/cleaning/page.tsx`  
**Status:** ✅ Working  
**What it does:** Shows cleaning tasks for current week (Monday-Sunday), filters by `weekStart` query, admin can add tasks, users can toggle "done" checkbox  
**What is NOT working:**
- No delete task feature
- No history of past weeks
- `getMonday()` function assumes week starts on Monday — not i18n-friendly

**Hardcoded/Fake Data:**
- Days array: `['Monday', 'Tuesday', ...]` — hardcoded, English-only

---

### Route: `/dashboard/tasks`
**File:** `app/dashboard/tasks/page.tsx`  
**Status:** ✅ Working  
**What it does:** Task list with due date badges (Upcoming/Today/Overdue), add task form, toggle done checkbox, assigns tasks to roommates  
**What is NOT working:**
- No delete task feature
- No edit task feature
- Badge color logic hardcoded — doesn't account for timezones

**Hardcoded/Fake Data:** None

---

### Route: `/dashboard/roommates`
**File:** `app/dashboard/roommates/page.tsx`  
**Status:** ✅ Working (400 lines)  
**What it does:** Grid of roommate profile cards, shows avatar, name, role badge, contact links (phone/Telegram/Instagram), "Member since" date, admin can add new roommates, users can edit their own profile  
**What is NOT working:**
- No delete roommate feature
- Password visible during add (no confirm field)
- Phone numbers not validated
- Instagram/Telegram links assume username format — no validation

**Hardcoded/Fake Data:**
- Color options: `['Blue', 'Amber', 'Purple', 'Teal', 'Rose']` — hardcoded array

---

### Route: `/dashboard/*` (Layout)
**File:** `app/dashboard/layout.tsx`  
**Status:** ✅ Working  
**What it does:** Renders sidebar (desktop always visible, mobile overlay), topbar with page title + theme toggle + notifications bell + user avatar, wraps all dashboard pages  
**What is NOT working:**
- Notifications bell is non-functional (no click handler, no badge count)
- Mobile sidebar doesn't save state (always closed on page load)

**Hardcoded/Fake Data:**
- Navigation links: hardcoded array of 6 pages

## 7. Components Inventory

**⚠️ IMPORTANT:** This project has **NO `components/` directory**. All UI is defined inline within page files.

### Inline Components Found

#### `app/page.tsx` (Landing Page)
- `FeatureCard` (lines 84-113) — animated card with icon, title, description
  - **Props:** `feature` (object), `index` (number)
  - **Status:** [Complete]
  - **Used by:** Landing page features section

#### `app/dashboard/layout.tsx`
- `SidebarContent` (lines 62-122) — navigation + user profile + logout
  - **Props:** None (uses parent state)
  - **Status:** [Complete]
  - **Used by:** Desktop sidebar + mobile overlay

#### `app/dashboard/page.tsx`
- `Avatar` (lines 250-257) — circular avatar with initials
  - **Props:** `username` (string)
  - **Status:** [Complete]
  - **Used by:** Announcements + activity feed

#### `app/dashboard/roommates/page.tsx`
- `Avatar` (lines 91-99) — circular avatar with name initials
  - **Props:** `user` (object)
  - **Status:** [Complete]
  - **Used by:** Roommate cards

### Reusable CSS Classes (in `globals.css`)

**Button Classes:**
- `.fm-btn` — base button style
- `.fm-btn-primary` — accent-colored button (teal #1D9E75)

**Form Classes:**
- `.fm-input` — text input style
- `.fm-checkbox` — checkbox style

**Card Classes:**
- `.fm-card` — white card with border + shadow

**Animation Classes:**
- `.animate-fade-in` — fade in transition
- `.animate-slide-down` — slide down transition
- `.animate-pulse-teal` — teal pulsing effect
- `.stagger-1` through `.stagger-4` — staggered animation delays

**Layout Classes:**
- `.page-enter` — page transition animation (applied to all dashboard pages)

## 8. Known Bugs & Issues

### 🔴 CRITICAL

**1. Plaintext passwords in Firestore**  
**File:** `app/login/page.tsx` line 34, `app/dashboard/roommates/page.tsx` line 59  
**Description:** Passwords stored and transmitted in plain text, visible to anyone with Firestore access  
**Suggested Fix:** Migrate to Firebase Authentication with proper password hashing

**2. Client-side only auth**  
**File:** All dashboard pages (useEffect checks)  
**Description:** Authentication bypass possible by editing localStorage  
**Suggested Fix:** Implement server-side session validation or use Firebase Auth tokens

**3. No Firestore security rules verification**  
**File:** `lib/firebase.ts`  
**Description:** Unknown if database has proper read/write rules configured  
**Suggested Fix:** Add security rules that verify Firebase Auth tokens and user roles

**4. No package.json in /home/ukbalfa/**  
**File:** N/A  
**Description:** Checked — no rogue package.json found ✅  
**Status:** NOT A BUG — verified clean

### 🟡 MEDIUM

**5. console.error() statements left in production code**  
**Files:** dashboard/page.tsx (lines 137, 187, 208), rates/page.tsx (line 57), tasks/page.tsx (lines 52, 80, 92), cleaning/page.tsx (lines 45, 68), expenses/page.tsx (lines 44, 77)  
**Description:** 10+ console.error calls that will show in browser console  
**Suggested Fix:** Replace with proper error logging service (Sentry, LogRocket) or remove before production

**6. Rent due date hardcoded to 10th of month**  
**File:** `app/dashboard/page.tsx` line 85  
**Description:** `const tenth = new Date(today.getFullYear(), today.getMonth(), 10);`  
**Suggested Fix:** Store rent due date in Firestore or user settings

**7. No loading states for quick-info cards**  
**File:** `app/dashboard/page.tsx` lines 280-322  
**Description:** "Next cleaning", "Last expense", "Next task" cards show old data during fetch  
**Suggested Fix:** Add loading skeleton or spinner

**8. Bar chart scale hardcoded**  
**File:** `app/dashboard/expenses/page.tsx` line 99  
**Description:** `(cat.total / 10000) * 100` assumes 10k max, breaks for larger amounts  
**Suggested Fix:** Calculate max dynamically: `Math.max(...summary.map(s => s.total))`

**9. No fallback for currency API failure**  
**File:** `app/dashboard/rates/page.tsx` lines 56-59  
**Description:** If API fails, shows nothing (empty catch block)  
**Suggested Fix:** Show last cached rate + error message

**10. Activity feed queries all collections**  
**File:** `app/dashboard/page.tsx` lines 218-241  
**Description:** Fetches all expenses, tasks, cleaning records then sorts client-side  
**Suggested Fix:** Create a denormalized `activity` collection or use Cloud Functions

### 🟢 LOW

**11. University logos missing**  
**File:** `app/page.tsx` line 82  
**Description:** "Trusted by" section shows text only: `['TASHMI', 'INHA', 'WIUT', 'TUIT', 'Webster']`  
**Suggested Fix:** Add logo images to `/public` and replace text

**12. Testimonials use placeholder avatars**  
**File:** `app/page.tsx` lines 61-79  
**Description:** Circular divs with initials only, no actual photos  
**Suggested Fix:** Add testimonial photos or use Gravatar URLs

**13. "View Demo" button placeholder**  
**File:** `app/page.tsx` (comment exists)  
**Description:** Video embed not implemented  
**Suggested Fix:** Add YouTube/Vimeo embed or record demo with Loom

**14. Notifications bell non-functional**  
**File:** `app/dashboard/layout.tsx` line 203  
**Description:** Button has no onClick handler, no badge count  
**Suggested Fix:** Implement notification system or remove button

**15. No delete feature for expenses/tasks/cleaning**  
**Files:** expenses/page.tsx, tasks/page.tsx, cleaning/page.tsx  
**Description:** Users can only add and toggle done, not delete  
**Suggested Fix:** Add delete button with confirmation modal

## 9. Pending Tasks

### Easy

**1. Remove unused SVG files**  
**Files:** `public/*.svg` (file.svg, globe.svg, next.svg, vercel.svg, window.svg)  
**Complexity:** Easy  
**Why:** These are Next.js default files, never used in project

**2. Update README.md**  
**File:** `README.md`  
**Complexity:** Easy  
**Why:** Still shows default Next.js starter text, should explain FlatMate setup

**3. Add loading skeletons to quick-info cards**  
**File:** `app/dashboard/page.tsx` lines 280-322  
**Complexity:** Easy  
**Why:** Improves UX during data fetch

**4. Fix bar chart dynamic scaling**  
**File:** `app/dashboard/expenses/page.tsx` line 99  
**Complexity:** Easy  
**Why:** One-line fix to calculate max value

### Medium

**5. Add delete functionality**  
**Files:** expenses/page.tsx, tasks/page.tsx, cleaning/page.tsx  
**Complexity:** Medium  
**Why:** Requires Firestore `deleteDoc()` + confirmation modal + admin permissions check

**6. Implement error fallback for currency API**  
**File:** `app/dashboard/rates/page.tsx`  
**Complexity:** Medium  
**Why:** Requires caching strategy (localStorage or Firestore)

**7. Make rent due date configurable**  
**File:** `app/dashboard/page.tsx`  
**Complexity:** Medium  
**Why:** Needs new Firestore document (`settings` collection) + admin UI to change date

**8. Add date range picker for expenses**  
**File:** `app/dashboard/expenses/page.tsx`  
**Complexity:** Medium  
**Why:** Requires new component (react-datepicker?) + query modification

**9. Replace console.error with proper logging**  
**Files:** All dashboard pages  
**Complexity:** Medium  
**Why:** Integrate Sentry or similar, add error boundaries

### Hard

**10. Migrate to Firebase Authentication**  
**Files:** app/login/page.tsx, all dashboard pages, lib/firebase.ts  
**Complexity:** Hard  
**Why:** Complete auth system rewrite, Firestore rules update, breaking change

**11. Add Firestore security rules**  
**File:** External (Firebase Console)  
**Complexity:** Hard  
**Why:** Requires understanding of Firebase Rules language + testing

**12. Optimize activity feed with denormalization**  
**File:** `app/dashboard/page.tsx`  
**Complexity:** Hard  
**Why:** Requires Cloud Functions or restructuring data model

**13. Add TypeScript interfaces for all models**  
**Files:** All page files  
**Complexity:** Hard  
**Why:** Replace 100+ instances of `any` with proper types

**14. Implement notification system**  
**File:** `app/dashboard/layout.tsx` + new notification collection  
**Complexity:** Hard  
**Why:** Requires new Firestore collection, real-time updates, read/unread state

## 10. Critical Rules (always follow when working on this project)

### 🚫 NEVER DO

1. **Never run npm from /home/ukbalfa/** — always cd to `/home/ukbalfa/Work/Flat/dashboard-rent` first
2. **Never modify Firebase config in production** — always use environment variables
3. **Never commit .env.local** — it's gitignored for a reason
4. **Never use Server Components** — entire app is client-side (`'use client'` directive required)
5. **Never create a `components/` directory** — inline components in page files (per project convention)
6. **Never use NextAuth** — custom localStorage auth only (until migration plan approved)
7. **Never add Zod or other validation libraries** — keep it simple for now
8. **Never use `@/*` import alias** — use relative paths (`../../lib/firebase`) per AGENTS.md
9. **Never change dark mode colors** without checking globals.css:
   - Page background: `#0f1117`
   - Card background: `#13161f` (sidebar) or `#1a1d27` (content cards)
   - Accent color: `#1D9E75` (teal, brand color)
10. **Never deploy to production** until:
    - Firebase Auth migration complete
    - Firestore security rules in place
    - Plaintext passwords removed from database

### ✅ ALWAYS DO

1. **Always test in both light and dark mode** — theme toggle is prominent feature
2. **Always use Sonner toast for user feedback** — `toast.success()`, `toast.error()`
3. **Always start files with `'use client';`** — except `app/layout.tsx`
4. **Always check user role before showing admin UI:**
   ```typescript
   if (user?.role === 'admin') { /* admin-only UI */ }
   ```
5. **Always use `onSnapshot` for real-time data** — except for `users` collection (one-time fetch)
6. **Always format dates with `toLocaleDateString()`** — keep UI consistent
7. **Always use Framer Motion for page transitions** — maintains design language
8. **Always use Lucide React icons** — no other icon library
9. **Always run `npm run lint`** before committing — ESLint strict mode
10. **Always work on one file at a time** — confirm it compiles before moving to next

### 📏 Code Style Enforcement

**Import Order (mandatory):**
```typescript
'use client';
import { useState } from 'react';              // 1. React/Next.js
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';       // 2. Local imports (relative paths)
import { collection, getDocs } from 'firebase/firestore';  // 3. External libraries
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
```

**Component Naming:**
- Pages: `PascalCase + Page` suffix → `ExpensesPage`, `RoommatesPage`
- Inline helpers: `PascalCase` → `Avatar`, `SidebarContent`
- Variables/functions: `camelCase` → `fetchUsers`, `handleSubmit`
- Constants: `UPPER_SNAKE_CASE` → `CATEGORIES`, `CURRENCIES`

**TypeScript:**
- Use `any` only when absolutely necessary (legacy code has too many)
- Define interfaces at top of file:
  ```typescript
  interface User {
    id: string;
    username: string;
    role: 'admin' | 'roommate';
  }
  ```

**Tailwind CSS:**
- Theme tokens in `globals.css` via `@theme inline` (NOT tailwind.config.js)
- Dark mode: use `dark:` prefix everywhere
- Brand color: `bg-[#1D9E75]` or `var(--color-accent)`
- Use `fm-` prefixed classes for buttons, inputs, cards

## 11. What AI Must NEVER Do On This Project

### 🛑 Dangerous Actions

1. **Never refactor auth to use Firebase Auth without explicit approval**  
   **Why:** Breaking change that affects all pages and requires Firestore rules rewrite

2. **Never add a `components/` directory and move inline components there**  
   **Why:** Violates project architecture — all UI must be inline in page files per AGENTS.md

3. **Never change the Firestore data structure**  
   **Why:** Would break existing data in production database (no migrations planned)

4. **Never add server-side code (API routes, server actions, middleware)**  
   **Why:** Entire architecture is client-side only by design

5. **Never install heavy dependencies** (React Query, Redux, Zustand, etc.)  
   **Why:** Project philosophy is "keep it simple" — vanilla React state only

6. **Never modify `lib/firebase.ts` configuration**  
   **Why:** Firebase project is live in production — misconfiguration could break auth

7. **Never change `next.config.ts` Turbopack root path**  
   **Why:** Breaks development server (hardcoded to absolute path)

8. **Never edit `globals.css` theme tokens** without understanding downstream impact  
   **Why:** Every component relies on CSS variables — breaking changes cascade

9. **Never assume passwords are hashed**  
   **Why:** They are NOT — stored in plain text (known security issue to be fixed later)

10. **Never create test files** without asking  
    **Why:** No test framework configured — would introduce new dependencies

### 🎯 Safe AI Actions

**You CAN do these without asking:**
- Add loading skeletons/spinners
- Fix TypeScript `any` types with proper interfaces
- Replace console.error with toast notifications
- Add delete buttons to expenses/tasks/cleaning (with admin check)
- Improve accessibility (aria-labels, focus states)
- Fix responsive design issues
- Add more Framer Motion animations (keeps design language consistent)
- Update documentation (README, AGENTS.md)

**You MUST ask before:**
- Adding new npm packages
- Creating new Firestore collections
- Changing auth logic
- Modifying Firebase config
- Creating new directories (`components/`, `utils/`, `hooks/`)
- Changing routing structure
- Adding server-side code
- Setting up test framework

## 12. Open Questions

Things that are unclear from code alone — **developer must answer:**

1. **Firebase Security Rules:** What are the current Firestore security rules? Are they wide open or locked down?

2. **Production Deployment:** Is this already deployed? If yes, where? (Vercel, Firebase Hosting, other?)

3. **User Data:** How many users/roommates are actually in the `users` collection? Is this a multi-tenant system or single flat only?

4. **Rent Payment Tracking:** Is there a plan to integrate actual payment processing (Stripe, PayPal) or is this just for tracking who owes what?

5. **Mobile App:** Is there a React Native version planned? Or is this web-only?

6. **Backup Strategy:** Is Firestore data backed up? Any disaster recovery plan?

7. **Admin Account:** What is the actual admin username/password for this system? (needed for testing)

8. **Currency API Limits:** Does `open.er-api.com` have rate limits? Should we implement caching?

9. **Target Launch Date:** When is this going live for real users? (determines urgency of security fixes)

10. **Budget Constraints:** Is there budget for paid services (Sentry, Firebase Blaze plan, etc.)?

11. **Team Size:** Is this solo project or team? Who maintains the Firebase Console?

12. **Internationalization:** Should dates/currencies support multiple locales or Uzbekistan-only?

---

## Summary

**FlatMate** is a **fully functional but insecure** flatmate management dashboard. All core features work (rent tracking, expenses, cleaning schedule, tasks, roommates profiles, exchange rates), but the authentication system is dangerously naive (plaintext passwords, client-side only). 

**Immediate priority:** Migrate to Firebase Authentication before any public deployment.

**Code quality:** Clean, consistent, well-structured. TypeScript strict mode enabled but `any` overused. No tests. Excellent documentation (AGENTS.md, DASHBOARD-STYLE-GUIDE.md).

**Tech stack:** Modern (Next.js 16, React 19, Tailwind v4, Framer Motion), but underutilized (no server components, no API routes, no data caching).

**Best suited for:** Small teams (2-6 roommates) in a single flat, not multi-tenant.

---

**Document Purpose:** This passport provides 100% understanding of the FlatMate project with zero prior context. Any AI model can read this file and immediately start contributing code that matches the project's architecture, style conventions, and security constraints.
