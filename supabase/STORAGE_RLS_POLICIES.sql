-- Storage RLS 정책 설정
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;

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

-- 3. 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;



