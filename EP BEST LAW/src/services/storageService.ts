import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Upload logo to Supabase storage
export const uploadLogo = async (file: File, userId: string): Promise<{ url: string | null; error: any }> => {
  if (!isSupabaseConfigured) {
    return { url: null, error: { message: 'Supabase is not configured' } };
  }
  
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return { url: null, error: { message: 'Invalid file type. Please upload an image.' } };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: { message: 'File too large. Maximum size is 5MB.' } };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('firm-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('firm-assets')
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error };
  }
};

// Delete logo from storage
export const deleteLogo = async (logoUrl: string): Promise<{ error: any }> => {
  if (!isSupabaseConfigured) {
    return { error: { message: 'Supabase is not configured' } };
  }
  
  try {
    // Extract file path from URL
    const urlParts = logoUrl.split('/firm-assets/');
    if (urlParts.length < 2) {
      return { error: { message: 'Invalid logo URL' } };
    }
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('firm-assets')
      .remove([filePath]);

    return { error };
  } catch (error) {
    return { error };
  }
};


