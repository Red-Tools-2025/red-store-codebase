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
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      employee: {
        Row: {
          createdat: string | null
          empid: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid: number[] | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          createdat?: string | null
          empid?: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid?: number[] | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          createdat?: string | null
          empid?: number
          empname?: string
          empphone?: string
          empstatus?: boolean
          roleid?: number[] | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      employee_store_1: {
        Row: {
          createdat: string | null
          empid: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid: number[] | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          createdat?: string | null
          empid?: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid?: number[] | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          createdat?: string | null
          empid?: number
          empname?: string
          empphone?: string
          empstatus?: boolean
          roleid?: number[] | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      employee_store_2: {
        Row: {
          createdat: string | null
          empid: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid: number[] | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          createdat?: string | null
          empid?: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid?: number[] | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          createdat?: string | null
          empid?: number
          empname?: string
          empphone?: string
          empstatus?: boolean
          roleid?: number[] | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      employee_store_4: {
        Row: {
          createdat: string | null
          empid: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid: number[] | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          createdat?: string | null
          empid?: number
          empname: string
          empphone: string
          empstatus: boolean
          roleid?: number[] | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          createdat?: string | null
          empid?: number
          empname?: string
          empphone?: string
          empstatus?: boolean
          roleid?: number[] | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          addedat: string | null
          favid: number
          invid: number
          invitem: string
          invitembrand: string | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          addedat?: string | null
          favid?: number
          invid: number
          invitem: string
          invitembrand?: string | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          addedat?: string | null
          favid?: number
          invid?: number
          invitem?: string
          invitembrand?: string | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_favorites"
            columns: ["storeid", "invid"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["storeid", "invid"]
          },
          {
            foreignKeyName: "fk_store_favorites"
            columns: ["storeid", "storemanagerid"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["storeid", "storemanagerid"]
          },
        ]
      }
      favorites_store_101: {
        Row: {
          addedat: string | null
          favid: number
          invid: number
          invitem: string
          invitembrand: string | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          addedat?: string | null
          favid?: number
          invid: number
          invitem: string
          invitembrand?: string | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          addedat?: string | null
          favid?: number
          invid?: number
          invitem?: string
          invitembrand?: string | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      favorites_store_2: {
        Row: {
          addedat: string | null
          favid: number
          invid: number
          invitem: string
          invitembrand: string | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          addedat?: string | null
          favid?: number
          invid: number
          invitem: string
          invitembrand?: string | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          addedat?: string | null
          favid?: number
          invid?: number
          invitem?: string
          invitembrand?: string | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          invadditional: Json | null
          invcreateddate: string | null
          invid: number
          invitem: string
          invitembarcode: string | null
          invitembrand: string | null
          invitemprice: number
          invitemstock: number
          invitemtype: string | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice: number
          invitemstock: number
          invitemtype?: string | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem?: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice?: number
          invitemstock?: number
          invitemtype?: string | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_store_inventory"
            columns: ["storeid", "storemanagerid"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["storeid", "storemanagerid"]
          },
        ]
      }
      inventory_store_1: {
        Row: {
          invadditional: Json | null
          invcreateddate: string | null
          invid: number
          invitem: string
          invitembarcode: string | null
          invitembrand: string | null
          invitemprice: number
          invitemstock: number
          invitemtype: string | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice: number
          invitemstock: number
          invitemtype?: string | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem?: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice?: number
          invitemstock?: number
          invitemtype?: string | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      inventory_store_2: {
        Row: {
          invadditional: Json | null
          invcreateddate: string | null
          invid: number
          invitem: string
          invitembarcode: string | null
          invitembrand: string | null
          invitemprice: number
          invitemstock: number
          invitemtype: string | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice: number
          invitemstock: number
          invitemtype?: string | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem?: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice?: number
          invitemstock?: number
          invitemtype?: string | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      inventory_store_4: {
        Row: {
          invadditional: Json | null
          invcreateddate: string | null
          invid: number
          invitem: string
          invitembarcode: string | null
          invitembrand: string | null
          invitemprice: number
          invitemstock: number
          invitemtype: string | null
          storeid: number
          storemanagerid: string
        }
        Insert: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice: number
          invitemstock: number
          invitemtype?: string | null
          storeid: number
          storemanagerid: string
        }
        Update: {
          invadditional?: Json | null
          invcreateddate?: string | null
          invid?: number
          invitem?: string
          invitembarcode?: string | null
          invitembrand?: string | null
          invitemprice?: number
          invitemstock?: number
          invitemtype?: string | null
          storeid?: number
          storemanagerid?: string
        }
        Relationships: []
      }
      Role: {
        Row: {
          roleId: number
          roleType: Database["public"]["Enums"]["RoleType"]
        }
        Insert: {
          roleId?: number
          roleType: Database["public"]["Enums"]["RoleType"]
        }
        Update: {
          roleId?: number
          roleType?: Database["public"]["Enums"]["RoleType"]
        }
        Relationships: []
      }
      Sale: {
        Row: {
          invId: number
          saleDate: string
          saleId: number
          salePrice: number
          saleQuantity: number
          storeId: number
          storeManagerId: string
        }
        Insert: {
          invId: number
          saleDate: string
          saleId?: number
          salePrice: number
          saleQuantity: number
          storeId: number
          storeManagerId: string
        }
        Update: {
          invId?: number
          saleDate?: string
          saleId?: number
          salePrice?: number
          saleQuantity?: number
          storeId?: number
          storeManagerId?: string
        }
        Relationships: []
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      store: {
        Row: {
          createdat: string | null
          customfields: Json | null
          storeid: number
          storelocation: string | null
          storemanagerid: string
          storename: string
          storestatus: boolean
        }
        Insert: {
          createdat?: string | null
          customfields?: Json | null
          storeid?: number
          storelocation?: string | null
          storemanagerid: string
          storename: string
          storestatus: boolean
        }
        Update: {
          createdat?: string | null
          customfields?: Json | null
          storeid?: number
          storelocation?: string | null
          storemanagerid?: string
          storename?: string
          storestatus?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["storemanagerid"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      store_manager_cm53jfy2y0001141joy1n113v: {
        Row: {
          createdat: string | null
          customfields: Json | null
          storeid: number
          storelocation: string | null
          storemanagerid: string
          storename: string
          storestatus: boolean
        }
        Insert: {
          createdat?: string | null
          customfields?: Json | null
          storeid?: number
          storelocation?: string | null
          storemanagerid: string
          storename: string
          storestatus: boolean
        }
        Update: {
          createdat?: string | null
          customfields?: Json | null
          storeid?: number
          storelocation?: string | null
          storemanagerid?: string
          storename?: string
          storestatus?: boolean
        }
        Relationships: []
      }
      store_manager_cm5i1aq0f0001l52flaqt4z43: {
        Row: {
          createdat: string | null
          customfields: Json | null
          storeid: number
          storelocation: string | null
          storemanagerid: string
          storename: string
          storestatus: boolean
        }
        Insert: {
          createdat?: string | null
          customfields?: Json | null
          storeid?: number
          storelocation?: string | null
          storemanagerid: string
          storename: string
          storestatus: boolean
        }
        Update: {
          createdat?: string | null
          customfields?: Json | null
          storeid?: number
          storelocation?: string | null
          storemanagerid?: string
          storename?: string
          storestatus?: boolean
        }
        Relationships: []
      }
      User: {
        Row: {
          createdAt: string
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          password: string
          phone: string | null
          roleId: number
        }
        Insert: {
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          password: string
          phone?: string | null
          roleId: number
        }
        Update: {
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          password?: string
          phone?: string | null
          roleId?: number
        }
        Relationships: [
          {
            foreignKeyName: "User_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Role"
            referencedColumns: ["roleId"]
          },
        ]
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_create_employee_partition: {
        Args: {
          store_id: number
        }
        Returns: undefined
      }
      check_and_create_favorites_partition: {
        Args: {
          store_id: number
        }
        Returns: boolean
      }
      check_and_create_inventory_partition: {
        Args: {
          store_id: number
        }
        Returns: boolean
      }
      check_and_create_store_partition: {
        Args: {
          manager_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      RoleType: "SALES" | "MANAGER" | "INVENTORY_STAFF" | "STORE_MANAGER"
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
