import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// 타입 정의 (모듈 export 문제 해결을 위해 직접 정의)
type CollaborationInsert = {
  id?: string
  store_id: string
  requester_id: string
  title: string
  description: string
  collaboration_type: 'joint' | 'sponsorship' | 'space_sharing' | 'event' | 'other'
  contact_email: string
  contact_phone?: string | null
  budget_range?: string | null
  preferred_dates?: Record<string, string> | null
  status?: 'pending' | 'approved' | 'rejected' | 'completed'
  created_at?: string
  updated_at?: string
}

export function useCreateCollaboration() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCollaboration = async (data: Omit<CollaborationInsert, 'requester_id' | 'id'>) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    setLoading(true)
    setError(null)

    try {
      // 프로필 존재 여부 확인
      const { error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // 프로필이 없는 경우 생성
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
            role: 'user',
          })

        if (createProfileError) {
          throw new Error(`프로필 생성 실패: ${createProfileError.message}`)
        }
      } else if (profileError) {
        throw new Error(`프로필 확인 실패: ${profileError.message}`)
      }

      // 협업 요청 데이터 생성
      const collaborationData: CollaborationInsert = {
        ...data,
        requester_id: user.id,
        status: 'pending',
      }

      console.log('협업 요청 데이터:', collaborationData)

      const { data: collaboration, error: insertError } = await supabase
        .from('collaborations')
        .insert(collaborationData)
        .select()
        .single()

      if (insertError) {
        console.error('협업 요청 생성 에러 상세:', {
          error: insertError,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        })
        
        // RLS 정책 위반인 경우 더 명확한 메시지 제공
        if (insertError.message?.includes('row-level security') || insertError.code === '42501') {
          throw new Error(
            `RLS 정책 위반: 협업 요청을 생성할 권한이 없습니다. ` +
            `데이터베이스의 RLS 정책을 확인해주세요. (에러: ${insertError.message})`
          )
        }
        
        // 테이블이 없는 경우 (PGRST205 에러)
        if (insertError.code === 'PGRST205' || insertError.code === '42P01' || 
            insertError.message?.includes('Could not find the table') ||
            insertError.message?.includes('does not exist') ||
            (insertError.message?.includes('relation') && insertError.message?.includes('does not exist'))) {
          throw new Error(
            `데이터베이스 테이블이 존재하지 않습니다.\n\n` +
            `📋 해결 방법:\n` +
            `1. Supabase Dashboard 접속 (https://app.supabase.com)\n` +
            `2. 프로젝트 선택 후 SQL Editor 메뉴 클릭\n` +
            `3. "New Query" 클릭\n` +
            `4. 파일 'supabase/migrations/20241202000001_add_collaborations.sql'의 전체 내용을 복사하여 붙여넣기\n` +
            `5. "Run" 버튼 클릭하여 실행\n` +
            `6. 실행 완료 후 Supabase 프로젝트를 재시작하거나 몇 분 기다린 후 다시 시도\n\n` +
            `에러 코드: ${insertError.code}`
          )
        }
        
        // 제약 조건 위반
        if (insertError.code === '23505') {
          throw new Error(
            `이미 해당 스토어에 협업 요청을 보냈습니다. ` +
            `한 스토어당 하나의 협업 요청만 가능합니다.`
          )
        }
        
        throw new Error(
          `협업 요청 생성 실패: ${insertError.message || '알 수 없는 오류'} ` +
          `(코드: ${insertError.code || 'N/A'})`
        )
      }

      console.log('협업 요청 생성 성공:', collaboration)
      return { data: collaboration, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '협업 요청 생성에 실패했습니다.'
      console.error('협업 요청 생성 최종 에러:', err)
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    createCollaboration,
    loading,
    error,
  }
}



