import { firms as localFirms } from "@/data/firms";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Firm } from "@/data/types";
import { FIRM_SELECT_COLUMNS } from "@/services/firmSelectColumns";

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
  (localFirms as LocalFirm[]).map((firm) => ({
    id: firm.id ?? (() => { throw new Error(`Local firm "${firm.name}" is missing a canonical id.`); })(),
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

// Only ordinary profile fields may be submitted by browser-side profile saves.
// Commercial entitlements, ownership, approval, and billing are server-managed.
// The database must independently enforce these restrictions (including video access).
const EDITABLE_PROFILE_FIELDS = [
  "name", "slug", "description", "phone", "email", "website",
  "address", "city", "state", "zip", "zip_code", "bio",
  "category", "logo_url", "practice_areas", "image_url", "banner_url",
  "primary_category", "specialties", "years_experience",
  "consultation_free", "accepts_payment_plans", "languages",
  "team_size", "consultation_fee", "office_hours",
  "awards", "google_maps_url", "gallery_urls", "facebook_url",
  "linkedin_url", "twitter_url", "instagram_url",
] as const;

// Fields that influence paid placement or canonical routing may be supplied
// during initial registration, but cannot be changed by a browser-side update.
const REGISTRATION_ONLY_FIELDS = new Set([
  "slug", "category", "primary_category", "practice_areas",
]);

const safeProfileFields = (
  input: FirmInput,
  mode: "insert" | "update"
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key of EDITABLE_PROFILE_FIELDS) {
    if ((mode === "insert" || !REGISTRATION_ONLY_FIELDS.has(key)) &&
        Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined) {
      result[key] = input[key];
    }
  }
  return result;
};

const restrictedWrite = {
  message: "This operation must be performed through an authorized server endpoint.",
};

const notConfigured = {
  message: "Supabase is not configured",
};

const hasRemoteValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const mergeFirmRecords = (localFirm: Firm, remoteFirm: Firm): Firm => {
  const merged = { ...localFirm } as Firm & Record<string, unknown>;

  for (const [key, value] of Object.entries(remoteFirm)) {
    if (hasRemoteValue(value)) {
      merged[key] = value;
    }
  }

  merged.id = localFirm.id;
  return merged as Firm;
};

const normalizeFirmName = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

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
    .select(FIRM_SELECT_COLUMNS)
    .order("created_at", {
      ascending: false,
    });

  const remote = (data ?? []) as Firm[];

  const merged = remote.map((remoteFirm) => {
    const localMatch = local.find(
      (localFirm) =>
        localFirm.id === remoteFirm.id ||
        normalizeFirmName(localFirm.name ?? "") ===
          normalizeFirmName(remoteFirm.name ?? "")
    );

    return localMatch
      ? mergeFirmRecords(localMatch, remoteFirm)
      : remoteFirm;
  });

  for (const localFirm of local) {
    const alreadyExists = remote.some(
      (remoteFirm) =>
        remoteFirm.id === localFirm.id ||
        normalizeFirmName(remoteFirm.name ?? "") ===
          normalizeFirmName(localFirm.name ?? "")
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

export const getFirmById = async (
  firmId: string
): Promise<{
  data: Firm | null;
  error: any;
}> => {
  const localFirm = getLocalFirmById(firmId);

  if (!isSupabaseConfigured || !supabase) {
    return {
      data: localFirm,
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("firms")
    .select(FIRM_SELECT_COLUMNS)
    .eq("id", firmId)
    .maybeSingle();

  if (error) {
    return {
      data: localFirm,
      error,
    };
  }

  const remoteFirm = (data ?? null) as Firm | null;

  if (localFirm && remoteFirm) {
    return {
      data: mergeFirmRecords(localFirm, remoteFirm),
      error: null,
    };
  }

  return {
    data: remoteFirm ?? localFirm,
    error: null,
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
    .select(FIRM_SELECT_COLUMNS)
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
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: notConfigured };
  }

  // Verify the authenticated identity rather than trusting a caller-supplied ID.
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user || authData.user.id !== userId) {
    return { data: null, error: { message: "Not authorized to edit this firm." } };
  }

  const updateFields = safeProfileFields(profile, "update");
  const insertFields = safeProfileFields(profile, "insert");
  if (Object.keys(insertFields).length === 0) {
    return { data: null, error: { message: "No editable profile fields were provided." } };
  }

  // A registration-only payload must not create an empty UPDATE request.
  const updateResult = Object.keys(updateFields).length > 0
    ? await supabase
    .from("firms")
    .update(updateFields)
    .eq("user_id", userId)
    .select(FIRM_SELECT_COLUMNS)
    .maybeSingle()
    : { data: null, error: null };

  if (updateResult.error) {
    return { data: null, error: updateResult.error };
  }
  if (updateResult.data) {
    return { data: updateResult.data as Firm, error: null };
  }
  if (Object.keys(updateFields).length === 0) {
    const existing = await supabase.from("firms").select(FIRM_SELECT_COLUMNS)
      .eq("user_id", userId).maybeSingle();
    if (existing.error) return { data: null, error: existing.error };
    if (existing.data) return { data: existing.data as Firm, error: null };
  }

  // Registration only supplies ordinary profile details plus the authenticated
  // owner ID. Plan/approval/verification/payment status come from DB defaults.
  const insertResult = await supabase
    .from("firms")
    .insert({ ...insertFields, user_id: authData.user.id })
    .select(FIRM_SELECT_COLUMNS)
    .single();

  return {
    data: (insertResult.data as Firm | null) ?? null,
    error: insertResult.error,
  };
};

// No active application callers remain. Keep these exports for compatibility,
// but prevent accidental browser-side bypass of server-controlled workflows.
export const createFirm = async (
  _firm: FirmInput
): Promise<{ data: Firm | null; error: any }> => ({
  data: null,
  error: restrictedWrite,
});

export const updateFirm = async (
  _firmId: string,
  _updates: FirmInput
): Promise<{ data: Firm | null; error: any }> => ({
  data: null,
  error: restrictedWrite,
});

export const deleteFirm = async (
  _firmId: string
): Promise<{ error: any }> => ({
  error: restrictedWrite,
});
