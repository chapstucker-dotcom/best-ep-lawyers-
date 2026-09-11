import { firms as localFirms } from "@/data/firms";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Firm } from "@/data/types";

type FirmInput = Partial<Firm> & Record<string, unknown>;

type LocalFirm = {
  id?: string;
  name: string;
  category?: string;
  categories?: string[];
  specialties?: string[];
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  bio?: string;
  description?: string;
  logo?: string;
  logo_url?: string;
  featured?: boolean;
  exclusive?: boolean;
  verified?: boolean;
  plan?: string;
  plan_key?: string;
  video_url?: string;
  years_experience?: number | string;
  team_size?: number | string;
  consultation_fee?: number | string;
  office_hours?: string;
  languages?: string[];
  awards?: string[];
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  google_maps_url?: string;
  gallery_urls?: string[];
};

const fallbackFirms = (): Firm[] =>
  (localFirms as LocalFirm[]).map((firm, index) => ({
    id: firm.id ?? String(index + 1),
    user_id: "",
    name: firm.name,

    description:
      firm.description ??
      firm.bio ??
      "",

    phone: firm.phone ?? "",
    email: firm.email ?? "",
    website: firm.website ?? "",
    address: firm.address ?? "",

    city: firm.city ?? "El Paso",
    state: firm.state ?? "TX",
    zip_code: firm.zip_code ?? "",

    specialties:
      firm.specialties ??
      (firm.category
        ? [firm.category]
        : []),

    categories:
      firm.categories ??
      (firm.category
        ? [firm.category]
        : []),

    category: firm.category ?? "",

    plan:
      firm.plan ??
      firm.plan_key ??
      "free",

    plan_key:
      firm.plan_key ??
      firm.plan ??
      "free",

    is_featured:
      firm.featured ?? false,

    featured:
      firm.featured ?? false,

    exclusive:
      firm.exclusive ?? false,

    is_verified:
      firm.verified ?? false,

    verified:
      firm.verified ?? false,

    logo: firm.logo ?? "",
    logo_url: firm.logo_url ?? "",

    video_url: firm.video_url ?? "",
    years_experience: firm.years_experience ?? 0,
    team_size: firm.team_size ?? 0,
    consultation_fee: firm.consultation_fee ?? 0,
    office_hours: firm.office_hours ?? "",
    languages: firm.languages ?? [],
    awards: firm.awards ?? [],
    linkedin_url: firm.linkedin_url ?? "",
    facebook_url: firm.facebook_url ?? "",
    instagram_url: firm.instagram_url ?? "",
    google_maps_url: firm.google_maps_url ?? "",
    gallery_urls: firm.gallery_urls ?? [],

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as Firm[];

export const getLocalFirmById = (
  firmId: string
): Firm | null =>
  fallbackFirms().find(
    (firm) => firm.id === firmId
  ) ?? null;

const notConfigured = {
  message: "Supabase is not configured",
};

export const getAllFirms = async (): Promise<{
  data: Firm[] | null;
  error: any;
}> => {
  const local = fallbackFirms();

  if (!isSupabaseConfigured || !supabase) {
    return {
      data: local,
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("firms")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  const remote =
    (data ?? []) as Firm[];

  const normalizeName = (
    value: string
  ) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const merged = [...remote];

  for (const localFirm of local) {
    const alreadyExists =
      remote.some(
        (remoteFirm) =>
          normalizeName(
            remoteFirm.name ?? ""
          ) ===
          normalizeName(
            localFirm.name ?? ""
          )
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

export const getFirmByUserId = async (
  userId: string
) => {
  if (
    !isSupabaseConfigured ||
    !supabase
  ) {
    return {
      data: null,
      error: notConfigured,
    };
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
): Promise<{
  data: Firm | null;
  error: any;
}> => {
  if (
    !isSupabaseConfigured ||
    !supabase
  ) {
    return {
      data: null,
      error: notConfigured,
    };
  }

  const updateResult =
    await supabase
      .from("firms")
      .update({
        ...profile,
        user_id: userId,
      })
      .eq("user_id", userId)
      .select("*")
      .maybeSingle();

  if (updateResult.error) {
    return {
      data: null,
      error: updateResult.error,
    };
  }

  if (updateResult.data) {
    return {
      data:
        updateResult.data as Firm,
      error: null,
    };
  }

  const insertResult =
    await supabase
      .from("firms")
      .insert({
        ...profile,
        user_id: userId,
      })
      .select("*")
      .single();

  return {
    data:
      (insertResult.data as
        | Firm
        | null) ?? null,
    error: insertResult.error,
  };
};

export const createFirm = async (
  firm: FirmInput
): Promise<{
  data: Firm | null;
  error: any;
}> => {
  if (
    !isSupabaseConfigured ||
    !supabase
  ) {
    return {
      data: null,
      error: notConfigured,
    };
  }

  const { data, error } =
    await supabase
      .from("firms")
      .insert(firm)
      .select("*")
      .single();

  return {
    data: data as Firm | null,
    error,
  };
};

export const updateFirm = async (
  firmId: string,
  updates: FirmInput
): Promise<{
  data: Firm | null;
  error: any;
}> => {
  if (
    !isSupabaseConfigured ||
    !supabase
  ) {
    return {
      data: null,
      error: notConfigured,
    };
  }

  const { data, error } =
    await supabase
      .from("firms")
      .update(updates)
      .eq("id", firmId)
      .select("*")
      .single();

  return {
    data: data as Firm | null,
    error,
  };
};

export const deleteFirm = async (
  firmId: string
): Promise<{
  error: any;
}> => {
  if (
    !isSupabaseConfigured ||
    !supabase
  ) {
    return {
      error: notConfigured,
    };
  }

  const { error } =
    await supabase
      .from("firms")
      .delete()
      .eq("id", firmId);

  return { error };
};
