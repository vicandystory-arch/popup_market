import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCreateReview } from '../../hooks/useCreateReview'
import { useImageUpload } from '../../hooks/useImageUpload'
import { ImageUploader } from '../stores/ImageUploader'
import { useAuth } from '../../contexts/AuthContext'

interface ReviewFormProps {
  storeId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({ storeId, onSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuth()
  const { createReview, loading, error: createError } = useCreateReview()
  const {
    images,
    uploadedImages,
    uploading: imageUploading,
    error: imageError,
    handleFileSelect,
    removeImage,
    removeUploadedImage,
    uploadImages,
  } = useImageUpload()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        리뷰를 작성하려면 로그인이 필요합니다.
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (rating === 0) {
      newErrors.rating = '평점을 선택해주세요.'
    }
    if (!comment.trim()) {
      newErrors.comment = '리뷰 내용을 입력해주세요.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // 이미지 업로드
      let uploadedImageUrls: string[] = []
      if (images.length > 0) {
        uploadedImageUrls = await uploadImages()
      } else {
        uploadedImageUrls = uploadedImages.map((img) => img.url)
      }

      const { data, error } = await createReview({
        store_id: storeId,
        rating,
        comment: comment.trim(),
        images: uploadedImageUrls,
      })

      if (error) {
        setErrors({ submit: error })
        return
      }

      if (data) {
        setRating(0)
        setComment('')
        onSuccess?.()
      }
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : '리뷰 작성에 실패했습니다.',
      })
    }
  }

  const isSubmitting = loading || imageUploading

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(errors.submit || createError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit || createError}
        </div>
      )}

      {/* 평점 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          평점 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star)
                setErrors((prev) => ({ ...prev, rating: '' }))
              }}
              className={`transition-colors ${
                star <= rating
                  ? 'text-yellow-400 hover:text-yellow-500'
                  : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
      </div>

      {/* 리뷰 내용 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          리뷰 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
            setErrors((prev) => ({ ...prev, comment: '' }))
          }}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.comment ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="리뷰를 작성해주세요..."
        />
        {errors.comment && <p className="mt-1 text-sm text-red-500">{errors.comment}</p>}
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">이미지 (선택)</label>
        <ImageUploader
          images={images}
          uploadedImages={uploadedImages}
          uploading={imageUploading}
          error={imageError}
          canAddMore={images.length + uploadedImages.length < 5}
          onFileSelect={handleFileSelect}
          onRemoveImage={removeImage}
          onRemoveUploadedImage={removeUploadedImage}
          maxImages={5}
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '작성 중...' : '리뷰 작성'}
        </button>
      </div>
    </form>
  )
}



