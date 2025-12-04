import { StoreImageGallery } from './StoreImageGallery'
import { StoreMap } from './StoreMap'
import { RatingDisplay } from '../reviews/RatingDisplay'
import { ReviewForm } from '../reviews/ReviewForm'
import { ReviewList } from '../reviews/ReviewList'
import { FavoriteButton } from '../favorites/FavoriteButton'
import { CollaborationList } from '../collaborations/CollaborationList'
import { useStoreRating } from '../../hooks/useStoreRating'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

type PopupStore = {
  id: string
  name: string
  description: string | null
  category: string
  location: string
  latitude: number | null
  longitude: number | null
  start_date: string
  end_date: string
  opening_hours: Record<string, string> | null
  contact_info: {
    phone?: string
    email?: string
    instagram?: string
    facebook?: string
  } | null
  images: string[]
  tags: string[]
  status: 'draft' | 'published' | 'ended'
}

interface StoreDetailsProps {
  store: PopupStore
}

export function StoreDetails({ store }: StoreDetailsProps) {
  const { user } = useAuth()
  const { rating, reviewCount, refetch: refetchRating } = useStoreRating(store.id)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = () => {
    const today = new Date()
    const startDate = new Date(store.start_date)
    const endDate = new Date(store.end_date)

    if (today < startDate) {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">예정</span>
    } else if (today > endDate) {
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">종료</span>
    } else {
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">진행중</span>
    }
  }

  // const weekdays = ['월', '화', '수', '목', '금', '토', '일'] // 사용하지 않음
  const weekdayMap: Record<string, string> = {
    monday: '월',
    tuesday: '화',
    wednesday: '수',
    thursday: '목',
    friday: '금',
    saturday: '토',
    sunday: '일',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">
                {store.name}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {getStatusBadge()}
              <FavoriteButton storeId={store.id} size="md" />
            </div>
          </div>
          {/* 평점 표시 */}
          {rating !== null && (
            <div className="mb-3 sm:mb-4">
              <RatingDisplay rating={rating} reviewCount={reviewCount} size="sm" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 text-gray-600">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {store.category}
            </span>
            {store.tags && store.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {store.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 이미지 갤러리 */}
        <div className="lg:col-span-2">
          <StoreImageGallery images={store.images} storeName={store.name} />
        </div>

        {/* 오른쪽: 정보 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">기본 정보</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">운영 기간</p>
                <p className="font-medium">
                  {formatDate(store.start_date)} ~ {formatDate(store.end_date)}
                </p>
              </div>
              {store.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">설명</p>
                  <p className="text-gray-900 whitespace-pre-line">{store.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* 운영 시간 */}
          {store.opening_hours && Object.keys(store.opening_hours).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">운영 시간</h2>
              <div className="space-y-2">
                {Object.entries(store.opening_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-700">{weekdayMap[day.toLowerCase()] || day}</span>
                    <span className="font-medium">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 위치 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">위치</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-gray-900">{store.location}</p>
              </div>
              {store.latitude && store.longitude && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <StoreMap
                    latitude={store.latitude}
                    longitude={store.longitude}
                    storeName={store.name}
                    address={store.location}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 연락처 */}
          {store.contact_info && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">연락처</h2>
              <div className="space-y-3">
                {store.contact_info.phone && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a href={`tel:${store.contact_info.phone}`} className="text-blue-600 hover:text-blue-800">
                      {store.contact_info.phone}
                    </a>
                  </div>
                )}
                {store.contact_info.email && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a href={`mailto:${store.contact_info.email}`} className="text-blue-600 hover:text-blue-800">
                      {store.contact_info.email}
                    </a>
                  </div>
                )}
                {store.contact_info.instagram && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <a
                      href={store.contact_info.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      인스타그램
                    </a>
                  </div>
                )}
                {store.contact_info.facebook && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <a
                      href={store.contact_info.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      페이스북
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 참여 업체 (콜라보레이션) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">참여 업체 (콜라보레이션)</h2>
            <CollaborationList storeId={store.id} />
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">리뷰</h2>
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              리뷰 작성
            </button>
          )}
        </div>

        {/* 리뷰 작성 폼 */}
        {showReviewForm && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <ReviewForm
              storeId={store.id}
              onSuccess={() => {
                setShowReviewForm(false)
                refetchRating()
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* 리뷰 목록 */}
        <ReviewList storeId={store.id} />
      </div>
    </div>
  )
}



