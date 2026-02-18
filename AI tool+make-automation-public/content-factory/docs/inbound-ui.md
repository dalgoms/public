# 🧩 Inbound Sales UI (Notion)

Content Factory 인바운드 영업용 Notion UI 설계.

---

## Main Page: Inbound Command Center

영업팀이 매일 바라보는 메인 화면.

---

## Views

### 1. Inbound Queue

- **정렬:** Intent → Score → Time
- **용도:** 당일 처리할 리드 우선순위
- **필터:** Status = New / Contacted

### 2. Lead Detail (AI Sales Assistant)

- **용도:** 리드별 상세 + First Response Script, Qualification Questions, Objection Handling
- **동작:** Top Lead 선택 → Copy First Response → 연락 → Status 업데이트

### 3. Today Sales Keywords (Board)

- **용도:** 오늘의 Top3 키워드, Intent 트렌드, 스크립트 스니펫
- **출처:** 16:00 자동 이메일과 동기화

### 4. Performance (Admin only)

- **용도:** 키워드별 전환, 미팅, 계약 현황
- **접근:** 관리자만

---

## Sales Flow

1. Notion 열기
2. Inbound Queue에서 Top Lead 선택
3. First Response Script 복사
4. 연락 (이메일/전화)
5. Status 업데이트 (Contacted / Meeting / Won / Lost)

---

## Inbound Leads DB 연동

- 모든 인바운드 자동화(Webhook → Intent 분류 → 스크립트 생성) 결과가 **Inbound Leads** DB에 저장됨
- 영업팀 화면은 이 DB를 바라보게 설계하는 것이 안정적

---

*Full spec: [content-factory-full-spec.md](../content-factory-full-spec.md) §5*
