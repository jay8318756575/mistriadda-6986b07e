export interface Mistri {
  id: string;
  name: string;
  category: string;
  location: string;
  mobile: string;
  experience: number;
  rating?: number;
  image?: string;
  description?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  admin_approval_status?: 'pending' | 'approved' | 'rejected';
  phone_verified?: boolean;
  id_proof_url?: string;
  profile_photo_url?: string;
  work_gallery?: string[];
  is_active?: boolean;
  last_active?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  nameHindi: string;
}

export interface MistriRating {
  id: string;
  mistri_id: string;
  customer_name: string;
  customer_phone: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface OTPVerification {
  id: string;
  phone_number: string;
  otp_code: string;
  expires_at: string;
  is_verified: boolean;
  attempts: number;
  created_at: string;
}
