-- 팝업 마켓 초기 데이터베이스 스키마
-- PRD 섹션 3.1 참고

-- ============================================
-- 1. profiles 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- username 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자가 프로필 조회 가능
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- RLS 정책: 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS 정책: 사용자는 자신의 프로필만 생성 가능
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. popup_stores 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS popup_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  opening_hours JSONB DEFAULT '{}'::jsonb,
  contact_info JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_popup_stores_category ON popup_stores(category);
CREATE INDEX IF NOT EXISTS idx_popup_stores_status ON popup_stores(status);
CREATE INDEX IF NOT EXISTS idx_popup_stores_start_date ON popup_stores(start_date);
CREATE INDEX IF NOT EXISTS idx_popup_stores_end_date ON popup_stores(end_date);
CREATE INDEX IF NOT EXISTS idx_popup_stores_seller_id ON popup_stores(seller_id);

-- RLS 활성화
ALTER TABLE popup_stores ENABLE ROW LEVEL SECURITY;

-- RLS 정책: published 상태의 스토어는 모든 사용자가 조회 가능
CREATE POLICY "Published stores are viewable by everyone" ON popup_stores
  FOR SELECT USING (status = 'published' OR auth.uid() = seller_id);

-- RLS 정책: 인증된 사용자만 스토어 생성 가능
CREATE POLICY "Authenticated users can create stores" ON popup_stores
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- RLS 정책: 판매자만 자신의 스토어 수정 가능
CREATE POLICY "Sellers can update own stores" ON popup_stores
  FOR UPDATE USING (auth.uid() = seller_id);

-- RLS 정책: 판매자만 자신의 스토어 삭제 가능
CREATE POLICY "Sellers can delete own stores" ON popup_stores
  FOR DELETE USING (auth.uid() = seller_id);

-- ============================================
-- 3. reviews 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES popup_stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_store_review UNIQUE (store_id, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_reviews_store_id ON reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- RLS 활성화
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자가 리뷰 조회 가능
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- RLS 정책: 인증된 사용자만 리뷰 생성 가능
CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 리뷰만 수정 가능
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 리뷰만 삭제 가능
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. favorites 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES popup_stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_store_favorite UNIQUE (user_id, store_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_store_id ON favorites(store_id);

-- RLS 활성화
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 즐겨찾기만 조회 가능
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 즐겨찾기만 생성 가능
CREATE POLICY "Users can create own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 즐겨찾기만 삭제 가능
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 5. 유틸리티 함수 및 트리거
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles 테이블의 updated_at 트리거
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- popup_stores 테이블의 updated_at 트리거
CREATE TRIGGER update_popup_stores_updated_at
  BEFORE UPDATE ON popup_stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- reviews 테이블의 updated_at 트리거
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 사용자 생성 시 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 사용자 생성 트리거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 스토어 평균 평점 계산 함수 (선택사항)
CREATE OR REPLACE FUNCTION calculate_store_rating(store_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating
  FROM reviews
  WHERE store_id = store_uuid;
  RETURN ROUND(avg_rating, 2);
END;
$$ LANGUAGE plpgsql;
