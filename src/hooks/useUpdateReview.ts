import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

type ReviewUpdate = {
  id?: string
  store_id?: string
  user_id?: string
  rating?: number
  comment?: string | null
  images?: string[]
  created_at?: string
  updated_at?: string
}

export function useUpdateReview(reviewId: string) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateReview = async (data: ReviewUpdate) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: review, error: updateError } = await supabase
        .from('reviews')
        .update(data)
        .eq('id', reviewId)
        .eq('user_id', user.id) // RLS 정책과 함께 본인 확인
        .select()
        .single()

      if (updateError) {
        if (updateError.code === 'PGRST116') {
          throw new Error('리뷰를 찾을 수 없거나 수정 권한이 없습니다.')
        }
        throw updateError
      }

      return { data: review, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '리뷰 수정에 실패했습니다.'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    updateReview,
    loading,
    error,
  }
}



