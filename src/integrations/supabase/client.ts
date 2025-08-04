// PHP API client for local backend
const API_BASE = window.location.origin;

export class PHPClient {
  async saveProfile(profileData: any) {
    const response = await fetch(`${API_BASE}/save_profile.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  async sendOTP(phone: string, action: 'send' | 'verify', otp?: string) {
    const response = await fetch(`${API_BASE}/send_otp.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, action, otp })
    });
    return response.json();
  }

  async uploadVideo(formData: FormData) {
    const response = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  async getMistris(filters?: { category?: string; location?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await fetch(`${API_BASE}/api.php?endpoint=mistris&${params}`);
    return response.json();
  }

  async getVideos(filters?: { mistri_id?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.mistri_id) params.append('mistri_id', filters.mistri_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await fetch(`${API_BASE}/api.php?endpoint=videos&${params}`);
    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${API_BASE}/api.php?endpoint=categories`);
    return response.json();
  }
}

export const phpClient = new PHPClient();