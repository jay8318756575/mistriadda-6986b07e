export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      mistri_ratings: {
        Row: {
          comment: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          mistri_id: string | null
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          mistri_id?: string | null
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          mistri_id?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "mistri_ratings_mistri_id_fkey"
            columns: ["mistri_id"]
            isOneToOne: false
            referencedRelation: "mistris"
            referencedColumns: ["id"]
          },
        ]
      }
      mistri_videos: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          id: string
          is_active: boolean | null
          likes_count: number | null
          mistri_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
          views_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          mistri_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
          views_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          mistri_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mistri_videos_mistri_id_fkey"
            columns: ["mistri_id"]
            isOneToOne: false
            referencedRelation: "mistris"
            referencedColumns: ["id"]
          },
        ]
      }
      mistris: {
        Row: {
          aadhar_address: string | null
          aadhar_number: string | null
          admin_approval_status: string | null
          category: string
          created_at: string
          description: string | null
          experience: number
          id: string
          id_proof_url: string | null
          is_active: boolean | null
          last_active: string | null
          latitude: number | null
          location: string
          longitude: number | null
          mobile: string
          name: string
          phone_verified: boolean | null
          profile_photo_url: string | null
          rating: number | null
          updated_at: string
          verification_status: string | null
          work_gallery: string[] | null
        }
        Insert: {
          aadhar_address?: string | null
          aadhar_number?: string | null
          admin_approval_status?: string | null
          category: string
          created_at?: string
          description?: string | null
          experience: number
          id?: string
          id_proof_url?: string | null
          is_active?: boolean | null
          last_active?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          mobile: string
          name: string
          phone_verified?: boolean | null
          profile_photo_url?: string | null
          rating?: number | null
          updated_at?: string
          verification_status?: string | null
          work_gallery?: string[] | null
        }
        Update: {
          aadhar_address?: string | null
          aadhar_number?: string | null
          admin_approval_status?: string | null
          category?: string
          created_at?: string
          description?: string | null
          experience?: number
          id?: string
          id_proof_url?: string | null
          is_active?: boolean | null
          last_active?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          mobile?: string
          name?: string
          phone_verified?: boolean | null
          profile_photo_url?: string | null
          rating?: number | null
          updated_at?: string
          verification_status?: string | null
          work_gallery?: string[] | null
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          attempts: number | null
          created_at: string
          expires_at: string
          id: string
          is_verified: boolean | null
          otp_code: string
          phone_number: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          expires_at: string
          id?: string
          is_verified?: boolean | null
          otp_code: string
          phone_number: string
        }
        Update: {
          attempts?: number | null
          created_at?: string
          expires_at?: string
          id?: string
          is_verified?: boolean | null
          otp_code?: string
          phone_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
