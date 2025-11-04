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
    return this.makeRequest('/save_profile.php', profileData);
  }

  async sendOTP(phone: string, action: 'send' | 'verify', otp?: string): Promise<any> {
    return this.makeRequest('/send_otp.php', { phone, action, otp });
  }

  async uploadVideo(formData: FormData): Promise<any> {
    return this.makeRequest('/upload.php', formData, true);
  }

  async uploadPhoto(formData: FormData): Promise<any> {
    formData.append('type', 'photo');
    return this.makeRequest('/upload.php', formData, true);
  }

  // Generic method to fetch data from /api.php
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

  async getMistris(filters?: {
    category?: string;
    location?: string;
    limit?: number;
  }): Promise<any> {
    const params: Record<string, any> = {};
    if (filters) {
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.limit) params.limit = filters.limit;
    }
    return this.getAPIData('mistris', params);
  }

  async getVideos(filters?: {
    mistri_id?: string;
    limit?: number;
  }): Promise<any> {
    const params: Record<string, any> = {};
    if (filters) {
      if (filters.mistri_id) params.mistri_id = filters.mistri_id;
      if (filters.limit) params.limit = filters.limit;
    }
    return this.getAPIData('videos', params);
  }

  async getCategories(): Promise<any> {
    console.log('Fetching categories from PHP API...');
    return this.getAPIData('categories');
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
