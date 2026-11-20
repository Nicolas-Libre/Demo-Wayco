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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      cancellations: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      catalog: {
        Row: {
          brand: string
          consumption_l_100km: number | null
          fuel_type: string | null
          id: number
          model: string
          version: string
          year: number
        }
        Insert: {
          brand: string
          consumption_l_100km?: number | null
          fuel_type?: string | null
          id?: never
          model: string
          version: string
          year: number
        }
        Update: {
          brand?: string
          consumption_l_100km?: number | null
          fuel_type?: string | null
          id?: never
          model?: string
          version?: string
          year?: number
        }
        Relationships: []
      }
      catalog_import_candidates: {
        Row: {
          anio_modelo: number | null
          codigo_fuente: string
          combustible_verificado: string | null
          consumo_l_100km_verificado: number | null
          creado_en: string
          denominacion_original: string
          estado: string
          marca_original: string
          modelo_normalizado: string | null
          tipo_original: string
          version_normalizada: string | null
        }
        Insert: {
          anio_modelo?: number | null
          codigo_fuente: string
          combustible_verificado?: string | null
          consumo_l_100km_verificado?: number | null
          creado_en?: string
          denominacion_original: string
          estado?: string
          marca_original: string
          modelo_normalizado?: string | null
          tipo_original: string
          version_normalizada?: string | null
        }
        Update: {
          anio_modelo?: number | null
          codigo_fuente?: string
          combustible_verificado?: string | null
          consumo_l_100km_verificado?: number | null
          creado_en?: string
          denominacion_original?: string
          estado?: string
          marca_original?: string
          modelo_normalizado?: string | null
          tipo_original?: string
          version_normalizada?: string | null
        }
        Relationships: []
      }
      google_maps_usage: {
        Row: {
          free_limit: number | null
          period: string
          request_count: number
          request_limit: number
          service: string
          updated_at: string
        }
        Insert: {
          free_limit?: number | null
          period: string
          request_count?: number
          request_limit?: number
          service: string
          updated_at?: string
        }
        Update: {
          free_limit?: number | null
          period?: string
          request_count?: number
          request_limit?: number
          service?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          id: string
          passenger_id: string
          seats: number
          status: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          passenger_id: string
          seats: number
          status?: string
          trip_id: string
        }
        Update: {
          created_at?: string
          id?: string
          passenger_id?: string
          seats?: number
          status?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_ratings: {
        Row: {
          category: string
          created_at: string
          id: string
          is_automatic: boolean
          reviewed_id: string
          reviewer_id: string
          score: number
          trip_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_automatic?: boolean
          reviewed_id: string
          reviewer_id: string
          score: number
          trip_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_automatic?: boolean
          reviewed_id?: string
          reviewer_id?: string
          score?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_ratings_reviewed_id_fkey"
            columns: ["reviewed_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_ratings_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_ratings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          available_seats: number
          created_at: string
          date: string
          destination: string
          destination_address: string | null
          destination_lat: number | null
          destination_lng: number | null
          driver_id: string
          finalized_at: string | null
          hour: string
          id: string
          notes: string | null
          origin: string
          origin_address: string | null
          origin_lat: number | null
          origin_lng: number | null
          price_per_seat: number
          route_distance_meters: number | null
          route_duration_seconds: number | null
          route_polyline: string | null
          route_toll_cost: number | null
          status: string
          total_seats: number
          vehicle_id: string
        }
        Insert: {
          available_seats: number
          created_at?: string
          date: string
          destination: string
          destination_address?: string | null
          destination_lat?: number | null
          destination_lng?: number | null
          driver_id: string
          finalized_at?: string | null
          hour: string
          id?: string
          notes?: string | null
          origin: string
          origin_address?: string | null
          origin_lat?: number | null
          origin_lng?: number | null
          price_per_seat: number
          route_distance_meters?: number | null
          route_duration_seconds?: number | null
          route_polyline?: string | null
          route_toll_cost?: number | null
          status?: string
          total_seats: number
          vehicle_id: string
        }
        Update: {
          available_seats?: number
          created_at?: string
          date?: string
          destination?: string
          destination_address?: string | null
          destination_lat?: number | null
          destination_lng?: number | null
          driver_id?: string
          finalized_at?: string | null
          hour?: string
          id?: string
          notes?: string | null
          origin?: string
          origin_address?: string | null
          origin_lat?: number | null
          origin_lng?: number | null
          price_per_seat?: number
          route_distance_meters?: number | null
          route_duration_seconds?: number | null
          route_polyline?: string | null
          route_toll_cost?: number | null
          status?: string
          total_seats?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          rating_id: string | null
          transaction_type: string
          trip_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          rating_id?: string | null
          transaction_type: string
          trip_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          rating_id?: string | null
          transaction_type?: string
          trip_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credit_transactions_rating_id_fkey"
            columns: ["rating_id"]
            isOneToOne: false
            referencedRelation: "trip_ratings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_credit_transactions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          average_rating: number
          cbu_alias: string | null
          created_at: string
          dni_back_url: string | null
          dni_front_url: string | null
          email: string
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          role: string
          surname: string
          total_trips: number
        }
        Insert: {
          average_rating?: number
          cbu_alias?: string | null
          created_at?: string
          dni_back_url?: string | null
          dni_front_url?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          photo_url?: string | null
          role?: string
          surname: string
          total_trips?: number
        }
        Update: {
          average_rating?: number
          cbu_alias?: string | null
          created_at?: string
          dni_back_url?: string | null
          dni_front_url?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          role?: string
          surname?: string
          total_trips?: number
        }
        Relationships: []
      }
      users_status_history: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      vehicle_designated_drivers: {
        Row: {
          created_at: string
          dni: string
          dni_back_url: string
          dni_front_url: string
          id: string
          license_url: string
          name: string
          surname: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          dni: string
          dni_back_url: string
          dni_front_url: string
          id?: string
          license_url: string
          name: string
          surname: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          dni?: string
          dni_back_url?: string
          dni_front_url?: string
          id?: string
          license_url?: string
          name?: string
          surname?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_designated_drivers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          catalog_id: number | null
          created_at: string
          deleted_at: string | null
          disable_reason: string | null
          disabled_at: string | null
          driver_id: string
          fuel: string
          fuel_consumption_x100km: number
          id: string
          license_url: string | null
          model: string
          patent: string
          registration_card_url: string | null
          reject_reason: string | null
          secure_url: string | null
          validated_at: string | null
          validated_by: string | null
          validation_state: string
          version: string | null
          year: number
        }
        Insert: {
          brand: string
          catalog_id?: number | null
          created_at?: string
          deleted_at?: string | null
          disable_reason?: string | null
          disabled_at?: string | null
          driver_id: string
          fuel?: string
          fuel_consumption_x100km: number
          id?: string
          license_url?: string | null
          model: string
          patent: string
          registration_card_url?: string | null
          reject_reason?: string | null
          secure_url?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_state?: string
          version?: string | null
          year: number
        }
        Update: {
          brand?: string
          catalog_id?: number | null
          created_at?: string
          deleted_at?: string | null
          disable_reason?: string | null
          disabled_at?: string | null
          driver_id?: string
          fuel?: string
          fuel_consumption_x100km?: number
          id?: string
          license_url?: string | null
          model?: string
          patent?: string
          registration_card_url?: string | null
          reject_reason?: string | null
          secure_url?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_state?: string
          version?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      wayco_available_brands: {
        Row: {
          brand: string | null
        }
        Relationships: []
      }
      wayco_available_models: {
        Row: {
          brand: string | null
          model: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cancel_my_reservation: {
        Args: { p_reservation_id: string }
        Returns: {
          id: string
          seats: number
          status: string
        }[]
      }
      cancel_my_trip: {
        Args: { p_trip_id: string }
        Returns: {
          id: string
          status: string
        }[]
      }
      complete_expired_trip_ratings: { Args: never; Returns: number }
      create_trip_reservation: {
        Args: { p_seats?: number; p_trip_id: string }
        Returns: {
          id: string
          seats: number
          status: string
        }[]
      }
      delete_my_vehicle: { Args: { p_vehicle_id: string }; Returns: string }
      finalize_empty_trip: {
        Args: { p_trip_id: string }
        Returns: {
          id: string
          status: string
        }[]
      }
      finalize_trip: {
        Args: { p_trip_id: string }
        Returns: {
          id: string
          status: string
        }[]
      }
      get_user_credit_balance: { Args: never; Returns: number }
      rate_trip_participant: {
        Args: { p_reviewed_id: string; p_score: number; p_trip_id: string }
        Returns: {
          completed_ratings: number
          required_ratings: number
          trip_id: string
          trip_status: string
        }[]
      }
      recalculate_trip_rating: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      reserve_google_maps_request: {
        Args: never
        Returns: {
          allowed: boolean
          current_count: number
          max_count: number
          warning_reached: boolean
        }[]
      }
      reserve_google_maps_service_request: {
        Args: { p_free_limit: number; p_service: string }
        Returns: {
          allowed: boolean
          current_count: number
          max_count: number
          warning_reached: boolean
        }[]
      }
      search_trips_geographically: {
        Args: {
          p_date: string
          p_destination_lat: number
          p_destination_lng: number
          p_limit?: number
          p_minimum_hour?: string
          p_origin_lat: number
          p_origin_lng: number
          p_radius_km?: number
        }
        Returns: {
          destination_distance_km: number
          origin_distance_km: number
          total_distance_km: number
          trip_id: string
        }[]
      }
      update_trip_reservation_status: {
        Args: { p_reservation_id: string; p_status: string }
        Returns: {
          id: string
          seats: number
          status: string
        }[]
      }
      wayco_distance_km: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      wayco_register_catalog_vehicle: {
        Args: {
          p_brand: string
          p_model: string
          p_version: string
          p_year: number
        }
        Returns: number
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
