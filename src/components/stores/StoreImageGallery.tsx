import { useState } from 'react'

interface StoreImageGalleryProps {
  images: string[]
  storeName: string
}

export function StoreImageGallery({ images, storeName }: StoreImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-2"
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
          <p>이미지가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* 메인 이미지 */}
        <div
          className="aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={images[selectedIndex]}
            alt={`${storeName} - 이미지 ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 썸네일 목록 */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-blue-600 ring-2 ring-blue-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${storeName} - 썸네일 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 이미지 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="max-w-4xl w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
            >
              <svg
                className="w-6 h-6"
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
            <img
              src={images[selectedIndex]}
              alt={`${storeName} - 확대 이미지`}
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                  }}
                  className="bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75"
                >
                  이전
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                  }}
                  className="bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}



