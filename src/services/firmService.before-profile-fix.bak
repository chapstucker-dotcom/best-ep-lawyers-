import { firms as localFirms } from "@/data/firms";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Firm } from "@/data/types";

type FirmInput = Partial<Firm> & Record<string, unknown>;

type FirmResult = {
  data: Firm | null;
  error: unknown;
};

const fallbackFirms = (): Firm[] =>
  localFirms.map((firm: any, index: number) => ({
    id: String(index + 1),
    user_id: "",
    name: firm.name,
    description: firm.bio,
    phone: firm.phone,
    website: firm.website,
    address: firm.address,
    city: "El Paso",
    state: "TX",
    zip_code: "",
    specialties: [firm.category],
    is_featured: firm.featured ?? false,
    is_verified: firm.verified ?? false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as Firm[];

const notConfiguredError = { message: "Supabase is not configured" };

export const getAllFirms = async (): Promise<{ data: Firm[] | null; error: unknown }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackFirms(), error: null };
  }

  const { data, error } = await supabase
    .from("firms")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    data: data && data.length > 0 ? (data as Firm[]) : fallbackFirms(),
    error,
  };
};

export const getFirmByUserId = async (userId: string): Promise<FirmResult> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfiguredError };
  }

  const { data, error } = await supabase
    .from("firms")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return { data: data as Firm | null, error };
};

export const createFirm = async (firm: FirmInput): Promise<FirmResult> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfiguredError };
  }

  if (!firm.user_id) {
    return { data: null, error: { message: "A signed-in user is required to create a firm profile." } };
  }

  const { data, error } = await supabase
    .from("firms")
    .insert(firm)
    .select("*")
    .single();

  return { data: data as Firm | null, error };
};

export const updateFirm = async (firmId: string, updates: FirmInput): Promise<FirmResult> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfiguredError };
  }

  const { data, error } = await supabase
    .from("firms")
    .update(updates)
    .eq("id", firmId)
    .select("*")
    .single();

  return { data: data as Firm | null, error };
};

export const deleteFirm = async (firmId: string): Promise<{ error: unknown }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: notConfiguredError };
  }

  const { error } = await supabase.from("firms").delete().eq("id", firmId);
  return { error };
};
