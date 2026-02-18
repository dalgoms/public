# 리드 수집 자동화

> Wix 상담신청서 → Notion 자동 저장

## 📋 개요

| 항목 | 내용 |
|------|------|
| **작성일** | 2026-02-09 |
| **시나리오명** | 상담신청 리드 수집 |
| **상태** | ✅ 운영 중 |

---

## 🔄 자동화 흐름

```
┌─────────────┐    ┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│  Wix 폼    │───→│ Wix Automation  │───→│ Make Webhook │───→│  Notion DB  │
│  (상담신청) │    │ (HTTP 요청)     │    │ (수신)       │    │ (저장)      │
└─────────────┘    └─────────────────┘    └──────────────┘    └─────────────┘
```

---

## 🛠️ 구성 요소

### 1. Wix Forms

| 항목 | 값 |
|------|-----|
| 폼 이름 | 상담신청서 (취업/프리랜서) |
| Collection ID | Forms/contact12 |
| 폼 타입 | Old Wix Forms |

### 2. Wix Automation

| 항목 | 값 |
|------|-----|
| 트리거 | Old Wix Forms - 양식 제출 시 |
| 액션 | HTTP 요청 발송 |
| 메서드 | POST |
| 바디 | 전체 페이로드 |

### 3. Make Webhook

| 항목 | 값 |
|------|-----|
| 모듈 | Custom Webhook |
| URL | `https://hook.eu1.make.com/t3ec9t9vj0qp3jp72oby59p987j72lcu` |

### 4. Notion Database

| 항목 | 값 |
|------|-----|
| DB 이름 | 전체 신청 목록 |
| 모듈 | Create a Database Item (Legacy) |

---

## 📊 필드 매핑

| Notion 속성 | 타입 | Wix 필드 ID | 예시 값 |
|------------|------|-------------|--------|
| 이름 | Title | `field:comp-mi5q29w3` | 홍길동 |
| 생년월일 | Text | `field:comp-mi5q29wn1` | 900101 |
| 연락처 | Text | `field:comp-mi5q29wp1` | 01012345678 |
| 지역 | Select | `field:comp-mkgk7o90` | 강남 (서울) |
| 직업상태 | Select | `field:comp-mi5q4cuc` | 직장인 |
| 희망시간 | Select | `field:comp-mkgla33c` | 저녁 7시 ~ 8시 |
| 상담방식 | Select | `field:comp-mi5q29x31` | 비대면 상담 |
| cg (캠페인) | Text | `field:comp-mi5q29xg1` | m_1_02 |
| 제출일시 | Date | `submissionTime` | 2026-02-09 |

---

## 🏷️ 캠페인 코드 (cg) 체계

URL 파라미터로 유입 채널 추적:

```
https://사이트.com/상담신청?cg1=매체&cg2=캠페인&cg3=소재
```

| 코드 | 의미 |
|------|------|
| m_1_02 | 매체1_캠페인02 |
| m_2_23 | 매체2_캠페인23 |
| naver_search | 네이버 검색 광고 |
| insta_promo | 인스타그램 프로모션 |
| google_ads | 구글 애즈 |

---

## 🔧 트러블슈팅

### 문제: Data Hook이 동작 안 함

**원인**: Wix Forms는 시스템 컬렉션(`Forms/contact12`)이라 일반 Data Hook이 안 됨

**해결**: Wix Automation 사용 (HTTP 요청 발송)

### 문제: 웹훅에 데이터가 안 옴

**원인**: Wix 에디터 미리보기에서 테스트

**해결**: 실제 라이브 사이트에서 폼 제출

### 문제: Notion 필드가 비어있음

**원인**: 필드 매핑 누락

**해결**: Make Notion 모듈에서 모든 필드 매핑 확인

---

## 💰 비용

| 항목 | 비용 |
|------|------|
| Wix Automation | 무료 |
| Make | 무료 (1,000 ops/월) |
| Notion | 무료 |
| **총 비용** | **$0/월** |

---

## 📈 향후 개선

- [ ] 신규 리드 슬랙 알림
- [ ] 주간 캠페인 성과 리포트
- [ ] 중복 리드 필터링
- [ ] 자동 응답 이메일

---

## 📝 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-02-09 | 최초 구축 및 운영 시작 |

