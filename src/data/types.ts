// Canonical application types aligned with the current firm platform model.
// Some fields remain optional because local fallback records and Supabase rows
// are not yet guaranteed to contain the same complete shape.

export interface Firm {
  id: string;
  user_id: string;
  name: string;

  // Public profile
  description?: string | null;
  bio?: string | null;
  blurb?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  zip_code?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  slug?: string | null;

  // Canonical legal-market and specialty assignment
  category?: string | null;
  primary_category?: string | null;
  categories?: string[] | null;
  practice_areas?: string[] | null;
  specialties?: string[] | null;

  // Commercial placement / legacy compatibility
  plan?: string | null;
  plan_key?: string | null;
  is_featured: boolean;
  featured?: boolean | null;
  exclusive?: boolean | null;
  is_verified: boolean;
  verified?: boolean | null;

  // Enhanced profile fields
  years_experience?: number | string | null;
  team_size?: number | string | null;
  consultation_fee?: number | string | null;
  office_hours?: string | null;
  languages?: string[] | null;
  awards?: string[] | null;
  linkedin_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  google_maps_url?: string | null;
  gallery_urls?: string[] | null;

  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  firm_id: string;
  user_id?: string;
  reviewer_name: string;
  reviewer_email?: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  firm_id: string;
  event_type: 'view' | 'click_phone' | 'click_email' | 'click_website';
  visitor_ip?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  firm_id: string;
  user_id: string;
  plan_type: 'basic' | 'professional' | 'expert';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  attorney_profile_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonth: number;
  features: string[];
  stripePriceId: string;
  isFeatured: boolean;
  attorneyProfileLimit: number;
  additionalAttorneyPrice: number; // Price per additional attorney profile
}
