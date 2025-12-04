import { useFavorites } from '../../hooks/useFavorites'
import { StoreCard } from '../stores/StoreCard'
import { Link } from 'react-router-dom'

export function FavoriteList() {
  const { favorites, loading, error, removeFavorite } = useFavorites()

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">즐겨찾기를 불러오는 중...</p>
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

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <p className="text-gray-600 mb-4">즐겨찾기한 스토어가 없습니다.</p>
        <Link
          to="/stores"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          스토어 둘러보기
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">즐겨찾기 ({favorites.length}개)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => {
          const store = favorite.popup_stores
          return (
            <div key={favorite.id} className="relative">
              <StoreCard
                store={{
                  id: store.id,
                  name: store.name,
                  description: store.description,
                  category: store.category,
                  location: store.location,
                  images: store.images || [],
                  status: store.status,
                  start_date: store.start_date,
                  end_date: store.end_date,
                  tags: [],
                }}
              />
              <button
                onClick={async () => {
                  if (confirm('즐겨찾기에서 제거하시겠습니까?')) {
                    try {
                      await removeFavorite(favorite.id)
                    } catch (err) {
                      alert('즐겨찾기 제거에 실패했습니다.')
                    }
                  }
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                title="즐겨찾기 제거"
              >
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}



