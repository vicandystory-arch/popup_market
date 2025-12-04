import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// PopupStore 타입 정의
type PopupStore = {
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

export function useStore(storeId: string) {
  const [store, setStore] = useState<PopupStore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!storeId) {
      setLoading(false)
      return
    }

    fetchStore()
  }, [storeId])

  const fetchStore = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('popup_stores')
        .select('*')
        .eq('id', storeId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      setStore(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '스토어 정보를 불러오는 중 오류가 발생했습니다.')
      setStore(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    store,
    loading,
    error,
    refetch: fetchStore,
  }
}



