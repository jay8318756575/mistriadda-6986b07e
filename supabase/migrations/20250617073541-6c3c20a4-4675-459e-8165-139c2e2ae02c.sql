
-- Create a table for mistri profiles
CREATE TABLE public.mistris (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  mobile TEXT NOT NULL,
  experience INTEGER NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to make profiles public for everyone to view
ALTER TABLE public.mistris ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view all profiles
CREATE POLICY "Everyone can view mistri profiles" 
  ON public.mistris 
  FOR SELECT 
  USING (true);

-- Create policy that allows everyone to create profiles
CREATE POLICY "Everyone can create mistri profiles" 
  ON public.mistris 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows everyone to update profiles
CREATE POLICY "Everyone can update mistri profiles" 
  ON public.mistris 
  FOR UPDATE 
  USING (true);

-- Create policy that allows everyone to delete profiles
CREATE POLICY "Everyone can delete mistri profiles" 
  ON public.mistris 
  FOR DELETE 
  USING (true);
