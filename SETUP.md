# Developer Setup Guide

Get a working local development environment in 15 minutes.

## Prerequisites

| Tool | Minimum version | Install |
|------|----------------|---------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | bundled with Node |
| Git | any | https://git-scm.com |
| Supabase CLI (optional) | latest | `npm i -g supabase` |

---

## 1. Clone the repository

```bash
git clone https://github.com/chapstucker-dotcom/best-ep-lawyers-.git
cd best-ep-lawyers-
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the following values (get them from the Supabase dashboard):

| Variable | Where to find it |
|----------|-----------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → `anon` / `public` key |
| `VITE_SITE_URL` | `http://localhost:8080` for local dev |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys (test key for dev) |

The `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` are only needed when deploying Supabase Edge Functions (not required for running the frontend locally).

## 4. Run database migrations

If you have the Supabase CLI installed and the project linked:

```bash
supabase link --project-ref yvcuhnnhspqjfnrbkhok
supabase db push
```

Alternatively, run the SQL files in `supabase/migrations/` manually in order via the Supabase SQL editor:
1. `001_create_firms_table.sql`
2. `002_create_reviews_table.sql`
3. `003_create_analytics_table.sql`
4. `004_create_subscriptions_table.sql`
5. `005_create_storage_buckets.sql`
6. `006_create_helper_functions.sql`

## 5. Start the dev server

```bash
npm run dev
```

The app opens at **http://localhost:8080**.

---

## Useful commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server (HMR enabled) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project structure

```
best-ep-lawyers-/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth, App)
│   ├── data/           # Static data & TypeScript types
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Supabase client and utilities
│   ├── pages/          # Page-level components
│   ├── services/       # Supabase service functions
│   └── utils/          # Helper utilities
├── public/             # Static assets
├── supabase/
│   ├── functions/      # Edge Functions (Stripe, etc.)
│   └── migrations/     # Ordered SQL migration files
├── .env.example        # Environment variable template
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── vercel.json         # Vercel deployment configuration
```

---

## Troubleshooting

**`VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is undefined**
Make sure you copied `.env.example` to `.env` and restarted the dev server.

**Login/signup does not work locally**
In the Supabase Dashboard, add `http://localhost:8080` to Authentication → URL Configuration → Redirect URLs.

**Build fails with TypeScript errors**
Run `npx tsc --noEmit` to see all type errors, then fix them before building.
