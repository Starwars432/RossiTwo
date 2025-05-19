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
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          content: Json
          metadata: Json
          is_draft: boolean
          created_at: string | null
          updated_at: string | null
          published_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content?: Json
          metadata?: Json
          is_draft?: boolean
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: Json
          metadata?: Json
          is_draft?: boolean
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
        }
      }
      media: {
        Row: {
          id: string
          filename: string
          url: string
          mime_type: string
          size: number
          uploaded_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          filename: string
          url: string
          mime_type: string
          size: number
          uploaded_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          filename?: string
          url?: string
          mime_type?: string
          size?: number
          uploaded_by?: string | null
          created_at?: string | null
        }
      }
      editor_settings: {
        Row: {
          id: string
          user_id: string
          github_token: string | null
          github_repo: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          github_token?: string | null
          github_repo?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          github_token?: string | null
          github_repo?: string | null
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
          user_id: string | null
          amount: number
          items: Json
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount: number
          items: Json
          status?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          amount?: number
          items?: Json
          status?: string
          created_at?: string | null
        }
      }
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}