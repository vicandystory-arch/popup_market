import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export function ProfileForm() {
  const { user } = useAuth()
  const { profile, loading, error, updateUsername, updateAvatar, updateRole } = useProfile()
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [role, setRole] = useState<'user' | 'seller' | 'admin'>('user')
  const [isEditing, setIsEditing] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username)
      setAvatarUrl(profile.avatar_url || '')
      setRole(profile.role)
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    setSaveSuccess(false)
    setSaveLoading(true)

    try {
      // 사용자명 업데이트
      if (username !== profile?.username) {
        const { error: usernameError } = await updateUsername(username)
        if (usernameError) {
          setSaveError(usernameError)
          setSaveLoading(false)
          return
        }
      }

      // 아바타 URL 업데이트
      if (avatarUrl !== (profile?.avatar_url || '')) {
        const { error: avatarError } = await updateAvatar(avatarUrl || null)
        if (avatarError) {
          setSaveError(avatarError)
          setSaveLoading(false)
          return
        }
      }

      // 역할 업데이트 (일반 사용자는 자신의 역할을 변경할 수 없음)
      // 역할 변경은 관리자만 가능하도록 제한
      if (role !== profile?.role && profile?.role === 'admin') {
        const { error: roleError } = await updateRole(role)
        if (roleError) {
          setSaveError(roleError)
          setSaveLoading(false)
          return
        }
      }

      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '프로필 업데이트 중 오류가 발생했습니다.')
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">프로필을 불러올 수 없습니다.</p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">프로필 관리</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            수정
          </Button>
        )}
      </div>

      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          프로필이 성공적으로 업데이트되었습니다.
        </div>
      )}

      {(error || saveError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error || saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 아바타 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            프로필 이미지
          </label>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="프로필"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
            {isEditing && (
              <div className="flex-1">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="이미지 URL을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  이미지 URL을 입력하거나 Supabase Storage를 사용하세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 사용자명 */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            사용자명
          </label>
          {isEditing ? (
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="px-3 py-2 bg-gray-50 rounded-md">{profile.username}</p>
          )}
        </div>

        {/* 역할 */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            역할
          </label>
          {isEditing && profile.role === 'admin' ? (
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'seller' | 'admin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">일반 사용자</option>
              <option value="seller">판매자</option>
              <option value="admin">관리자</option>
            </select>
          ) : (
            <p className="px-3 py-2 bg-gray-50 rounded-md">
              {role === 'user' && '일반 사용자'}
              {role === 'seller' && '판매자'}
              {role === 'admin' && '관리자'}
            </p>
          )}
          {profile.role !== 'admin' && (
            <p className="mt-1 text-xs text-gray-500">
              역할 변경은 관리자에게 문의하세요.
            </p>
          )}
        </div>

        {/* 이메일 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-600">
            {user?.email || '이메일 없음'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            이메일은 변경할 수 없습니다.
          </p>
        </div>

        {/* 생성일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            가입일
          </label>
          <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-600">
            {new Date(profile.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saveLoading}>
              {saveLoading ? '저장 중...' : '저장'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setUsername(profile.username)
                setAvatarUrl(profile.avatar_url || '')
                setRole(profile.role)
                setSaveError(null)
              }}
            >
              취소
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}



