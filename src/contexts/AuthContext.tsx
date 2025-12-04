import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
type User = NonNullable<Session>['user'] | null
type AuthError = { message: string; status?: number }

interface AuthContextType {
  user: User | null
  session: Session
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithKakao: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('세션 확인 오류:', error)
        setSession(null)
        setUser(null)
        setLoading(false)
        return
      }
      
      // 세션이 있고 유효한 사용자가 있는 경우에만 설정
      if (session && session.user) {
        setSession(session)
        setUser(session.user)
      } else {
        setSession(null)
        setUser(null)
      }
      setLoading(false)
    })

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('인증 상태 변경:', event, session?.user?.email || '로그아웃')
      
      // 로그아웃 이벤트 명시적 처리
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session || !session) {
        // 상태 즉시 초기화
        setSession(null)
        setUser(null)
        setLoading(false)
        
        // 추가 확인: 세션이 정말 없는지 재확인
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (!currentSession) {
          setSession(null)
          setUser(null)
        }
        return
      }
      
      // 로그인/세션 업데이트 이벤트 처리
      if (session && session.user) {
        setSession(session)
        setUser(session.user)
        setLoading(false)
      } else {
        // 세션이 없으면 확실히 초기화
        setSession(null)
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    // 프로필 생성은 트리거에서 자동으로 처리됨
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { error: null }
  }

  const signOut = async () => {
    try {
      // 1. 먼저 상태 초기화
      setUser(null)
      setSession(null)
      setLoading(true)
      
      // 2. Supabase 세션 종료 (모든 스코프에서)
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      
      if (error) {
        console.error('로그아웃 오류:', error)
      }
      
      // 3. 로컬 스토리지에서 Supabase 관련 데이터 완전히 제거
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oaypyevjwtfoualfmjwq.supabase.co'
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'oaypyevjwtfoualfmjwq'
        
        // Supabase가 사용하는 모든 가능한 키 패턴 제거
        const keysToRemove: string[] = []
        
        // localStorage에서 Supabase 관련 키 찾기
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes(projectRef))) {
            keysToRemove.push(key)
          }
        }
        
        // sessionStorage에서 Supabase 관련 키 찾기
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes(projectRef))) {
            keysToRemove.push(key)
          }
        }
        
        // 찾은 모든 키 제거
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key)
            sessionStorage.removeItem(key)
          } catch (e) {
            // 무시
          }
        })
        
        // 추가로 일반적인 Supabase 키 패턴도 제거 시도
        const commonKeys = [
          `sb-${projectRef}-auth-token`,
          `supabase.auth.token`,
          `sb-${projectRef}-auth-token-code-verifier`,
        ]
        
        commonKeys.forEach(key => {
          try {
            localStorage.removeItem(key)
            sessionStorage.removeItem(key)
          } catch (e) {
            // 무시
          }
        })
      } catch (storageError) {
        console.warn('스토리지 정리 중 오류:', storageError)
      }
      
      // 4. 세션 재확인 및 강제 정리
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        console.warn('세션이 남아있어 강제 정리합니다.')
        // 강제로 다시 signOut 시도
        await supabase.auth.signOut({ scope: 'global' })
        setUser(null)
        setSession(null)
      }
      
      // 5. 상태 최종 확인
      setUser(null)
      setSession(null)
      setLoading(false)
      
    } catch (error) {
      console.error('로그아웃 중 예상치 못한 오류:', error)
      // 에러가 발생해도 상태는 확실히 초기화
      setUser(null)
      setSession(null)
      setLoading(false)
      
      // 스토리지는 강제로 정리
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oaypyevjwtfoualfmjwq.supabase.co'
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'oaypyevjwtfoualfmjwq'
        
        // 모든 Supabase 관련 키 제거
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes(projectRef))) {
            localStorage.removeItem(key)
          }
        }
        
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key = sessionStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes(projectRef))) {
            sessionStorage.removeItem(key)
          }
        }
      } catch (e) {
        // 무시
      }
    }
  }

  const signInWithKakao = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { error: null }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { error: null }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithKakao,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



