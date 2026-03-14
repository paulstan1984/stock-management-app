# GitHub Copilot Instructions — Stock Management App

## Project Overview
This is a **stock management web application** written in **Next.js 16 (App Router)** with **React 19**, **TypeScript**, and **Tailwind CSS v4**. It is intended to be deployed on **fly.io**.

The UI language is **Romanian**. All user-facing text (labels, buttons, messages, placeholders) must be written in Romanian.

---

## Tech Stack
- **Framework**: Next.js 16 (App Router, `app/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Runtime**: Node.js
- **Deployment target**: fly.io

---

## Domain Model

### Product
| Field       | Type   | Notes                        |
|-------------|--------|------------------------------|
| code        | string | Barcode / unique identifier  |
| name        | string | Product name                 |
| measureUnit | string | e.g., kg, L, buc             |
| stock       | number | Current quantity in stock    |
| categoryId  | string | Reference to a Category      |

### Category
| Field | Type   |
|-------|--------|
| id    | string |
| name  | string |

---

## Authentication
- There is a single admin user (no registration flow).
- Credentials are stored in a **config file** (e.g., `config/auth.ts` or environment variables). Never hard-code credentials in component or route files.
- All routes other than the login page must be protected and accessible only to authenticated admins.
- Use Next.js middleware (`middleware.ts`) for route protection.

---

## Key Features & Requirements

### Admin Panel
- CRUD for **Products** (code, name, measureUnit, stock, category).
- CRUD for **Categories**.
- Products list is sorted **alphabetically** by name.
- Live **search/filter**: as the user types, products are filtered instantly (no submit needed). Example: typing "pa" shows "patrunjel", "pastarnac".

### Buy / Scan Screen (mobile-friendly)
- Accessible via a dedicated URL (e.g., `/scan` or `/cumpara`).
- Allows scanning a **product barcode** with the device camera or entering the code manually.
- After identifying the product, the user enters the **quantity purchased**; the product stock is **decreased** by that amount.
- Displays all products as individual **buttons** (one per product), ordered alphabetically.
- Search functionality to filter products by name before selecting.
- Protected — only accessible to logged-in admins.

---

## Coding Conventions

### General
- Use **TypeScript** everywhere. Avoid `any`; define explicit types and interfaces.
- Prefer **named exports** for components, **default exports** only for Next.js pages/layouts.
- Use **React Server Components** by default. Add `'use client'` only when interactivity or browser APIs are needed.
- Keep components small and single-responsibility.

### File & Folder Structure
Follow the Next.js App Router conventions:
```
app/
  layout.tsx          # Root layout
  page.tsx            # Home / redirect
  (auth)/
    login/page.tsx
  admin/
    layout.tsx        # Admin-only layout with auth guard
    dashboard/page.tsx
    products/
      page.tsx        # Product list
      [id]/page.tsx   # Edit product
      new/page.tsx    # New product
    categories/
      page.tsx
      [id]/page.tsx
      new/page.tsx
  scan/
    page.tsx          # Barcode scan / buy screen
components/           # Shared UI components
lib/
  auth.ts             # Auth helpers
  data.ts             # Data access (products, categories)
config/
  auth.ts             # Admin credentials (read from env)
middleware.ts         # Route protection
```

### Styling
- Use **Tailwind CSS utility classes** exclusively; avoid inline styles and CSS modules unless absolutely necessary.
- Design for **mobile-first**; the scan/buy screen must work well on phones.
- Use dark mode support where it doesn't add complexity.

### Data & State
- Until a database is added, data may be stored in-memory or in a JSON file on the server.
- Use **server actions** (`'use server'`) for form mutations (create, update, delete).
- Use `revalidatePath` / `revalidateTag` after mutations to keep pages fresh.

### Security
- Sanitize and validate all user input on the server side.
- Do not expose credentials or secret config values to the client.
- Admin routes must reject unauthenticated requests with a redirect to `/login`.

---

## Romanian UI Reference

| Concept         | Romanian label         |
|-----------------|------------------------|
| Login           | Autentificare          |
| Username        | Utilizator             |
| Password        | Parolă                 |
| Products        | Produse                |
| Categories      | Categorii              |
| Stock           | Stoc                   |
| Measure unit    | Unitate de măsură      |
| Search          | Căutare                |
| Quantity        | Cantitate              |
| Save            | Salvează               |
| Cancel          | Anulează               |
| Delete          | Șterge                 |
| Edit            | Editează               |
| Add             | Adaugă                 |
| Scan barcode    | Scanează cod de bare   |
| Enter code      | Introduceți codul      |
| Buy / Purchase  | Cumpărare              |
| Logout          | Deconectare            |

---

## What to Avoid
- Do **not** use class components.
- Do **not** use `pages/` directory (this is an App Router project).
- Do **not** add unnecessary dependencies; keep the bundle lean.
- Do **not** write English UI strings; always use Romanian.
- Do **not** store credentials in source code; use environment variables.
