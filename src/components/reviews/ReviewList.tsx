import { useState } from 'react'
import { useReviews } from '../../hooks/useReviews'
import { ReviewItem } from './ReviewItem'

// 타입 정의 (모듈 export 문제 해결을 위해 직접 정의)
type ReviewFilter = 'all' | '5' | '4' | '3' | '2' | '1'
type ReviewSort = 'latest' | 'rating_high' | 'rating_low'

interface ReviewListProps {
  storeId: string
}

export function ReviewList({ storeId }: ReviewListProps) {
  const [filter, setFilter] = useState<ReviewFilter>('all')
  const [sort, setSort] = useState<ReviewSort>('latest')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { reviews, loading, error, totalCount, refetch } = useReviews({
    storeId,
    filter,
    sort,
    page,
    pageSize,
  })

  const totalPages = Math.ceil(totalCount / pageSize)

  if (loading && page === 1) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">리뷰를 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>아직 작성된 리뷰가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 필터 및 정렬 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">평점 필터:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as ReviewFilter)
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="5">5점</option>
            <option value="4">4점</option>
            <option value="3">3점</option>
            <option value="2">2점</option>
            <option value="1">1점</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">정렬:</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as ReviewSort)
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">최신순</option>
            <option value="rating_high">평점 높은순</option>
            <option value="rating_low">평점 낮은순</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-600">
          총 {totalCount}개 리뷰
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} onUpdate={refetch} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          <span className="px-4 py-2 text-gray-700">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}



