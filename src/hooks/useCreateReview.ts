import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

type ReviewInsert = {
  id?: string
  store_id: string
  user_id: string
  rating: number
  comment?: string | null
  images?: string[]
  created_at?: string
  updated_at?: string
}

export function useCreateReview() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReview = async (data: Omit<ReviewInsert, 'user_id' | 'id'>) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    setLoading(true)
    setError(null)

    try {
      // 이미 리뷰가 있는지 확인
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('store_id', data.store_id)
        .eq('user_id', user.id)
        .single()

      if (existingReview) {
        throw new Error('이미 리뷰를 작성하셨습니다. 수정만 가능합니다.')
      }

      const reviewData: ReviewInsert = {
        ...data,
        user_id: user.id,
      }

      const { data: review, error: insertError } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single()

      if (insertError) throw insertError

      return { data: review, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '리뷰 작성에 실패했습니다.'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    createReview,
    loading,
    error,
  }
}



