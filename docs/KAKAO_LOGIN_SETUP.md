# 카카오 로그인 설정 가이드

## 이미지 파일 추가

카카오 로그인 버튼 이미지를 `public/kakao_login_medium_narrow.png` 경로에 추가해주세요.

카카오에서 제공하는 공식 로그인 버튼 이미지를 사용하거나, 다음 경로에서 다운로드할 수 있습니다:
- 카카오 개발자 센터: https://developers.kakao.com/tool/resource/login

이미지 파일명은 `kakao_login_medium_narrow.png`로 설정해주세요.

## Supabase 카카오 OAuth 설정

1. **카카오 개발자 콘솔 설정**
   - https://developers.kakao.com 접속
   - 내 애플리케이션 > 앱 설정 > 플랫폼 설정
   - Web 플랫폼 등록
   - 사이트 도메인: `http://localhost:5173` (개발), `https://yourdomain.com` (프로덕션)
   - Redirect URI: `https://oaypyevjwtfoualfmjwq.supabase.co/auth/v1/callback`

2. **카카오 로그인 활성화**
   - 내 애플리케이션 > 제품 설정 > 카카오 로그인 활성화
   - Redirect URI 등록: `https://oaypyevjwtfoualfmjwq.supabase.co/auth/v1/callback`

3. **Supabase 대시보드 설정**
   - Authentication > Providers > Kakao 활성화
   - Kakao Client ID 입력 (카카오 개발자 콘솔의 REST API 키)
   - Kakao Client Secret 입력 (카카오 개발자 콘솔의 Client Secret)

## 테스트

1. 개발 서버 실행: `npm run dev`
2. 메인 페이지에서 카카오 로그인 버튼 클릭
3. 카카오 로그인 화면으로 리다이렉트
4. 로그인 후 자동으로 메인 페이지로 돌아옴

## 문제 해결

- 이미지가 표시되지 않으면: `public/kakao_login_medium_narrow.png` 파일이 존재하는지 확인
- 로그인 오류 발생 시: Supabase 대시보드의 Authentication > Providers에서 Kakao 설정 확인
- Redirect URI 오류: 카카오 개발자 콘솔과 Supabase 설정의 Redirect URI가 일치하는지 확인
