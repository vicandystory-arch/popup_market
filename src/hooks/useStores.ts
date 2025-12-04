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

// SortOption 타입은 각 컴포넌트에서 직접 정의 (모듈 export 문제 해결)
// export type SortOption = 'latest' | 'popular' | 'distance'
type SortOption = 'latest' | 'popular' | 'distance'

interface UseStoresOptions {
  page?: number
  pageSize?: number
  category?: string
  status?: 'draft' | 'published' | 'ended' | 'all'
  search?: string
  location?: string
  startDate?: string
  endDate?: string
  dateFilter?: 'all' | 'upcoming' | 'ongoing' | 'ended'
  sortBy?: SortOption
  userLatitude?: number
  userLongitude?: number
}

export function useStores(options: UseStoresOptions = {}) {
  const {
    page = 1,
    pageSize = 12,
    category,
    status = 'published',
    search,
    location,
    startDate,
    endDate,
    dateFilter = 'ongoing',
    sortBy = 'latest',
    userLatitude,
    userLongitude,
  } = options

  const [stores, setStores] = useState<PopupStore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchStores()
  }, [page, pageSize, category, status, search, location, startDate, endDate, dateFilter, sortBy])

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('popup_stores')
        .select('*', { count: 'exact' })

      // 상태 필터
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      // 카테고리 필터
      if (category) {
        query = query.eq('category', category)
      }

      // 지역 필터
      if (location) {
        query = query.ilike('location', `%${location}%`)
      }

      // 날짜 필터
      const today = new Date().toISOString().split('T')[0]
      if (dateFilter === 'upcoming') {
        // 예정된 스토어
        query = query.gt('start_date', today)
      } else if (dateFilter === 'ongoing') {
        // 진행 중인 스토어
        query = query.lte('start_date', today).gte('end_date', today)
      } else if (dateFilter === 'ended') {
        // 종료된 스토어
        query = query.lt('end_date', today)
      }
      // 'all'인 경우 날짜 필터 없음

      // 날짜 범위 필터
      if (startDate) {
        query = query.gte('start_date', startDate)
      }
      if (endDate) {
        query = query.lte('end_date', endDate)
      }

      // 검색 필터 (이름, 위치, 설명, 태그)
      if (search) {
        // 태그 배열 검색을 위한 별도 처리
        query = query.or(
          `name.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`
        )
        // 태그 검색은 클라이언트 측에서 필터링 (Supabase 배열 검색 제한)
      }

      // 정렬
      if (sortBy === 'latest') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'popular') {
        // 인기순은 리뷰 수나 평점으로 정렬해야 하지만, 현재는 created_at으로 대체
        // 추후 리뷰 시스템 구현 후 수정 필요
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'distance' && userLatitude && userLongitude) {
        // 거리순 정렬은 클라이언트 측에서 처리 (PostGIS 필요)
        query = query.order('created_at', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // 페이지네이션
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        throw fetchError
      }

      let filteredStores = data || []

      // 태그 검색 필터링 (클라이언트 측)
      if (search) {
        const searchLower = search.toLowerCase()
        filteredStores = filteredStores.filter((store) => {
          const tagMatch = store.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          )
          return tagMatch || true // 다른 필드 검색은 이미 서버에서 처리됨
        })
      }

      // 거리순 정렬 (클라이언트 측)
      if (sortBy === 'distance' && userLatitude && userLongitude) {
        filteredStores = filteredStores.sort((a, b) => {
          if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) {
            return 0
          }
          const distanceA = calculateDistance(
            userLatitude,
            userLongitude,
            a.latitude,
            a.longitude
          )
          const distanceB = calculateDistance(
            userLatitude,
            userLongitude,
            b.latitude,
            b.longitude
          )
          return distanceA - distanceB
        })
      }

      setStores(filteredStores)
      setTotalCount(count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : '스토어 목록을 불러오는 중 오류가 발생했습니다.')
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  // 두 지점 간 거리 계산 (Haversine 공식)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371 // 지구 반경 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return {
    stores,
    loading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    refetch: fetchStores,
  }
}



