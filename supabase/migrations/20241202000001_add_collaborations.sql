-- 협업 요청 테이블 생성
CREATE TABLE IF NOT EXISTS collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES popup_stores(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  collaboration_type VARCHAR(50) NOT NULL CHECK (collaboration_type IN ('joint', 'sponsorship', 'space_sharing', 'event', 'other')),
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  budget_range VARCHAR(50),
  preferred_dates JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_requester_store UNIQUE (store_id, requester_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_collaborations_store_id ON collaborations(store_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_requester_id ON collaborations(requester_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);

-- RLS 활성화
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자가 협업 요청 조회 가능
CREATE POLICY "Collaborations are viewable by everyone" ON collaborations
  FOR SELECT USING (true);

-- RLS 정책: 인증된 사용자만 협업 요청 생성 가능
CREATE POLICY "Authenticated users can create collaborations" ON collaborations
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- RLS 정책: 요청자는 자신의 협업 요청만 수정 가능
CREATE POLICY "Users can update own collaborations" ON collaborations
  FOR UPDATE USING (auth.uid() = requester_id);

-- RLS 정책: 요청자는 자신의 협업 요청만 삭제 가능
CREATE POLICY "Users can delete own collaborations" ON collaborations
  FOR DELETE USING (auth.uid() = requester_id);

-- RLS 정책: 스토어 소유자는 자신의 스토어에 대한 협업 요청 상태를 수정 가능
CREATE POLICY "Store owners can update collaboration status" ON collaborations
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT seller_id FROM popup_stores WHERE id = store_id
    )
  );

-- updated_at 트리거
CREATE TRIGGER update_collaborations_updated_at
  BEFORE UPDATE ON collaborations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



