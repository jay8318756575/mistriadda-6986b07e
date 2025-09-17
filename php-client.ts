// PHP Backend Client for MistriAdda

export interface MistriProfile {
  id?: string;
  name: string;
  phone: string;
  location: string;
  category: string;
  experience_years?: number;
  description?: string;
  profile_image?: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface VideoUpload {
  id?: string;
  mistri_id: string;
  title: string;
  description?: string;
  video_url?: string;
  category?: string;
  created_at?: string;
}

export interface OTPRequest {
  phone: string;
  action: 'send' | 'verify';
  otp?: string;
}

class PHPClient {
  private baseUrl: string;

  constructor() {
    // Use current domain or localhost for development
    this.baseUrl = window.location.origin;
  }

  private async makeRequest(endpoint: string, data?: any, isFormData = false): Promise<any> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      
      let body;
      let headers: HeadersInit = {};

      if (data) {
        if (isFormData) {
          body = data; // FormData object
        } else {
          body = JSON.stringify(data);
          headers['Content-Type'] = 'application/json';
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('PHP Client Error:', error);
      throw error;
    }
  }

  // Save Mistri Profile
  async saveProfile(profileData: MistriProfile): Promise<any> {
    return await this.makeRequest('save_profile.php', profileData);
  }

  // Send OTP
  async sendOTP(phone: string): Promise<any> {
    return await this.makeRequest('send_otp.php', {
      phone,
      action: 'send'
    });
  }

  // Verify OTP
  async verifyOTP(phone: string, otp: string): Promise<any> {
    return await this.makeRequest('send_otp.php', {
      phone,
      otp,
      action: 'verify'
    });
  }

  // Upload Video
  async uploadVideo(videoData: {
    mistri_id: string;
    title: string;
    description?: string;
    category?: string;
    video: File;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('mistri_id', videoData.mistri_id);
    formData.append('title', videoData.title);
    if (videoData.description) {
      formData.append('description', videoData.description);
    }
    if (videoData.category) {
      formData.append('category', videoData.category);
    }
    formData.append('video', videoData.video);

    return await this.makeRequest('upload_video.php', formData, true);
  }

  // Get API Data (mistris, videos, categories)
  async getAPIData(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/api.php?endpoint=${endpoint}&${queryString}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Data Error:', error);
      throw error;
    }
  }

  // Get Mistris
  async getMistris(filters: {
    category?: string;
    location?: string;
    limit?: number;
  } = {}): Promise<any> {
    return await this.getAPIData('mistris', filters);
  }

  // Get Videos
  async getVideos(filters: {
    mistri_id?: string;
    limit?: number;
  } = {}): Promise<any> {
    return await this.getAPIData('videos', filters);
  }

  // Get Categories
  async getCategories(): Promise<any> {
    return await this.getAPIData('categories');
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/?api=health`);
      const result = await response.json();
      return result.status === 'ok';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const phpClient = new PHPClient();

// Also export for window object (backward compatibility)
declare global {
  interface Window {
    phpClient: PHPClient;
  }
}

window.phpClient = phpClient;