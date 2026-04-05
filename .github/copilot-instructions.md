# Copilot Instructions for FlatMate Dashboard

> ⚠️ **Important:** This project uses Next.js 16 with breaking changes from previous versions. APIs, conventions, and file structure may differ from your training data. Consult `node_modules/next/dist/docs/` before making changes.

## Build, Test, and Lint Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

**No test framework is configured.** Ask before introducing test dependencies.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5** (strict mode enabled)
- **Tailwind CSS v4** — theme tokens defined via `@theme inline` in `app/globals.css`, NOT `tailwind.config.js`
- **Firebase Firestore** — client-side only (no Auth SDK, no API routes, no server actions)
- **Framer Motion** — page transitions, card animations, mobile sidebar
- **Lucide React** — icon library
- **next-themes** — dark/light mode via `app/providers.tsx`

## High-Level Architecture

This is a **flatmate management dashboard** with client-side Firebase integration:

- **Authentication:** Custom login page (`app/login/page.tsx`). User identity stored in `localStorage` (not Firebase Auth):
  ```typescript
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  ```
- **Data Layer:** Direct Firestore calls from client components. No API routes, no server actions. Common pattern:
  ```typescript
  const snap = await getDocs(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')));
  setExpenses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  ```
- **Features:** Rent tracking, expense splitting, cleaning schedules, exchange rates, task manager, roommate profiles — all under `app/dashboard/*`
- **Layout:** Sidebar and top navigation defined in `app/dashboard/layout.tsx`
- **Theme:** Managed by `ThemeProvider` in `app/providers.tsx` with `next-themes`

## Code Style Conventions

### Import Order & Style

1. React/Next.js imports
2. External libraries
3. Local/relative imports (use **relative paths**, NOT `@/*` alias)

```typescript
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
```

- Multi-line imports: one item per line with trailing commas
- **Named imports only** for libraries; default exports only for page components

### Components & File Structure

- **Every page/layout** (except `app/layout.tsx`) must start with `'use client';` directive (single quotes)
- Page components: `export default function ExpensesPage() { ... }` (PascalCase + `Page` suffix)
- **No `components/` directory** — all UI is inline in page/layout files
- Helper components may be defined inline as non-exported functions

### TypeScript

- `strict: true` is enforced
- **Avoid `any`** — define proper interfaces at the top of files:
  ```typescript
  interface Expense {
    id: string;
    amount: number;
    category: string;
    date: string;
  }
  ```
- Use `React.FormEvent`, `React.ReactNode` explicitly
- Prefer optional chaining (`?.`) and nullish coalescing (`??`)

### Naming Conventions

| Kind | Convention | Example |
|---|---|---|
| Page components | PascalCase + `Page` | `ExpensesPage` |
| Layouts | PascalCase | `RootLayout`, `DashboardLayout` |
| Variables/functions | camelCase | `fetchExpenses`, `handleSubmit` |
| Constants/config | UPPER_SNAKE_CASE | `CATEGORIES`, `CURRENCIES` |

### Tailwind CSS & Styling

- **Tailwind v4:** Theme defined in `app/globals.css` via `@theme inline`, not in config file
- Two styling approaches coexist:
  1. **Inline Tailwind utilities** (preferred for layout/spacing)
  2. **`fm-` prefixed classes** (for buttons, inputs, cards)
- Dark mode: use `dark:` prefix; custom variant is `&:where(.dark, .dark *)`
- Brand color: `#1D9E75` (also `var(--color-accent)`)
- Arbitrary values allowed: `bg-[#1D9E75]/10`, `border-white/[0.06]`

### Error Handling

- Use try/catch with meaningful messages (don't swallow error variables)
- Show errors inline via component state (no toast library)
- Guard clauses for validation: `if (!name.trim() || !user) return;`

### Animations

- **Framer Motion** for: page transitions, card hovers, staggered lists, mobile sidebar
- CSS animation classes available in `globals.css`: `animate-fade-in`, `animate-slide-down`, `stagger-1` through `stagger-4`
- Use `as const` for easing arrays: `ease: [0.25, 0.1, 0.25, 1] as const`

---

For comprehensive style guide, see `AGENTS.md`.
