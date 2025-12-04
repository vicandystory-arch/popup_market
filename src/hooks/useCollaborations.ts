import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// 타입 정의 (모듈 export 문제 해결을 위해 직접 정의)
type Collaboration = {
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
  profiles?: {
    username: string
    avatar_url: string | null
  }
}

interface UseCollaborationsOptions {
  storeId?: string
  requesterId?: string
  status?: 'pending' | 'approved' | 'rejected' | 'completed'
}

export function useCollaborations(options: UseCollaborationsOptions = {}) {
  const { storeId, requesterId, status } = options
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCollaborations()
  }, [storeId, requesterId, status])

  const fetchCollaborations = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('collaborations')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false })

      if (storeId) {
        query = query.eq('store_id', storeId)
      }

      if (requesterId) {
        query = query.eq('requester_id', requesterId)
      }

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setCollaborations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '협업 요청을 불러오는 중 오류가 발생했습니다.')
      setCollaborations([])
    } finally {
      setLoading(false)
    }
  }

  return {
    collaborations,
    loading,
    error,
    refetch: fetchCollaborations,
  }
}



