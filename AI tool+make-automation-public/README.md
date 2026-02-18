# TIMBEL 마케팅 자동화 (Make) + Content Factory AI Revenue System

> TIMBEL 마케팅팀을 위한 Make(Integromat) 자동화 시나리오 모음

## 📁 폴더 구성

| 폴더 | 설명 |
|------|------|
| **[content-factory/](./content-factory/)** | AI 기반 콘텐츠 자동화 + 인바운드 영업 Revenue Support System |
| [scenarios/](./scenarios/) | Make 시나리오 설계/이슈 대응 문서 |
| [docs/](./docs/) | 공통 문서 |
| [templates/](./templates/) | 템플릿 |

## 📋 프로젝트 개요

API 비용 없이 무료로 운영 가능한 마케팅 자동화 시스템입니다.

- **작성일**: 2026-02-08 (업데이트: 2026-02-09)
- **도구**: Make (formerly Integromat), Wix Automation
- **연동 서비스**: RSS, Gmail, Notion, Google Alerts, Wix Forms

---

## ✅ 완료된 자동화

### 1. 뉴스레터 자동화

| 항목 | 내용 |
|------|------|
| **시나리오명** | AI 마케팅 모닝 뉴스 |
| **구조** | RSS → Text Aggregator → Gmail |
| **RSS 소스** | 바이라인 (byline.network/feed/) |
| **발송 형식** | 매거진형 HTML 이메일 |
| **수신자** | 마케팅팀 전체 |

**기능:**
- 매일 아침 IT/마케팅 뉴스 5개 자동 수집
- 예쁜 HTML 형식으로 정리
- 팀 전체에게 1통으로 발송

---

### 2. 콘텐츠 모니터링 (Notion)

| 항목 | 내용 |
|------|------|
| **시나리오명** | 콘텐츠 모니터링 |
| **구조** | RSS → Notion Database |
| **Notion DB** | 콘텐츠 모니터링 |
| **카테고리** | AI 트렌드, AI 회의록, AI 미디어, 생성형 AI |

**RSS 소스:**
| 카테고리 | RSS URL |
|----------|---------|
| AI 트렌드 | `https://byline.network/feed/` |
| AI (해외) | `https://techcrunch.com/category/artificial-intelligence/feed/` |
| 테크 전체 | `https://www.theverge.com/rss/index.xml` |

**Notion DB 구조:**
| 속성 | 타입 |
|------|------|
| 제목 | Title |
| 카테고리 | Select |
| 원문링크 | URL |
| 요약 | Text |
| 상태 | Select (수집됨/편집중/발행완료) |
| 수집일 | Date |

---

### 3. 브랜드 언급 모니터링

| 항목 | 내용 |
|------|------|
| **시나리오명** | 브랜드 언급 모니터링 |
| **구조** | Google Alerts RSS → Notion Database |
| **Notion DB** | 알림 에이전트 |

**Google Alerts 설정:**
| 카테고리 | 검색어 | RSS URL |
|----------|--------|---------|
| AI 미디어 | 클립데스크, 영상편집, 자막, 번역 | `...249568` |
| AI 회의록 | 팀블로, 회의록, AI회의록 | `...248598` |
| AI 회의록 | 회의록, AI미팅, 녹음, 요약 | `...737339` |
| 자사 언급 | 팀벨, 인공지능 | `...517003` |
| 속기사 시장 | 속기사, 속기 관련 | `...737049` |

---

### 4. 리드 수집 자동화 (NEW! 2026-02-09)

| 항목 | 내용 |
|------|------|
| **시나리오명** | 상담신청 리드 수집 |
| **구조** | Wix Forms → Wix Automation → Make Webhook → Notion DB |
| **Wix 폼** | 상담신청서 (취업/프리랜서) |
| **Notion DB** | 전체 신청 목록 |

**자동화 흐름:**
```
[Wix 사이트]          [Wix Automation]       [Make]           [Notion]
폼 제출 ──────────→ HTTP 요청 발송 ──────→ Webhook ──────→ DB 저장
```

**수집 필드:**
| Notion 속성 | Wix 필드 | 설명 |
|------------|----------|------|
| 이름 | field:comp-mi5q29w3 | 고객명 |
| 생년월일 | field:comp-mi5q29wn1 | 생년월일 |
| 연락처 | field:comp-mi5q29wp1 | 전화번호 |
| 지역 | field:comp-mkgk7o90 | 상담 지역 |
| 직업상태 | field:comp-mi5q4cuc | 취업/구직/재직 등 |
| 희망시간 | field:comp-mkgla33c | 연락 희망 시간대 |
| 상담방식 | field:comp-mi5q29x31 | 비대면/방문 등 |
| cg (캠페인) | field:comp-mi5q29xg1 | 유입 채널 추적 |
| 제출일시 | submissionTime | 폼 제출 시간 |

**캠페인 코드(cg) 예시:**
| 코드 | 의미 |
|------|------|
| m_1_02 | 매체1_캠페인02 |
| m_2_23 | 매체2_캠페인23 |
| naver_search | 네이버 검색 |

**활용 방안:**
- 캠페인별 리드 유입 분석
- 지역/시간대별 패턴 파악
- ROI 측정 및 마케팅 최적화

---

## 📁 프로젝트 구조

```
timbel-make-automation/
├── README.md # 프로젝트 개요 (본 문서)
├── content-factory/ # AI 콘텐츠 자동화 + 인바운드 Revenue System
│ ├── README.md
│ ├── ARCHITECTURE.md
│ ├── content-factory-full-spec.md
│ └── docs/ # KPI, 인바운드 UI, 로드맵, Repo Setup
├── scenarios/ # Make 시나리오 설계/이슈 대응
│ ├── lead-collection.md
│ └── lead-collection-이슈대응.md
├── templates/ # 템플릿
└── docs/ # 공통 문서
```

---

## 🔧 기술 스택

| 도구 | 용도 |
|------|------|
| Make | 자동화 플랫폼 |
| Wix Automation | 폼 제출 트리거 |
| Wix Forms | 상담신청 폼 |
| RSS | 뉴스 수집 |
| Gmail | 이메일 발송 |
| Notion | 데이터 저장/관리 |
| Google Alerts | 브랜드 모니터링 |

---

## 💰 비용

| 항목 | 비용 |
|------|------|
| Make | 무료 (1,000 ops/월) |
| RSS | 무료 |
| Gmail | 무료 |
| Notion | 무료 |
| Google Alerts | 무료 |
| **총 비용** | **$0/월** |

---

## 🚀 향후 계획

### Phase 2: 리드 분석 자동화
- [x] 리드 수집 자동화 ✅ (2026-02-09 완료!)
- [ ] 주간 인사이트 리포트 (캠페인별 분석)
- [ ] 슬랙/카톡 신규 리드 알림
- [ ] 캠페인 ROI 대시보드

### Phase 3: AI API 연동
- [ ] Claude/GPT API 연결
- [ ] 자동 블로그 초안 생성
- [ ] SEO 최적화 콘텐츠 작성
- [ ] ### Phase 3: AI API 연동 (→ [Content Factory](./content-factory/) 확장)

### Phase 4: 추가 자동화
- [ ] AI 소식관련 알림
- [ ] 경쟁사 웹사이트 변화 감지

---

## 📞 문의

TIMBEL 홍보마케팅팀 이세영 팀장
