import { useCollaborations } from '../../hooks/useCollaborations'

interface CollaborationListProps {
  storeId: string
}

const collaborationTypeLabels: Record<string, string> = {
  joint: '공동 운영',
  sponsorship: '스폰서십',
  space_sharing: '공간 공유',
  event: '이벤트 협업',
  other: '기타',
}

export function CollaborationList({ storeId }: CollaborationListProps) {
  const { collaborations, loading, error } = useCollaborations({
    storeId,
    status: 'approved', // 승인된 협업만 표시
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">협업 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 text-sm">협업 정보를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  if (!collaborations || collaborations.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">참여 업체가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {collaborations.map((collab) => (
        <div
          key={collab.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">{collab.title}</h4>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded whitespace-nowrap">
                  {collaborationTypeLabels[collab.collaboration_type] || collab.collaboration_type}
                </span>
              </div>
              {collab.profiles && (
                <p className="text-sm text-gray-600 mb-2">
                  요청자: {collab.profiles.username || '익명'}
                </p>
              )}
              <p className="text-sm text-gray-700 line-clamp-2">{collab.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            {collab.contact_email && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="truncate max-w-[150px]">{collab.contact_email}</span>
              </div>
            )}
            {collab.contact_phone && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{collab.contact_phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(collab.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

