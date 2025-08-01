// Centralized error handling utility for MistriAdda
export class ErrorHandler {
  
  /**
   * Get user-friendly error message in Hindi
   */
  static getErrorMessage(error: any): string {
    if (!error) return "अज्ञात समस्या हुई";
    
    let message = "";
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (error.message) {
      message = error.message;
    } else {
      message = "अज्ञात समस्या हुई";
    }
    
    // Network-related errors
    if (this.isNetworkError(message)) {
      return "इंटरनेट कनेक्शन में समस्या। कृपया कनेक्शन चेक करें और दोबारा कोशिश करें।";
    }
    
    // Supabase/Database errors
    if (this.isDatabaseError(message)) {
      return "डेटाबेस कनेक्शन में समस्या। कृपया बाद में कोशिश करें।";
    }
    
    // Permission errors
    if (this.isPermissionError(message)) {
      return "अनुमति में समस्या। कृपया व्यवस्थापक से संपर्क करें।";
    }
    
    // Storage/Upload errors
    if (this.isStorageError(message)) {
      return "फ़ाइल अपलोड में समस्या। कृपया छोटी फ़ाइल अपलोड करें या बाद में कोशिश करें।";
    }
    
    // Return original message if it's already in Hindi
    if (this.isHindiMessage(message)) {
      return message;
    }
    
    // Default fallback
    return `समस्या: ${message}`;
  }
  
  /**
   * Check if error is network-related
   */
  static isNetworkError(message: string): boolean {
    const networkKeywords = [
      'failed to fetch',
      'fetch',
      'network error',
      'connection failed',
      'timeout',
      'network',
      'offline',
      'no internet',
      'connection refused',
      'network request failed'
    ];
    
    return networkKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  /**
   * Check if error is database-related
   */
  static isDatabaseError(message: string): boolean {
    const dbKeywords = [
      'database',
      'supabase',
      'connection to database',
      'query failed',
      'sql',
      'invalid response',
      'server error',
      'database connection'
    ];
    
    return dbKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  /**
   * Check if error is permission-related
   */
  static isPermissionError(message: string): boolean {
    const permissionKeywords = [
      'permission',
      'unauthorized',
      'forbidden',
      'access denied',
      'policy',
      'rls',
      'row level security',
      'authentication required'
    ];
    
    return permissionKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  /**
   * Check if error is storage-related
   */
  static isStorageError(message: string): boolean {
    const storageKeywords = [
      'storage',
      'bucket',
      'upload',
      'file too large',
      'file size',
      'invalid file',
      'upload failed'
    ];
    
    return storageKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  /**
   * Check if message is already in Hindi
   */
  static isHindiMessage(message: string): boolean {
    const hindiKeywords = [
      'समस्या',
      'त्रुटि',
      'कनेक्शन',
      'इंटरनेट',
      'डेटाबेस',
      'अनुमति',
      'फ़ाइल',
      'अपलोड',
      'सर्वर',
      'नेटवर्क'
    ];
    
    return hindiKeywords.some(keyword => message.includes(keyword));
  }
  
  /**
   * Log error for debugging while showing user-friendly message
   */
  static handleError(error: any, context: string = 'General'): string {
    console.error(`[${context}] Error:`, error);
    return this.getErrorMessage(error);
  }
  
  /**
   * Get appropriate toast variant based on error type
   */
  static getToastVariant(error: any): "default" | "destructive" {
    const message = this.getErrorMessage(error);
    
    // Show default variant for network issues (suggests offline mode)
    if (this.isNetworkError(message)) {
      return "default";
    }
    
    // Show destructive for other errors
    return "destructive";
  }
  
  /**
   * Get appropriate toast title based on error type
   */
  static getToastTitle(error: any): string {
    const message = this.getErrorMessage(error);
    
    if (this.isNetworkError(message)) {
      return "ऑफलाइन मोड";
    }
    
    if (this.isDatabaseError(message)) {
      return "डेटाबेस त्रुटि";
    }
    
    if (this.isPermissionError(message)) {
      return "अनुमति त्रुटि";
    }
    
    if (this.isStorageError(message)) {
      return "अपलोड त्रुटि";
    }
    
    return "त्रुटि";
  }
}