import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Firm } from '@/data/types';

export interface FirmInput {
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
}

// Create a new firm profile
export const createFirm = async (firmData: FirmInput): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase is not configured' } };
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('firms')
    .insert([{ ...firmData, user_id: user.id }])
    .select()
    .single();

  return { data, error };
};

// Get firm by user ID
export const getFirmByUserId = async (userId: string): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('firms')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

// Get firm by ID
export const getFirmById = async (firmId: string): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('firms')
    .select('*')
    .eq('id', firmId)
    .single();

  return { data, error };
};

// Update firm profile
export const updateFirm = async (firmId: string, updates: Partial<FirmInput>): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase is not configured' } };
  }
  
  const { data, error } = await supabase
    .from('firms')
    .update(updates)
    .eq('id', firmId)
    .select()
    .single();

  return { data, error };
};

// Delete firm profile
export const deleteFirm = async (firmId: string): Promise<{ error: any }> => {
  if (!isSupabaseConfigured) {
    return { error: { message: 'Supabase is not configured' } };
  }
  
  const { error } = await supabase
    .from('firms')
    .delete()
    .eq('id', firmId);

  return { error };
};

// Get all firms (for admin or public listing)
export const getAllFirms = async (): Promise<{ data: Firm[] | null; error: any }> => {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }
  
  const { data, error } = await supabase
    .from('firms')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};


