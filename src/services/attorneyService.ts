import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AttorneyProfile, AttorneyProfileInput } from '@/data/attorneyTypes';
import { getPlanRules } from '@/config/planRules';

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

  async createAttorney(
    firmId: string,
    attorney: AttorneyProfileInput
  ): Promise<AttorneyProfile> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured');
    }

    const { data: firm, error: firmError } = await supabase
      .from('firms')
      .select('plan, plan_key')
      .eq('id', firmId)
      .maybeSingle();

    if (firmError) {
      throw firmError;
    }

    if (!firm) {
      throw new Error('Firm profile could not be found');
    }

    const planName =
      firm.plan_key ??
      firm.plan ??
      'free';

    const planRules =
      getPlanRules(planName);

    const attorneyLimit =
      planRules.attorneyLimit;

    if (attorneyLimit === 0) {
      throw new Error(
        `${planRules.displayName} does not include attorney profiles. Upgrade your plan to add attorneys.`
      );
    }

    const { count, error: countError } = await supabase
      .from('attorney_profiles')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('firm_id', firmId);

    if (countError) {
      throw countError;
    }

    const currentCount =
      count ?? 0;

    if (currentCount >= attorneyLimit) {
      throw new Error(
        `${planRules.displayName} includes up to ${attorneyLimit} attorney profiles. Delete an existing profile or upgrade your plan before adding another.`
      );
    }

    const { data, error } = await supabase
      .from('attorney_profiles')
      .insert([
        {
          ...attorney,
          firm_id: firmId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAttorney(
    id: string,
    attorney: Partial<AttorneyProfileInput>
  ): Promise<AttorneyProfile> {
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

    const fileExt =
      file.name.split('.').pop();

    const fileName =
      `${Math.random()}.${fileExt}`;

    const filePath =
      `${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from('attorney-photos')
        .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from('attorney-photos')
        .getPublicUrl(filePath);

    return data.publicUrl;
  },
};