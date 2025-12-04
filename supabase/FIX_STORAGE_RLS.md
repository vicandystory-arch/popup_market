# Storage RLS 정책 에러 해결 가이드

## 에러 원인

`new row violates row-level security policy` 에러는 Supabase Storage의 RLS(Row Level Security) 정책이 제대로 설정되지 않아 발생합니다.

## 해결 방법 (두 가지 중 하나 선택)

### 방법 1: RLS 정책 비활성화 (가장 간단, 권장)

1. [Supabase Dashboard](https://app.supabase.com) 로그인
2. 프로젝트 선택
3. **Storage** 메뉴 클릭
4. `store-images` 버킷 찾기
5. 버킷 옆의 **⋮** (점 3개) 클릭 → **Edit bucket** 선택
6. **Public bucket** 옵션을 **체크** ✅
7. **Save** 클릭

### 방법 2: RLS 정책 추가 (더 안전)

Supabase Dashboard > **SQL Editor**에서 다음 SQL을 실행하세요:

```sql
-- 1. 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- 2. 새 정책 생성
-- 모든 사용자가 store-images 버킷의 이미지 조회 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'store-images');

-- 인증된 사용자는 store-images 버킷에 이미지 업로드 가능
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'store-images' 
  AND auth.role() = 'authenticated'
);

-- 인증된 사용자는 store-images 버킷의 이미지 삭제 가능
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'store-images' 
  AND auth.role() = 'authenticated'
);

-- 인증된 사용자는 store-images 버킷의 이미지 업데이트 가능
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'store-images' 
  AND auth.role() = 'authenticated'
);
```

## 정책 확인

다음 SQL로 정책이 올바르게 생성되었는지 확인하세요:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects';
```

## 버킷 존재 확인

버킷이 없는 경우, 다음과 같이 생성하세요:

1. **Storage** 메뉴 > **New bucket** 클릭
2. **Name**: `store-images` 입력
3. **Public bucket** 체크 ✅
4. **Create bucket** 클릭

## 문제가 계속되는 경우

1. **사용자 로그인 확인**: 브라우저에서 로그아웃 후 다시 로그인
2. **브라우저 캐시 삭제**: 개발자 도구 > Application > Clear storage
3. **Supabase 프로젝트 재시작**: Dashboard에서 프로젝트 일시 중지 후 재시작

## 테스트

설정 완료 후:
1. 브라우저 새로고침 (F5)
2. 스토어 등록 페이지에서 이미지 업로드 테스트
3. 콘솔에 에러가 없는지 확인



