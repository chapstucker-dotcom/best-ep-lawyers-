# Deployment Guide — Vercel + Supabase Functions

Overview
- Frontend: Vite React app — deploy to Vercel as a static site
- Server: Supabase Edge Functions (Deno) — keep deployed on Supabase

1) Frontend -> Vercel
- Create a Vercel project and connect this repository.
- Build command: `npm run build`
- Output directory: `dist` (Vercel auto-reads `vercel.json`)
- Set these Environment Variables in the Vercel Project (Production):
  - `VITE_SUPABASE_URL` = your Supabase URL
  - `VITE_SUPABASE_ANON_KEY` = your Supabase anon/public key
  - `SITE_URL` = https://elpasosbestlawyers.com
  - (optional) `VITE_STRIPE_PUBLISHABLE_KEY` if your frontend uses Stripe Elements

2) Supabase Functions (recommended to stay on Supabase)
- Install and login: `npm i -g supabase` (or use Homebrew/other installers)
- Link to your project: `supabase login` then `supabase link --project-ref <ref>`
- Deploy functions:
  - `supabase functions deploy create-checkout --project-ref <ref>`
  - `supabase functions deploy stripe-webhook --project-ref <ref>`
- Set secrets for functions (example):
  - `supabase secrets set STRIPE_SECRET_KEY="sk_live_..." SUPABASE_SERVICE_ROLE_KEY="service-role-key" STRIPE_WEBHOOK_SECRET="whsec_..."`

Notes
- The project expects the frontend to call Supabase Functions via the Supabase client (no proxy required).
- Keep the Stripe secret keys and Supabase service role key only in server-side environments (Supabase functions/secrets).
- After deploying, configure Stripe webhook endpoint to point to the deployed `stripe-webhook` function URL and set the webhook secret in Supabase secrets.

Local build & test
- Install deps: `npm ci`
- Dev: `npm run dev`
- Build locally: `npm run build`
- Preview built site: `npm run preview`

GitHub Actions → Vercel CI (`.github/workflows/vercel-deploy.yml`)

The workflow deploys automatically on every push to `main` and can also be triggered manually.

Required GitHub repository secrets (Settings → Secrets and variables → Actions):

| Secret | Required | Description | Where to get it |
|---|---|---|---|
| `VERCEL_TOKEN` | ✅ Yes | Vercel API token for authentication | https://vercel.com/account/tokens |
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL (baked into frontend build) | Supabase dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon/public key (baked into frontend build) | Supabase dashboard → Settings → API → anon key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ⚪ Optional | Stripe publishable key for payment UI | https://dashboard.stripe.com/apikeys |

Where each variable belongs:

- **GitHub Secrets** (used by the workflow for the Vite build and Vercel deploy):
  `VERCEL_TOKEN`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`

- **Supabase Secrets only** (server-side Edge Functions — never in GitHub or Vercel):
  `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`

- **Supabase Authentication config only** (not a secret, set in Supabase dashboard):
  `SITE_URL` — go to Authentication → URL Configuration and add your production domain

Note on `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`: These are optional. The workflow uses
`--name=best-ep-lawyers` to set the project name directly, avoiding the repository name
validation issue (the repo name `best-ep-lawyers-` contains a trailing hyphen that Vercel
rejects as `---` when combined with auto-generated slugs).
