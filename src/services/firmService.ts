import { firms as localFirms } from "@/data/firms";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Firm } from "@/data/types";

type FirmInput = Partial<Firm> & Record<string, unknown>;

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
  }));

const notConfigured = { message: "Supabase is not configured" };

export const getAllFirms = async (): Promise<{
  data: Firm[] | null;
  error: any;
}> => {
  const local = fallbackFirms();

  if (!isSupabaseConfigured || !supabase) {
    return { data: local, error: null };
  }

  const { data, error } = await supabase
    .from("firms")
    .select("*")
    .order("created_at", { ascending: false });

  const remote = (data ?? []) as Firm[];

  const normalizeName = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const merged = [...remote];

  for (const localFirm of local) {
    const alreadyExists = remote.some(
      (remoteFirm) =>
        normalizeName(remoteFirm.name ?? "") ===
        normalizeName(localFirm.name ?? "")
    );

    if (!alreadyExists) {
      merged.push(localFirm);
    }
  }

  return {
    data: merged,
    error,
  };
};

export const getFirmByUserId = async (userId: string) => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfigured };
  }

  return supabase
    .from("firms")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
};

export const saveFirmProfile = async (
  userId: string,
  profile: FirmInput
): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfigured };
  }

  // Update first. This works even if the database does not have a unique
  // constraint on user_id, which makes it safer than upsert(onConflict).
  const updateResult = await supabase
    .from("firms")
    .update({ ...profile, user_id: userId })
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (updateResult.error) {
    return { data: null, error: updateResult.error };
  }

  if (updateResult.data) {
    return { data: updateResult.data as Firm, error: null };
  }

  const insertResult = await supabase
    .from("firms")
    .insert({ ...profile, user_id: userId })
    .select("*")
    .single();

  return {
    data: (insertResult.data as Firm | null) ?? null,
    error: insertResult.error,
  };
};

export const createFirm = async (
  firm: FirmInput
): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfigured };
  }

  const { data, error } = await supabase
    .from("firms")
    .insert(firm)
    .select("*")
    .single();

  return { data: data as Firm | null, error };
};

export const updateFirm = async (
  firmId: string,
  updates: FirmInput
): Promise<{ data: Firm | null; error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfigured };
  }

  const { data, error } = await supabase
    .from("firms")
    .update(updates)
    .eq("id", firmId)
    .select("*")
    .single();

  return { data: data as Firm | null, error };
};

export const deleteFirm = async (firmId: string): Promise<{ error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: notConfigured };
  }

  const { error } = await supabase.from("firms").delete().eq("id", firmId);
  return { error };
};
