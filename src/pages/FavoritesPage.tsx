import { FavoriteList } from '@/components/favorites/FavoriteList'

export function FavoritesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">즐겨찾기</h1>
      <FavoriteList />
    </div>
  )
}



