import { useRef } from 'react'
import type { DragEvent } from 'react'

// 타입 정의 (모듈 export 문제 해결을 위해 직접 정의)
interface ImageFile {
  file: File
  preview: string
  id: string
}

interface UploadedImage {
  url: string
  path: string
}

interface ImageUploaderProps {
  images: ImageFile[]
  uploadedImages: UploadedImage[]
  uploading: boolean
  error: string | null
  canAddMore: boolean
  onFileSelect: (files: FileList | null) => void
  onRemoveImage: (id: string) => void
  onRemoveUploadedImage: (path: string) => void
  maxImages?: number
}

export function ImageUploader({
  images,
  uploadedImages,
  uploading,
  error,
  canAddMore,
  onFileSelect,
  onRemoveImage,
  onRemoveUploadedImage,
  maxImages = 10,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (canAddMore) {
      onFileSelect(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const allImages = [
    ...uploadedImages.map((img) => ({ url: img.url, id: img.path, isUploaded: true })),
    ...images.map((img) => ({ url: img.preview, id: img.id, isUploaded: false })),
  ]

  return (
    <div className="space-y-4">
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 업로드 영역 */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600 font-medium">이미지를 드래그하거나 클릭하여 업로드</p>
          <p className="text-sm text-gray-400 mt-1">
            JPEG, PNG, WebP (최대 5MB) · 최대 {maxImages}개
          </p>
        </div>
      )}

      {/* 이미지 미리보기 그리드 */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 삭제 버튼 */}
              <button
                onClick={() => {
                  if (image.isUploaded) {
                    onRemoveUploadedImage(image.id)
                  } else {
                    onRemoveImage(image.id)
                  }
                }}
                disabled={uploading}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                title="이미지 삭제"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {/* 업로드 완료 배지 */}
              {image.isUploaded && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  업로드됨
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 이미지 개수 표시 */}
      {allImages.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {allImages.length} / {maxImages}개 이미지
        </div>
      )}

      {/* 업로드 중 표시 */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
          이미지를 업로드하는 중...
        </div>
      )}
    </div>
  )
}



