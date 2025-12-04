// 데이터베이스 타입 정의
// Supabase에서 자동 생성된 타입을 사용하거나 수동으로 정의

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          role: 'user' | 'seller' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          role?: 'user' | 'seller' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          role?: 'user' | 'seller' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      popup_stores: {
        Row: {
          id: string
          seller_id: string
          name: string
          description: string | null
          category: string
          location: string
          latitude: number | null
          longitude: number | null
          start_date: string
          end_date: string
          opening_hours: Record<string, string> | null
          contact_info: {
            phone?: string
            email?: string
            instagram?: string
            facebook?: string
          } | null
          images: string[]
          tags: string[]
          status: 'draft' | 'published' | 'ended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          name: string
          description?: string | null
          category: string
          location: string
          latitude?: number | null
          longitude?: number | null
          start_date: string
          end_date: string
          opening_hours?: Record<string, string> | null
          contact_info?: {
            phone?: string
            email?: string
            instagram?: string
            facebook?: string
          } | null
          images?: string[]
          tags?: string[]
          status?: 'draft' | 'published' | 'ended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          name?: string
          description?: string | null
          category?: string
          location?: string
          latitude?: number | null
          longitude?: number | null
          start_date?: string
          end_date?: string
          opening_hours?: Record<string, string> | null
          contact_info?: {
            phone?: string
            email?: string
            instagram?: string
            facebook?: string
          } | null
          images?: string[]
          tags?: string[]
          status?: 'draft' | 'published' | 'ended'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          store_id: string
          user_id: string
          rating: number
          comment: string | null
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          user_id: string
          rating: number
          comment?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          store_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          store_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          store_id?: string
          created_at?: string
        }
      }
      collaborations: {
        Row: {
          id: string
          store_id: string
          requester_id: string
          title: string
          description: string
          collaboration_type: 'joint' | 'sponsorship' | 'space_sharing' | 'event' | 'other'
          contact_email: string
          contact_phone: string | null
          budget_range: string | null
          preferred_dates: Record<string, string> | null
          status: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          requester_id: string
          title: string
          description: string
          collaboration_type: 'joint' | 'sponsorship' | 'space_sharing' | 'event' | 'other'
          contact_email: string
          contact_phone?: string | null
          budget_range?: string | null
          preferred_dates?: Record<string, string> | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          requester_id?: string
          title?: string
          description?: string
          collaboration_type?: 'joint' | 'sponsorship' | 'space_sharing' | 'event' | 'other'
          contact_email?: string
          contact_phone?: string | null
          budget_range?: string | null
          preferred_dates?: Record<string, string> | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_store_rating: {
        Args: {
          store_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 편의 타입 정의
export type Profile = Database['public']['Tables']['profiles']['Row']
export type PopupStore = Database['public']['Tables']['popup_stores']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Collaboration = Database['public']['Tables']['collaborations']['Row']

export type PopupStoreInsert = Database['public']['Tables']['popup_stores']['Insert']
export type PopupStoreUpdate = Database['public']['Tables']['popup_stores']['Update']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert']
export type CollaborationInsert = Database['public']['Tables']['collaborations']['Insert']
export type CollaborationUpdate = Database['public']['Tables']['collaborations']['Update']



