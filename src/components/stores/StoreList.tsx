import { useState } from 'react'
import { StoreCard } from './StoreCard'
import { useStores } from '@/hooks/useStores'

type SortOption = 'latest' | 'popular' | 'distance'
type DateFilterOption = 'all' | 'upcoming' | 'ongoing' | 'ended'

interface StoreListProps {
  category?: string
  search?: string
  location?: string
  dateFilter?: DateFilterOption
  sortBy?: SortOption
  startDate?: string
  endDate?: string
}

export function StoreList({
  category,
  search,
  location,
  dateFilter = 'ongoing',
  sortBy = 'latest',
  startDate,
  endDate,
}: StoreListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 12

  const { stores, loading, error, totalPages } = useStores({
    page,
    pageSize,
    category,
    status: 'published',
    search,
    location,
    dateFilter,
    sortBy,
    startDate,
    endDate,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">스토어 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">표시할 스토어가 없습니다.</p>
        <p className="text-sm text-gray-500">
          {search || location || category
            ? '검색 조건에 맞는 스토어가 없습니다.'
            : '등록된 스토어가 없습니다.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* 결과 개수 표시 */}
      <div className="mb-4 text-sm text-gray-600">
        총 {stores.length}개의 스토어를 찾았습니다.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}



