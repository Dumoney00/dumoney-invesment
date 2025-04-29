export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          created_at: string
          id: string
          ifsc_code: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          created_at?: string
          id?: string
          ifsc_code: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          created_at?: string
          id?: string
          ifsc_code?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      owned_products: {
        Row: {
          cycle_days: number
          id: string
          product_id: number
          purchase_date: string
          user_id: string
        }
        Insert: {
          cycle_days: number
          id?: string
          product_id: number
          purchase_date?: string
          user_id: string
        }
        Update: {
          cycle_days?: number
          id?: string
          product_id?: number
          purchase_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "owned_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          approval_timestamp: string | null
          approved_by: string | null
          bank_details_id: string | null
          details: string | null
          id: string
          product_id: number | null
          product_name: string | null
          status: string
          timestamp: string
          type: string
          user_id: string
          withdrawal_time: string | null
        }
        Insert: {
          amount: number
          approval_timestamp?: string | null
          approved_by?: string | null
          bank_details_id?: string | null
          details?: string | null
          id?: string
          product_id?: number | null
          product_name?: string | null
          status: string
          timestamp?: string
          type: string
          user_id: string
          withdrawal_time?: string | null
        }
        Update: {
          amount?: number
          approval_timestamp?: string | null
          approved_by?: string | null
          bank_details_id?: string | null
          details?: string | null
          id?: string
          product_id?: number | null
          product_name?: string | null
          status?: string
          timestamp?: string
          type?: string
          user_id?: string
          withdrawal_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_details_id_fkey"
            columns: ["bank_details_id"]
            isOneToOne: false
            referencedRelation: "bank_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          balance: number
          created_at: string
          daily_income: number
          email: string
          id: string
          investment_quantity: number
          is_admin: boolean
          is_blocked: boolean
          last_income_collection: string | null
          level: number | null
          phone: string | null
          referral_code: string | null
          referral_status: string | null
          referred_by: string | null
          total_deposit: number
          total_withdraw: number
          username: string
          withdrawal_balance: number
        }
        Insert: {
          balance?: number
          created_at?: string
          daily_income?: number
          email: string
          id: string
          investment_quantity?: number
          is_admin?: boolean
          is_blocked?: boolean
          last_income_collection?: string | null
          level?: number | null
          phone?: string | null
          referral_code?: string | null
          referral_status?: string | null
          referred_by?: string | null
          total_deposit?: number
          total_withdraw?: number
          username: string
          withdrawal_balance?: number
        }
        Update: {
          balance?: number
          created_at?: string
          daily_income?: number
          email?: string
          id?: string
          investment_quantity?: number
          is_admin?: boolean
          is_blocked?: boolean
          last_income_collection?: string | null
          level?: number | null
          phone?: string | null
          referral_code?: string | null
          referral_status?: string | null
          referred_by?: string | null
          total_deposit?: number
          total_withdraw?: number
          username?: string
          withdrawal_balance?: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
