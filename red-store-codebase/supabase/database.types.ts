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
      inventory_timeseries: {
        Row: {
          closing_stock: number | null
          mrp_per_bottle: number | null
          opening_stock: number | null
          product_id: number
          received_stock: number | null
          sale_amount: number | null
          sales: number | null
          store_id: number
          time: string
        }
        Insert: {
          closing_stock?: number | null
          mrp_per_bottle?: number | null
          opening_stock?: number | null
          product_id: number
          received_stock?: number | null
          sale_amount?: number | null
          sales?: number | null
          store_id: number
          time: string
        }
        Update: {
          closing_stock?: number | null
          mrp_per_bottle?: number | null
          opening_stock?: number | null
          product_id?: number
          received_stock?: number | null
          sale_amount?: number | null
          sales?: number | null
          store_id?: number
          time?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_inventory_worth: {
        Args: {
          store_id_input: number
        }
        Returns: {
          total_worth: number
          previous_month_worth: number
          increase_amount: number
          increase_percentage: number
        }[]
      }
      calculate_monthly_transaction_metrics: {
        Args: {
          store_id_input: number
        }
        Returns: {
          month: string
          average_transaction: number
          total_transactions: number
          highest_transaction: number
          lowest_transaction: number
        }[]
      }
      calculate_restock_data: {
        Args: {
          store_id_input: number
        }
        Returns: {
          current_month_total_value: number
          previous_month_total_value: number
          percentage_change: number
          current_month_frequency: number
          previous_month_frequency: number
        }[]
      }
      calculate_store_revenue: {
        Args: {
          store_id_input: number
          year_input: number
          month_input: number
        }
        Returns: {
          period: string
          total_revenue: number
          currency: string
        }[]
      }
      get_available_years_and_months: {
        Args: {
          store_id_input: number
        }
        Returns: {
          year: number
          month: number
        }[]
      }
      get_mean_transaction_value_by_day: {
        Args: {
          store_id_input: number
        }
        Returns: {
          bucket: string
          mean_transaction: number
        }[]
      }
      get_monthly_sales: {
        Args: {
          store_id_input: number
        }
        Returns: {
          month: string
          total_sales: number
          currency: string
        }[]
      }
      get_sales_averages: {
        Args: {
          store_id_input: number
        }
        Returns: {
          avg_daily_sales: number
          avg_monthly_sales: number
        }[]
      }
      get_sales_by_hour: {
        Args: {
          store_id_input: number
        }
        Returns: {
          hour: number
          total_sales: number
        }[]
      }
      get_sales_by_hour_date_range: {
        Args: {
          store_id_input: number
          start_date: string
          end_date: string
        }
        Returns: {
          hour: number
          total_sales: number
        }[]
      }
      get_store_revenue_by_date_range: {
        Args: {
          store_id_input: number
          start_date: string
          end_date: string
        }
        Returns: {
          bucket: string
          total_revenue: number
          currency: string
        }[]
      }
      get_store_revenue_last_30_days: {
        Args: {
          store_id_input: number
        }
        Returns: {
          bucket: string
          total_revenue: number
          currency: string
        }[]
      }
      get_timeseries_status: {
        Args: {
          p_store_id: number
          p_product_id: number
          p_timestamp: string
        }
        Returns: {
          last_closing_stock: number
          last_received_stock: number
          same_day_received_stock: number
          has_same_day_record: boolean
        }[]
      }
      get_top_10_best_selling_products: {
        Args: {
          store_id_input: number
        }
        Returns: {
          product_id: number
          total_sales: number
        }[]
      }
      get_top_10_best_selling_products_by_revenue_stock_status: {
        Args: {
          store_id_input: number
        }
        Returns: {
          product_id: number
          total_sales: number
          revenue: number
          stock: number
          status: string
        }[]
      }
      get_top_10_best_selling_products_date_range: {
        Args: {
          store_id_input: number
          start_date: string
          end_date: string
        }
        Returns: {
          product_id: number
          total_sales: number
        }[]
      }
      get_top_10_worst_selling_products: {
        Args: {
          store_id_input: number
        }
        Returns: {
          product_id: number
          total_sales: number
        }[]
      }
      get_weekday_transaction_averages: {
        Args: {
          store_id_input: number
        }
        Returns: {
          weekday: string
          mean_transaction_value: number
        }[]
      }
      get_weekday_transaction_averages_date_range: {
        Args: {
          store_id_input: number
          start_date: string
          end_date: string
        }
        Returns: {
          weekday: string
          mean_transaction_value: number
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
