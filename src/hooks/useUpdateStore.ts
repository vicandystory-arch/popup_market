import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// 타입 정의 (모듈 export 문제 해결을 위해 직접 정의)
type PopupStoreUpdate = {
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

export function useUpdateStore(storeId: string) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateStore = async (data: PopupStoreUpdate) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: store, error: updateError } = await supabase
        .from('popup_stores')
        .update(data)
        .eq('id', storeId)
        .eq('seller_id', user.id) // RLS 정책과 함께 판매자 확인
        .select()
        .single()

      if (updateError) {
        // RLS 정책 위반 시 에러 메시지 개선
        if (updateError.code === 'PGRST116') {
          throw new Error('스토어를 찾을 수 없거나 수정 권한이 없습니다.')
        }
        throw updateError
      }

      return { data: store, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '스토어 수정에 실패했습니다.'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    updateStore,
    loading,
    error,
  }
}



