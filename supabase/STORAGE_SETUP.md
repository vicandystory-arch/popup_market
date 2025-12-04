# Supabase Storage 설정 가이드

## Storage 버킷 생성

이미지 업로드 기능을 사용하기 위해 Supabase Storage 버킷을 생성해야 합니다.

### 1. Supabase Dashboard에서 Storage 버킷 생성

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Storage** 클릭
4. **New bucket** 버튼 클릭
5. 다음 정보 입력:
   - **Name**: `store-images`
   - **Public bucket**: ✅ 체크 (공개 버킷으로 설정)
6. **Create bucket** 클릭

### 2. RLS 정책 설정 (필수)

**중요**: 공개 버킷으로 설정했더라도, RLS 정책을 명시적으로 설정해야 업로드가 작동합니다.

Supabase Dashboard > **Storage** > **Policies** 메뉴에서 다음 정책을 추가하거나, SQL Editor에서 실행하세요:

```sql
-- Storage 버킷에 대한 RLS 정책
-- 모든 사용자가 이미지 조회 가능
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'store-images');

-- 인증된 사용자만 이미지 업로드 가능
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'store-images' 
    AND auth.role() = 'authenticated'
  );

-- 인증된 사용자는 자신이 업로드한 이미지 삭제 가능
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'store-images' 
    AND auth.role() = 'authenticated'
  );
```

**또는 더 간단한 정책 (모든 인증된 사용자가 업로드/삭제 가능):**

```sql
-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- 모든 사용자가 이미지 조회 가능
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'store-images');

-- 인증된 사용자는 모든 이미지 업로드 가능
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'store-images' 
    AND auth.role() = 'authenticated'
  );

-- 인증된 사용자는 모든 이미지 삭제 가능
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'store-images' 
    AND auth.role() = 'authenticated'
  );
```

### 3. 파일 크기 제한 확인

Supabase 기본 파일 크기 제한은 50MB입니다. 필요시 Dashboard에서 조정할 수 있습니다.

현재 코드에서는 클라이언트 측에서 5MB로 제한하고 있습니다 (`useImageUpload.ts`의 `MAX_FILE_SIZE`).

### 4. 지원 파일 형식

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### 5. 테스트

버킷 생성 후, 애플리케이션에서 이미지 업로드 기능을 테스트해보세요.

## 문제 해결

### 이미지가 업로드되지 않는 경우 (400 Bad Request)

1. **버킷 이름 확인**: 버킷 이름이 정확히 `store-images`인지 확인
2. **RLS 정책 확인**: Storage RLS 정책이 올바르게 설정되었는지 확인
   - Supabase Dashboard > Storage > Policies에서 정책 확인
   - 위의 SQL을 실행하여 정책 생성
3. **사용자 인증 확인**: 사용자가 로그인되어 있는지 확인
4. **브라우저 콘솔 확인**: 에러 메시지의 상세 내용 확인

### 권한 오류가 발생하는 경우 (403 Forbidden)

1. **사용자 로그인 확인**: 사용자가 로그인되어 있는지 확인
2. **Storage RLS 정책 확인**: 
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'objects' 
   AND schemaname = 'storage';
   ```
3. **정책 재생성**: 위의 RLS 정책 SQL을 다시 실행

### 400 Bad Request 에러 해결 방법

1. **RLS 정책이 없는 경우**: 위의 RLS 정책 SQL을 실행
2. **버킷이 없는 경우**: Dashboard에서 `store-images` 버킷 생성
3. **파일 크기 초과**: 파일이 5MB를 초과하지 않는지 확인
4. **파일 형식 확인**: JPEG, PNG, WebP만 지원

### RLS 정책 확인 방법

SQL Editor에서 다음 쿼리로 현재 정책을 확인할 수 있습니다:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%store-images%';
```



