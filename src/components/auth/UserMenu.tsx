import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const [showMenu, setShowMenu] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (!user) {
    return (
      <Link
        to="/auth"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        로그인
      </Link>
    )
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setShowMenu(false)
    
    try {
      await signOut()
      
      // 로그아웃 후 즉시 홈 페이지로 강제 리다이렉트
      // replace: true로 히스토리 교체하여 뒤로가기 방지
      window.location.href = '/'
      
      // 위의 리다이렉트가 작동하지 않을 경우를 대비한 백업
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          window.location.replace('/')
        }
        // 최종적으로 페이지 새로고침으로 완전한 상태 초기화
        window.location.reload()
      }, 200)
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error)
      // 에러가 발생해도 강제로 리다이렉트
      window.location.href = '/'
      setIsSigningOut(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
            {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {profile?.username || user.email}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${showMenu ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{profile?.username || user.email}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Link
              to="/profile"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              프로필 관리
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-400 border-t-transparent"></div>
                  <span>로그아웃 중...</span>
                </>
              ) : (
                '로그아웃'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}



