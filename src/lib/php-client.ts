// PHP backend client for interacting with MistriAdda API

interface MistriProfile {
  name: string;
  phone: string;
  category: string;
  location: string;
  address?: string;
  experience_years: number;
  description?: string;
  profile_image?: string;
}

interface VideoUpload {
  mistri_id: string;
  title: string;
  description?: string;
  video: File;
}

interface OTPRequest {
  phone: string;
  action: 'send' | 'verify';
  otp?: string;
}

class PHPClient {
  private baseURL: string;

  constructor() {
    // Use relative path for PHP backend on same domain
    this.baseURL = '';
  }

  private async makeRequest(endpoint: string, data?: any, isFormData: boolean = false): Promise<any> {
    try {
      console.log(`Making ${isFormData ? 'FormData' : 'JSON'} request to: ${this.baseURL}${endpoint}`);
      
      const options: RequestInit = {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data)
      };

      if (!isFormData) {
        options.headers = {
          'Content-Type': 'application/json'
        };
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      
      console.log('Response status:', response.status);
      
      // Check if response is JSON
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
      console.log('Response data:', result);
      
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
    console.log('Saving profile via PHP API (Demo Mode)...');
    
    // Demo mode - simulate successful save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Profile saved successfully (Demo Mode)',
      data: {
        id: 'demo-mistri-' + Date.now(),
        ...profileData,
        phone: profileData.phone,
        rating: 4.5,
        is_verified: true,
        created_at: new Date().toISOString()
      }
    };
  }

  async sendOTP(phone: string, action: 'send' | 'verify', otp?: string): Promise<any> {
    console.log(`${action === 'send' ? 'Sending' : 'Verifying'} OTP via PHP API...`);
    
    // For demo mode, return success without actual API call
    if (action === 'send') {
      return {
        success: true,
        otp: '123456', // Demo OTP
        message: 'OTP sent successfully (Demo Mode)'
      };
    } else {
      // Verify - accept any 6 digit OTP
      if (otp && otp.length === 6) {
        return {
          success: true,
          message: 'OTP verified successfully (Demo Mode)'
        };
      } else {
        return {
          success: false,
          error: 'Invalid OTP'
        };
      }
    }
  }

  async uploadVideo(formData: FormData): Promise<any> {
    console.log('Uploading video via PHP API (Demo Mode)...');
    
    // Demo mode - simulate successful upload
    const title = formData.get('title') as string;
    const mistriId = formData.get('mistri_id') as string;
    const videoFile = formData.get('video') as File;
    
    console.log('Demo upload:', { title, mistriId, videoFileName: videoFile?.name });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Video uploaded successfully (Demo Mode)',
      data: {
        id: 'demo-video-' + Date.now(),
        title: title,
        mistri_id: mistriId,
        video_url: URL.createObjectURL(videoFile),
        created_at: new Date().toISOString()
      }
    };
  }

  // Generic method to fetch data from /api.php
  async getAPIData(endpoint: string, params?: Record<string, any>): Promise<any> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/api.php${queryParams}`, { endpoint, ...params });
  }

  async getMistris(filters?: {
    category?: string;
    location?: string;
    limit?: number;
  }): Promise<any> {
    console.log('Fetching mistris from PHP API with filters (Demo Mode):', filters);
    
    const params: Record<string, any> = { action: 'get_mistris' };
    if (filters) {
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.limit) params.limit = filters.limit;
    }
    
    const result = await this.makeRequest('/api.php', params);
    
    // If PHP not working, return empty data (will trigger fallback to sample data)
    if (!result.success) {
      return { success: false, error: 'PHP backend not available (using demo data)' };
    }
    
    return result;
  }

  async getVideos(filters?: {
    mistri_id?: string;
    limit?: number;
  }): Promise<any> {
    console.log('Fetching videos from PHP API with filters (Demo Mode):', filters);
    
    const params: Record<string, any> = { action: 'get_videos' };
    if (filters) {
      if (filters.mistri_id) params.mistri_id = filters.mistri_id;
      if (filters.limit) params.limit = filters.limit;
    }
    
    const result = await this.makeRequest('/api.php', params);
    
    // If PHP not working, return empty videos array
    if (!result.success) {
      return { success: true, data: [] };
    }
    
    return result;
  }

  async getCategories(): Promise<any> {
    console.log('Fetching categories from PHP API...');
    return this.makeRequest('/api.php', { action: 'get_categories' });
  }

  async checkPHPStatus(): Promise<any> {
    try {
      console.log('Checking PHP backend status...');
      const response = await fetch('/api.php?action=health_check', {
        method: 'GET'
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { success: false, error: 'PHP backend not available' };
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('PHP backend check failed:', error);
      return { success: false, error: 'Backend unavailable' };
    }
  }
}

// Export singleton instance
export const phpClient = new PHPClient();

// Also export to window for backward compatibility
if (typeof window !== 'undefined') {
  (window as any).phpClient = phpClient;
}
