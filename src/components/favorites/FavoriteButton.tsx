import { useFavorite } from '../../hooks/useFavorite'
import { useAuth } from '../../contexts/AuthContext'

interface FavoriteButtonProps {
  storeId: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function FavoriteButton({ storeId, size = 'md', showText = false }: FavoriteButtonProps) {
  const { user } = useAuth()
  const { isFavorite, loading, toggleFavorite } = useFavorite(storeId)

  if (!user) {
    return null
  }

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  }

  const handleClick = async () => {
    try {
      await toggleFavorite()
    } catch (err) {
      alert(err instanceof Error ? err.message : '즐겨찾기 처리에 실패했습니다.')
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 transition-colors ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-gray-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isFavorite ? '즐겨찾기 제거' : '즐겨찾기 추가'}
    >
      <svg
        className={sizeClasses[size]}
        fill={isFavorite ? 'currentColor' : 'none'}
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
      {showText && (
        <span className="text-sm font-medium">
          {isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
        </span>
      )}
    </button>
  )
}



