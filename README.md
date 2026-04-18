# TCL Customer Portal Migration (Phase 1)

Next.js + Tailwind + Supabase implementation for the TCL Full-Stack Developer hiring test.

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Supabase (Auth, Postgres, RLS, Storage)
- Mock Shopify sync integration: `POST /api/sync-products`

## Local Setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - copy `.env.example` to `.env.local`
3. Add these values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase SQL Editor, run:
   - `supabase/migrations/001_customer_schema.sql` (run once on a fresh schema)
   - `supabase/migrations/002_seed_customer_data.sql`
5. Create Supabase Storage bucket:
   - `design-files`
6. Start app:
   - `npm run dev`
7. Open:
   - `http://localhost:3000`

## Required Env Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

## Task Coverage

### Task 1 - Schema Analysis and Supabase Migration

- SQL migration: `supabase/migrations/001_customer_schema.sql`
  - Includes enums, tables, foreign keys, indexes, triggers
- Seed file: `supabase/migrations/002_seed_customer_data.sql`
  - Includes sample users, products, orders, proofs, and revision requests
- RLS implemented for customer-scoped access on:
  - `users`
  - `orders`
  - `proofs`
  - `revision_requests`

### Task 2 - Authentication and Role-Based Access

- Supabase email/password sign-up and login implemented
- On sign-up, `public.users` row is inserted via trigger `handle_new_auth_user()`
- Protected routes:
  - `/dashboard`
  - `/orders/*`
- Route protection and auth session refresh are handled in middleware

### Task 3 - Customer Dashboard and Order Creation UI

- Dashboard (`/dashboard`) shows:
  - authenticated customer name and organization
  - customer-specific orders with status badges
  - prominent `Create New Order` CTA
- Create order (`/orders/new`) provides 3-step flow:
  - Step 1: event info, order type, product selection, product color choices
  - Step 2: design descriptions, design-direction choice, file upload to Supabase Storage
  - Step 3: print type selection and submit
- Order submit inserts order with `status = 'new'` and redirects to dashboard

### Task 4 - Proof Review and Approval Workflow

- Proof review page: `/orders/[id]/proofs`
- Proof cards include:
  - proof number, product, color, print type, estimated ship date, price tiers, status, mockup image
- Actions:
  - Approve proof
  - Request revision (creates `revision_requests` row and updates proof status)
- Order status is auto-updated by trigger when all proofs are approved

### Task 5 - Integration

- Mock Shopify sync endpoint:
  - `POST /api/sync-products`
- Upserts product records into `products` table

## Schema Design Decisions

- Bubble option sets were mapped to Postgres enums:
  - `user_type`, `order_status`, `print_type`, `proof_status`
- `products_selected` is stored as `text[]` for phase-1 migration speed and Bubble parity.
- `price_tiers` is stored as `jsonb` to support variable tier structures.
- `public.users` is linked to `auth.users` through a trigger-based profile creation flow.

## RLS Validation Notes

Customer RLS policies ensure a logged-in customer can only access their own records.

Quick check in Supabase SQL Editor (authenticated context):

```sql
select * from public.orders;
```

Expected behavior: only the current authenticated customer's orders are returned.

## Demo

- Demo video (3-5 min): `https://www.loom.com/share/9fa62b1fbef342028476df56bb471d01`


## Test Credentials (for reviewers)

- Email: `test@tcl-demo.com`
- Password: `<set and add password>`

## Notes

- If Supabase email confirmation is enabled, login may fail with `Email not confirmed`.
- For local demo, disable email confirmation in Supabase Auth settings or confirm the user manually.
