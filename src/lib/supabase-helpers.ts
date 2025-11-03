import { supabase } from '@/integrations/supabase/client';

export interface MistriProfile {
  name: string;
  phone: string;
  category: string;
  location: string;
  address?: string;
  experience_years: number;
  description?: string;
  profile_photo_url?: string;
}

export interface VideoUploadData {
  mistri_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
}

// Upload profile photo to Supabase Storage
export const uploadProfilePhoto = async (file: File, phone: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${phone}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // @ts-ignore - Types will be auto-generated after migration
  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    throw new Error(`Photo upload failed: ${uploadError.message}`);
  }

  // @ts-ignore - Types will be auto-generated after migration
  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Upload video to Supabase Storage
export const uploadVideo = async (file: File, mistriId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${mistriId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // @ts-ignore - Types will be auto-generated after migration
  const { error: uploadError } = await supabase.storage
    .from('videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Video upload failed: ${uploadError.message}`);
  }

  // @ts-ignore - Types will be auto-generated after migration
  const { data } = supabase.storage
    .from('videos')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Save mistri profile
export const saveMistriProfile = async (
  profileData: MistriProfile,
  photoFile?: File
): Promise<any> => {
  let photoUrl = profileData.profile_photo_url || '';
  
  // Upload photo if provided
  if (photoFile) {
    photoUrl = await uploadProfilePhoto(photoFile, profileData.phone);
  }

  // @ts-ignore - Types will be auto-generated after migration
  const { data, error } = await (supabase as any)
    .from('mistris')
    .insert([{
      name: profileData.name,
      phone: profileData.phone,
      category: profileData.category,
      location: profileData.location,
      address: profileData.address || '',
      experience_years: profileData.experience_years,
      description: profileData.description || '',
      profile_photo_url: photoUrl,
      phone_verified: true,
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Profile save failed: ${error.message}`);
  }

  return data;
};

// Save video
export const saveVideo = async (
  videoData: VideoUploadData
): Promise<any> => {
  // @ts-ignore - Types will be auto-generated after migration
  const { data, error } = await (supabase as any)
    .from('videos')
    .insert([{
      mistri_id: videoData.mistri_id,
      title: videoData.title,
      description: videoData.description || '',
      video_url: videoData.video_url,
      thumbnail_url: videoData.thumbnail_url || ''
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Video save failed: ${error.message}`);
  }

  return data;
};

// Get all mistris
export const getMistris = async (filters?: {
  category?: string;
  location?: string;
  limit?: number;
}) => {
  // @ts-ignore - Types will be auto-generated after migration
  let query = (supabase as any)
    .from('mistris')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.location) {
    query = query.eq('location', filters.location);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch mistris: ${error.message}`);
  }

  return data || [];
};

// Get videos
export const getVideos = async (filters?: {
  mistri_id?: string;
  limit?: number;
}) => {
  // @ts-ignore - Types will be auto-generated after migration
  let query = (supabase as any)
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.mistri_id) {
    query = query.eq('mistri_id', filters.mistri_id);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`);
  }

  return data || [];
};
