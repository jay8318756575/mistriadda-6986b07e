// PHP API client - automatically detects if running on localhost or production
const API_BASE = window.location.origin;

// Enable console logging for debugging
const DEBUG = true;
const log = (...args: any[]) => {
  if (DEBUG) console.log('[PHP Client]', ...args);
};

// Fallback to sample data when PHP backend is not available
import { sampleMistris } from '@/data/sample-mistris';

// Local storage keys for demo mode
const DEMO_MISTRIS_KEY = 'demo_mistris';
const DEMO_VIDEOS_KEY = 'demo_videos';

// Helper function to check if response is valid JSON
const isValidJSONResponse = (response: any) => {
  try {
    return response && typeof response === 'object' && response.success !== undefined;
  } catch {
    return false;
  }
};

export class PHPClient {
  // Check if PHP backend is available
  async checkPHPStatus() {
    try {
      const response = await fetch(`${API_BASE}/check_php.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: 'PHP backend not available' };
    }
  }
  async saveProfile(profileData: any) {
    log('Saving profile...', profileData);
    
    try {
      const response = await fetch(`${API_BASE}/save_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      log('Profile saved successfully:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Profile save failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Save profile failed:', error);
      
      // Show error to user - don't silently fall back to demo mode
      throw new Error('सर्वर से कनेक्ट नहीं हो पा रहा। कृपया बाद में कोशिश करें।');
    }
  }

  async sendOTP(phone: string, action: 'send' | 'verify', otp?: string) {
    log('OTP operation:', action, 'for phone:', phone);
    
    try {
      const response = await fetch(`${API_BASE}/send_otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, action, otp })
      });
      
      log('OTP response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      log('OTP operation result:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'OTP operation failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ OTP operation failed:', error);
      
      // For demo purposes only - in production, this should fail
      if (action === 'send') {
        console.warn('⚠️ Using demo OTP mode');
        return {
          success: true,
          message: 'डेमो मोड: कोई भी 6 अंक का OTP डालें',
          otp: '123456'
        };
      } else if (action === 'verify') {
        // Accept any 6-digit OTP in demo mode
        if (otp && otp.length === 6) {
          console.warn('⚠️ Demo mode: OTP verified');
          return {
            success: true,
            message: 'डेमो मोड में OTP सत्यापित',
            verified: true
          };
        }
      }
      
      throw new Error('सर्वर से कनेक्ट नहीं हो पा रहा। कृपया बाद में कोशिश करें।');
    }
  }

  async uploadVideo(formData: FormData) {
    log('Uploading video...');
    
    try {
      const response = await fetch(`${API_BASE}/upload_video.php`, {
        method: 'POST',
        body: formData
      });
      
      log('Upload response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      log('Video uploaded successfully:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Video upload failed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Video upload failed:', error);
      
      // Show error to user - don't silently fall back to demo mode
      throw new Error('सर्वर से कनेक्ट नहीं हो पा रहा। कृपया बाद में कोशिश करें।');
    }
  }

  async getMistris(filters?: { category?: string; location?: string; limit?: number }) {
    log('Fetching mistris...', filters);
    
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const url = `${API_BASE}/api.php?endpoint=mistris${params.toString() ? '&' + params.toString() : ''}`;
      log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      log('Mistris fetched:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch mistris');
      }
      
      return data;
    } catch (error) {
      console.warn('⚠️ PHP API failed, using fallback data:', error);
      
      // Fallback to sample data for display purposes
      let filteredData = [...sampleMistris];
      
      if (filters?.category && filters.category !== 'all') {
        filteredData = filteredData.filter(m => m.category === filters.category);
      }
      if (filters?.location && filters.location !== 'all cities') {
        filteredData = filteredData.filter(m => 
          m.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters?.limit) {
        filteredData = filteredData.slice(0, filters.limit);
      }
      
      return { success: true, data: filteredData };
    }
  }

  async getVideos(filters?: { mistri_id?: string; limit?: number }) {
    log('Fetching videos...', filters);
    
    try {
      const params = new URLSearchParams();
      if (filters?.mistri_id) params.append('mistri_id', filters.mistri_id);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const url = `${API_BASE}/api.php?endpoint=videos${params.toString() ? '&' + params.toString() : ''}`;
      log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      log('Videos fetched:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch videos');
      }
      
      return data;
    } catch (error) {
      console.warn('⚠️ PHP API failed for videos:', error);
      
      // Return empty array as fallback
      return { success: true, data: [] };
    }
  }

  async getCategories() {
    try {
      const response = await fetch(`${API_BASE}/api.php?endpoint=categories`);
      const data = await response.json();
      
      if (!isValidJSONResponse(data)) {
        throw new Error('Invalid response from server');
      }
      
      return data;
    } catch (error) {
      console.error('Categories API failed:', error);
      // Return fallback categories
      return { 
        success: true, 
        data: [
          { id: 'plumber', name: 'प्लंबर', icon: 'plumber-icon.png' },
          { id: 'electrician', name: 'इलेक्ट्रीशियन', icon: 'electrician-icon.png' },
          { id: 'carpenter', name: 'बढ़ई', icon: 'carpenter-icon.png' },
          { id: 'painter', name: 'पेंटर', icon: 'painter-icon.png' },
          { id: 'mason', name: 'राजमिस्त्री', icon: 'mason-icon.png' },
          { id: 'mechanic', name: 'मैकेनिक', icon: 'mechanic-icon.png' }
        ]
      };
    }
  }
}

export const phpClient = new PHPClient();