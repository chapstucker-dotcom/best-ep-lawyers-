# Attorney Directory - Local Testing Guide

## Quick Start

### Step 1: Set Up Environment
1. Copy `.env.example` to `.env`
2. Get your Supabase anon key from: https://supabase.com/dashboard/project/yvcuhnnhspqjfnrbkhok/settings/api
3. Update `.env` with your anon key

### Step 2: Run Migrations
Go to Supabase SQL Editor and run these files **in order**:
1. `supabase/migrations/001_create_firms_table.sql`
2. `supabase/migrations/002_create_reviews_table.sql`
3. `supabase/migrations/003_create_analytics_table.sql`
4. `supabase/migrations/004_create_subscriptions_table.sql`
5. `supabase/migrations/005_create_storage_buckets.sql`
6. `supabase/migrations/006_create_helper_functions.sql`

### Step 3: Start Development
```bash
npm install
npm run dev
```
Open: http://localhost:5173

## Testing Checklist

### Authentication
- [ ] Sign up with email/password
- [ ] Check email for confirmation
- [ ] Log in with credentials
- [ ] Reset password flow

### Firm Profile (Dashboard)
- [ ] Create firm profile
- [ ] Upload logo
- [ ] Edit firm details
- [ ] Add specialties

### Reviews
- [ ] Submit review on firm
- [ ] Approve/reject reviews in dashboard

### Subscriptions (requires Stripe)
- [ ] View pricing plans
- [ ] Initiate checkout
- [ ] Test card: 4242 4242 4242 4242

### Analytics
- [ ] View profile stats
- [ ] Track clicks

## Troubleshooting

**"Invalid API key"** - Check `.env` has correct anon key, restart dev server

**Tables not found** - Run all migrations in order in SQL Editor

**Auth not working** - Enable Email auth in Supabase > Authentication > Providers
