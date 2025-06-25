
-- Create a table for mistri videos
CREATE TABLE public.mistri_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mistri_id UUID REFERENCES public.mistris(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on videos table
ALTER TABLE public.mistri_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for video access
CREATE POLICY "Everyone can view active videos" 
  ON public.mistri_videos 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Mistris can manage their own videos" 
  ON public.mistri_videos 
  FOR ALL 
  USING (mistri_id IN (SELECT id FROM public.mistris WHERE mobile = current_setting('app.current_user_mobile', true)));

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mistri-videos', 'mistri-videos', true);

-- Create storage policies for video uploads
CREATE POLICY "Anyone can view videos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'mistri-videos');

CREATE POLICY "Authenticated users can upload videos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'mistri-videos');

-- Create indexes for better performance
CREATE INDEX idx_mistri_videos_mistri_id ON public.mistri_videos(mistri_id);
CREATE INDEX idx_mistri_videos_created_at ON public.mistri_videos(created_at DESC);
CREATE INDEX idx_mistri_videos_active ON public.mistri_videos(is_active);
