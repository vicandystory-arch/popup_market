import { useState, useRef, useEffect, useMemo } from 'react'
import { useStores } from '../hooks/useStores'
import { StoreCard } from '../components/stores/StoreCard'
import { CollaborationRequestModal } from '../components/collaborations/CollaborationRequestModal'

type PopupStore = {
  id: string
  name: string
  location: string
  category: string
  images: string[]
  [key: string]: any
}

export function CollaborationsPage() {
  const { stores, loading, error } = useStores({
    status: 'published',
    pageSize: 100,
    dateFilter: 'all', // 모든 스토어 표시 (진행중, 예정, 종료 포함)
  })
  
  // 디버깅: 스토어 데이터 로드 확인
  useEffect(() => {
    if (!loading) {
      console.log('CollaborationsPage - 스토어 데이터:', {
        storesCount: stores?.length || 0,
        loading,
        error,
        stores: stores,
      })
    }
  }, [stores, loading, error])
  
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRequestCollaboration = (storeId: string) => {
    setSelectedStoreId(storeId)
    setShowModal(true)
  }

  const handleSelectStore = (store: PopupStore) => {
    setSearch(store.name)
    setShowSuggestions(false)
    // 선택한 스토어로 스크롤
    setTimeout(() => {
      const element = document.getElementById(`store-${store.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // 하이라이트 효과
        element.classList.add('ring-4', 'ring-blue-500', 'ring-offset-2')
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2')
        }, 2000)
      }
    }, 100)
  }

  const filteredStores = useMemo(() => {
    if (!stores || stores.length === 0) return []
    
    if (!search || !search.trim()) {
      return stores // 검색어가 없으면 전체 목록
    }
    
    const searchLower = search.toLowerCase()
    return stores.filter(
      (store) =>
        store.name?.toLowerCase().includes(searchLower) ||
        store.location?.toLowerCase().includes(searchLower) ||
        store.category?.toLowerCase().includes(searchLower)
    )
  }, [stores, search])

  // 검색어와 매칭되는 제안 목록 (최대 10개)
  const suggestions = useMemo(() => {
    if (!stores || stores.length === 0) return []
    
    if (search.trim()) {
      return stores
        .filter(
          (store) =>
            store.name?.toLowerCase().includes(search.toLowerCase()) ||
            store.location?.toLowerCase().includes(search.toLowerCase()) ||
            store.category?.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 10)
    }
    return stores.slice(0, 10) // 검색어가 없을 때는 전체 목록의 최대 10개 표시
  }, [stores, search])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">스토어 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">팝업 스토어 협업 모집</h1>
        <p className="text-gray-600">
          마음에 드는 팝업 스토어에 협업을 제안해보세요. 함께하면 더 큰 시너지를 낼 수 있습니다.
        </p>
      </div>

      {/* 검색 바 (자동완성) */}
      <div className="mb-6 relative" ref={searchRef}>
        <input
          type="text"
          placeholder="스토어 이름, 위치, 카테고리로 검색..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => {
            if (stores && stores.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onClick={() => {
            if (stores && stores.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onBlur={(e) => {
            // 드롭다운 내부를 클릭한 경우가 아니면 닫기
            const target = e.relatedTarget as HTMLElement
            if (!searchRef.current?.contains(target)) {
              setTimeout(() => setShowSuggestions(false), 150)
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* 자동완성 드롭다운 */}
        {showSuggestions && !loading && stores && stores.length > 0 && suggestions.length > 0 && (
          <div 
            className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()} // onBlur 방지
          >
            {!search && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-600">전체 스토어 목록 (최대 10개)</p>
              </div>
            )}
            {suggestions.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => handleSelectStore(store)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelectStore(store)
                }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  {/* 스토어 이미지 */}
                  {store.images && store.images.length > 0 ? (
                    <img
                      src={store.images[0]}
                      alt={store.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-gray-400"
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
                    </div>
                  )}
                  
                  {/* 스토어 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{store.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="inline-flex items-center mr-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {store.category}
                      </span>
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{store.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* 검색어 있지만 결과 없음 */}
        {showSuggestions && !loading && search.trim() && stores && stores.length > 0 && suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4">
            <p className="text-gray-500 text-center">검색 결과가 없습니다.</p>
          </div>
        )}
        
        {/* 스토어가 없을 때 */}
        {showSuggestions && !loading && stores && stores.length === 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4">
            <p className="text-gray-500 text-center">등록된 스토어가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 스토어 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">스토어 목록을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">스토어 목록을 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : (
        <>
          {/* 스토어 개수 표시 */}
          <div className="mb-4 text-sm text-gray-600">
            {search.trim() ? (
              <>
                검색 결과: <span className="font-semibold">{filteredStores.length}개</span>
                {stores && stores.length > 0 && filteredStores.length !== stores.length && (
                  <span className="ml-2 text-gray-500">(전체 {stores.length}개)</span>
                )}
              </>
            ) : stores && stores.length > 0 ? (
              <>
                전체 스토어: <span className="font-semibold">{stores.length}개</span>
              </>
            ) : (
              <>등록된 스토어가 없습니다.</>
            )}
          </div>

          {/* 스토어 목록 그리드 */}
          {stores && stores.length > 0 ? (
            filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    id={`store-${store.id}`}
                    className="relative transition-all duration-300 rounded-lg"
                  >
                    <StoreCard store={store} />
                    <button
                      onClick={() => handleRequestCollaboration(store.id)}
                      className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg z-10"
                    >
                      협업 요청
                    </button>
                  </div>
                ))}
              </div>
            ) : search.trim() ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg p-8">
                <p className="text-gray-600 mb-2">검색 결과가 없습니다.</p>
                <p className="text-sm text-gray-500">다른 검색어로 시도해보세요.</p>
                <button
                  onClick={() => setSearch('')}
                  className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  전체 목록 보기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    id={`store-${store.id}`}
                    className="relative transition-all duration-300 rounded-lg"
                  >
                    <StoreCard store={store} />
                    <button
                      onClick={() => handleRequestCollaboration(store.id)}
                      className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg z-10"
                    >
                      협업 요청
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : !loading ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg p-8">
              <p className="text-gray-600 mb-2">등록된 스토어가 없습니다.</p>
              <p className="text-sm text-gray-500">
                스토어를 등록하면 협업 요청을 받을 수 있습니다.
              </p>
            </div>
          ) : null}
        </>
      )}

      {/* 협업 요청 모달 */}
      {showModal && selectedStoreId && (
        <CollaborationRequestModal
          storeId={selectedStoreId}
          onClose={() => {
            setShowModal(false)
            setSelectedStoreId(null)
          }}
        />
      )}
    </div>
  )
}



