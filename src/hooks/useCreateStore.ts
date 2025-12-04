import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// 타입 정의 (모듈 export 문제 해결을 위해 직접 정의)
type PopupStoreInsert = {
  id?: string
  seller_id: string
  name: string
  description?: string | null
  category: string
  location: string
  latitude?: number | null
  longitude?: number | null
  start_date: string
  end_date: string
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

export function useCreateStore() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createStore = async (data: Omit<PopupStoreInsert, 'seller_id' | 'id'>) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    setLoading(true)
    setError(null)

    try {
      // 프로필 존재 여부 확인 및 생성
      let profileExists = false
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // 프로필이 없는 경우 생성
          const username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`
          const { data: newProfile, error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: username,
              role: 'user',
            })
            .select()
            .single()

          if (createProfileError) {
            console.error('프로필 생성 에러:', createProfileError)
            throw new Error(`프로필 생성 실패: ${createProfileError.message}. RLS 정책을 확인해주세요.`)
          }

          if (!newProfile) {
            throw new Error('프로필 생성 후 데이터를 받지 못했습니다.')
          }

          // 프로필 생성 후 재확인 (트랜잭션 지연 대비)
          await new Promise((resolve) => setTimeout(resolve, 100))
          
          const { data: verifyProfile, error: verifyError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single()

          if (verifyError || !verifyProfile) {
            throw new Error('프로필 생성 후 확인에 실패했습니다. 잠시 후 다시 시도해주세요.')
          }
          
          profileExists = true
        } else {
          console.error('프로필 확인 에러:', profileError)
          throw new Error(`프로필 확인 실패: ${profileError.message}`)
        }
      } else {
        profileExists = true
      }

      // 프로필이 존재하는지 최종 확인
      if (!profileExists || !profile) {
        throw new Error('프로필이 존재하지 않습니다. 프로필을 먼저 생성해주세요.')
      }

      // 스토어 데이터 생성
      const storeData: PopupStoreInsert = {
        ...data,
        seller_id: user.id,
        status: data.status || 'draft',
      }

      const { data: store, error: insertError } = await supabase
        .from('popup_stores')
        .insert(storeData)
        .select()
        .single()

      if (insertError) {
        console.error('스토어 생성 에러:', insertError)
        // RLS 정책 위반인 경우 더 명확한 메시지 제공
        if (insertError.message?.includes('row-level security')) {
          throw new Error(
            `RLS 정책 위반: 스토어를 생성할 권한이 없습니다. ` +
            `프로필이 제대로 생성되었는지 확인해주세요. (에러: ${insertError.message})`
          )
        }
        throw insertError
      }

      return { data: store, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '스토어 생성에 실패했습니다.'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    createStore,
    loading,
    error,
  }
}



