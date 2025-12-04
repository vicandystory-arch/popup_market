import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL 해시에서 인증 정보 처리 (OAuth 콜백)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        if (error) {
          console.error('OAuth 오류:', error, errorDescription)
          navigate(`/auth?error=${encodeURIComponent(errorDescription || error)}`)
          return
        }

        // URL 파라미터에서 오류 확인
        const urlError = searchParams.get('error')
        if (urlError) {
          console.error('인증 오류:', urlError)
          navigate(`/auth?error=${encodeURIComponent(urlError)}`)
          return
        }

        // 세션 확인
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('세션 오류:', sessionError)
          navigate('/auth?error=auth_failed')
          return
        }

        if (data.session) {
          // 로그인 성공
          navigate('/')
        } else {
          // 세션이 없음 - 잠시 대기 후 재시도
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession()
            if (retryData.session) {
              navigate('/')
            } else {
              navigate('/auth?error=no_session')
            }
          }, 1000)
        }
      } catch (error) {
        console.error('콜백 처리 오류:', error)
        navigate('/auth?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
}
