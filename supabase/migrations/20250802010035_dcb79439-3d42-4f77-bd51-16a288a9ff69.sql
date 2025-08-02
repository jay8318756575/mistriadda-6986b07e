-- Add is_active column to mistri_videos table
ALTER TABLE public.mistri_videos 
ADD COLUMN is_active boolean DEFAULT true;