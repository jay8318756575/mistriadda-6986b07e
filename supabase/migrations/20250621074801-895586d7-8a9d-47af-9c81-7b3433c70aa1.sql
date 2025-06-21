
-- Add verification fields to mistris table
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'));
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS admin_approval_status TEXT DEFAULT 'pending' CHECK (admin_approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS id_proof_url TEXT;
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS work_gallery TEXT[]; -- Array to store work image URLs
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create ratings table for customer reviews
CREATE TABLE IF NOT EXISTS public.mistri_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mistri_id UUID REFERENCES public.mistris(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ratings table
ALTER TABLE public.mistri_ratings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view ratings
CREATE POLICY "Everyone can view mistri ratings" 
  ON public.mistri_ratings 
  FOR SELECT 
  USING (true);

-- Create policy that allows everyone to create ratings
CREATE POLICY "Everyone can create mistri ratings" 
  ON public.mistri_ratings 
  FOR INSERT 
  WITH CHECK (true);

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on OTP table
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to create OTP requests
CREATE POLICY "Everyone can create OTP requests" 
  ON public.otp_verifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows everyone to verify OTP
CREATE POLICY "Everyone can verify OTP" 
  ON public.otp_verifications 
  FOR UPDATE 
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_mistris_verification_status ON public.mistris(verification_status);
CREATE INDEX IF NOT EXISTS idx_mistris_admin_approval ON public.mistris(admin_approval_status);
CREATE INDEX IF NOT EXISTS idx_mistris_location ON public.mistris(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_otp_phone_expires ON public.otp_verifications(phone_number, expires_at);
