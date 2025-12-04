# Vercel 환경 변수 설정 가이드

## 필수 환경 변수

Vercel 배포 시 다음 환경 변수를 반드시 설정해야 합니다:

### 1. Vercel 대시보드에서 설정

1. Vercel 프로젝트 페이지 접속
2. Settings > Environment Variables 메뉴로 이동
3. 다음 환경 변수 추가:

#### VITE_SUPABASE_URL
```
https://oaypyevjwtfoualfmjwq.supabase.co
```

#### VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heXB5ZXZqd3Rmb3VhbGZtandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzI5NDIsImV4cCI6MjA4MDI0ODk0Mn0.05GSMirAQEjUQzUPKft5GREpseXv9Bw_Y0IUcuMsExY
```

### 2. 환경 변수 설정 확인

환경 변수 설정 후:
1. **Redeploy** 클릭하여 재배포
2. 배포 로그에서 환경 변수가 제대로 로드되었는지 확인
3. 브라우저 콘솔에서 에러 확인

### 3. 문제 해결

#### 에러: "supabaseKey is required"

이 에러가 발생하면:
1. Vercel 대시보드에서 환경 변수 확인
2. 변수명이 정확한지 확인 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. 값이 올바르게 설정되었는지 확인
4. **Redeploy** 실행

#### 환경 변수가 적용되지 않는 경우

- 환경 변수 이름 앞에 `VITE_` 접두사가 있는지 확인
- Production, Preview, Development 환경 모두 설정했는지 확인
- 재배포 필요 (환경 변수 변경 후 자동 재배포되지 않음)

### 4. 환경별 설정

각 환경(Production, Preview, Development)에 동일한 값을 설정하거나, 필요에 따라 다르게 설정할 수 있습니다.

### 5. 보안 주의사항

- 환경 변수는 Vercel 대시보드에서만 관리
- 코드에 직접 하드코딩하지 마세요
- `.env` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)
