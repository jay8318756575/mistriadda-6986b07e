
-- Drop existing restrictive policies on otp_verifications table
DROP POLICY IF EXISTS "Everyone can create OTP requests" ON public.otp_verifications;
DROP POLICY IF EXISTS "Everyone can verify OTP" ON public.otp_verifications;

-- Create more permissive policies for OTP operations
CREATE POLICY "Allow OTP creation for everyone" 
  ON public.otp_verifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow OTP verification for everyone" 
  ON public.otp_verifications 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow OTP reading for verification" 
  ON public.otp_verifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow OTP deletion for cleanup" 
  ON public.otp_verifications 
  FOR DELETE 
  USING (true);
