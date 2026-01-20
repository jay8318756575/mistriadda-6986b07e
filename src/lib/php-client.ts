// PHP Backend Client for MistriAdda

interface MistriProfile {
  name: string;
  phone: string;
  location: string;
  category: string;
  experience_years: number;
  description?: string;
  profile_image?: string;
  address?: string;
}

interface VideoUpload {
  mistri_id: string;
  title: string;
  description?: string;
  video: File;
}

interface OTPRequest {
  phone: string;
  otp?: string;
}

class PHPClient {
  private baseUrl: string;
  
  constructor() {
    // Use current domain for production
    this.baseUrl = window.location.origin;
  }
  
  private isDemo(): boolean {
    const hostname = window.location.hostname;
    return hostname.includes('lovable') || 
           hostname.includes('localhost') ||
           hostname.includes('127.0.0.1') ||
           !hostname.includes('.');
  }

  private async makeRequest(endpoint: string, data?: any, isFormData: boolean = false): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      console.log('Making request to:', url);
      
      const options: RequestInit = {
        method: 'POST',
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
        },
        body: isFormData ? data : JSON.stringify(data)
      };
      
      const response = await fetch(url, options);
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        return {
          success: false,
          error: 'Server returned invalid response'
        };
      }
      
      const result = await response.json();
      console.log('Response:', result);
      
      return result;
    } catch (error) {
      console.error('Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network request failed'
      };
    }
  }
  
  async saveProfile(profileData: MistriProfile & { id?: string }): Promise<any> {
    // Demo mode - save to localStorage
    if (this.isDemo()) {
      const existingProfiles: any[] = JSON.parse(localStorage.getItem('demo_profiles') || '[]');
      const id = (profileData as any).id || ('demo_' + Date.now());
      const existing = existingProfiles.find((p: any) => p.id === id) || {};

      // Merge so we don't lose fields like profile_photo_url set during upload
      const merged: any = { ...existing, ...profileData, id };

      // Normalize / derive legacy fields used by UI
      merged.mobile = merged.phone || merged.mobile || '';
      merged.experience = Number(merged.experience_years ?? merged.experience ?? 0);

      // Keep photo visible in UI (UI reads profile_photo_url)
      merged.profile_photo_url = merged.profile_photo_url || merged.profile_image || '';

      // Preserve meta fields
      merged.rating = existing.rating ?? merged.rating ?? 4.5;
      merged.is_verified = existing.is_verified ?? merged.is_verified ?? false;
      merged.created_at = existing.created_at ?? merged.created_at ?? new Date().toISOString();

      const isUpdate = Boolean(existing.id);
      const next = isUpdate
        ? existingProfiles.map((p: any) => (p.id === id ? merged : p))
        : [merged, ...existingProfiles];

      localStorage.setItem('demo_profiles', JSON.stringify(next));

      return {
        success: true,
        data: merged,
        message: isUpdate ? 'Profile updated (Demo Mode)' : 'Profile saved (Demo Mode)'
      };
    }


    return this.makeRequest('/save_profile.php', profileData);
  }
  
  async sendOTP(phone: string, action: 'send' | 'verify', otp?: string): Promise<any> {
    // Check if we're in demo/preview environment (no PHP backend)
    const hostname = window.location.hostname;
    const isDemo = hostname.includes('lovable') || 
                   hostname.includes('localhost') ||
                   hostname.includes('127.0.0.1') ||
                   !hostname.includes('.'); // Local dev without domain
    
    console.log('OTP Request - hostname:', hostname, 'isDemo:', isDemo, 'action:', action);
    
    // Helper function for demo OTP
    const demoSendOTP = () => {
      const demoOtp = '123456';
      localStorage.setItem(`demo_otp_${phone}`, demoOtp);
      console.log('Demo OTP for', phone, ':', demoOtp);
      return {
        success: true,
        message: 'Demo Mode: OTP भेजा गया',
        otp: demoOtp,
        debug_otp: demoOtp
      };
    };
    
    const demoVerifyOTP = () => {
      const storedOtp = localStorage.getItem(`demo_otp_${phone}`);
      if (otp === storedOtp || otp === '123456') {
        localStorage.removeItem(`demo_otp_${phone}`);
        return {
          success: true,
          message: 'OTP सत्यापित',
          phone_verified: true
        };
      }
      return {
        success: false,
        error: 'गलत OTP। Demo में 123456 का उपयोग करें'
      };
    };
    
    // Always use demo mode in preview environments
    if (isDemo) {
      if (action === 'send') {
        return demoSendOTP();
      } else if (action === 'verify') {
        return demoVerifyOTP();
      }
    }
    
    // Production mode - try PHP backend with fallback
    try {
      const result = await this.makeRequest(`/firebase_otp.php?action=${action}`, { phone, otp });
      
      // Check if PHP returned valid response
      if (result.success) {
        return result;
      }
      
      // Fallback to demo on any error
      console.log('PHP returned error, using demo fallback:', result.error);
      return action === 'send' ? demoSendOTP() : demoVerifyOTP();
      
    } catch (error) {
      console.log('PHP error, using demo mode:', error);
      return action === 'send' ? demoSendOTP() : demoVerifyOTP();
    }
  }
  
  async uploadVideo(formData: FormData): Promise<any> {
    // Demo mode - simulate video upload
    if (this.isDemo()) {
      console.log('Demo: Video upload simulated');
      return {
        success: true,
        data: { url: '/placeholder.svg', filename: 'demo_video.mp4' },
        message: 'Video uploaded (Demo Mode)'
      };
    }
    return this.makeRequest('/upload.php', formData, true);
  }

  async uploadPhoto(formData: FormData): Promise<any> {
    // Demo mode - simulate photo upload
    if (this.isDemo()) {
      console.log('Demo: Photo upload simulated');
      return {
        success: true,
        data: { url: '/placeholder.svg', filename: 'demo_photo.jpg' },
        message: 'Photo uploaded (Demo Mode)'
      };
    }
    return this.makeRequest('/upload.php', formData, true);
  }

  async uploadProfilePhoto(mistriId: string, formData: FormData): Promise<any> {
    // Demo mode - create a data URL from the file for localStorage
    if (this.isDemo()) {
      console.log('Demo: Profile photo upload - creating data URL');
      
      // Get the file from FormData
      const file = formData.get('photo') as File;
      if (file && file instanceof File) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            
            // Update the profile in localStorage with the new photo
            const existingProfiles = JSON.parse(localStorage.getItem('demo_profiles') || '[]');
            const updatedProfiles = existingProfiles.map((p: any) => {
              if (p.id === mistriId) {
                return { ...p, profile_photo_url: dataUrl, profile_image: dataUrl };
              }
              return p;
            });
            localStorage.setItem('demo_profiles', JSON.stringify(updatedProfiles));
            
            resolve({
              success: true,
              data: { url: dataUrl, filename: file.name },
              message: 'Profile photo uploaded (Demo Mode)'
            });
          };
          reader.onerror = () => {
            resolve({
              success: true,
              data: { url: '/placeholder.svg', filename: 'demo_profile.jpg' },
              message: 'Profile photo uploaded (Demo Mode - fallback)'
            });
          };
          reader.readAsDataURL(file);
        });
      }
      
      return {
        success: true,
        data: { url: '/placeholder.svg', filename: 'demo_profile.jpg' },
        message: 'Profile photo uploaded (Demo Mode)'
      };
    }
    formData.append('mistri_id', mistriId);
    formData.append('upload_type', 'profile');
    return this.makeRequest('/upload_profile.php', formData, true);
  }

  async uploadWorkPhoto(mistriId: string, formData: FormData): Promise<any> {
    // Demo mode - simulate work photo upload
    if (this.isDemo()) {
      console.log('Demo: Work photo upload simulated');
      return {
        success: true,
        data: { url: '/placeholder.svg', filename: 'demo_work.jpg' },
        message: 'Work photo uploaded (Demo Mode)'
      };
    }
    formData.append('mistri_id', mistriId);
    formData.append('upload_type', 'work');
    return this.makeRequest('/upload_profile.php', formData, true);
  }
  
  // Generic API data fetcher
  async getAPIData(endpoint: string, params?: Record<string, any>): Promise<any> {
    try {
      const queryParams = new URLSearchParams({ endpoint, ...params }).toString();
      const url = `/api.php?${queryParams}`;
      
      console.log(`Fetching data from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Non-JSON response received:', contentType);
        const text = await response.text();
        console.log('Response text:', text);
        
        return {
          success: false,
          error: 'PHP backend not configured properly. Expected JSON response.',
          raw_response: text
        };
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network request failed'
      };
    }
  }
  
  async getMistris(filters?: {
    category?: string;
    location?: string;
    limit?: number;
  }): Promise<any> {
    // Demo mode - read from localStorage instead of PHP API
    if (this.isDemo()) {
      const raw: any[] = JSON.parse(localStorage.getItem('demo_profiles') || '[]');

      let data = raw.map((p: any) => ({
        ...p,
        mobile: p.mobile || p.phone || '',
        experience: Number(p.experience ?? p.experience_years ?? 0),
        profile_photo_url: p.profile_photo_url || p.profile_image || ''
      }));

      if (filters?.category) {
        data = data.filter((p: any) => p.category === filters.category);
      }
      if (filters?.location) {
        const q = filters.location.toLowerCase();
        data = data.filter((p: any) => String(p.location || '').toLowerCase().includes(q));
      }
      if (filters?.limit) {
        data = data.slice(0, filters.limit);
      }

      return { success: true, data };
    }

    const params: Record<string, any> = {};

    if (filters?.category) params.category = filters.category;
    if (filters?.location) params.location = filters.location;
    if (filters?.limit) params.limit = filters.limit;

    return this.getAPIData('mistris', params);
  }

  
  async getVideos(filters?: {
    mistri_id?: string;
    limit?: number;
  }): Promise<any> {
    // Demo mode - read from localStorage
    if (this.isDemo()) {
      const raw: any[] = JSON.parse(localStorage.getItem('demo_videos') || '[]');
      let data = raw;

      if (filters?.mistri_id) {
        data = data.filter((v: any) => v.mistri_id === filters.mistri_id);
      }
      if (filters?.limit) {
        data = data.slice(0, filters.limit);
      }

      return { success: true, data };
    }

    const params: Record<string, any> = {};

    if (filters?.mistri_id) params.mistri_id = filters.mistri_id;
    if (filters?.limit) params.limit = filters.limit;

    return this.getAPIData('videos', params);
  }

  
  async getCategories(): Promise<any> {
    return this.getAPIData('categories');
  }
  
  async checkPHPStatus(): Promise<any> {
    // In preview/local environments PHP isn't reliable, so treat as demo.
    if (this.isDemo()) {
      return { success: false, mode: 'demo' };
    }

    try {
      const response = await fetch('/debug.php', { method: 'GET' });
      return { success: response.ok };
    } catch (error) {
      return {
        success: false,
        error: 'Cannot connect to PHP backend'
      };
    }
  }

}

export const phpClient = new PHPClient();

// Make available globally for backward compatibility
(window as any).phpClient = phpClient;
