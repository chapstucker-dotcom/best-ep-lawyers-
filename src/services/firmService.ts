import { firms as localFirms } from "@/data/firms";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Firm } from "@/data/types";

type FirmInput = Partial<Firm> & Record<string, any>;

const fallbackFirms = (): Firm[] =>
  localFirms.map((firm: any, index: number) => ({
    id: String(index + 1),
    name: firm.name,
    category: firm.category,
    phone: firm.phone,
    website: firm.website,
    address: firm.address,
    bio: firm.bio,
    is_featured: firm.featured ?? false,
    is_exclusive: firm.exclusive ?? false,
    is_verified: firm.verified ?? false,
    created_at: new Date().toISOString(),
  })) as Firm[];

export const getAllFirms = async (): Promise<{ data: Firm[] | null; error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackFirms(), error: null };
  }

  const { data, error } = await supabase
    .from("firms")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    data: data && data.length > 0 ? data : fallbackFirms(),
    error,
  };
};

export const createFirm = async (
  firm: FirmInput
): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: { message: "Supabase is not configured" } };
  }

  const { data, error } = await supabase
    .from("firms")
    .insert(firm)
    .select()
    .single();

  return { data, error };
};

export const updateFirm = async (
  firmId: string,
  updates: FirmInput
): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: { message: "Supabase is not configured" } };
  }

  const { data, error } = await supabase
    .from("firms")
    .update(updates)
    .eq("id", firmId)
    .select()
    .single();

  return { data, error };
};

export const deleteFirm = async (
  firmId: string
): Promise<{ error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: "Supabase is not configured" } };
  }

  const { error } = await supabase
    .from("firms")
    .delete()
    .eq("id", firmId);

  return { error };
};