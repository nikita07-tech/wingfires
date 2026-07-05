
## What I'll build

### 1. `/parts` inventory upgrades
- Replace "Load more" with **IntersectionObserver-driven infinite scroll**; new cards animate in with staggered Framer Motion (fade + slide + scale) as batches mount.
- Each card gets a proper **"Request Quote" button** that opens a **prefilled RFQ modal** (part number, name, manufacturer, condition, qty auto-filled; buyer fills name/email/company/notes).
- Modal submits via existing `submitRfq` server function → `rfqs` table → also triggers email.

### 2. Prefilled RFQ modal
- New `RfqDialog` component (shadcn `Dialog`) reusable across the site.
- Wire it into the Hero RFQ section too (currently a plain form) so both entry points share one component.

### 3. Admin dashboard — **`/admin`** (separate from vendor)
- Auth-gated under `_authenticated/admin.tsx`, requires `admin` role via `has_role()`.
- Shows: total RFQs, total quotes, vendors count, recent RFQ table, quote status breakdown, top parts requested. Framer chart-style tiles.
- Ability to change quote status (submitted → accepted / won / rejected).

### 4. CRM dashboard — **`/crm`**
- Also under `_authenticated/`, admin-only.
- Lead pipeline board (kanban-style columns: New / Contacted / Quoted / Won / Lost) reading from `rfqs.status`.
- Lead detail drawer with buyer contact, notes, linked quotes, status transitions.
- Adds `rfqs.status` extended values via migration (open, contacted, quoted, won, lost).

### 5. Header icons & CTAs
- **Search icon** → routes to `/parts` (focuses search box via query param).
- **Bell icon** → dropdown showing latest RFQs (for signed-in vendors) or "Sign in for alerts" prompt.
- **"How it Works"** nav link → smooth scrolls to `#how` section; also add a real `HowItWorks` section with 4 animated steps if missing / thin.

### 6. Mobile polish
- Reduce hero heading sizes at `sm`/`md`, tighter paddings, larger tap targets.
- Add `motion` viewport-triggered fade/slide on section entry (mobile-friendly, `once: true`).
- Ensure header grid pattern (`grid-cols-[minmax(0,1fr)_auto]`) on all multi-item rows per responsive rule.
- Parts grid: 1 col mobile with larger touch cards; sticky filter bar collapses into a drawer on mobile.

### 7. Footer logo
- Swap footer wordmark for `BrandLogo` component (already used in header) so branding is consistent.

### 8. Email notifications → `wingfire987@gmail.com`
- Enable Lovable Emails infrastructure + a verified sender domain (requires user's DNS action for the sender domain; I'll trigger the setup dialog).
- Create two React Email templates:
  - `rfq-received.tsx` — sent to `wingfire987@gmail.com` on every RFQ submission (buyer info, part details, lead ID).
  - `vendor-signup.tsx` — sent to `wingfire987@gmail.com` on every new vendor registration (company, contact, email).
- Wire triggers:
  - RFQ: inside `submitRfq` handler after DB insert.
  - Vendor: new server fn called from `/auth` signup success path (or DB trigger → server route).

### Technical notes
- New migration: extend `rfqs.status` allowed values; add `admin` role assignment path (manual — I'll document how to promote yourself via SQL).
- New server fns: `getAdminStats`, `listAllRfqs`, `updateRfqStatus`, `updateQuoteStatus`, `notifyVendorSignup` — all guarded by `requireSupabaseAuth` + `has_role('admin')` where relevant.
- Email queue prerequisite: `email_domain--setup_email_infra` + `scaffold_transactional_email` after user picks a sender domain.

### Links after build
- Admin: `/admin`
- CRM: `/crm`
- Vendor (existing): `/vendor`
- Parts: `/parts`

### One thing I need from you
**Email sender domain**: to send to `wingfire987@gmail.com`, we need a *sender* domain you own (e.g. `notify.yourdomain.com`). Gmail addresses can't be used as senders. When I start email setup I'll open the domain dialog — reply with the domain you want to use, or say "skip email for now" and I'll ship everything else and stub the notifications with a TODO.

Approve and I'll build it.
