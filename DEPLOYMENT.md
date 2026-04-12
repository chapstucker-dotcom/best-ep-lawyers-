# Deployment Guide — Vercel + Supabase Functions

## Overview
- **Frontend**: Vite/React app — deployed to Vercel as a static site
- **Server**: Supabase Edge Functions (Deno) — deployed and run on Supabase

---

## 1) Frontend → Vercel

### GitHub Actions workflow (recommended)
The workflow in `.github/workflows/vercel-deploy.yml` builds the app locally (so VITE_ secrets are
baked into the static bundle) and then uploads the pre-built output to Vercel.

**Required GitHub repository secrets** (Settings → Secrets and variables → Actions):

| Secret name | Description | Required? |
|---|---|---|
| `VERCEL_TOKEN` | Vercel personal access token | ✅ YES |
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ YES |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | ✅ YES |
| `VERCEL_PROJECT_ID` | Vercel project ID (from Project Settings) | Recommended |
| `VERCEL_ORG_ID` | Vercel org/team ID (from Team Settings) | Recommended |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (frontend) | Optional |
| `SITE_URL` | Production URL, e.g. `https://elpasosbestlawyers.com` | Optional |

> **Why `VERCEL_PROJECT_ID` + `VERCEL_ORG_ID` are recommended:** Without them the Vercel CLI
> auto-detects the project name from the repository name. The repository name `best-ep-lawyers-`
> produces an invalid project name containing `---`. Providing the IDs explicitly bypasses
> auto-detection entirely. If you omit them, the workflow falls back to linking with the explicit
> project name `elpaso-best-lawyers`.

**Where to find Vercel IDs:**
- `VERCEL_TOKEN` — Vercel Dashboard → Account Settings → Tokens
- `VERCEL_PROJECT_ID` — Vercel Dashboard → Your Project → Settings → General → Project ID
- `VERCEL_ORG_ID` — Vercel Dashboard → Team Settings → General → Team ID (or account ID)

**Where to find Supabase keys:**
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Supabase Dashboard →
  [Project Settings → API](https://supabase.com/dashboard/project/yvcuhnnhspqjfnrbkhok/settings/api)

### Manual Vercel dashboard setup (alternative)
1. Connect this GitHub repository to a Vercel project.
2. Set **Root Directory** to `EP BEST LAWYERS`.
3. Build command: `npm run build` | Output directory: `dist`
4. Add the following **Environment Variables** in the Vercel Project settings:

| Variable | Value | Environment |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://yvcuhnnhspqjfnrbkhok.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | *(from Supabase Dashboard → Settings → API)* | Production, Preview |
| `SITE_URL` | `https://elpasosbestlawyers.com` | Production |
| `VITE_STRIPE_PUBLISHABLE_KEY` | *(from Stripe Dashboard)* | Production *(optional)* |

### Environment variable classification

| Variable | Location | Visible in browser? | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | GitHub Secret + Vercel Env | ✅ Yes (public) | Baked into static bundle |
| `VITE_SUPABASE_ANON_KEY` | GitHub Secret + Vercel Env | ✅ Yes (public) | Intentionally public key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | GitHub Secret + Vercel Env | ✅ Yes (public) | Publishable key, safe to expose |
| `SITE_URL` | GitHub Secret + Vercel Env | ✅ Yes | Used by Supabase auth |
| `VERCEL_TOKEN` | GitHub Secret only | ❌ No | CI auth — never expose |
| `VERCEL_PROJECT_ID` | GitHub Secret only | ❌ No | CI config — never expose |
| `VERCEL_ORG_ID` | GitHub Secret only | ❌ No | CI config — never expose |
| `STRIPE_SECRET_KEY` | Supabase secrets only | ❌ No | Server-side only |
| `STRIPE_WEBHOOK_SECRET` | Supabase secrets only | ❌ No | Server-side only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets only | ❌ No | Server-side only |

---

## 2) Supabase Edge Functions

Keep Stripe and service-role secrets in Supabase (never in GitHub or Vercel):

```bash
# Install and login
npm install -g supabase
supabase login
supabase link --project-ref yvcuhnnhspqjfnrbkhok

# Deploy functions
supabase functions deploy create-checkout --project-ref yvcuhnnhspqjfnrbkhok
supabase functions deploy stripe-webhook --project-ref yvcuhnnhspqjfnrbkhok

# Set server-side secrets (Supabase secrets — NOT GitHub secrets)
supabase secrets set \
  STRIPE_SECRET_KEY="sk_live_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
  SITE_URL="https://elpasosbestlawyers.com"
```

> After deploying, configure the Stripe webhook endpoint to point to the deployed
> `stripe-webhook` function URL and update `STRIPE_WEBHOOK_SECRET` in Supabase secrets.

---

## 3) Local development

```bash
# Clone and install
cd "EP BEST LAWYERS"
cp .env.example .env
# Edit .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run preview    # preview production build locally
```

