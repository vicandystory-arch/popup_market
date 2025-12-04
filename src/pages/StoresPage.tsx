import { useState } from 'react'
import { StoreList } from '@/components/stores/StoreList'
import { StoreFilters } from '@/components/stores/StoreFilters'

type SortOption = 'latest' | 'popular' | 'distance'
type DateFilterOption = 'all' | 'upcoming' | 'ongoing' | 'ended'

export function StoresPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [location, setLocation] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('ongoing')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">팝업 스토어 목록</h1>

        {/* 필터 컴포넌트 */}
        <StoreFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          location={location}
          onLocationChange={setLocation}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          showAdvanced={showAdvanced}
          onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        />
      </div>

      {/* 스토어 목록 */}
      <StoreList
        category={category || undefined}
        search={search || undefined}
        location={location || undefined}
        dateFilter={dateFilter}
        sortBy={sortBy}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
      />
    </div>
  )
}



