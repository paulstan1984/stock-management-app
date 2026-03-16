# Plan: Stock Management App — Full Build

## Decisions
- Framework: Next.js 16 (App Router) — already scaffolded
- DB: PostgreSQL via fly.io managed Postgres (`fly postgres create`)
- ORM: Prisma (schema + migrations)
- Auth: iron-session (cookie-based, single admin via env vars)
- UI language: Romanian

---

## Phase 1 — Foundation (dependencies + DB schema)
1. Install: `prisma`, `@prisma/client`, `iron-session`
2. Start local DB: `docker compose up -d` (postgres:16 on port 5432, db=`stock_db`, user=`stock_user`, pwd=`stock_pwd`; pgAdmin at http://localhost:8080)
3. Create `.env.local`: `DATABASE_URL=postgresql://stock_user:stock_pwd@localhost:5432/stock_db`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`
4. Create `config/auth.ts`: reads credentials from env vars only
5. Create `prisma/schema.prisma`: `Category` and `Product` models
6. Run `npx prisma migrate dev --name init`
7. Create `lib/db.ts`: Prisma client singleton (global pattern for dev HMR)

## Phase 2 — Authentication
8. Create `lib/auth.ts`: iron-session config + `getSession()`, `login()`, `logout()` helpers
9. Create `middleware.ts`: protect `/admin/*` and `/scan`, redirect unauthenticated to `/login`
10. Create `app/(auth)/login/page.tsx`: Romanian login form (*Utilizator*, *Parolă*)
11. Create `app/(auth)/login/actions.ts`: server action — validate credentials, set session cookie, redirect to `/admin/products`

## Phase 3 — Admin Layout + Categories *(parallel with Phase 4)*
12. Create `lib/data.ts`: DB access functions (`getCategories`, `getProducts`, `getProductByCode`, `createCategory`, `updateCategory`, `deleteCategory`, `createProduct`, `updateProduct`, `deleteProduct`, `decreaseStock`)
13. Create `app/admin/layout.tsx`: nav with links (*Produse*, *Categorii*) + *Deconectare* button
14. Create `app/admin/page.tsx`: redirect to `/admin/products`
15. Create `app/admin/categories/page.tsx`: list all categories
16. Create `app/admin/categories/new/page.tsx`: form to create category
17. Create `app/admin/categories/[id]/page.tsx`: form to edit/delete category
18. Create `app/admin/categories/actions.ts`: server actions + `revalidatePath`

## Phase 4 — Admin Products *(parallel with Phase 3)*
19. Create `app/admin/products/page.tsx`: list products alphabetically; client-side live search (`SearchBar` component)
20. Create `app/admin/products/new/page.tsx`: form to create product (Code, Name, MeasureUnit, Stock, CategoryId)
21. Create `app/admin/products/[id]/page.tsx`: form to edit/delete product
22. Create `app/admin/products/actions.ts`: server actions + `revalidatePath`

## Phase 5 — Buy Screen
23. Create `components/ProductGrid.tsx` (`'use client'`): alphabetical product buttons + live search filter
24. Create `components/QuantityModal.tsx` (`'use client'`): modal to enter *Cantitate*, calls server action
25. Create `app/scan/actions.ts`: `decreaseStock` server action (validates `stock >= quantity`)
26. Create `app/scan/page.tsx` (`'use client'`): composes ProductGrid + QuantityModal

## Phase 6 — Shared Components + Polish *(parallel with any phase)*
28. Create `components/ui/`: `Button`, `Input`, `FormField` reusable components
29. Update `app/layout.tsx`: `lang="ro"`, title *"Gestiune Stoc"*
30. Update `app/page.tsx`: redirect to `/admin/products` or `/login` based on session

## Phase 7 — Deployment (fly.io)
31. Configure `next.config.ts` with `output: 'standalone'`
32. Create `Dockerfile` for Next.js standalone output
33. Create `fly.toml` with `release_command = "npx prisma migrate deploy"`
34. `fly postgres create` → `fly postgres attach`
35. `fly secrets set DATABASE_URL=... ADMIN_USERNAME=... ADMIN_PASSWORD=... SESSION_SECRET=...`
36. `fly deploy`

---

## Relevant Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local dev PostgreSQL + pgAdmin |
| `prisma/schema.prisma` | DB schema (Category, Product) |
| `lib/db.ts` | Prisma client singleton |
| `lib/auth.ts` | iron-session helpers |
| `lib/data.ts` | All DB access functions |
| `config/auth.ts` | Reads env credentials |
| `middleware.ts` | Route protection |
| `app/(auth)/login/` | Login page + server action |
| `app/admin/**` | Admin layout, categories CRUD, products CRUD |
| `app/scan/` | Buy screen + server action |
| `components/ProductGrid.tsx` | Product buttons + live search |
| `components/QuantityModal.tsx` | Quantity entry modal |
| `.env.local` | Local secrets (gitignored) |
| `Dockerfile` + `fly.toml` | Deployment config |

---

## Verification
1. `docker compose up -d` — postgres and pgAdmin containers start cleanly
2. `npm run build` — zero TypeScript and lint errors
3. `npm run dev` — login at `/login`; wrong credentials rejected
4. CRUD: create/edit/delete category → appears in product form dropdown
5. CRUD: create/edit/delete product → correct alphabetical order, live search works
6. Buy page on mobile: tap product button → quantity modal → stock decreases
7. Unauthenticated access to `/admin/*` or `/scan` → redirected to `/login`
8. `fly deploy` — migrations run via `release_command`, app live at fly.io URL

---

## Out of Scope
- User roles / multi-user support
- Audit log / stock history
- Email notifications
- Product images