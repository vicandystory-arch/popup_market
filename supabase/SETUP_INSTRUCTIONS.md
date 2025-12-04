# Supabase 데이터베이스 설정 가이드

## 테이블 생성 방법

Supabase MCP 연결이 타임아웃되는 경우, Supabase Dashboard에서 직접 SQL을 실행하세요.

### 방법 1: SQL Editor 사용 (권장)

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New Query** 클릭
5. 아래 SQL을 복사하여 붙여넣기
6. **Run** 버튼 클릭

### 방법 2: 마이그레이션 파일 사용

`supabase/migrations/20241202000000_initial_schema.sql` 파일의 전체 내용을 SQL Editor에 복사하여 실행하세요.

## 생성되는 테이블

1. **profiles** - 사용자 프로필
2. **popup_stores** - 팝업 스토어 정보
3. **reviews** - 리뷰 및 평점
4. **favorites** - 즐겨찾기

## 중요 사항

- 마이그레이션을 실행하기 전에 Supabase 프로젝트가 활성화되어 있는지 확인하세요
- 모든 테이블과 RLS 정책이 올바르게 생성되었는지 확인하세요
- 테이블 생성 후 Storage 버킷도 설정해야 합니다 (이미지 업로드용)

## Storage 버킷 설정

이미지 업로드를 위해 Storage 버킷을 생성해야 합니다:

1. Supabase Dashboard > **Storage** 메뉴로 이동
2. **New bucket** 클릭
3. 버킷 이름: `store-images`
4. **Public bucket** 선택 (또는 RLS 정책 설정)
5. 생성 완료

## 테이블 생성 확인

SQL Editor에서 다음 쿼리로 테이블이 생성되었는지 확인할 수 있습니다:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

예상 결과:
- favorites
- popup_stores
- profiles
- reviews

## RLS 정책 확인 및 문제 해결

스토어 등록 시 "new row violates row-level security policy" 에러가 발생하는 경우:

### 1. RLS 정책 확인

SQL Editor에서 다음 쿼리로 RLS 정책을 확인하세요:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'popup_stores')
ORDER BY tablename, policyname;
```

### 2. 프로필 테이블 RLS 정책 확인

`profiles` 테이블에 다음 정책이 있어야 합니다:
- "Users can insert own profile" - 사용자가 자신의 프로필을 생성할 수 있음
- "Users can update own profile" - 사용자가 자신의 프로필을 수정할 수 있음

### 3. popup_stores 테이블 RLS 정책 확인

`popup_stores` 테이블에 다음 정책이 있어야 합니다:
- "Authenticated users can create stores" - 인증된 사용자가 스토어를 생성할 수 있음

### 4. 프로필이 없는 경우

사용자가 로그인했지만 `profiles` 테이블에 프로필이 없는 경우, 다음 쿼리로 수동 생성할 수 있습니다:

```sql
-- 현재 사용자의 프로필 확인
SELECT * FROM profiles WHERE id = auth.uid();

-- 프로필이 없으면 생성 (SQL Editor에서 실행)
INSERT INTO profiles (id, username, role)
VALUES (
  auth.uid(),
  COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), 'user_' || substr(auth.uid()::text, 1, 8)),
  'user'
)
ON CONFLICT (id) DO NOTHING;
```

### 5. RLS 정책 재생성 (필요한 경우)

정책이 없거나 잘못된 경우, 마이그레이션 파일의 RLS 정책 부분만 다시 실행하세요.



