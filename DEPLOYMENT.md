# Deployment Guide — Vercel + Supabase Functions

## Overview
- **Frontend**: Vite React app → deployed to Vercel as a static site
- **Backend**: Supabase Edge Functions (Deno) → deployed on Supabase

---

## 1) Frontend → Vercel

### Option A: GitHub Actions (manual trigger)
The workflow in `.github/workflows/vercel-deploy.yml` handles building and deploying.
It reads secrets from GitHub and passes them to Vercel CLI.

#### Required GitHub Secrets
Set these in: **GitHub repo → Settings → Secrets and variables → Actions**

| Secret Name | Required | Description | Where to Get |
|---|---|---|---|
| `VERCEL_TOKEN` | ✅ YES | Vercel personal access token | [Vercel dashboard → Account settings → Tokens](https://vercel.com/account/tokens) |
| `VITE_SUPABASE_URL` | ✅ YES | Supabase project URL | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | ✅ YES | Supabase public anon key | [Supabase Dashboard → Settings → API → "anon" key](https://supabase.com/dashboard/project/your-project-ref/settings/api) |
| `VERCEL_ORG_ID` | ❌ Optional | Vercel team/org ID | Only needed for org-scoped projects |
| `VERCEL_PROJECT_ID` | ❌ Optional | Vercel project ID | Only needed for explicit project targeting |

> **Note:** `VITE_STRIPE_PUBLISHABLE_KEY` and `SITE_URL` are not required for the frontend build.
> `SITE_URL` is only used by Supabase Edge Functions (set it there instead).

#### Trigger a Deploy
1. Go to **GitHub repo → Actions → Deploy to Vercel → Run workflow**

### Option B: Vercel Native GitHub Integration
Connect the repo to Vercel directly in the Vercel dashboard for automatic deploys on push.
Configure these environment variables in the **Vercel Project Settings → Environment Variables**:

| Variable | Required | Value |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ YES | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | ✅ YES | Your Supabase anon key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ❌ Optional | Your Stripe publishable key (if using Stripe frontend) |
| `SITE_URL` | ❌ Optional | `https://elpasosbestlawyers.com` |

---

## 2) Supabase Edge Functions

These stay deployed on Supabase — **do not** put their secrets in GitHub or Vercel.

```bash
npm i -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy create-checkout --project-ref your-project-ref
supabase functions deploy stripe-webhook --project-ref your-project-ref
supabase secrets set \
  STRIPE_SECRET_KEY="sk_live_..." \
  SUPABASE_SERVICE_ROLE_KEY="service-role-key" \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  SITE_URL="https://elpasosbestlawyers.com" \
  --project-ref your-project-ref
```

### Supabase Function Secrets (set in Supabase dashboard, NOT GitHub)

| Secret | Required | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | For Stripe integration | Stripe secret key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | For Stripe webhooks | From Stripe → Webhooks → signing secret |
| `SUPABASE_SERVICE_ROLE_KEY` | For admin operations | From Supabase → Settings → API → service_role key |
| `SITE_URL` | For redirect URLs | `https://elpasosbestlawyers.com` |

---

## 3) Environment Variables by Stage

| Variable | GitHub Secret | Vercel Project | Supabase Secrets |
|---|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | ✅ | — |
| `VITE_SUPABASE_ANON_KEY` | ✅ | ✅ | — |
| `VERCEL_TOKEN` | ✅ | — | — |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ❌ Optional | ❌ Optional | — |
| `SITE_URL` | — | ❌ Optional | ✅ |
| `STRIPE_SECRET_KEY` | — | — | ✅ |
| `STRIPE_WEBHOOK_SECRET` | — | — | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | — | — | ✅ |
| `VERCEL_ORG_ID` | ❌ Optional | — | — |
| `VERCEL_PROJECT_ID` | ❌ Optional | — | — |

---

## 4) Local Development

```bash
cd "EP BEST LAWYERS"
cp .env.example .env
# Edit .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Open: http://localhost:5173

---

## 5) Notes

- **Project name**: The Vercel project is named `best-ep-lawyers` (explicit in `vercel.json` and the deploy command) to avoid the `---` naming error caused by the repository's trailing hyphens.
- **Stripe**: Stripe frontend integration (`VITE_STRIPE_PUBLISHABLE_KEY`) is optional and not in active use. Stripe server-side logic runs in Supabase functions.
- After deploying, configure the Stripe webhook endpoint to point to the deployed `stripe-webhook` function URL and update `STRIPE_WEBHOOK_SECRET` in Supabase secrets.
- After deploying, add your Vercel domain to Supabase → Authentication → URL Configuration → Redirect URLs:
  `https://your-project.vercel.app/auth/callback`
