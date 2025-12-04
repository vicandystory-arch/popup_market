import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStoreRating(storeId: string) {
  const [rating, setRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!storeId) {
      setLoading(false)
      return
    }

    fetchRating()
  }, [storeId])

  const fetchRating = async () => {
    try {
      setLoading(true)

      // 평균 평점 및 개수 조회
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('store_id', storeId)

      if (error) throw error

      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
        const avgRating = totalRating / data.length
        setRating(Math.round(avgRating * 10) / 10) // 소수점 1자리
        setReviewCount(data.length)

        // 평점 분포 계산
        const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        data.forEach((review) => {
          distribution[review.rating as keyof typeof distribution]++
        })
        setRatingDistribution(distribution)
      } else {
        setRating(null)
        setReviewCount(0)
      }
    } catch (err) {
      console.error('평점 조회 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    rating,
    reviewCount,
    ratingDistribution,
    loading,
    refetch: fetchRating,
  }
}



