import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AttorneyProfile, AttorneyProfileInput } from '@/data/attorneyTypes';

export const attorneyService = {
  async getAttorneysByFirm(firmId: string): Promise<AttorneyProfile[]> {
    if (!isSupabaseConfigured) return [];
    
    const { data, error } = await supabase
      .from('attorney_profiles')
      .select('*')
      .eq('firm_id', firmId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllAttorneysByFirm(firmId: string): Promise<AttorneyProfile[]> {
    if (!isSupabaseConfigured) return [];
    
    const { data, error } = await supabase
      .from('attorney_profiles')
      .select('*')
      .eq('firm_id', firmId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAttorneyById(id: string): Promise<AttorneyProfile | null> {
    if (!isSupabaseConfigured) return null;
    
    const { data, error } = await supabase
      .from('attorney_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createAttorney(firmId: string, attorney: AttorneyProfileInput): Promise<AttorneyProfile> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured');
    }
    
    const { data, error } = await supabase
      .from('attorney_profiles')
      .insert([{ ...attorney, firm_id: firmId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAttorney(id: string, attorney: Partial<AttorneyProfileInput>): Promise<AttorneyProfile> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured');
    }
    
    const { data, error } = await supabase
      .from('attorney_profiles')
      .update(attorney)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAttorney(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured');
    }
    
    const { error } = await supabase
      .from('attorney_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadPhoto(file: File): Promise<string> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attorney-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('attorney-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};


