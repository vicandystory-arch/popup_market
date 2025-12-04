# 카카오 로그인 테스트 가이드

## 구현 완료 사항

✅ 이미지 파일: `public/kakao_login_medium_narrow.png`  
✅ AuthContext에 `signInWithKakao()` 함수 추가  
✅ HomePage에 카카오 로그인 버튼 추가  
✅ OAuth 콜백 페이지 (`/auth/callback`) 구현  
✅ 에러 처리 및 로딩 상태 추가  

## 테스트 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 메인 페이지 확인
- 브라우저에서 `http://localhost:5173` 접속
- 로그인하지 않은 상태에서 메인 페이지에 카카오 로그인 버튼이 표시되는지 확인
- 카카오 로그인 이미지가 정상적으로 표시되는지 확인

### 3. 카카오 로그인 테스트
1. 카카오 로그인 버튼 클릭
2. 카카오 로그인 페이지로 리다이렉트되는지 확인
3. 카카오 계정으로 로그인
4. 로그인 성공 후 메인 페이지로 돌아오는지 확인
5. 로그인 상태에서 카카오 로그인 버튼이 사라지는지 확인

### 4. 에러 처리 테스트
- Supabase 카카오 OAuth 설정이 잘못된 경우 에러 메시지가 표시되는지 확인
- 네트워크 오류 시 적절한 에러 처리가 되는지 확인

## 문제 해결

### 이미지가 표시되지 않는 경우
- `public/kakao_login_medium_narrow.png` 파일이 존재하는지 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인
- 이미지 경로가 `/kakao_login_medium_narrow.png`인지 확인

### 로그인 후 리다이렉트가 안 되는 경우
- Supabase 대시보드에서 Redirect URI 설정 확인
- 카카오 개발자 콘솔에서 Redirect URI 설정 확인
- 브라우저 콘솔에서 에러 메시지 확인

### OAuth 오류 발생 시
- Supabase 대시보드 > Authentication > Providers > Kakao 설정 확인
- 카카오 Client ID와 Client Secret이 올바른지 확인
- 카카오 개발자 콘솔에서 Redirect URI가 정확히 설정되었는지 확인

## 예상 동작 흐름

1. 사용자가 카카오 로그인 버튼 클릭
2. `signInWithKakao()` 함수 호출
3. Supabase OAuth 리다이렉트 발생
4. 카카오 로그인 페이지로 이동
5. 사용자가 카카오 계정으로 로그인
6. 카카오에서 Supabase로 인증 정보 전달
7. `/auth/callback` 페이지에서 세션 확인
8. 로그인 성공 시 메인 페이지(`/`)로 리다이렉트
9. AuthContext에서 사용자 정보 업데이트
10. 메인 페이지에서 카카오 로그인 버튼 숨김

## 다음 단계

카카오 로그인이 정상적으로 작동하면:
- 프로필 페이지에서 카카오 사용자 정보 표시
- 로그아웃 기능 테스트
- 추가 OAuth 제공자 (구글, 네이버 등) 추가 고려
