-- Add Aadhar card number and address fields to mistris table
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS aadhar_number TEXT;
ALTER TABLE public.mistris ADD COLUMN IF NOT EXISTS aadhar_address TEXT;

-- Add constraint to ensure aadhar_number is unique when not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_mistris_aadhar_number ON public.mistris(aadhar_number) WHERE aadhar_number IS NOT NULL;