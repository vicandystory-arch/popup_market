import { useState } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_BUCKET = 'store-images'
const MAX_IMAGES = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface ImageFile {
  file: File
  preview: string
  id: string
}

export interface UploadedImage {
  url: string
  path: string
}

export function useImageUpload() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 파일 선택 핸들러
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles: ImageFile[] = []

    // 파일 개수 확인
    if (images.length + fileArray.length > MAX_IMAGES) {
      setError(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다.`)
      return
    }

    // 파일 유효성 검사
    for (const file of fileArray) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`${file.name}: 지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP만 가능)`)
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name}: 파일 크기가 너무 큽니다. (최대 5MB)`)
        continue
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random()}`,
      })
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles])
      setError(null)
    }
  }

  // 이미지 삭제 (로컬)
  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  // 업로드된 이미지 삭제
  const removeUploadedImage = async (path: string) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path])

      if (deleteError) throw deleteError

      setUploadedImages((prev) => prev.filter((img) => img.path !== path))
    } catch (err) {
      setError(`이미지 삭제 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`)
    }
  }

  // 이미지 업로드
  const uploadImages = async (folder?: string): Promise<string[]> => {
    if (images.length === 0) {
      return uploadedImages.map((img) => img.url)
    }

    setUploading(true)
    setError(null)

    try {
      // 현재 사용자 확인
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('로그인이 필요합니다. 이미지를 업로드하려면 로그인해주세요.')
      }

      // Storage 버킷 존재 여부 확인
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      
      if (bucketError) {
        console.error('버킷 목록 조회 실패:', bucketError)
      } else {
        const bucketExists = buckets?.some((bucket) => bucket.name === STORAGE_BUCKET)
        if (!bucketExists) {
          throw new Error(
            `Storage 버킷 '${STORAGE_BUCKET}'이 존재하지 않습니다. ` +
            `Supabase Dashboard에서 버킷을 생성해주세요.`
          )
        }
      }

      const uploadPromises = images.map(async (imageFile) => {
        const fileExt = imageFile.file.name.split('.').pop()?.toLowerCase() || 'png'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = folder ? `${folder}/${fileName}` : fileName

        const { data, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, imageFile.file, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.file.type,
          })

        if (uploadError) {
          console.error('이미지 업로드 에러:', uploadError)
          
          // RLS 정책 위반인 경우 더 명확한 메시지 제공
          if (uploadError.message?.includes('row-level security') || (uploadError as any).statusCode === '403') {
            throw new Error(
              `이미지 업로드 권한이 없습니다. ` +
              `Storage 버킷의 RLS 정책을 확인해주세요. ` +
              `(에러: ${uploadError.message})`
            )
          }
          
          if ((uploadError as any).statusCode === '400') {
            throw new Error(
              `이미지 업로드 실패: 잘못된 요청입니다. ` +
              `파일 형식과 크기를 확인해주세요. ` +
              `(에러: ${uploadError.message})`
            )
          }
          
          throw uploadError
        }

        if (!data) {
          throw new Error('이미지 업로드 후 데이터를 받지 못했습니다.')
        }

        // 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)

        return {
          url: publicUrl,
          path: filePath,
        }
      })

      const uploaded = await Promise.all(uploadPromises)
      const allUrls = [...uploadedImages.map((img) => img.url), ...uploaded.map((img) => img.url)]

      // 로컬 이미지 정리
      images.forEach((img) => URL.revokeObjectURL(img.preview))
      setImages([])
      setUploadedImages((prev) => [...prev, ...uploaded])
      setUploading(false)

      return allUrls
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류'
      setError(`이미지 업로드 실패: ${errorMessage}`)
      setUploading(false)
      throw err
    }
  }

  // 기존 이미지 URL 설정 (수정 시 사용)
  const setExistingImages = (urls: string[]) => {
    setUploadedImages(
      urls.map((url) => {
        // URL에서 path 추출 (예: https://xxx.supabase.co/storage/v1/object/public/store-images/path/to/file.jpg)
        const pathMatch = url.match(/store-images\/(.+)$/)
        return {
          url,
          path: pathMatch ? pathMatch[1] : url,
        }
      })
    )
  }

  // 모든 이미지 초기화
  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    setUploadedImages([])
    setError(null)
  }

  // 모든 이미지 URL 반환 (로컬 + 업로드된)
  const getAllImageUrls = (): string[] => {
    const localUrls = images.map((img) => img.preview)
    const uploadedUrls = uploadedImages.map((img) => img.url)
    return [...localUrls, ...uploadedUrls]
  }

  return {
    images,
    uploadedImages,
    uploading,
    error,
    maxImages: MAX_IMAGES,
    canAddMore: images.length + uploadedImages.length < MAX_IMAGES,
    handleFileSelect,
    removeImage,
    removeUploadedImage,
    uploadImages,
    setExistingImages,
    reset,
    getAllImageUrls,
  }
}



