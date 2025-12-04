# Supabase 마이그레이션 가이드

이 디렉토리에는 팝업 마켓 프로젝트의 데이터베이스 마이그레이션 파일이 포함되어 있습니다.

## 마이그레이션 적용 방법

### 방법 1: Supabase Dashboard 사용

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. SQL Editor로 이동
4. `supabase/migrations/20241202000000_initial_schema.sql` 파일의 내용을 복사하여 실행

### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (아직 설치하지 않은 경우)
npm install -g supabase

# Supabase 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 적용
supabase db push
```

### 방법 3: MCP 도구 사용

Cursor의 MCP 도구를 사용하여 마이그레이션을 적용할 수 있습니다.

## 마이그레이션 내용

### 생성되는 테이블

1. **profiles** - 사용자 프로필 정보
2. **popup_stores** - 팝업 스토어 정보
3. **reviews** - 스토어 리뷰 및 평점
4. **favorites** - 사용자 즐겨찾기

### RLS (Row Level Security) 정책

모든 테이블에 RLS가 활성화되어 있으며, 다음 정책이 적용됩니다:

- **profiles**: 모든 사용자가 조회 가능, 본인만 수정 가능
- **popup_stores**: published 상태만 공개, 판매자는 자신의 스토어 관리 가능
- **reviews**: 모든 사용자가 조회 가능, 본인만 생성/수정/삭제 가능
- **favorites**: 본인만 조회/생성/삭제 가능

### 자동 생성 기능

- 사용자 가입 시 프로필 자동 생성
- updated_at 타임스탬프 자동 업데이트

## Storage 버킷 설정

이미지 업로드를 위해 Storage 버킷을 생성해야 합니다:

1. Supabase Dashboard > Storage로 이동
2. 새 버킷 생성: `store-images`
3. 공개 버킷으로 설정 (또는 RLS 정책 설정)



