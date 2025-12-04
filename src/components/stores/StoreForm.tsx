import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useImageUpload } from '../../hooks/useImageUpload'
import { ImageUploader } from './ImageUploader'
import { useCreateStore } from '../../hooks/useCreateStore'
import { useUpdateStore } from '../../hooks/useUpdateStore'
import { useNavigate } from 'react-router-dom'

const categories = ['패션', '뷰티', '푸드', '라이프스타일', '아트', '기타']
const weekdays = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']

interface StoreFormData {
  name: string
  description: string
  category: string
  location: string
  latitude: string
  longitude: string
  startDate: string
  endDate: string
  openingHours: Record<string, string>
  contactPhone: string
  contactEmail: string
  instagram: string
  facebook: string
  tags: string[]
  status: 'draft' | 'published' | 'ended'
}

interface StoreFormProps {
  storeId?: string
  initialData?: {
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
}

export function StoreForm({ storeId, initialData }: StoreFormProps = {}) {
  const navigate = useNavigate()
  const isEditMode = !!storeId
  const { createStore, loading: createLoading, error: createError } = useCreateStore()
  const { updateStore: updateStoreFn, loading: updateLoading, error: updateError } = useUpdateStore(storeId || '')
  const {
    images,
    uploadedImages,
    uploading: imageUploading,
    error: imageError,
    handleFileSelect,
    removeImage,
    removeUploadedImage,
    uploadImages,
    setExistingImages,
  } = useImageUpload()

  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    description: '',
    category: '',
    location: '',
    latitude: '',
    longitude: '',
    startDate: '',
    endDate: '',
    openingHours: {},
    contactPhone: '',
    contactEmail: '',
    instagram: '',
    facebook: '',
    tags: [],
    status: 'draft',
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // 초기 데이터 로드 (수정 모드)
  useEffect(() => {
    if (isEditMode && initialData && !isInitialized) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        category: initialData.category,
        location: initialData.location,
        latitude: initialData.latitude?.toString() || '',
        longitude: initialData.longitude?.toString() || '',
        startDate: initialData.start_date,
        endDate: initialData.end_date,
        openingHours: initialData.opening_hours || {},
        contactPhone: initialData.contact_info?.phone || '',
        contactEmail: initialData.contact_info?.email || '',
        instagram: initialData.contact_info?.instagram || '',
        facebook: initialData.contact_info?.facebook || '',
        tags: initialData.tags || [],
        status: initialData.status,
      })

      // 기존 이미지 설정
      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images)
      }

      setIsInitialized(true)
    }
  }, [isEditMode, initialData, isInitialized, setExistingImages])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = '스토어 이름을 입력해주세요.'
    if (!formData.description.trim()) newErrors.description = '설명을 입력해주세요.'
    if (!formData.category) newErrors.category = '카테고리를 선택해주세요.'
    if (!formData.location.trim()) newErrors.location = '위치를 입력해주세요.'
    if (!formData.startDate) newErrors.startDate = '시작일을 선택해주세요.'
    if (!formData.endDate) newErrors.endDate = '종료일을 선택해주세요.'

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = '종료일은 시작일 이후여야 합니다.'
      }
    }

    // 운영 시간 검증 (최소 1개 요일)
    const hasOpeningHours = Object.values(formData.openingHours).some((hours) => hours.trim() !== '')
    if (!hasOpeningHours) {
      newErrors.openingHours = '최소 1개 요일의 운영 시간을 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // 이미지 업로드 (로컬 이미지가 있는 경우)
      let uploadedImageUrls: string[] = []
      if (images.length > 0) {
        uploadedImageUrls = await uploadImages()
      } else {
        // 이미 업로드된 이미지만 사용
        uploadedImageUrls = uploadedImages.map((img) => img.url)
      }

      // 스토어 데이터 생성
      const storeData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        start_date: formData.startDate,
        end_date: formData.endDate,
        opening_hours: formData.openingHours,
        contact_info: {
          phone: formData.contactPhone.trim() || undefined,
          email: formData.contactEmail.trim() || undefined,
          instagram: formData.instagram.trim() || undefined,
          facebook: formData.facebook.trim() || undefined,
        },
        images: uploadedImageUrls,
        tags: formData.tags,
        status: formData.status,
      }

      let result
      if (isEditMode && storeId) {
        result = await updateStoreFn(storeData)
      } else {
        result = await createStore(storeData)
      }

      const { data, error } = result

      if (error) {
        setErrors({ submit: error })
        return
      }

      if (data) {
        navigate(`/stores/${data.id}`)
      }
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : '스토어 등록에 실패했습니다.',
      })
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleOpeningHoursChange = (day: string, hours: string) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: hours,
      },
    }))
  }

  const loading = isEditMode ? updateLoading : createLoading
  const error = isEditMode ? updateError : createError
  const isSubmitting = loading || imageUploading

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 에러 메시지 */}
      {(errors.submit || error) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit || error}
        </div>
      )}

      {/* 기본 정보 */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold mb-4">기본 정보</h2>
        <div className="space-y-4">
          {/* 스토어 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              스토어 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="예: 홍대 팝업 스토어"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="스토어에 대한 설명을 입력해주세요."
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* 위치 정보 */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold mb-4">위치 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="예: 서울시 강남구 테헤란로 123"
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">위도 (선택)</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="37.5665"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">경도 (선택)</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="126.9780"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 운영 기간 */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold mb-4">운영 기간</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시작일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              종료일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              min={formData.startDate}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
          </div>
        </div>
      </div>

      {/* 운영 시간 */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold mb-4">운영 시간</h2>
        <div className="space-y-3">
          {weekdays.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium text-gray-700">{day}</label>
              <input
                type="text"
                value={formData.openingHours[day] || ''}
                onChange={(e) => handleOpeningHoursChange(day, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 10:00-18:00"
              />
            </div>
          ))}
          {errors.openingHours && <p className="mt-1 text-sm text-red-500">{errors.openingHours}</p>}
        </div>
      </div>

      {/* 연락처 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">연락처 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="010-1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">인스타그램</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">페이스북</label>
            <input
              type="text"
              value={formData.facebook}
              onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이스북 페이지 URL"
            />
          </div>
        </div>
      </div>

      {/* 태그 */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold mb-4">태그</h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="태그를 입력하고 Enter를 누르세요"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              추가
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold mb-4">이미지</h2>
        <ImageUploader
          images={images}
          uploadedImages={uploadedImages}
          uploading={imageUploading}
          error={imageError}
          canAddMore={images.length + uploadedImages.length < 10}
          onFileSelect={handleFileSelect}
          onRemoveImage={removeImage}
          onRemoveUploadedImage={removeUploadedImage}
          maxImages={10}
        />
      </div>

      {/* 상태 및 제출 버튼 */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">공개 상태</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                />
                <span>임시 저장</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                />
                <span>공개</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/stores')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? '저장 중...'
                : isEditMode
                  ? '수정하기'
                  : formData.status === 'published'
                    ? '등록하기'
                    : '임시 저장'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}



