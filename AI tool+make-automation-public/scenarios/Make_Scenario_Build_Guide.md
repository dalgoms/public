# Make RSS 감지 에이전트 구축 가이드

## 단계별 시나리오 구축 방법

이 가이드는 Make.com 웹 인터페이스를 사용하여 RSS 감지 에이전트를 순차적으로 구축하는 방법을 설명합니다.

---

## 사전 준비사항

### 필요한 계정 및 API 키

1. **Make.com 계정** (유료 플랜 권장 - API 호출 제한 완화)
2. **OpenAI API 키** (GPT 분석용)
3. **Notion API 키** 및 Database ID
4. **Slack 워크스페이스** 및 Bot Token
5. **Email 설정** (선택사항)

---

## Step 1: 새 시나리오 생성

1. Make.com에 로그인
2. 상단 메뉴에서 **"Scenarios"** 클릭
3. **"Create a new scenario"** 버튼 클릭
4. 시나리오 이름 입력: `AI Meeting Market Intelligence`

---

## Step 2: Scheduler 모듈 추가

1. 시나리오 편집 화면에서 **"+"** 버튼 클릭
2. **"Schedule"** 모듈 검색 및 선택
3. **"Schedule"** → **"Run a scenario on schedule"** 선택

### 설정:
- **Schedule**: `Every 6 hours` (또는 `Daily at 09:00`)
- **Timezone**: `Asia/Seoul` (또는 원하는 시간대)
- **Save** 클릭

---

## Step 3: Set Variable 모듈 추가

1. Scheduler 모듈 다음에 **"+"** 버튼 클릭
2. **"Tools"** → **"Set variable"** 선택

### 설정:
- **Variable name**: `rss_list`
- **Variable value**: 아래 JSON 배열 입력

```json
[
  "https://blog.otter.ai/feed/",
  "https://fireflies.ai/blog/rss.xml",
  "https://notta.ai/en/blog/rss.xml",
  "https://medium.com/feed/tag/ai-meeting",
  "https://www.producthunt.com/feed"
]
```

- **Save** 클릭

---

## Step 4: Iterator 모듈 추가

1. Set Variable 모듈 다음에 **"+"** 버튼 클릭
2. **"Tools"** → **"Iterator"** 선택

### 설정:
- **Array name**: `rss_list` (Set Variable에서 설정한 변수명)
- **Save** 클릭

**참고**: Iterator는 배열의 각 항목을 순회하며, 각 반복마다 `{{Iterator.value}}`에 현재 값이 할당됩니다.

---

## Step 5: RSS 모듈 추가

1. Iterator 모듈 다음에 **"+"** 버튼 클릭
2. **"RSS"** 검색 및 선택
3. **"RSS"** → **"Watch Feed Items"** 선택

### 설정:
- **Feed URL**: `{{Iterator.value}}`
- **Limit**: `10`
- **From now on**: `Enabled` (체크박스 활성화)
- **Save** 클릭

**중요**: Iterator 내부에 배치되어야 하므로, Iterator 모듈의 **"Add a path"** 또는 **"Add another action"** 옵션을 사용하세요.

---

## Step 6: Filter 모듈 추가

1. RSS 모듈 다음에 **"+"** 버튼 클릭
2. **"Flow control"** → **"Filter"** 선택

### 설정:
- **Condition**: `Custom condition`
- **Expression**: 아래 코드 입력

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

- **Save** 클릭

**참고**: `{{1.Title}}`은 RSS 모듈의 출력에서 Title 필드를 참조합니다. Make의 데이터 매퍼를 사용하여 정확한 필드명을 확인하세요.

---

## Step 7: OpenAI 모듈 추가 (GPT 분석)

1. Filter 모듈 다음에 **"+"** 버튼 클릭
2. **"OpenAI"** 검색 및 선택
3. **"OpenAI"** → **"Create a Chat Completion"** 선택

### API 연결:
- **"Add"** 클릭하여 OpenAI API 키 입력
- API 키: `sk-...` 형식의 OpenAI API 키 입력
- **"Save"** 클릭

### 설정:
- **Model**: `gpt-4-turbo-preview` (또는 `gpt-3.5-turbo`)
- **Messages**: 아래와 같이 설정

#### System Message:
```
너는 AI SaaS 시장 분석가다.

아래 콘텐츠를 분석해서 JSON으로 반환해.

필드:
- category: Feature | Pricing | Marketing | UseCase | Technology
- summary: 핵심 요약 2줄
- signal: 우리 제품 전략에 참고할 변화 포인트 1줄

반드시 유효한 JSON 형식으로만 응답해야 한다.
```

#### User Message:
```
콘텐츠:
제목: {{1.Title}}
설명: {{1.Description}}
내용: {{1.Content}}
URL: {{1.Link}}
발행일: {{1.PubDate}}
```

- **Temperature**: `0.3`
- **Max tokens**: `500`
- **Response format**: `JSON object` (가능한 경우)
- **Save** 클릭

**참고**: GPT 응답을 JSON으로 파싱하기 위해 **"Parse JSON"** 모듈을 추가로 사용할 수 있습니다.

---

## Step 8: Parse JSON 모듈 추가 (선택사항)

GPT 응답이 JSON 문자열인 경우 파싱이 필요합니다.

1. OpenAI 모듈 다음에 **"+"** 버튼 클릭
2. **"Tools"** → **"Parse JSON"** 선택

### 설정:
- **JSON string**: `{{2.choices[0].message.content}}` (OpenAI 응답의 content 필드)
- **Save** 클릭

**참고**: 파싱된 JSON은 `{{3.category}}`, `{{3.summary}}`, `{{3.signal}}` 형식으로 접근 가능합니다.

---

## Step 9: Notion 모듈 추가

### 9-1. Notion Database 생성

먼저 Notion에서 데이터베이스를 생성해야 합니다.

1. Notion에서 새 페이지 생성
2. **"/database"** 입력하여 데이터베이스 생성
3. 다음 필드 추가:

| 필드명 | 타입 | 옵션 |
|--------|------|------|
| title | Title | - |
| source_url | URL | - |
| category | Select | Feature, Pricing, Marketing, UseCase, Technology |
| summary | Text | - |
| signal | Text | - |
| published_at | Date | - |
| rss_source | Text | - |

4. 데이터베이스 URL에서 Database ID 복사 (URL의 마지막 부분)

### 9-2. Make에서 Notion 모듈 설정

1. Parse JSON 모듈 다음에 **"+"** 버튼 클릭
2. **"Notion"** 검색 및 선택
3. **"Notion"** → **"Create a Database Item"** 선택

### API 연결:
- **"Add"** 클릭하여 Notion API 키 입력
- Notion Integration 생성 및 API 키 복사
- **"Save"** 클릭

### 설정:
- **Database**: 데이터베이스 선택 또는 Database ID 입력
- **Title**: `{{1.Title}}`
- **source_url**: `{{1.Link}}`
- **category**: `{{3.category}}` (Parse JSON 후) 또는 `{{2.parsed.category}}`
- **summary**: `{{3.summary}}`
- **signal**: `{{3.signal}}`
- **published_at**: `{{1.PubDate}}`
- **rss_source**: `{{Iterator.value}}`
- **Save** 클릭

---

## Step 10: Router 모듈 추가 (조건부 알림)

1. Notion 모듈 다음에 **"+"** 버튼 클릭
2. **"Flow control"** → **"Router"** 선택

### Route 1: Feature 카테고리
- **Condition**: `{{3.category}}` equals `Feature`
- **Label**: `Feature Alert`

### Route 2: Pricing 카테고리
- **Condition**: `{{3.category}}` equals `Pricing`
- **Label**: `Pricing Alert`

### Route 3: 기타
- **Condition**: `Else`
- **Label**: `Other`

- **Save** 클릭

---

## Step 11: Slack 모듈 추가

### Route 1 (Feature)에 Slack 알림 추가:

1. Router의 **"Feature Alert"** 경로에 **"+"** 버튼 클릭
2. **"Slack"** 검색 및 선택
3. **"Slack"** → **"Create a Message"** 선택

### API 연결:
- **"Add"** 클릭하여 Slack 워크스페이스 연결
- OAuth 인증 완료
- **"Save"** 클릭

### 설정:
- **Channel**: `#ai-market-intelligence` (또는 원하는 채널)
- **Message text**: 아래 템플릿 입력

```
🚨 AI Meeting Market Signal

제목: {{1.Title}}
분류: {{3.category}}
출처: {{Iterator.value}}

요약:
{{3.summary}}

전략 포인트:
{{3.signal}}

링크:
{{1.Link}}

발행일: {{1.PubDate}}
```

- **Username**: `Market Intelligence Bot`
- **Save** 클릭

### Route 2 (Pricing)에도 동일하게 Slack 모듈 추가 (채널만 다르게 설정 가능)

---

## Step 12: Email 모듈 추가 (선택사항)

1. Router의 **"Pricing Alert"** 경로에 **"+"** 버튼 클릭
2. **"Email"** 검색 및 선택
3. **"Email"** → **"Send an Email"** 선택

### 설정:
- **To**: `product-team@yourcompany.com`
- **Subject**: `[{{3.category}}] AI Meeting Market Signal: {{1.Title}}`
- **HTML**: 이전 문서의 HTML 템플릿 사용
- **Save** 클릭

---

## Step 13: 에러 핸들링 추가

### Error Handler 모듈 추가:

1. 시나리오 상단의 **"Error handler"** 탭 클릭
2. **"Add an error handler"** 클릭
3. **"Tools"** → **"Set variable"** 선택
4. 에러 로그를 저장할 변수 설정

또는 각 모듈의 **"Error handling"** 설정에서:
- **"Ignore errors"**: 체크 (다음 모듈로 계속 진행)
- **"Retry"**: 3회 재시도 설정

---

## Step 14: 테스트 실행

1. 시나리오 상단의 **"Run once"** 버튼 클릭
2. 각 모듈의 실행 결과 확인
3. 데이터 매퍼에서 각 모듈의 출력 데이터 확인
4. 문제가 있으면 모듈별로 수정

### 테스트 체크리스트:
- [ ] Scheduler가 정상 실행되는가?
- [ ] RSS 피드가 정상적으로 가져와지는가?
- [ ] Filter가 키워드를 정확히 필터링하는가?
- [ ] GPT가 JSON 형식으로 응답하는가?
- [ ] Notion에 데이터가 정상 저장되는가?
- [ ] Slack 알림이 정상 전송되는가?

---

## Step 15: 시나리오 활성화

1. 모든 테스트가 완료되면 시나리오 상단의 **"Toggle"** 스위치를 **ON**으로 변경
2. 시나리오가 자동으로 실행되기 시작합니다

---

## 트러블슈팅

### 문제 1: RSS 피드 접근 실패
**해결**: Error Handler에서 해당 피드를 스킵하도록 설정

### 문제 2: GPT 응답이 JSON 형식이 아님
**해결**: 
- 프롬프트에 "JSON 형식으로만 응답" 강조
- Parse JSON 모듈 추가
- Response format을 "JSON object"로 설정

### 문제 3: Notion 저장 실패 (중복)
**해결**: 
- Notion Database에서 `source_url` 필드를 Unique로 설정
- 또는 Make의 Data Store 모듈로 중복 체크

### 문제 4: Iterator가 제대로 작동하지 않음
**해결**: 
- Set Variable의 배열 형식 확인
- Iterator 모듈의 Array name이 정확한지 확인

---

## 최적화 팁

1. **Data Store 모듈 추가**: 이미 처리된 URL 추적하여 중복 방지
2. **배치 처리**: 여러 RSS 피드를 한 번에 처리하도록 최적화
3. **캐싱**: 자주 사용하는 데이터는 변수로 저장
4. **모니터링**: Make의 Execution History에서 실행 로그 확인

---

## 다음 단계

시나리오가 정상 작동하면:
1. 추가 RSS 피드 추가
2. 키워드 필터 확장
3. 알림 채널 커스터마이징
4. RAG 연동 준비 (벡터 DB 연동)

---

**문서 버전**: 1.0  
**최종 업데이트**: 2026-02-10
