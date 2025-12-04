import { useParams, Navigate } from 'react-router-dom'
import { useStore } from '@/hooks/useStore'
import { StoreForm } from '@/components/stores/StoreForm'
import { useAuth } from '@/contexts/AuthContext'

export function EditStorePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { store, loading, error } = useStore(id || '')

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="text-center py-12">
          <p className="text-gray-500">스토어 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || '스토어를 찾을 수 없습니다.'}
        </div>
      </div>
    )
  }

  // 판매자만 수정 가능
  if (store.seller_id !== user?.id) {
    return <Navigate to={`/stores/${id}`} replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">스토어 정보 수정</h1>
      <StoreForm storeId={id} initialData={store} />
    </div>
  )
}



