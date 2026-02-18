# Make 자동화 설정 가이드

## 사전 준비

### 필요한 계정

| 서비스 | 용도 | 비용 |
|--------|------|------|
| Make | 자동화 플랫폼 | 무료 (1,000 ops/월) |
| Gmail | 이메일 발송 | 무료 |
| Notion | 데이터 저장 | 무료 |
| Google Alerts | 브랜드 모니터링 | 무료 |

---

## Make 기본 설정

### 1. 계정 생성

1. https://make.com 접속
2. Sign up 클릭
3. 이메일로 가입

### 2. 시나리오 생성

1. Dashboard → Create a new scenario
2. 시나리오 이름 입력 (좌측 상단 클릭)

### 3. 모듈 추가

1. **+** 클릭
2. 서비스 검색 (RSS, Notion 등)
3. 액션 선택

---

## RSS 모듈 설정

### Watch RSS feed items

| 설정 | 설명 |
|------|------|
| URL | RSS 피드 URL |
| Maximum number of items | 가져올 최대 개수 (5 권장) |

### 첫 실행

1. 모듈 **우클릭**
2. **Choose where to start** 클릭
3. **All** 선택 (기존 항목 모두 가져오기)

---

## Notion 연동

### 1. Make에서 연결

1. Notion 모듈 추가
2. Connection → **Add** 클릭
3. Notion 로그인
4. **Select pages** 화면에서:
   - 연결할 페이지/DB **체크 ✅**
5. **Allow access** 클릭

### 2. Database ID 찾기

1. Notion에서 DB 열기
2. **···** → **Open as full page**
3. URL에서 ID 복사

**예시:**
```
https://www.notion.so/콘텐츠모니터링-3019d51b3361804e845df2fd6603aed5?v=...
                                    ↑ 이게 Database ID
```

### 3. 필드 매핑

| 방식 | 설명 |
|------|------|
| Specific Fields | 필드가 자동으로 나타남 (추천) |
| Generic Fields | 직접 Key-Value 입력 |

---

## Gmail 연동

### 1. 연결

1. Gmail 모듈 추가
2. Connection → **Add**
3. Google 계정 로그인
4. 권한 허용

### 2. Content Type

| 타입 | 용도 |
|------|------|
| Simple | 텍스트만 |
| HTML | 서식 있는 이메일 (추천) |

---

## Google Alerts RSS

### 1. 알림 생성

1. https://www.google.com/alerts 접속
2. 검색어 입력
3. **전송 위치** → **RSS 피드** 선택
4. 알림 만들기

### 2. RSS URL 복사

1. 생성된 알림 옆 **RSS 아이콘**
2. **우클릭** → 링크 복사

---

## 변수 사용법

### 변수 패널

1. 필드 클릭 → 오른쪽 패널 열림
2. 이전 모듈 클릭 → 항목 클릭
3. 자동으로 `{{1.title}}` 형식 삽입

### 직접 입력

```
{{모듈번호.속성}}

예시:
{{1.title}}       - 1번 모듈의 title
{{12.description}} - 12번 모듈의 description
{{14.text}}       - 14번 모듈의 text
```

### 함수

```
{{substring(1.description; 0; 1900)}}  - 글자 수 제한
{{formatDate(now; "YYYY.MM.DD")}}      - 날짜 포맷
{{now}}                                 - 현재 시간
```

---

## Text Aggregator 설정

### 용도

여러 개 → 1개로 합치기 (예: 뉴스 5개 → 이메일 1통)

### 설정

| 항목 | 설명 |
|------|------|
| Source Module | 데이터 소스 (RSS 등) |
| Row separator | 항목 구분자 (`<hr>` 등) |
| Text | 각 항목 템플릿 |

---

## 스케줄 설정

### 활성화

1. 화면 하단 **토글 ON**
2. 간격 설정

### 옵션

| 설정 | 설명 |
|------|------|
| Every 15 minutes | 15분마다 |
| Every hour | 매시간 |
| Every day | 매일 (시간 지정) |
| Specific days | 특정 요일 |

---

## 트러블슈팅

### "Not a feed" 에러

- **원인:** RSS URL이 유효하지 않음
- **해결:** 다른 RSS URL 사용, 한글 키워드 → 영문으로 변경

### "Module references non-existing module" 경고

- **원인:** 변수의 모듈 번호가 잘못됨
- **해결:** 변수 패널에서 다시 클릭해서 선택

### "Text content length should be ≤ 2000"

- **원인:** Notion Text 속성 2000자 제한
- **해결:** `{{substring(1.description; 0; 1900)}}` 사용

### "Trigger must be first module"

- **원인:** 시나리오당 트리거 1개만 가능
- **해결:** 별도 시나리오로 분리

### Notion에 데이터 안 들어감

- **원인 1:** Database ID 잘못됨
- **원인 2:** Make 연결 권한 없음
- **해결:** Notion에서 해당 페이지에 Make 연결 추가

---

## 무료 플랜 제한

| 항목 | 제한 |
|------|------|
| Operations | 1,000/월 |
| 시나리오 수 | 무제한 |
| 트리거 간격 | 15분 |
| 데이터 전송 | 100MB |

### Operations 계산

```
RSS(1) + Aggregator(1) + Gmail(1) = 3 ops/실행
매일 1회 × 30일 = 90 ops/월
```

→ 여유 있음!

