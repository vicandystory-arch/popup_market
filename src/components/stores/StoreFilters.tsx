// import { useState } from 'react' // 사용하지 않음

export type SortOption = 'latest' | 'popular' | 'distance'
export type DateFilterOption = 'all' | 'upcoming' | 'ongoing' | 'ended'

interface StoreFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  location: string
  onLocationChange: (value: string) => void
  dateFilter: DateFilterOption
  onDateFilterChange: (value: DateFilterOption) => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  startDate?: string
  onStartDateChange?: (value: string) => void
  endDate?: string
  onEndDateChange?: (value: string) => void
  showAdvanced?: boolean
  onToggleAdvanced?: () => void
}

const categories = ['패션', '뷰티', '푸드', '라이프스타일', '아트', '기타']

export function StoreFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  location,
  onLocationChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  showAdvanced = false,
  onToggleAdvanced,
}: StoreFiltersProps) {
  return (
    <div className="space-y-4">
      {/* 검색 바 */}
      <div>
        <input
          type="text"
          placeholder="스토어 이름, 위치, 설명, 태그로 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 기본 필터 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 whitespace-nowrap">정렬:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="distance">거리순</option>
          </select>
        </div>
      </div>

      {/* 날짜 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onDateFilterChange('all')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            dateFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => onDateFilterChange('upcoming')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            dateFilter === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          예정
        </button>
        <button
          onClick={() => onDateFilterChange('ongoing')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            dateFilter === 'ongoing'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          진행중
        </button>
        <button
          onClick={() => onDateFilterChange('ended')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            dateFilter === 'ended'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          종료
        </button>
      </div>

      {/* 고급 필터 */}
      {onToggleAdvanced && (
        <div>
          <button
            onClick={onToggleAdvanced}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAdvanced ? '▼ 고급 필터 숨기기' : '▶ 고급 필터 보기'}
          </button>
        </div>
      )}

      {showAdvanced && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          {/* 지역 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지역 검색
            </label>
            <input
              type="text"
              placeholder="예: 강남구, 홍대..."
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 날짜 범위 필터 */}
          {(onStartDateChange || onEndDateChange) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => onStartDateChange?.(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate || ''}
                  onChange={(e) => onEndDateChange?.(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}



