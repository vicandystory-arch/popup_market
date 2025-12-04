import { Link } from 'react-router-dom'
import { UserMenu } from '@/components/auth/UserMenu'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signInWithKakao, loading } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleKakaoLogin = async () => {
    setIsLoggingIn(true)
    try {
      const { error } = await signInWithKakao()
      if (error) {
        console.error('카카오 로그인 오류:', error)
        alert('카카오 로그인에 실패했습니다: ' + error.message)
        setIsLoggingIn(false)
      }
      // 성공 시 OAuth 리다이렉트가 발생하므로 여기서는 아무것도 하지 않음
    } catch (error) {
      console.error('예상치 못한 오류:', error)
      alert('로그인 중 오류가 발생했습니다.')
      setIsLoggingIn(false)
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700">
            팝업 마켓
          </Link>
          
          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/stores"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              스토어 목록
            </Link>
            <Link
              to="/favorites"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              즐겨찾기
            </Link>
            <Link
              to="/stores/new"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              스토어 등록
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* 카카오 로그인 버튼 - 로그인하지 않은 사용자에게만 표시 */}
            {!user && !loading && (
              <button
                onClick={handleKakaoLogin}
                disabled={isLoggingIn}
                className="cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-lg"
                aria-label="카카오 로그인"
              >
                {isLoggingIn ? (
                  <div className="px-3 py-2 bg-yellow-300 text-black rounded-md flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent"></div>
                    <span className="font-medium text-xs">로그인 중...</span>
                  </div>
                ) : (
                  <img
                    src="/kakao_login_medium_narrow.png"
                    alt="카카오 로그인"
                    className="h-8 w-auto"
                    onError={(e) => {
                      // 이미지 로드 실패 시 대체 버튼 표시
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent && !parent.querySelector('.kakao-fallback')) {
                        const fallback = document.createElement('button')
                        fallback.className = 'kakao-fallback px-3 py-2 bg-yellow-300 text-black rounded-md hover:bg-yellow-400 transition-colors text-xs font-medium'
                        fallback.textContent = '카카오 로그인'
                        fallback.onclick = handleKakaoLogin
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                )}
              </button>
            )}
            
            <UserMenu />
            
            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              aria-label="메뉴"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              {/* 모바일 카카오 로그인 버튼 */}
              {!user && !loading && (
                <div className="px-4">
                  <button
                    onClick={() => {
                      handleKakaoLogin()
                      setMobileMenuOpen(false)
                    }}
                    disabled={isLoggingIn}
                    className="w-full cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="카카오 로그인"
                  >
                    {isLoggingIn ? (
                      <div className="px-4 py-2 bg-yellow-300 text-black rounded-md flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                        <span className="font-medium text-sm">로그인 중...</span>
                      </div>
                    ) : (
                      <img
                        src="/kakao_login_medium_narrow.png"
                        alt="카카오 로그인"
                        className="h-10 w-auto mx-auto"
                      />
                    )}
                  </button>
                </div>
              )}
              
              <Link
                to="/stores"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
              >
                스토어 목록
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
              >
                즐겨찾기
              </Link>
              <Link
                to="/stores/new"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
              >
                스토어 등록
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}



