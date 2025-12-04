import { Link } from 'react-router-dom'

type PopupStore = {
  id: string
  name: string
  description: string | null
  category: string
  location: string
  start_date: string
  end_date: string
  images: string[]
  tags: string[]
  status: 'draft' | 'published' | 'ended'
}

interface StoreCardProps {
  store: PopupStore
}

export function StoreCard({ store }: StoreCardProps) {
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
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">예정</span>
    } else if (today > endDate) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">종료</span>
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">진행중</span>
    }
  }

  return (
    <Link
      to={`/stores/${store.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 이미지 */}
      <div className="aspect-video bg-gray-200 relative">
        {store.images && store.images.length > 0 ? (
          <img
            src={store.images[0]}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">{getStatusBadge()}</div>
      </div>

      {/* 내용 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{store.name}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {store.description || '설명이 없습니다.'}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
            {store.category}
          </span>
          {store.tags && store.tags.length > 0 && (
            <span className="text-xs text-gray-500">
              {store.tags.slice(0, 2).join(', ')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <svg
            className="w-4 h-4"
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
          <span className="truncate">{store.location}</span>
        </div>

        <div className="text-xs text-gray-500">
          {formatDate(store.start_date)} ~ {formatDate(store.end_date)}
        </div>
      </div>
    </Link>
  )
}



