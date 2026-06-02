export interface AttorneyProfile {
  id: string;
  firm_id: string;
  name: string;
  title?: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  education?: string[];
  bar_admissions?: string[];
  email?: string;
  phone?: string;
  linkedin_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttorneyProfileInput {
  name: string;
  title?: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  education?: string[];
  bar_admissions?: string[];
  email?: string;
  phone?: string;
  linkedin_url?: string;
  display_order?: number;
  is_active?: boolean;
}


