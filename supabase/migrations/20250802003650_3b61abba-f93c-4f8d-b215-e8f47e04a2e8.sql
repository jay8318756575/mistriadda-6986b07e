-- Create mistris table for storing mistri profiles
CREATE TABLE public.mistris (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  experience INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  description TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  admin_approval_status TEXT DEFAULT 'pending' CHECK (admin_approval_status IN ('pending', 'approved', 'rejected')),
  phone_verified BOOLEAN DEFAULT false,
  id_proof_url TEXT,
  profile_photo_url TEXT,
  work_gallery TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  latitude DECIMAL,
  longitude DECIMAL,
  aadhar_number TEXT,
  aadhar_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create OTP verification table
CREATE TABLE public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mistri videos table
CREATE TABLE public.mistri_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mistri_id UUID NOT NULL REFERENCES public.mistris(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ratings table
CREATE TABLE public.mistri_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mistri_id UUID NOT NULL REFERENCES public.mistris(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mistris ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistri_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistri_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public platform)
CREATE POLICY "Mistris are viewable by everyone" 
ON public.mistris 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert mistris" 
ON public.mistris 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update mistris" 
ON public.mistris 
FOR UPDATE 
USING (true);

CREATE POLICY "OTP verifications are manageable by anyone" 
ON public.otp_verifications 
FOR ALL 
USING (true);

CREATE POLICY "Videos are viewable by everyone" 
ON public.mistri_videos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert videos" 
ON public.mistri_videos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update videos" 
ON public.mistri_videos 
FOR UPDATE 
USING (true);

CREATE POLICY "Ratings are viewable by everyone" 
ON public.mistri_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert ratings" 
ON public.mistri_ratings 
FOR INSERT 
WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('mistri-photos', 'mistri-photos', true),
  ('mistri-videos', 'mistri-videos', true),
  ('id-proofs', 'id-proofs', false),
  ('work-gallery', 'work-gallery', true);

-- Create storage policies
CREATE POLICY "Profile photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'mistri-photos');

CREATE POLICY "Anyone can upload profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'mistri-photos');

CREATE POLICY "Videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'mistri-videos');

CREATE POLICY "Anyone can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'mistri-videos');

CREATE POLICY "Work gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'work-gallery');

CREATE POLICY "Anyone can upload work gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'work-gallery');

CREATE POLICY "ID proofs are private" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'id-proofs');

CREATE POLICY "Anyone can upload ID proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'id-proofs');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_mistris_updated_at
  BEFORE UPDATE ON public.mistris
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mistri_videos_updated_at
  BEFORE UPDATE ON public.mistri_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_mistris_category ON public.mistris(category);
CREATE INDEX idx_mistris_location ON public.mistris(location);
CREATE INDEX idx_mistris_mobile ON public.mistris(mobile);
CREATE INDEX idx_mistri_videos_mistri_id ON public.mistri_videos(mistri_id);
CREATE INDEX idx_otp_verifications_phone ON public.otp_verifications(phone_number);
CREATE INDEX idx_mistri_ratings_mistri_id ON public.mistri_ratings(mistri_id);