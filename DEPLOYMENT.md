# Deployment Guide

This project uses **Vite** for the frontend (deployed to **Vercel**) and **Supabase** for the database, authentication, and Edge Functions.

---

## Prerequisites

- Node.js 18+
- A [Vercel](https://vercel.com) account
- A [Supabase](https://supabase.com) account (project ref: `yvcuhnnhspqjfnrbkhok`)
- A [Stripe](https://stripe.com) account (for subscription features)

---

## 1. Vercel – Frontend Deployment

### First-time setup

1. Go to https://vercel.com/new and import this repository.
2. Vercel will auto-detect the Vite framework. Confirm:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
3. Add these **Environment Variables** in Vercel → Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://yvcuhnnhspqjfnrbkhok.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | your Supabase `anon` key | Production, Preview |
| `VITE_SITE_URL` | `https://elpasosbestlawyers.com` | Production |
| `VITE_SITE_URL` | your Vercel preview URL | Preview |
| `VITE_STRIPE_PUBLISHABLE_KEY` | your Stripe publishable key | Production, Preview |

4. Click **Deploy**.

### Subsequent deployments

Every push to `main` triggers an automatic Vercel deployment via the
`.github/workflows/deploy-vercel.yml` workflow. No manual action needed.

---

## 2. Supabase – Database Migrations

Run migrations in order using the Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref yvcuhnnhspqjfnrbkhok
supabase db push
```

Or run the SQL files in `supabase/migrations/` manually via the Supabase SQL editor:
1. `001_create_firms_table.sql`
2. `002_create_reviews_table.sql`
3. `003_create_analytics_table.sql`
4. `004_create_subscriptions_table.sql`
5. `005_create_storage_buckets.sql`
6. `006_create_helper_functions.sql`

---

## 3. Supabase – Authentication

1. In the Supabase Dashboard, go to **Authentication → Providers**.
2. Enable **Email** provider.
3. (Optional) Enable **Google OAuth** with your Google client ID/secret.
4. Under **Authentication → URL Configuration**, add redirect URLs:
   - `http://localhost:8080` (development)
   - `https://elpasosbestlawyers.com` (production)

---

## 4. Supabase – Edge Functions

Deploy the Stripe integration Edge Functions:

```bash
supabase functions deploy create-checkout --project-ref yvcuhnnhspqjfnrbkhok
supabase functions deploy stripe-webhook --project-ref yvcuhnnhspqjfnrbkhok
```

Set required secrets for Edge Functions:

```bash
supabase secrets set \
  STRIPE_SECRET_KEY="sk_live_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## 5. Stripe – Webhook Configuration

1. In the [Stripe Dashboard](https://dashboard.stripe.com/webhooks), add a new endpoint.
2. Set the URL to your `stripe-webhook` Edge Function:
   `https://yvcuhnnhspqjfnrbkhok.functions.supabase.co/stripe-webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.
4. Copy the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET` in Supabase secrets.

---

## 6. Local Build Verification

```bash
npm ci
npm run build       # Produces dist/
npm run preview     # Preview at http://localhost:4173
```

---

## Environment Variables Reference

See `.env.example` for the complete list with descriptions.
