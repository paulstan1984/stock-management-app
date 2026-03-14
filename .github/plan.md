# Plan: Stock Management App — Full Build

## Decisions
- Framework: Next.js 16 (App Router) — already scaffolded
- DB: PostgreSQL via fly.io managed Postgres (`fly postgres create`)
- ORM: Prisma (schema + migrations)
- Auth: iron-session (cookie-based, single admin via env vars)
- Barcode scanning: html5-qrcode (browser camera)
- UI language: Romanian

---

## Phase 1 — Foundation (dependencies + DB schema)
1. Install: `prisma`, `@prisma/client`, `iron-session`, `html5-qrcode`
2. Create `.env.local`: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`
3. Create `config/auth.ts`: reads credentials from env vars only
4. Create `prisma/schema.prisma`: `Category` and `Product` models
5. Run `npx prisma migrate dev --name init`
6. Create `lib/db.ts`: Prisma client singleton (global pattern for dev HMR)

## Phase 2 — Authentication
7. Create `lib/auth.ts`: iron-session config + `getSession()`, `login()`, `logout()` helpers
8. Create `middleware.ts`: protect `/admin/*` and `/scan`, redirect unauthenticated to `/login`
9. Create `app/(auth)/login/page.tsx`: Romanian login form (*Utilizator*, *Parolă*)
10. Create `app/(auth)/login/actions.ts`: server action — validate credentials, set session cookie, redirect to `/admin/products`

## Phase 3 — Admin Layout + Categories *(parallel with Phase 4)*
11. Create `lib/data.ts`: DB access functions (`getCategories`, `getProducts`, `getProductByCode`, `createCategory`, `updateCategory`, `deleteCategory`, `createProduct`, `updateProduct`, `deleteProduct`, `decreaseStock`)
12. Create `app/admin/layout.tsx`: nav with links (*Produse*, *Categorii*) + *Deconectare* button
13. Create `app/admin/page.tsx`: redirect to `/admin/products`
14. Create `app/admin/categories/page.tsx`: list all categories
15. Create `app/admin/categories/new/page.tsx`: form to create category
16. Create `app/admin/categories/[id]/page.tsx`: form to edit/delete category
17. Create `app/admin/categories/actions.ts`: server actions + `revalidatePath`

## Phase 4 — Admin Products *(parallel with Phase 3)*
18. Create `app/admin/products/page.tsx`: list products alphabetically; client-side live search (`SearchBar` component)
19. Create `app/admin/products/new/page.tsx`: form to create product (Code, Name, MeasureUnit, Stock, CategoryId)
20. Create `app/admin/products/[id]/page.tsx`: form to edit/delete product
21. Create `app/admin/products/actions.ts`: server actions + `revalidatePath`

## Phase 5 — Scan / Buy Screen
22. Create `components/BarcodeScanner.tsx` (`'use client'`): html5-qrcode wrapper, fires `onScan(code)` callback
23. Create `components/ProductGrid.tsx` (`'use client'`): alphabetical product buttons + live search filter
24. Create `components/QuantityModal.tsx` (`'use client'`): modal to enter *Cantitate*, calls server action
25. Create `app/scan/actions.ts`: `decreaseStock` server action (validates `stock >= quantity`)
26. Create `app/scan/page.tsx` (`'use client'`): composes BarcodeScanner + ProductGrid + QuantityModal

## Phase 6 — Shared Components + Polish *(parallel with any phase)*
27. Create `components/ui/`: `Button`, `Input`, `FormField` reusable components
28. Update `app/layout.tsx`: `lang="ro"`, title *"Gestiune Stoc"*
29. Update `app/page.tsx`: redirect to `/admin/products` or `/login` based on session

## Phase 7 — Deployment (fly.io)
30. Configure `next.config.ts` with `output: 'standalone'`
31. Create `Dockerfile` for Next.js standalone output
32. Create `fly.toml` with `release_command = "npx prisma migrate deploy"`
33. `fly postgres create` → `fly postgres attach`
34. `fly secrets set DATABASE_URL=... ADMIN_USERNAME=... ADMIN_PASSWORD=... SESSION_SECRET=...`
35. `fly deploy`

---

## Relevant Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | DB schema (Category, Product) |
| `lib/db.ts` | Prisma client singleton |
| `lib/auth.ts` | iron-session helpers |
| `lib/data.ts` | All DB access functions |
| `config/auth.ts` | Reads env credentials |
| `middleware.ts` | Route protection |
| `app/(auth)/login/` | Login page + server action |
| `app/admin/**` | Admin layout, categories CRUD, products CRUD |
| `app/scan/` | Buy/scan screen + server action |
| `components/BarcodeScanner.tsx` | html5-qrcode camera scanner |
| `components/ProductGrid.tsx` | Product buttons + live search |
| `components/QuantityModal.tsx` | Quantity entry modal |
| `.env.local` | Local secrets (gitignored) |
| `Dockerfile` + `fly.toml` | Deployment config |

---

## Verification
1. `npm run build` — zero TypeScript and lint errors
2. `npm run dev` — login at `/login`; wrong credentials rejected
3. CRUD: create/edit/delete category → appears in product form dropdown
4. CRUD: create/edit/delete product → correct alphabetical order, live search works
5. Scan page on mobile: camera opens, scan barcode → quantity modal → stock decreases
6. Manual product selection: tap product button → quantity modal → stock decreases
7. Unauthenticated access to `/admin/*` or `/scan` → redirected to `/login`
8. `fly deploy` — migrations run via `release_command`, app live at fly.io URL

---

## Out of Scope
- User roles / multi-user support
- Audit log / stock history
- Email notifications
- Product images