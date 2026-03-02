// Database types matching Supabase schema

export interface Firm {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  specialties?: string[];
  years_experience?: number;
  team_size?: number;
  consultation_fee?: number;
  is_verified: boolean;
  is_featured: boolean;
  slug?: string;
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