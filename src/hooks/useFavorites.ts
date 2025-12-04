import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export type FavoriteStore = {
  id: string
  store_id: string
  created_at: string
  popup_stores: {
    id: string
    name: string
    description: string | null
    category: string
    location: string
    images: string[]
    status: 'draft' | 'published' | 'ended'
    start_date: string
    end_date: string
  }
}

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteStore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select(
          `
          id,
          store_id,
          created_at,
          popup_stores (
            id,
            name,
            description,
            category,
            location,
            images,
            status,
            start_date,
            end_date
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // 타입 변환 (Supabase의 join 결과 처리)
      const formattedData = (data || []).map((item: any) => ({
        id: item.id,
        store_id: item.store_id,
        created_at: item.created_at,
        popup_stores: item.popup_stores,
      }))

      setFavorites(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.')
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase.from('favorites').delete().eq('id', favoriteId).eq('user_id', user!.id)

      if (error) throw error

      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId))
    } catch (err) {
      throw err
    }
  }

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    removeFavorite,
  }
}



