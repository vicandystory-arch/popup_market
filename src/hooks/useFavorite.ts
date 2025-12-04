import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useFavorite(storeId: string) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !storeId) {
      setLoading(false)
      return
    }

    checkFavorite()
  }, [user, storeId])

  const checkFavorite = async () => {
    if (!user || !storeId) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('store_id', storeId)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116은 "no rows returned" 에러이므로 정상
        throw error
      }

      setIsFavorite(!!data)
      setFavoriteId(data?.id || null)
    } catch (err) {
      console.error('즐겨찾기 확인 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    try {
      if (isFavorite && favoriteId) {
        // 즐겨찾기 제거
        const { error } = await supabase.from('favorites').delete().eq('id', favoriteId)

        if (error) throw error

        setIsFavorite(false)
        setFavoriteId(null)
      } else {
        // 즐겨찾기 추가
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            store_id: storeId,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) throw error

        setIsFavorite(true)
        setFavoriteId(data.id)
      }
    } catch (err) {
      throw err
    }
  }

  return {
    isFavorite,
    loading,
    toggleFavorite,
    refetch: checkFavorite,
  }
}



