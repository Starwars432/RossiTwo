export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          product_id: string
          quantity: number
          added_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id: string
          quantity?: number
          added_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string
          quantity?: number
          added_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          total_amount: number
          items: Json
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          total_amount: number
          items: Json
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          total_amount?: number
          items?: Json
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          amount: number
          items: Json
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          items: Json
          status?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          items?: Json
          status?: string
          created_at?: string | null
        }
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
  }
}