# Supabase Database Setup Instructions

## Project Reference
Your Supabase project reference: `yvcuhnnhspqjfnrbkhok`

## Setup Steps

### 1. Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard/project/yvcuhnnhspqjfnrbkhok
2. Navigate to the SQL Editor in the left sidebar

### 2. Run Migration Scripts (in order)
Execute each migration file in the SQL Editor:

1. **001_create_firms_table.sql** - Creates firms table with RLS policies
2. **002_create_reviews_table.sql** - Creates reviews table with RLS policies
3. **003_create_analytics_table.sql** - Creates analytics tracking table
4. **004_create_subscriptions_table.sql** - Creates subscriptions table
5. **005_create_storage_buckets.sql** - Creates storage bucket for firm logos
6. **006_create_helper_functions.sql** - Creates helper functions and triggers

### 3. Verify Setup
After running all migrations, verify:
- All tables are created in the `public` schema
- Row Level Security is enabled on all tables
- Storage bucket `firm-logos` is created
- All policies are active

### 4. Update Environment Variables
Make sure your `.env` file has:
```
VITE_SUPABASE_URL=https://yvcuhnnhspqjfnrbkhok.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Schema Overview

### Tables Created:
- **firms** - Law firm profiles with contact info, specialties, etc.
- **reviews** - Client reviews for firms (with approval system)
- **analytics** - Track profile views and interactions
- **subscriptions** - Manage firm subscription plans

### Security:
- Row Level Security (RLS) enabled on all tables
- Firms can only edit their own profiles
- Users can only see their own analytics
- Public can view approved reviews and firm profiles

## Next Steps
After setup, the application will be able to:
- Register new law firms
- Store and retrieve firm profiles
- Track analytics
- Manage subscriptions
- Upload firm logos to storage
