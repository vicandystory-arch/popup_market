# Google Maps API 설정 가이드

## 1. Google Maps API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **라이브러리**로 이동
4. **Maps JavaScript API** 검색 및 활성화
5. **사용자 인증 정보** > **사용자 인증 정보 만들기** > **API 키** 선택
6. 생성된 API 키 복사

## 2. API 키 제한 설정 (보안)

1. 생성된 API 키 클릭
2. **애플리케이션 제한사항** 설정:
   - **HTTP 리퍼러(웹사이트)** 선택
   - 허용된 리퍼러 추가:
     - `http://localhost:*` (개발용)
     - `https://yourdomain.com/*` (프로덕션용)
3. **API 제한사항** 설정:
   - **Maps JavaScript API**만 선택
4. 저장

## 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음을 추가:

```env
VITE_GOOGLE_MAPS_API_KEY=your-api-key-here
```

## 4. 비용 고려사항

- Google Maps JavaScript API는 월 $200 크레딧 제공
- 월 28,000회 로드까지 무료
- 초과 시 $7.00 per 1,000 requests
- 자세한 내용: [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)

## 5. 대안: Kakao Map 사용

한국 서비스의 경우 Kakao Map을 사용하는 것도 고려할 수 있습니다:

- 무료 할당량이 더 많음
- 한국어 지원 우수
- 한국 지역 데이터 정확도 높음

Kakao Map 통합을 원하시면 알려주세요.

## 6. 테스트

API 키를 설정한 후 스토어 상세 페이지에서 지도가 정상적으로 표시되는지 확인하세요.

API 키가 없어도 지도는 표시되지 않지만, "Google Maps에서 보기" 링크를 통해 위치를 확인할 수 있습니다.



