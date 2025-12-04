import { useParams, Link } from 'react-router-dom'
import { useStore } from '@/hooks/useStore'
import { StoreDetails } from '@/components/stores/StoreDetails'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function StoreDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { store, loading, error } = useStore(id || '')
  const isOwner = store && user && store.seller_id === user.id

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">스토어 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || '스토어를 찾을 수 없습니다.'}</p>
          <Link to="/stores">
            <Button variant="outline">스토어 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 뒤로가기 버튼 및 수정 버튼 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            스토어 목록으로 돌아가기
          </Link>
          {isOwner && (
            <Link to={`/stores/${id}/edit`}>
              <Button>스토어 수정</Button>
            </Link>
          )}
        </div>
      </div>

      <StoreDetails store={store} />
    </div>
  )
}



