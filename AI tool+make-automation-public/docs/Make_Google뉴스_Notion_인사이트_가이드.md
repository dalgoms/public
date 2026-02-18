# Make + Google 뉴스 RSS + OpenAI + Notion 인사이트 수집 가이드

Google News RSS를 수집해 OpenAI로 인사이트를 생성하고 Notion DB에 저장하는 Make 시나리오 설정 가이드입니다.

---

## 1. 전체 흐름 (최종 권장)

```
HTTP(RSS) → Iterator → OpenAI → Notion Create
```

| # | 모듈 | 역할 |
|---|------|------|
| 1 | HTTP | Google News RSS 요청 |
| 2 | Iterator | 기사별 반복 처리 |
| 3 | OpenAI | 제목+요약 기반 인사이트 생성 |
| 4 | Notion Create | DB에 저장 |

---

## 2. 단계별 설정

### 2.1 HTTP - Make a request

| 필드 | 값 |
|------|-----|
| **URL** | `https://news.google.com/rss/search?q=키워드&hl=ko&gl=KR&ceid=KR:ko` |
| **Method** | GET |
| **Parse response** | Yes |

**주의**: `/search`가 아니라 **`/rss/search`** 사용. HTML이 아닌 XML(RSS)을 받아야 함.

**예시 URL**:
```
https://news.google.com/rss/search?q=음성인식회의록&hl=ko&gl=KR&ceid=KR:ko
```

---

### 2.2 Iterator

| 필드 | 값 |
|------|-----|
| **Array** | `1.entry` |

Google News RSS는 Atom 형식. `entry` 배열 사용.  
HTTP 모듈 번호가 다르면 `1`을 해당 번호로 변경.

---

### 2.3 OpenAI - Create a Chat Completion

| 필드 | 값 |
|------|-----|
| **Model** | gpt-4o-mini (속도·비용 권장) |
| **Max tokens** | 500~800 |
| **Role (Message 1)** | User |
| **Text Content** | 아래 프롬프트 |

**프롬프트**:
```
다음 기사 제목과 요약을 바탕으로 핵심 인사이트 3가지를 bullet point로 요약해줘.

제목: {{2.entry.title}}
요약: {{2.entry.summary}}
```

- `2` = Iterator 모듈 번호
- `entry.summary`가 없으면 `entry.content` 또는 `entry.description` 시도

---

### 2.4 Notion - Create a Database Item

| 필드 | 값 |
|------|-----|
| **Database ID** | `3069d51b3361803ca92de6e9d69f8e37` (본인 DB로 변경) |
| **Title** | `{{2.entry.title}}` (매핑 사용) |
| **Properties** | 아래 참고 |

**Properties 매핑**:

| Property (속성명) | Type | Value |
|-------------------|------|-------|
| 제목 | Title | `{{2.entry.title}}` |
| 원문링크 | URL | `{{2.entry.link}}` |
| 카테고리 | Select | `Google 뉴스` |
| 요약 | Text | `{{3.choices[0].message.content}}` |

- `3` = OpenAI 모듈 번호

---

## 3. Notion DB 속성 준비

| 속성명 | 타입 | 비고 |
|--------|------|------|
| 제목 | Title | 기사 제목 |
| 원문링크 | URL | 기사 링크 |
| 카테고리 | Select | 옵션에 "Google 뉴스" 추가 |
| 요약 | **Text** | 인사이트 저장 (Formula/Rollup 아님) |

**요약 속성**: 반드시 **Text** 타입. 수식/롤업/관계형은 API로 값 입력 불가.

---

## 4. 수정 및 트러블슈팅

### 4.1 URL이 HTML을 반환하는 경우

**증상**: Notion에 숫자만 들어오거나, Iterator가 비정상 동작

**원인**: `https://news.google.com/search?q=...` 사용 (HTML 반환)

**해결**: `https://news.google.com/rss/search?q=...` 사용

---

### 4.2 Iterator Array 설정

**Array**에 넣을 값: `1.entry` (HTTP 모듈 번호 + `.entry`)

atom/entry 형식이면 `entry`, RSS 2.0이면 `channel.item` 또는 `items` 사용.

---

### 4.3 본문 없음 / HTML 헤더만 전달됨

**증상**: OpenAI가 "기사 본문이 포함되어 있지 않습니다" 또는 "HTML 헤더 부분만 포함" 응답

**원인**: 
- HTTP로 기사 URL을 fetch할 때 HTML 전체가 전달됨
- Google News 링크는 리다이렉트·구조 복잡
- 본문만 추출하지 않으면 HTML 헤더/메타만 전달됨

**해결**: **HTTP(본문) 모듈 제거**, RSS의 `entry.summary` / `entry.content` 사용

```
Iterator → OpenAI (제목 + RSS 요약만 사용) → Notion Create
```

---

### 4.4 제목에 "4.entry.title" 문자열이 저장됨

**원인**: 제목 필드에 변수명을 **문자열**로 입력함

**해결**: 
- 입력란 옆 **매핑(지도) 아이콘** 클릭
- Iterator → `entry` → `title` 선택
- 또는 `{{2.entry.title}}` 형식으로 입력

---

### 4.5 RateLimitError (TPM 초과)

**증상**: `Request too large for gpt-5... Limit 500000, Requested 509066`

**해결**:
- **Model**: gpt-4o-mini 사용
- **본문 길이**: 2000~3000자로 제한 (Tools - Set variable로 `substring()` 사용)
- **RSS 요약 사용**: 본문 fetch 제거 시 토큰 대폭 감소

---

### 4.6 Notion 카테고리 연동 안 됨

**확인**:
1. Notion DB를 Make용 Integration에 **공유**
2. Database ID 옆 **Search**로 DB 선택 후 Properties 갱신
3. Property Name: `카테고리` 선택
4. Value: Notion Select에 있는 옵션명과 **정확히 동일** (예: `Google 뉴스`)

---

### 4.7 Create + Update 중복 제거

**권장**: Create 한 번에 모든 필드 저장

- Notion Update 모듈 삭제
- Notion Create를 OpenAI 다음에 배치
- Create 시 제목, 원문링크, 카테고리, 요약을 한 번에 매핑

---

## 5. 동작하지 않는 구성 (참고)

| 구성 | 문제 |
|------|------|
| `news.google.com/search` | HTML 반환, RSS 파싱 불가 |
| HTTP로 기사 URL fetch 후 본문 전달 | HTML 헤더만 전달, 본문 추출 복잡 |
| Notion Update만 사용 (Create 없이) | Page ID 없어 업데이트 불가 |
| 요약 속성 = Formula/Rollup | API로 값 입력 불가 |

---

## 6. 참고 링크

- [Google News RSS](https://news.google.com/rss/search?q=키워드&hl=ko&gl=KR&ceid=KR:ko)
- [Make - Notion Integration](https://www.make.com/en/integrations/notion)
- [OpenAI API Rate Limits](https://platform.openai.com/account/rate-limits)

---

## 7. 체크리스트

- [ ] HTTP URL: `/rss/search` 사용
- [ ] Iterator Array: `1.entry`
- [ ] OpenAI: 제목 + `entry.summary` (본문 fetch 없음)
- [ ] Notion Create: 제목·원문링크·카테고리·요약 모두 매핑 (변수 사용)
- [ ] 요약 속성: Text 타입
- [ ] DB가 Integration에 공유됨
