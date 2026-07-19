export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artists: {
        Row: {
          bio: string
          created_at: string
          id: string
          instagram: string
          name: string
          portrait_url: string | null
          slug: string
          sort_order: number
          specialties: string[]
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          id?: string
          instagram?: string
          name: string
          portrait_url?: string | null
          slug: string
          sort_order?: number
          specialties?: string[]
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          instagram?: string
          name?: string
          portrait_url?: string | null
          slug?: string
          sort_order?: number
          specialties?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      consent_forms: {
        Row: {
          artist_name: string
          client_name: string
          confirms_18_plus: boolean
          confirms_accurate_health_info: boolean
          confirms_not_impaired: boolean
          consents_to_procedure: boolean
          created_at: string
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          health_conditions: string[]
          health_notes: string
          id: string
          id_photo_path: string
          phone: string
          placement: string
          signature_date: string
          signature_name: string
          tattoo_description: string
          understands_aftercare: boolean
          understands_risks: boolean
        }
        Insert: {
          artist_name?: string
          client_name: string
          confirms_18_plus?: boolean
          confirms_accurate_health_info?: boolean
          confirms_not_impaired?: boolean
          consents_to_procedure?: boolean
          created_at?: string
          date_of_birth: string
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          health_conditions?: string[]
          health_notes?: string
          id?: string
          id_photo_path?: string
          phone?: string
          placement?: string
          signature_date?: string
          signature_name: string
          tattoo_description?: string
          understands_aftercare?: boolean
          understands_risks?: boolean
        }
        Update: {
          artist_name?: string
          client_name?: string
          confirms_18_plus?: boolean
          confirms_accurate_health_info?: boolean
          confirms_not_impaired?: boolean
          consents_to_procedure?: boolean
          created_at?: string
          date_of_birth?: string
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          health_conditions?: string[]
          health_notes?: string
          id?: string
          id_photo_path?: string
          phone?: string
          placement?: string
          signature_date?: string
          signature_name?: string
          tattoo_description?: string
          understands_aftercare?: boolean
          understands_risks?: boolean
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          budget_range: string
          created_at: string
          email: string
          id: string
          name: string
          notes: string
          phone: string
          placement: string
          preferred_artist: string
          preferred_dates: string
          size_estimate: string
          status: string
          tattoo_idea: string
          updated_at: string
        }
        Insert: {
          budget_range?: string
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string
          phone?: string
          placement?: string
          preferred_artist?: string
          preferred_dates?: string
          size_estimate?: string
          status?: string
          tattoo_idea: string
          updated_at?: string
        }
        Update: {
          budget_range?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string
          phone?: string
          placement?: string
          preferred_artist?: string
          preferred_dates?: string
          size_estimate?: string
          status?: string
          tattoo_idea?: string
          updated_at?: string
        }
        Relationships: []
      }
      guest_spots: {
        Row: {
          artist_id: string | null
          city: string
          created_at: string
          end_date: string
          id: string
          sort_order: number
          start_date: string
          status: string
          updated_at: string
          venue: string
        }
        Insert: {
          artist_id?: string | null
          city: string
          created_at?: string
          end_date: string
          id?: string
          sort_order?: number
          start_date: string
          status?: string
          updated_at?: string
          venue?: string
        }
        Update: {
          artist_id?: string | null
          city?: string
          created_at?: string
          end_date?: string
          id?: string
          sort_order?: number
          start_date?: string
          status?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_spots_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          artist_id: string | null
          aspect: string
          caption: string
          created_at: string
          id: string
          image_url: string
          sort_order: number
          style: string
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          aspect?: string
          caption?: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          style?: string
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          aspect?: string
          caption?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          style?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
