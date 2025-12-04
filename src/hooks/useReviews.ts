import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export type Review = {
  id: string
  store_id: string
  user_id: string
  rating: number
  comment: string | null
  images: string[]
  created_at: string
  updated_at: string
  profiles?: {
    username: string
    avatar_url: string | null
  }
}

export type ReviewFilter = 'all' | '5' | '4' | '3' | '2' | '1'
export type ReviewSort = 'latest' | 'rating_high' | 'rating_low'

interface UseReviewsOptions {
  storeId: string
  filter?: ReviewFilter
  sort?: ReviewSort
  page?: number
  pageSize?: number
}

export function useReviews({ storeId, filter = 'all', sort = 'latest', page = 1, pageSize = 10 }: UseReviewsOptions) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    if (!storeId) {
      setLoading(false)
      return
    }

    fetchReviews()
  }, [storeId, filter, sort, page])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('reviews')
        .select('*, profiles(username, avatar_url)', { count: 'exact' })
        .eq('store_id', storeId)

      // 평점 필터
      if (filter !== 'all') {
        query = query.eq('rating', parseInt(filter))
      }

      // 정렬
      if (sort === 'latest') {
        query = query.order('created_at', { ascending: false })
      } else if (sort === 'rating_high') {
        query = query.order('rating', { ascending: false }).order('created_at', { ascending: false })
      } else if (sort === 'rating_low') {
        query = query.order('rating', { ascending: true }).order('created_at', { ascending: false })
      }

      // 페이지네이션
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      setReviews(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : '리뷰를 불러오는 중 오류가 발생했습니다.')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  return {
    reviews,
    loading,
    error,
    totalCount,
    refetch: fetchReviews,
  }
}



