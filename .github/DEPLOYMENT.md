# Vercel 배포 가이드

## 배포 준비 완료 ✅

프로젝트가 Vercel 배포를 위해 준비되었습니다.

### 빌드 테스트 결과

- ✅ TypeScript 컴파일 성공
- ✅ Vite 빌드 성공
- ✅ 빌드 산출물: `dist/` 폴더

### 빌드 산출물

- `dist/index.html` - 메인 HTML 파일
- `dist/assets/index-*.css` - 스타일시트 (40.70 kB)
- `dist/assets/index-*.js` - JavaScript 번들 (562.06 kB)

## Vercel 배포 방법

### 방법 1: Vercel 웹사이트에서 배포

1. https://vercel.com 접속 및 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택: `vicandystory-arch/popup_market`
4. 프로젝트 설정:
   - **Framework Preset**: Vite (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 설정됨)
   - **Output Directory**: `dist` (자동 설정됨)
   - **Install Command**: `npm install` (자동 설정됨)
5. **Environment Variables** 추가:
   ```
   VITE_SUPABASE_URL=https://oaypyevjwtfoualfmjwq.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
6. "Deploy" 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 배포
cd /Users/andy/Vibe_Coding/12.02/popup_market
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 3: GitHub 연동 자동 배포

1. Vercel에서 GitHub 저장소 연결
2. 저장소에 푸시할 때마다 자동 배포
3. Pull Request마다 Preview 배포 생성

## 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

### 필수 환경 변수

- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase Anonymous Key

### 환경 변수 가져오기

Supabase 대시보드에서:
1. Settings > API 접속
2. Project URL 복사 → `VITE_SUPABASE_URL`
3. anon public 키 복사 → `VITE_SUPABASE_ANON_KEY`

## 배포 후 확인 사항

1. ✅ 빌드 성공 여부 확인
2. ✅ 환경 변수 설정 확인
3. ✅ 카카오 로그인 Redirect URI 업데이트:
   - 카카오 개발자 콘솔에서 Redirect URI에 Vercel URL 추가
   - 예: `https://your-project.vercel.app/auth/callback`
4. ✅ Supabase Redirect URI 업데이트:
   - Supabase 대시보드 > Authentication > URL Configuration
   - Site URL: `https://your-project.vercel.app`
   - Redirect URLs: `https://your-project.vercel.app/**`

## 문제 해결

### 빌드 실패 시

1. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```
2. 빌드 로그 확인
3. 환경 변수 확인

### 환경 변수 오류 시

- Vercel 대시보드에서 환경 변수 재확인
- 변수명 앞에 `VITE_` 접두사 확인
- 배포 후 재배포 필요

### 라우팅 오류 시

- `vercel.json`의 `rewrites` 설정 확인
- SPA 라우팅을 위한 설정이 포함되어 있음

## 성능 최적화

현재 빌드 결과:
- JavaScript 번들: 562.06 kB (경고: 500 kB 초과)

개선 방법:
1. 코드 스플리팅 적용
2. 동적 import() 사용
3. 라이브러리 최적화
