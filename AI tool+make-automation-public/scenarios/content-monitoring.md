# 콘텐츠 모니터링 (Notion)

## 시나리오 개요

| 항목 | 내용 |
|------|------|
| 시나리오명 | 콘텐츠 모니터링 |
| 트리거 | 매일 (새 RSS 항목 감지) |
| 출력 | Notion Database |

---

## 모듈 구성

```
[RSS 1] Watch RSS feed items
    ↓
[Notion 9] Create a Database Item
```

---

## Notion Database 설정

### Database ID
```
3019d51b3361804e845df2fd6603aed5
```

### Database 구조

| 속성 | 타입 | 용도 |
|------|------|------|
| 제목 | Title | 기사 제목 |
| 카테고리 | Select | 분류 (AI 트렌드/AI 회의록/AI 미디어 등) |
| 원문링크 | URL | 기사 원본 링크 |
| 요약 | Text | 기사 요약 (2000자 제한) |
| 상태 | Select | 수집됨/편집중/발행완료 |
| 수집일 | Date | 수집 날짜 |

### 카테고리 옵션
- AI 트렌드
- AI 회의록
- AI 미디어
- 생성형 AI
- 자사뉴스
- 경쟁사

---

## RSS 소스 목록

| 카테고리 | 소스 | URL | 상태 |
|----------|------|-----|------|
| AI 트렌드 | 바이라인 | `https://byline.network/feed/` | ✅ 활성 |
| AI 트렌드 | 블로터 | `https://www.bloter.net/feed` | ✅ 활성 |
| AI (해외) | TechCrunch | `https://techcrunch.com/category/artificial-intelligence/feed/` | ✅ 활성 |
| 테크 전체 | The Verge | `https://www.theverge.com/rss/index.xml` | ✅ 활성 |

---

## 모듈 상세 설정

### 1. RSS 모듈

| 설정 | 값 |
|------|-----|
| URL | (위 RSS 소스 중 선택) |
| Maximum number of items | `5` |

**중요:** 첫 실행 시 우클릭 → Choose where to start → All

---

### 2. Notion 모듈

| 설정 | 값 |
|------|-----|
| Connection | Notion 연결 |
| Input method | Specific Fields of Data Source |
| Database ID | `3019d51b3361804e845df2fd6603aed5` |

**필드 매핑:**

| Notion 필드 | Make 변수 |
|-------------|-----------|
| 제목 | `{{1.title}}` |
| 카테고리 | `AI 트렌드` (직접 선택) |
| 원문링크 | `{{1.link}}` |
| 요약 | `{{substring(1.description; 0; 1900)}}` |
| 상태 | `수집됨` (직접 선택) |
| 수집일 | (비워두기) |

---

## 활용 워크플로우

```
[자동] 매일 아침 뉴스 수집 → Notion 저장
    ↓
[수동 5분] 테이블에서 제목 훑어보기
    ↓
관심 기사 클릭 → 요약 확인 → 원문 읽기
    ↓
블로그 소재로 쓸 만한 건 상태를 "편집중"으로 변경
    ↓
글 작성 후 "발행완료"로 변경
```

---

## 트러블슈팅

### 문제: Notion에 안 들어감
- **원인 1:** Database ID 잘못됨
- **해결:** Notion에서 DB 전체 페이지로 열고 URL에서 ID 복사

- **원인 2:** Make 연결 권한 없음
- **해결:** Notion에서 해당 페이지에 Make 연결 추가

### 문제: 글자 수 초과 에러
- **원인:** description이 2000자 초과
- **해결:** `{{substring(1.description; 0; 1900)}}` 사용

### 문제: 날짜 형식 에러
- **원인:** 수집일 필드에 잘못된 형식
- **해결:** 수집일 필드 비워두기

---

## 시나리오 복제 (카테고리별)

여러 RSS를 사용하려면 **시나리오 복제**:

1. 시나리오 1: 바이라인 → 카테고리: AI 트렌드
2. 시나리오 2: TechCrunch → 카테고리: AI (해외)
3. 시나리오 3: The Verge → 카테고리: 테크 전체

**주의:** Make 무료 플랜은 트리거가 시나리오당 1개만 가능

