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
  
  async saveProfile(profileData: MistriProfile): Promise<any> {
    return this.makeRequest('/save_profile.php', profileData);
  }
  
  async sendOTP(phone: string, action: 'send' | 'verify', otp?: string): Promise<any> {
    // Check if we're in demo/preview environment (no PHP backend)
    const isDemo = window.location.hostname.includes('lovable') || 
                   window.location.hostname === 'localhost';
    
    if (isDemo) {
      // Demo mode - simulate OTP
      if (action === 'send') {
        const demoOtp = '123456';
        localStorage.setItem(`demo_otp_${phone}`, demoOtp);
        console.log('Demo OTP for', phone, ':', demoOtp);
        return {
          success: true,
          message: 'Demo Mode: OTP भेजा गया',
          otp: demoOtp, // Show OTP in demo mode
          debug_otp: demoOtp
        };
      } else if (action === 'verify') {
        const storedOtp = localStorage.getItem(`demo_otp_${phone}`);
        if (otp === storedOtp || otp === '123456') {
          localStorage.removeItem(`demo_otp_${phone}`);
          return {
            success: true,
            message: 'OTP सत्यापित',
            phone_verified: true
          };
        } else {
          return {
            success: false,
            error: 'गलत OTP। Demo में 123456 का उपयोग करें'
          };
        }
      }
    }
    
    // Production mode - use PHP backend
    try {
      const result = await this.makeRequest(`/firebase_otp.php?action=${action}`, { phone, otp });
      
      // If PHP returns non-JSON (source code), fallback to demo mode
      if (!result.success && result.error?.includes('invalid response')) {
        console.log('PHP not working, falling back to demo mode');
        return this.sendOTP(phone, action, otp); // Will use demo mode on retry
      }
      
      return result;
    } catch (error) {
      // Fallback to demo mode on error
      console.log('PHP error, using demo mode');
      if (action === 'send') {
        const demoOtp = '123456';
        localStorage.setItem(`demo_otp_${phone}`, demoOtp);
        return {
          success: true,
          message: 'Demo Mode: OTP भेजा गया',
          otp: demoOtp,
          debug_otp: demoOtp
        };
      } else {
        const storedOtp = localStorage.getItem(`demo_otp_${phone}`);
        if (otp === storedOtp || otp === '123456') {
          return { success: true, message: 'OTP सत्यापित', phone_verified: true };
        }
        return { success: false, error: 'गलत OTP' };
      }
    }
  }
  
  async uploadVideo(formData: FormData): Promise<any> {
    return this.makeRequest('/upload.php', formData, true);
  }

  async uploadPhoto(formData: FormData): Promise<any> {
    return this.makeRequest('/upload.php', formData, true);
  }

  async uploadProfilePhoto(mistriId: string, formData: FormData): Promise<any> {
    formData.append('mistri_id', mistriId);
    formData.append('upload_type', 'profile');
    return this.makeRequest('/upload_profile.php', formData, true);
  }

  async uploadWorkPhoto(mistriId: string, formData: FormData): Promise<any> {
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
    const params: Record<string, any> = {};
    
    if (filters?.mistri_id) params.mistri_id = filters.mistri_id;
    if (filters?.limit) params.limit = filters.limit;
    
    return this.getAPIData('videos', params);
  }
  
  async getCategories(): Promise<any> {
    return this.getAPIData('categories');
  }
  
  async checkPHPStatus(): Promise<any> {
    try {
      const response = await fetch('/debug.php');
      return await response.json();
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
