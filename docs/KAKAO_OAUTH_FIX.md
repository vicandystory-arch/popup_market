# 카카오 OAuth 콜백 오류 해결 가이드

## 문제 상황

카카오 로그인 후 `localhost:3000`으로 리다이렉트되거나 URL 해시에 토큰이 포함된 상태로 멈추는 문제

## 해결 방법

### 1. Supabase Redirect URL 설정 확인

Supabase 대시보드에서:
1. Authentication > URL Configuration 접속
2. Site URL 설정:
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://your-vercel-app.vercel.app`
3. Redirect URLs에 추가:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/**`
   - `https://your-vercel-app.vercel.app/auth/callback`
   - `https://your-vercel-app.vercel.app/**`

### 2. 카카오 개발자 콘솔 Redirect URI 확인

카카오 개발자 콘솔에서:
1. 내 애플리케이션 > 카카오 로그인 > Redirect URI 설정
2. 다음 URI 추가:
   - 개발: `https://oaypyevjwtfoualfmjwq.supabase.co/auth/v1/callback`
   - 프로덕션: `https://oaypyevjwtfoualfmjwq.supabase.co/auth/v1/callback` (동일)

### 3. 코드 수정 사항

`AuthCallbackPage.tsx`에서:
- URL 해시에서 토큰 감지 및 처리 개선
- 세션 확인을 여러 번 시도하여 확실하게 처리
- URL 해시 제거로 보안 강화

### 4. 테스트 방법

1. 개발 서버 실행:
   ```bash
   npm run dev
   ```

2. 카카오 로그인 버튼 클릭
3. 카카오 로그인 완료
4. `/auth/callback` 페이지로 리다이렉트 확인
5. 자동으로 홈 페이지(`/`)로 이동 확인

### 5. 문제 해결 체크리스트

- [ ] Supabase Site URL이 올바르게 설정되었는가?
- [ ] Supabase Redirect URLs에 콜백 URL이 포함되어 있는가?
- [ ] 카카오 개발자 콘솔의 Redirect URI가 Supabase 콜백 URL인가?
- [ ] 브라우저 콘솔에서 에러 메시지 확인
- [ ] 네트워크 탭에서 리다이렉트 흐름 확인

### 6. 디버깅

브라우저 콘솔에서 확인할 로그:
- "OAuth 토큰 감지됨, 세션 처리 대기 중..."
- "로그인 성공: [이메일]"
- 또는 에러 메시지

### 7. 일반적인 오류

#### "세션을 가져올 수 없음"
- Supabase Redirect URL 설정 확인
- 카카오 Redirect URI 확인
- 브라우저 캐시 클리어 후 재시도

#### "localhost:3000으로 리다이렉트됨"
- Supabase의 redirectTo 설정 확인
- `signInWithKakao` 함수의 redirectTo URL 확인
