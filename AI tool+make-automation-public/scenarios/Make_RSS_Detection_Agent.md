# Make RSS 감지 에이전트 설계 문서

## 개요

글로벌 AI 음성회의록 / 미팅 SaaS 시장의 콘텐츠를 자동으로 수집하고, GPT를 통해 분석한 후 Notion에 저장하고 Slack/Email로 알림을 전송하는 경쟁 인텔리전스 감지 에이전트 시스템입니다.

---

## 1. 전체 Make 시나리오 구조 다이어그램

```
┌─────────────────┐
│   Scheduler     │  (Every 6 hours 또는 Daily 09:00)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Tools Set Variable         │  (RSS Array 설정)
│  Variable name: rss_list    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│    Iterator     │  (rss_list 순회)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  RSS Watch Feed Items       │  (각 RSS 피드 모니터링)
│  URL: {{Iterator.value}}    │
│  Limit: 10                  │
│  From now on: Enabled       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│  Keyword Filter │  (키워드 기반 필터링)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   GPT 분석      │  (콘텐츠 분석 및 분류)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Notion 저장    │  (데이터베이스에 저장)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Slack/Email    │  (알림 전송)
│     알림        │
└─────────────────┘
```

---

## 2. RSS Array 예시 (JSON)

```json
[
  "https://blog.otter.ai/feed/",
  "https://fireflies.ai/blog/rss.xml",
  "https://notta.ai/en/blog/rss.xml",
  "https://medium.com/feed/tag/ai-meeting",
  "https://www.producthunt.com/feed"
]
```

### RSS 피드 추가 가이드

- **주요 경쟁사 블로그**: Otter.ai, Fireflies.ai, Notta.ai, Rev.ai 등
- **기술 커뮤니티**: Medium AI Meeting 태그, Product Hunt
- **업계 뉴스**: TechCrunch AI 섹션, VentureBeat AI
- **한국 시장**: 네이버 블로그, 브런치 AI 회의록 관련

---

## 3. Iterator 설정 방법

### 모듈: Iterator

**설정 항목:**
- **Source Array**: `rss_list`
- **Array Name**: `rss_list` (Set Variable에서 설정한 변수명)

**동작 방식:**
- Set Variable에서 설정한 RSS 배열의 각 항목을 순차적으로 순회합니다.
- 각 반복마다 `{{Iterator.value}}`에 현재 RSS URL이 할당됩니다.

---

## 4. RSS 모듈 설정

### 모듈: RSS Watch Feed Items

**설정 항목:**

| 항목 | 값 | 설명 |
|------|-----|------|
| **URL** | `{{Iterator.value}}` | Iterator에서 전달받은 RSS 피드 URL |
| **Limit** | `10` | 최신 피드 항목 수 제한 |
| **From now on** | `Enabled` | 이 시점 이후의 새 항목만 감지 |

**고급 설정:**
- **Polling Interval**: 기본값 사용 (Scheduler 주기에 따라 조정)
- **Timeout**: 30초 권장

**에러 처리:**
- RSS 피드 접근 실패 시 다음 피드로 자동 진행
- Make의 Error Handler 모듈로 실패 로그 기록 권장

---

## 5. Make Filter 키워드 조건 예시

### 필터링 키워드 목록

```
meeting
transcription
회의록
AI
LLM
note
summary
voice
speech
conversation
```

### Make Expression

```javascript
contains(lowercase({{1.Title}}); "meeting")
OR
contains(lowercase({{1.Description}}); "transcription")
OR
contains(lowercase({{1.Description}}); "회의록")
OR
contains(lowercase({{1.Title}}); "ai")
OR
contains(lowercase({{1.Description}}); "llm")
OR
contains(lowercase({{1.Title}}); "note")
OR
contains(lowercase({{1.Description}}); "summary")
OR
contains(lowercase({{1.Content}}); "meeting")
OR
contains(lowercase({{1.Content}}); "transcription")
```

### 필터 모듈 설정

**모듈**: Filter

**조건**: 
- **조건 유형**: Custom condition
- **Expression**: 위의 Make Expression 사용

**설명:**
- Title, Description, Content 필드에서 대소문자 구분 없이 키워드 검색
- OR 조건으로 하나라도 매칭되면 통과

---

## 6. GPT 분석 프롬프트

### 모듈: OpenAI (GPT-4 또는 GPT-3.5-turbo)

**시스템 프롬프트:**

```
너는 AI SaaS 시장 분석가다.

아래 콘텐츠를 분석해서 JSON으로 반환해.

필드:
- category: Feature | Pricing | Marketing | UseCase | Technology
- summary: 핵심 요약 2줄
- signal: 우리 제품 전략에 참고할 변화 포인트 1줄

반드시 유효한 JSON 형식으로만 응답해야 한다.
```

**사용자 프롬프트:**

```
콘텐츠:
제목: {{1.Title}}
설명: {{1.Description}}
내용: {{1.Content}}
URL: {{1.Link}}
발행일: {{1.PubDate}}
```

**응답 형식 예시:**

```json
{
  "category": "Feature",
  "summary": "Otter.ai가 실시간 화면 공유 기능을 추가했다. 이는 원격 회의에서 화면 내용을 자동으로 캡처하고 회의록에 포함시키는 기능이다.",
  "signal": "화면 공유 자동 캡처 기능은 우리 제품 로드맵에 추가 검토가 필요하다."
}
```

**GPT 모델 설정:**
- **Model**: `gpt-4-turbo-preview` 또는 `gpt-3.5-turbo`
- **Temperature**: `0.3` (일관성 있는 분석을 위해 낮게 설정)
- **Max Tokens**: `500`

---

## 7. Notion Database Schema

### 데이터베이스 구조

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| **title** | Title | 콘텐츠 제목 | ✅ |
| **source_url** | URL | 원본 RSS 항목 링크 | ✅ |
| **category** | Select | Feature / Pricing / Marketing / UseCase / Technology | ✅ |
| **summary** | Text | GPT가 생성한 요약 (2줄) | ✅ |
| **signal** | Text | 전략 포인트 (1줄) | ✅ |
| **published_at** | Date | RSS 항목 발행일 | ✅ |
| **rss_source** | Text | RSS 피드 출처 URL | |
| **detected_at** | Created Time | Make에서 감지된 시간 (자동) | ✅ |

### Notion 모듈 설정

**모듈**: Notion - Create a Database Item

**매핑:**

```javascript
{
  "title": "{{1.Title}}",
  "source_url": "{{1.Link}}",
  "category": "{{2.category}}",
  "summary": "{{2.summary}}",
  "signal": "{{2.signal}}",
  "published_at": "{{1.PubDate}}",
  "rss_source": "{{Iterator.value}}"
}
```

**중복 방지:**
- Notion의 `source_url` 필드를 Unique로 설정
- 또는 Make의 Data Store 모듈로 이미 처리된 URL 추적

---

## 8. Slack/Email 알림 템플릿

### Slack 알림 템플릿

**모듈**: Slack - Create a Message

**채널**: `#ai-market-intelligence` (또는 지정된 채널)

**메시지 템플릿:**

```
🚨 AI Meeting Market Signal

제목: {{1.Title}}
분류: {{2.category}}
출처: {{Iterator.value}}

요약:
{{2.summary}}

전략 포인트:
{{2.signal}}

링크:
{{1.Link}}

발행일: {{1.PubDate}}
```

**고급 설정:**
- **Username**: `Market Intelligence Bot`
- **Icon**: 커스텀 아이콘 URL (선택사항)
- **Threading**: 동일 카테고리 항목은 스레드로 그룹화 (선택사항)

### Email 알림 템플릿

**모듈**: Email - Send an Email

**받는 사람**: `product-team@yourcompany.com`

**제목:**
```
[{{2.category}}] AI Meeting Market Signal: {{1.Title}}
```

**본문 (HTML):**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .header { background-color: #4A90E2; color: white; padding: 20px; }
    .content { padding: 20px; }
    .signal { background-color: #FFF3CD; padding: 15px; border-left: 4px solid #FFC107; }
    .link { color: #4A90E2; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <h2>🚨 AI Meeting Market Signal</h2>
  </div>
  <div class="content">
    <h3>{{1.Title}}</h3>
    <p><strong>분류:</strong> {{2.category}}</p>
    <p><strong>출처:</strong> {{Iterator.value}}</p>
    
    <h4>요약:</h4>
    <p>{{2.summary}}</p>
    
    <div class="signal">
      <h4>전략 포인트:</h4>
      <p><strong>{{2.signal}}</strong></p>
    </div>
    
    <p><a href="{{1.Link}}" class="link">원문 보기</a></p>
    <p><small>발행일: {{1.PubDate}}</small></p>
  </div>
</body>
</html>
```

---

## 9. Scheduler 권장 주기

### 권장 설정

**옵션 1: 정기 실행**
- **주기**: `Every 6 hours`
- **시간대**: UTC 기준 (한국 시간대 고려하여 조정)
- **장점**: 실시간 감지, 빠른 대응 가능

**옵션 2: 일일 실행**
- **주기**: `Daily`
- **시간**: `09:00` (한국 시간 기준)
- **장점**: 리소스 절약, 일일 요약 형태로 관리 용이

**옵션 3: 업무시간 집중**
- **주기**: `Every 4 hours` (09:00 ~ 18:00)
- **장점**: 업무시간에 집중 모니터링

### 권장 사항

- 초기 구축 시: `Every 6 hours`로 시작하여 데이터 수집 패턴 파악
- 안정화 후: `Daily 09:00`으로 전환하여 리소스 최적화
- 긴급 모니터링 필요 시: 별도 시나리오로 `Every 1 hour` 실행

---

## 10. 확장 전략 섹션

### 조건부 알림 전략

#### Feature 카테고리만 Slack 알림

**모듈**: Router 또는 Filter

**조건:**
```javascript
{{2.category}} = "Feature"
```

**설정:**
- Feature일 때만 Slack 알림 전송
- 다른 카테고리는 Notion 저장만 수행

#### Pricing 감지 시 High Priority

**모듈**: Router

**조건:**
```javascript
{{2.category}} = "Pricing"
```

**액션:**
- 별도 Slack 채널 (`#pricing-alerts`)로 전송
- Email 제목에 `[HIGH PRIORITY]` 태그 추가
- Notion에서 `priority` 필드에 `High` 설정

### 데이터 품질 관리

#### Signal 비어있으면 Notion 저장 제외

**모듈**: Filter

**조건:**
```javascript
{{2.signal}} is not empty
AND
length({{2.signal}}) > 10
```

**설명:**
- GPT가 의미 있는 signal을 생성하지 못한 경우 제외
- 최소 10자 이상의 signal만 저장

### RAG 연동 가능 구조

#### 향후 확장 계획

1. **벡터 데이터베이스 연동**
   - Notion 저장 후 Pinecone/Weaviate에 임베딩 저장
   - Make 시나리오에 "Embedding 생성" 모듈 추가

2. **RAG 기반 질의응답**
   - Slack에서 `@bot 질문` 형태로 시장 동향 질의
   - 저장된 콘텐츠 기반 답변 생성

3. **트렌드 분석 대시보드**
   - Notion Database를 데이터 소스로 사용
   - 카테고리별 트렌드 시각화
   - 시간대별 감지 패턴 분석

4. **경쟁사 비교 분석**
   - RSS 출처별 그룹핑
   - 경쟁사별 Feature 출시 빈도 추적
   - 가격 정책 변화 모니터링

### 추가 모듈 제안

**Data Store 모듈:**
- 이미 처리된 URL 추적
- 중복 처리 방지
- 처리 이력 관리

**Error Handler:**
- RSS 피드 접근 실패 시 재시도 로직
- GPT API 오류 시 대체 처리
- 알림 실패 시 로깅

**Webhook 트리거:**
- 수동 실행 가능한 엔드포인트
- 특정 RSS 피드 즉시 스캔
- 긴급 모니터링 시나리오

---

## 11. 에러 처리 및 모니터링

### 에러 핸들링 전략

1. **RSS 피드 접근 실패**
   - 다음 피드로 자동 진행
   - 실패한 피드 URL을 로그에 기록
   - 주기적으로 재시도

2. **GPT API 오류**
   - 재시도 로직 (최대 3회)
   - 실패 시 원본 데이터만 Notion 저장
   - 알림에는 "분석 실패" 태그 추가

3. **Notion 저장 실패**
   - 중복 URL 감지 시 스킵
   - 권한 오류 시 관리자에게 알림
   - 데이터 손실 방지를 위한 임시 저장소 활용

### 모니터링 지표

- 일일 감지 항목 수
- 카테고리별 분포
- 알림 전송 성공률
- 시나리오 실행 시간
- 에러 발생 빈도

---

## 12. 보안 및 권한 관리

### API 키 관리

- Make의 Credentials 기능 활용
- 환경 변수로 API 키 분리
- 정기적인 키 로테이션

### 접근 권한

- Notion Database: 읽기/쓰기 권한만 부여
- Slack 채널: Bot 계정으로 제한
- Email: 내부 팀원만 수신

---

## 결론

이 에이전트의 목적은 단순 RSS 수집이 아니라 글로벌 AI 회의록 시장의 방향을 조기 감지하는 전략 레이더 구축이다.

시장의 변화를 실시간으로 모니터링하고, 경쟁사의 동향을 분석하여 제품 전략 수립에 활용할 수 있는 인사이트를 제공하는 것이 핵심 목표입니다. Make의 자동화 기능을 통해 수동 작업을 최소화하고, GPT의 분석 능력을 활용하여 가치 있는 정보만 선별하여 전달하는 시스템입니다.

---

## 부록: Make 시나리오 체크리스트

- [ ] Scheduler 모듈 설정 완료
- [ ] Set Variable로 RSS Array 설정
- [ ] Iterator 모듈 연결 및 테스트
- [ ] RSS Watch Feed Items 모듈 설정
- [ ] Filter 모듈 키워드 조건 입력
- [ ] OpenAI API 연결 및 프롬프트 설정
- [ ] Notion Database 생성 및 스키마 설정
- [ ] Notion 모듈 매핑 완료
- [ ] Slack 워크스페이스 연결
- [ ] Slack 메시지 템플릿 작성
- [ ] Email 모듈 설정 (선택사항)
- [ ] 에러 핸들링 로직 추가
- [ ] 테스트 실행 및 검증
- [ ] 모니터링 대시보드 설정

---

**문서 버전**: 1.0  
**최종 업데이트**: 2026-02-10  
**작성자**: AI SaaS 경쟁 인텔리전스 시스템 설계팀
