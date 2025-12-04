import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL 해시에서 인증 정보 확인 (OAuth 콜백)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        // 오류 확인
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

        // URL 해시에 토큰이 있는 경우 Supabase가 자동으로 처리하도록 대기
        if (accessToken || refreshToken || window.location.hash.includes('access_token')) {
          console.log('OAuth 토큰 감지됨, 세션 처리 대기 중...')
          
          // Supabase가 URL 해시를 처리할 시간을 줌
          // onAuthStateChange 이벤트가 트리거될 시간을 줌
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // 세션 확인 (Supabase가 자동으로 URL 해시에서 토큰을 읽어 세션 생성)
        // 여러 번 시도하여 확실하게 처리
        let sessionData: { session: any } | null = null
        let sessionError: any = null
        
        for (let i = 0; i < 3; i++) {
          const result = await supabase.auth.getSession()
          sessionData = result.data
          sessionError = result.error
          
          if (sessionData?.session) {
            break
          }
          
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
        
        if (sessionError) {
          console.error('세션 오류:', sessionError)
          navigate('/auth?error=auth_failed')
          return
        }

        if (sessionData?.session) {
          console.log('로그인 성공:', sessionData.session.user.email)
          // URL 해시 제거 (보안 및 깔끔한 URL)
          window.history.replaceState(null, '', window.location.pathname)
          // 로그인 성공
          navigate('/', { replace: true })
        } else {
          // 세션이 없음 - 잠시 대기 후 재시도
          console.log('세션 없음, 재시도 중...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const { data: retryData, error: retryError } = await supabase.auth.getSession()
          if (retryError) {
            console.error('재시도 세션 오류:', retryError)
            navigate('/auth?error=auth_failed')
            return
          }
          
          if (retryData?.session) {
            console.log('재시도 성공:', retryData.session.user.email)
            window.history.replaceState(null, '', window.location.pathname)
            navigate('/', { replace: true })
          } else {
            console.error('세션을 가져올 수 없음')
            navigate('/auth?error=no_session')
          }
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
