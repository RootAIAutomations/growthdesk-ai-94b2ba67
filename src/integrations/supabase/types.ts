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
      clients: {
        Row: {
          business_type: string | null
          created_at: string
          email: string | null
          follow_up_date: string | null
          id: string
          last_contact_date: string | null
          last_contacted: string | null
          name: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"]
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          last_contacted?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          last_contacted?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      content_calendar: {
        Row: {
          blog_opener: string | null
          content_date: string
          created_at: string
          day_number: number | null
          generated_at: string | null
          generated_by: string | null
          id: string
          instagram_caption: string | null
          linkedin_post: string | null
          notes: string | null
          platform: string | null
          status: string
          tags: string[] | null
          topic: string
          updated_at: string
          video_script: string | null
          week_start_date: string | null
        }
        Insert: {
          blog_opener?: string | null
          content_date: string
          created_at?: string
          day_number?: number | null
          generated_at?: string | null
          video_script?: string | null
          generated_by?: string | null
          id?: string
          instagram_caption?: string | null
          linkedin_post?: string | null
          notes?: string | null
          platform?: string | null
          status?: string
          tags?: string[] | null
          topic: string
          updated_at?: string
          week_start_date?: string | null
        }
        Update: {
          blog_opener?: string | null
          content_date?: string
          created_at?: string
          day_number?: number | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          instagram_caption?: string | null
          linkedin_post?: string | null
          notes?: string | null
          platform?: string | null
          status?: string
          tags?: string[] | null
          topic?: string
          updated_at?: string
          week_start_date?: string | null
        }
        Relationships: []
      }
      content_library: {
        Row: {
          body: string | null
          content: string | null
          content_calendar_id: string | null
          content_type: string | null
          created_at: string
          id: string
          platform: string | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          content?: string | null
          content_calendar_id?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          content?: string | null
          content_calendar_id?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      follow_up_schedule: {
        Row: {
          client_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          due_date: string
          id: string
          notes: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date: string
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_schedule_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      message_log: {
        Row: {
          client_id: string
          created_at: string
          details: string | null
          direction: string
          id: string
          interaction_date: string
          message: string
          message_type: string | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          details?: string | null
          direction?: string
          id?: string
          interaction_date?: string
          message: string
          message_type?: string | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          details?: string | null
          direction?: string
          id?: string
          interaction_date?: string
          message?: string
          message_type?: string | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_drafts: {
        Row: {
          channel: string
          client_id: string | null
          copied_at: string | null
          draft_text: string
          edited_text: string | null
          generated_at: string
          generated_by: string | null
          id: string
          prompt_context: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          channel?: string
          client_id?: string | null
          copied_at?: string | null
          draft_text: string
          edited_text?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          prompt_context?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          channel?: string
          client_id?: string | null
          copied_at?: string | null
          draft_text?: string
          edited_text?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          prompt_context?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_drafts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      client_status: "Lead" | "Active" | "Follow-Up" | "Won" | "Lost"
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
      client_status: ["Lead", "Active", "Follow-Up", "Won", "Lost"],
    },
  },
} as const
