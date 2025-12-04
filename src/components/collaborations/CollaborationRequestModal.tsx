import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateCollaboration } from '../../hooks/useCreateCollaboration'
import { useAuth } from '../../contexts/AuthContext'

interface CollaborationRequestModalProps {
  storeId: string
  onClose: () => void
}

const collaborationTypes = [
  { value: 'joint', label: '공동 운영' },
  { value: 'sponsorship', label: '스폰서십' },
  { value: 'space_sharing', label: '공간 공유' },
  { value: 'event', label: '이벤트 협업' },
  { value: 'other', label: '기타' },
]

export function CollaborationRequestModal({ storeId, onClose }: CollaborationRequestModalProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createCollaboration, loading, error } = useCreateCollaboration()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collaboration_type: 'joint' as 'joint' | 'sponsorship' | 'space_sharing' | 'event' | 'other',
    contact_email: user?.email || '',
    contact_phone: '',
    budget_range: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!user) {
      navigate('/auth')
      return
    }

    // 유효성 검사
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요'
    if (!formData.description.trim()) newErrors.description = '협업 내용을 입력해주세요'
    if (!formData.contact_email.trim()) newErrors.contact_email = '이메일을 입력해주세요'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const { data, error } = await createCollaboration({
      store_id: storeId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      collaboration_type: formData.collaboration_type,
      contact_email: formData.contact_email.trim(),
      contact_phone: formData.contact_phone.trim() || null,
      budget_range: formData.budget_range.trim() || null,
    })

    if (!error && data) {
      alert('협업 요청이 성공적으로 전송되었습니다!')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">협업 요청</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="font-semibold mb-1">에러 발생</div>
              <div className="text-sm whitespace-pre-line">{error}</div>
              {(error.includes('테이블이 존재하지 않습니다') || error.includes('PGRST205') || error.includes('Could not find the table')) && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-xs font-semibold mb-2">📋 단계별 해결 방법:</p>
                  <ol className="text-xs list-decimal list-inside space-y-2">
                    <li>Supabase Dashboard 접속: <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://app.supabase.com</a></li>
                    <li>프로젝트 선택 후 왼쪽 메뉴에서 <strong>SQL Editor</strong> 클릭</li>
                    <li><strong>New Query</strong> 버튼 클릭</li>
                    <li>다음 파일의 전체 내용을 복사하여 붙여넣기:
                      <code className="block mt-1 px-2 py-1 bg-red-100 rounded text-xs">
                        supabase/migrations/20241202000001_add_collaborations.sql
                      </code>
                    </li>
                    <li><strong>Run</strong> 버튼 클릭하여 실행</li>
                    <li>실행 완료 후 프로젝트를 재시작하거나 1-2분 기다린 후 다시 시도</li>
                  </ol>
                  <p className="text-xs text-gray-600 mt-3">
                    ⚠️ 스키마 캐시가 업데이트되는데 시간이 걸릴 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="협업 제안 제목"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* 협업 유형 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                협업 유형 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.collaboration_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    collaboration_type: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {collaborationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 협업 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                협업 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="협업하고 싶은 내용을 자세히 설명해주세요..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* 연락처 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처 이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
              {errors.contact_email && (
                <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
              )}
            </div>

            {/* 연락처 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처 전화번호
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-1234-5678"
              />
            </div>

            {/* 예산 범위 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예산 범위</label>
              <input
                type="text"
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 100만원 ~ 300만원"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? '전송 중...' : '협업 요청 보내기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



