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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      anime: {
        Row: {
          aired_from: string | null
          aired_to: string | null
          created_at: string
          duration: string | null
          episodes: number | null
          favorites: number | null
          genres: string[] | null
          image_url: string | null
          mal_id: number
          members: number | null
          popularity: number | null
          rank: number | null
          rating: string | null
          score: number | null
          scored_by: number | null
          season: string | null
          source: string | null
          status: string | null
          studios: string[] | null
          synopsis: string | null
          title: string
          title_english: string | null
          title_japanese: string | null
          trailer_url: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          aired_from?: string | null
          aired_to?: string | null
          created_at?: string
          duration?: string | null
          episodes?: number | null
          favorites?: number | null
          genres?: string[] | null
          image_url?: string | null
          mal_id: number
          members?: number | null
          popularity?: number | null
          rank?: number | null
          rating?: string | null
          score?: number | null
          scored_by?: number | null
          season?: string | null
          source?: string | null
          status?: string | null
          studios?: string[] | null
          synopsis?: string | null
          title: string
          title_english?: string | null
          title_japanese?: string | null
          trailer_url?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          aired_from?: string | null
          aired_to?: string | null
          created_at?: string
          duration?: string | null
          episodes?: number | null
          favorites?: number | null
          genres?: string[] | null
          image_url?: string | null
          mal_id?: number
          members?: number | null
          popularity?: number | null
          rank?: number | null
          rating?: string | null
          score?: number | null
          scored_by?: number | null
          season?: string | null
          source?: string | null
          status?: string | null
          studios?: string[] | null
          synopsis?: string | null
          title?: string
          title_english?: string | null
          title_japanese?: string | null
          trailer_url?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          anime_watched: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          favorite_genres: string[] | null
          id: string
          preferred_studios: string[] | null
          total_episodes: number | null
          updated_at: string
          username: string | null
          watching_since: string | null
        }
        Insert: {
          anime_watched?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          favorite_genres?: string[] | null
          id: string
          preferred_studios?: string[] | null
          total_episodes?: number | null
          updated_at?: string
          username?: string | null
          watching_since?: string | null
        }
        Update: {
          anime_watched?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          favorite_genres?: string[] | null
          id?: string
          preferred_studios?: string[] | null
          total_episodes?: number | null
          updated_at?: string
          username?: string | null
          watching_since?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string
          id: string
          is_dismissed: boolean | null
          is_viewed: boolean | null
          mal_id: number
          reasoning: string | null
          recommendation_type: string
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_dismissed?: boolean | null
          is_viewed?: boolean | null
          mal_id: number
          reasoning?: string | null
          recommendation_type: string
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_dismissed?: boolean | null
          is_viewed?: boolean | null
          mal_id?: number
          reasoning?: string | null
          recommendation_type?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_mal_id_fkey"
            columns: ["mal_id"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["mal_id"]
          },
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          helpful_count: number | null
          id: string
          is_spoiler: boolean | null
          mal_id: number
          review_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_spoiler?: boolean | null
          mal_id: number
          review_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_spoiler?: boolean | null
          mal_id?: number
          review_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_mal_id_fkey"
            columns: ["mal_id"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["mal_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_anime: {
        Row: {
          created_at: string
          episodes_watched: number | null
          finish_date: string | null
          id: string
          is_favorite: boolean | null
          mal_id: number
          notes: string | null
          rewatched_times: number | null
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
          user_score: number | null
        }
        Insert: {
          created_at?: string
          episodes_watched?: number | null
          finish_date?: string | null
          id?: string
          is_favorite?: boolean | null
          mal_id: number
          notes?: string | null
          rewatched_times?: number | null
          start_date?: string | null
          status: string
          updated_at?: string
          user_id: string
          user_score?: number | null
        }
        Update: {
          created_at?: string
          episodes_watched?: number | null
          finish_date?: string | null
          id?: string
          is_favorite?: boolean | null
          mal_id?: number
          notes?: string | null
          rewatched_times?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          user_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_anime_mal_id_fkey"
            columns: ["mal_id"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["mal_id"]
          },
          {
            foreignKeyName: "user_anime_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
