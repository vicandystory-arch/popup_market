import { Link } from 'react-router-dom'

export function HomePage() {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          팝업 마켓에 오신 것을 환영합니다!
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
          지역의 팝업 스토어를 발견하고 방문하세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link
            to="/stores"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            스토어 탐색하기
          </Link>
          <Link
            to="/stores/new"
            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm sm:text-base"
          >
            스토어 등록하기
          </Link>
          <Link
            to="/collaborations"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm sm:text-base shadow-lg"
          >
            팝업 스토어 협업 모집
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">스토어 탐색</h3>
          <p className="text-gray-600 text-sm">
            지역별, 카테고리별로 팝업 스토어를 찾아보세요.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">스토어 등록</h3>
          <p className="text-gray-600 text-sm">
            자신의 팝업 스토어를 등록하고 홍보하세요.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">리뷰 작성</h3>
          <p className="text-gray-600 text-sm">
            방문한 스토어에 대한 리뷰를 작성하세요.
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow p-6 border border-purple-200">
          <h3 className="text-lg font-semibold mb-2 text-purple-900">협업 모집</h3>
          <p className="text-gray-700 text-sm">
            다른 스토어와 협업하여 시너지를 창출하세요.
          </p>
        </div>
      </div>
    </div>
  )
}



