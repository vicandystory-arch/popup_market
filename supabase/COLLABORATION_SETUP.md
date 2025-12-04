# 협업 모집 기능 설정 가이드

## 개요

팝업 스토어 협업 모집 기능을 사용하려면 `collaborations` 테이블을 생성해야 합니다.

## 마이그레이션 적용

### Supabase Dashboard에서 적용

1. [Supabase Dashboard](https://app.supabase.com) 로그인
2. 프로젝트 선택
3. **SQL Editor** 메뉴 클릭
4. **New Query** 클릭
5. `supabase/migrations/20241202000001_add_collaborations.sql` 파일의 내용을 복사하여 붙여넣기
6. **Run** 버튼 클릭

## 테이블 구조

### `collaborations` 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 협업 요청 ID (자동 생성) |
| store_id | UUID | 협업 대상 스토어 ID |
| requester_id | UUID | 협업 요청자 ID |
| title | VARCHAR(200) | 협업 제목 |
| description | TEXT | 협업 내용 |
| collaboration_type | VARCHAR(50) | 협업 유형 (joint, sponsorship, space_sharing, event, other) |
| contact_email | VARCHAR(255) | 연락처 이메일 |
| contact_phone | VARCHAR(50) | 연락처 전화번호 (선택) |
| budget_range | VARCHAR(50) | 예산 범위 (선택) |
| preferred_dates | JSONB | 선호 일정 (선택) |
| status | VARCHAR(20) | 상태 (pending, approved, rejected, completed) |
| created_at | TIMESTAMP | 생성 일시 |
| updated_at | TIMESTAMP | 수정 일시 |

## RLS 정책

- **조회**: 모든 사용자가 협업 요청 조회 가능
- **생성**: 인증된 사용자만 협업 요청 생성 가능
- **수정**: 요청자는 자신의 협업 요청만 수정 가능
- **삭제**: 요청자는 자신의 협업 요청만 삭제 가능
- **상태 변경**: 스토어 소유자는 자신의 스토어에 대한 협업 요청 상태를 변경할 수 있음

## 기능

### 1. 협업 모집 페이지 (`/collaborations`)

- 등록된 모든 팝업 스토어 목록 표시
- 검색 기능 (이름, 위치, 카테고리)
- 각 스토어에 "협업 요청" 버튼

### 2. 협업 요청 모달

- 협업 제목 입력
- 협업 유형 선택 (공동 운영, 스폰서십, 공간 공유, 이벤트 협업, 기타)
- 협업 내용 작성
- 연락처 정보 (이메일, 전화번호)
- 예산 범위 (선택)

### 3. 메인 페이지

- "팝업 스토어 협업 모집" 버튼 추가
- 클릭 시 협업 모집 페이지로 이동

## 테스트

마이그레이션 적용 후:

1. 브라우저 새로고침 (F5)
2. 메인 페이지에서 "팝업 스토어 협업 모집" 버튼 확인
3. 버튼 클릭하여 협업 모집 페이지로 이동
4. 스토어 선택 후 "협업 요청" 버튼 클릭
5. 협업 요청 폼 작성 및 전송

## 확인

테이블이 올바르게 생성되었는지 확인:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'collaborations';
```

RLS 정책 확인:

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'collaborations';
```

## 문제 해결

### 테이블이 생성되지 않는 경우

1. SQL 에러 메시지 확인
2. `update_updated_at_column` 함수가 존재하는지 확인 (초기 마이그레이션에서 생성됨)
3. 필요 시 마이그레이션 재실행

### RLS 정책 에러

RLS 정책이 협업 요청 생성을 차단하는 경우:
- 사용자가 로그인되어 있는지 확인
- `profiles` 테이블에 사용자 프로필이 존재하는지 확인



