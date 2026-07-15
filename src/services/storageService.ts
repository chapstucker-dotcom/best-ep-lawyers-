import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BUCKET_NAME = "firm-logos";

export const uploadLogo = async (
  file: File,
  userId: string
): Promise<{ url: string | null; error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      url: null,
      error: { message: "Supabase is not configured" },
    };
  }

  try {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        error: {
          message: "Invalid file type. Please upload JPG, PNG, WebP, or SVG.",
        },
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        url: null,
        error: { message: "File too large. Maximum size is 5 MB." },
      };
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${userId}-${Date.now()}.${extension}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      error: null,
    };
  } catch (error) {
    return { url: null, error };
  }
};

export const deleteLogo = async (
  logoUrl: string
): Promise<{ error: any }> => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      error: { message: "Supabase is not configured" },
    };
  }

  try {
    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const markerIndex = logoUrl.indexOf(marker);

    if (markerIndex === -1) {
      return {
        error: { message: "Invalid logo URL" },
      };
    }

    const filePath = decodeURIComponent(
      logoUrl.substring(markerIndex + marker.length)
    );

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    return { error };
  } catch (error) {
    return { error };
  }
};