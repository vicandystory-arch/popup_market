import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// Profile 타입 정의
type Profile = {
  id: string
  username: string
  avatar_url: string | null
  role: 'user' | 'seller' | 'admin'
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError) {
        // 프로필이 없는 경우 생성 시도
        if (fetchError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
              role: 'user',
            })
            .select()
            .single()

          if (createError) {
            setError(createError.message)
          } else {
            setProfile(newProfile)
          }
        } else {
          setError(fetchError.message)
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setProfile(data)
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로필 업데이트 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateUsername = async (username: string) => {
    if (username.length < 2) {
      return { error: '사용자명은 최소 2자 이상이어야 합니다.' }
    }

    return updateProfile({ username })
  }

  const updateAvatar = async (avatarUrl: string | null) => {
    return updateProfile({ avatar_url: avatarUrl })
  }

  const updateRole = async (role: 'user' | 'seller' | 'admin') => {
    return updateProfile({ role })
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateUsername,
    updateAvatar,
    updateRole,
  }
}



