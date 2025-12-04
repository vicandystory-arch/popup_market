import { useState } from 'react'
import { useUpdateReview } from '../../hooks/useUpdateReview'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

// 타입 정의 (모듈 export 문제 해결을 위해 직접 정의)
type Review = {
  id: string
  store_id: string
  user_id: string
  rating: number
  comment: string | null
  images: string[]
  created_at: string
  updated_at: string
  profiles?: {
    username: string
    avatar_url: string | null
  }
}

interface ReviewItemProps {
  review: Review
  onUpdate?: () => void
}

export function ReviewItem({ review, onUpdate }: ReviewItemProps) {
  const { user } = useAuth()
  const { updateReview, loading: updateLoading } = useUpdateReview(review.id)
  const [isEditing, setIsEditing] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [comment, setComment] = useState(review.comment || '')
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user && review.user_id === user.id

  const handleUpdate = async () => {
    const { error } = await updateReview({
      rating,
      comment: comment.trim() || null,
    })

    if (!error) {
      setIsEditing(false)
      onUpdate?.()
    }
  }

  const handleDelete = async () => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', review.id).eq('user_id', user!.id)

      if (error) throw error
      onUpdate?.()
    } catch (err) {
      alert('리뷰 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">리뷰 내용</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              disabled={updateLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {review.profiles?.avatar_url ? (
              <img src={review.profiles.avatar_url} alt={review.profiles.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm font-medium">
                {review.profiles?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.profiles?.username || '익명'}</p>
            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>
      )}

      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      )}
    </div>
  )
}



