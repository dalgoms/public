# 리드 수집 자동화 — 이슈 대응 가이드

> 예상 밖 데이터 유입 시 시나리오 끊김 방지 + 끊긴 리드 Notion 재연동

---

## 1. 문제 정리

| 이슈 | 원인 | 결과 |
|------|------|------|
| 제목(이름) 없이 들어옴 | Wix 필드 ID/구조가 다른 폼·테스트 제출 | Notion Create 실패 → 시나리오 에러 → **자동화 끊김** |
| 아예 다른 양식 | 다른 Wix 폼이 같은 웹훅으로 전송 | 필드 매핑 불일치 → 실패 → **끊김** |

---

## 2. 해결 1: 자동화가 끊기지 않게 하기

목표: **잘못된/다른 양식이 와도 시나리오는 계속 켜져 있고, 정상 리드만 Notion에 저장.**

### 2-1. Make 시나리오 구조 변경 (권장)

```
[Custom Webhook] → [Router] ─┬→ Route 1: 정상 데이터 → [Notion Create]
                             └→ Route 2: 비정상/기타 → (로깅 또는 무시)
```

- **Router**  
  - **Route 1**: “정상” 조건 통과 시에만 Notion Create 실행.  
  - **Route 2**: 그 외 모든 경우(이름 없음, 다른 양식 등) → Notion 호출 안 함 → **에러로 끊기지 않음.**

### 2-2. Route 1 조건 (Filter) 설정

Webhook 다음에 **Router** 추가 후, **Route 1**에만 아래 조건 사용.

- **조건 예시 (이름 필수)**  
  - Wix에서 이름이 오는 필드 ID가 `field:comp-mi5q29w3` 이라면:
  - `comp-mi5q29w3` 값이 **존재하고 비어 있지 않음**  
  - Make에서: `1. comp-mi5q29w3` (또는 웹훅 바디에서 이름이 들어오는 경로)가 **Is not equal to** `""`  
  - 또는 **Text exists / is not empty** 같은 조건.

- **다른 양식 걸러내기 (선택)**  
  - “상담신청서”만 받고 싶다면:  
  - Wix에서 폼 이름/ID를 보내주는 필드가 있다면 그 값으로 **Equals** “상담신청서” 등으로 한 번 더 제한.

실제 웹훅 페이로드 키 이름이 `field:comp-mi5q29w3`가 아니라 단순히 `comp-mi5q29w3`이면, 그 키 기준으로 조건 걸면 됨.

### 2-2-a. 기존 Filter 수정 (현재 "Set up a filter" 기준)

이미 **Label: 상담신청서 (취업/프리랜서)** 필터가 있다면, 아래 두 가지만 고치면 됨.

| 현재 설정 | 문제 | 수정 방법 |
|-----------|------|-----------|
| **조건 1**: `1. data: formName` **Equal to** `1. data: formName` | 자기 자신과 비교해서 **항상 참**. 다른 양식이 와도 통과함 | **세 번째 칸**을 변수 말고 **글자 그대로** 입력. **Text** 선택 후 `상담신청서 (취업/프리랜서)` 입력 |
| **이름(제목) 조건 없음** | 이름 없이 들어오면 Notion Create에서 실패 → 시나리오 끊김 | **Add AND rule** 로 조건 추가: `1.data.submissions[].field:comp-mi5q29w3` **Exists** (또는 **Is not equal to** `""`) |

**수정 후 권장 조건 3개:**

1. **formName**  
   - `1. data: formName` **Equal to** → 값: **Text** `상담신청서 (취업/프리랜서)` (따옴표 없이 그대로 입력)
2. **이름 존재**  
   - `1.data.submissions[].field:comp-mi5q29w3` **Exists** (또는 **Is not equal to** `""`)
3. **연락처** (기존 유지)  
   - `1.data.submissions[].field:comp-mi5q29wp1` **Exists**  
   - 더 엄격히 하려면 **Is not equal to** `""` 로 변경 (빈 문자열이면 제외)

**주의:** Wix 웹훅 구조가 `data.submissions[]` 배열이면, 실제 경로가 `1.data.submissions[0].field:comp-mi5q29w3` 처럼 인덱스가 들어갈 수 있음. Make에서 웹훅 실행 기록으로 받은 데이터 구조 확인 후, 위 경로가 안 먹히면 그 구조에 맞게 수정.

### 2-2-b. "막혀요" — 필터 통과가 안 될 때 (디버깅)

알려준 대로 세팅했는데 **정상 제출이 Notion까지 안 가고 막힌다**면, 아래 순서로 확인하세요.

#### 1단계: 웹훅 실제 데이터 확인

1. Make **시나리오** → **실행 기록(Execution history)** 에서 **최근 실행** 하나 클릭.
2. **모듈 1 (Custom Webhook)** 클릭 → **Output** 탭에서 **실제 JSON 구조** 확인.
3. 아래를 메모:
   - `formName` 이 정확히 어디에 있는지 (예: `data.formName` / `formName`)  
   - 실제 **formName 값** (공백, 괄호, 띄어쓰기까지 그대로)
   - `submissions` 구조: `data.submissions` 인지, `data.submissions[0]` 인지, 필드가 `field:comp-xxx` 인지 다른 키인지

#### 2단계: 조건 하나씩 완화해서 테스트

**A. formName만 남기고 테스트**

- Route 1 필터에서 **이름 Exists**, **연락처 Exists** 조건 **잠시 제거**.
- **formName Equal to** `상담신청서 (취업/프리랜서)` **만** 남기고 저장 후, 상담신청서 한 건 제출.
- **Notion에 들어오면** → formName은 맞는 것. 문제는 **이름/연락처 경로**.
- **여전히 안 들어오면** → formName 값이 실제와 다름. 1단계에서 적어둔 **실제 formName 문자열**을 필터 값에 **그대로** 넣기 (앞뒤 공백 포함).

**B. 이름/연락처 경로 수정**

- Make에서 배열은 보통 **첫 번째 항목**으로 쓸 때 `submissions[0]` 처럼 인덱스 필요.
- 필터에서 다음처럼 바꿔보기:
  - `1.data.submissions[].field:comp-mi5q29w3` → `1.data.submissions[0].field:comp-mi5q29w3`
  - 또는 Output에 `submissions` 대신 `fields` / 다른 키가 있으면 그 경로로 (예: `1.data.fields.comp-mi5q29w3`).
- **Exists** 가 계속 실패하면, 그 경로에 값이 있는지 **Notion 모듈** 쪽 매핑에서 같은 경로로 매핑해 보면서 “어디까지 나오는지” 확인.

#### 3단계: 임시로 필터 없이 돌리기 (빨리 풀고 싶을 때)

- **당장 리드는 받아야 한다**면: Route 1의 **필터 조건을 전부 제거** (또는 Filter 모듈 제거하고 Webhook → 바로 Notion).
- Notion 모듈에서 **이름** = `ifempty(1.실제이름경로; "미입력")` 처럼 **기본값**만 꼭 넣기.
- 이렇게 하면 다른 양식/이름 없음도 Notion에 들어가긴 하지만, **시나리오는 끊기지 않음**. 나중에 웹훅 구조 확인한 뒤 다시 필터 조건 추가하면 됨.

#### 자주 막히는 이유 정리

| 원인 | 확인 방법 | 수정 |
|------|-----------|------|
| formName 문자열 불일치 | Output에서 `data.formName` 값 복사 | 필터 값에 그대로 붙여넣기 (공백·괄호 포함) |
| submissions 경로 틀림 | Output에서 submissions / fields 구조 확인 | `submissions[0]` 또는 실제 키 경로로 수정 |
| Exists가 배열 경로에 안 먹힘 | 이름만 제거하고 테스트 | `submissions[0].field:comp-xxx` 처럼 인덱스 지정 |

### 2-3. Notion 모듈에서 기본값 처리 (이중 안전장치)

Router만으로는 부족할 수 있으니, **Notion Create a Database Item** 쪽에서도:

- **이름(Title)**  
  - 값: `ifempty(1.comp-mi5q29w3; "미입력")`  
  - 이름이 없어도 "미입력"으로 저장되어 Notion이 “필수 값 없음”으로 실패하지 않게 함.
- **그 외 필수로 설정된 Notion 속성**  
  - 가능하면 모두 `ifempty(1.필드; "")` 또는 `ifempty(1.필드; "미입력")` 형태로 매핑.

이렇게 하면 “가끔 이름이 비어 오는 정상 폼”은 Notion에 저장되고, “완전히 다른 양식”은 Router에서 Route 2로 빠져서 Notion만 안 타고 끝남.

### 2-4. 에러 핸들링 (선택)

- Notion 모듈 **에러 시**  
  - **Ignore** 또는 **Error handler**로 연결해서  
  - “한 번 실패해도 시나리오 비활성화되지 않게” 설정 (Make에서 시나리오 설정 또는 에러 라우트 확인).
- Route 2에서 **실패한 케이스 로깅**을 하고 싶다면:  
  - Google Sheet 한 행 추가, 또는 이메일 발송 등으로 “웹훅은 왔지만 Notion에 안 넣은 데이터”만 따로 남기면 나중에 수동 확인 가능.

---

## 3. 해결 2: 끊긴 시점 ~ 현재까지 리드 Notion 재연동 (한 번에 불러오기)

전제: **실제 리드는 전부 Wix 쪽에 있다.** Make 웹훅은 “그때 그때만” 받고 저장하지 않으므로, 재연동 소스는 **Wix**뿐이다.  
**한 사람씩 누적되지 않고, 과거~최근 데이터까지 한 번에** 불러오려면 아래 순서대로 하면 된다.

### 3-0. 한 번에 불러오기 흐름 (요약)

```
Wix 제출 내역 CSV 내보내기(전체 기간) → Google Sheet에 붙여넣기 → Make 일회성 시나리오 1회 실행 → Notion에 전부 생성
```

- Wix에서 **한 번에** CSV로 내보내고, 시트에 **전체 행** 붙여넣기.
- Make 시나리오는 **Google Sheets - Get Rows** (또는 Search Rows로 전체 범위) → **Iterator** → **Notion Create**.  
  **Run once** 한 번만 실행하면 시트의 **모든 행이 한 번에** 처리된다 (한 사람씩 누적 아님).

### 3-1. Wix에서 제출 데이터 내보내기

1. **Wix 대시보드** → **Forms** (또는 Contact Form / 상담신청서 관리 메뉴).
2. 해당 폼(상담신청서) 선택 → **제출 내역(Submissions)**.
3. **기간**: 끊긴 것으로 추정하는 날짜 ~ 오늘.
4. **내보내기(Export)** → CSV 다운로드.

(Old Wix Forms인 경우 메뉴 이름이 “Contact form submissions” 등으로 다를 수 있음. 가능한 “제출 내역 내보내기” 기능을 사용.)

### 3-2. Notion에 이미 있는 리드와 비교 (중복 방지)

- Notion **전체 신청 목록** DB에서 **제출일시** 기준으로 export (CSV 또는 Notion API).
- Wix CSV의 제출일시(또는 이름+연락처+제출일시)와 비교해서, **Notion에 없는 행만** 재연동 대상으로 둠.
- 엑셀/시트에서 `제출일시` + `연락처` 등으로 매칭하면 됨.

### 3-3. 재연동 방법 A: Google Sheet + Make 일회성 시나리오 (한 번에 불러오기, 권장)

1. **Google Sheet** 생성.
2. Wix에서 내보낸 CSV를 **전체** 열어서, Notion에 이미 있는 건 제외할 거면 제외한 뒤 **나머지 전부** 시트에 붙여넣기.  
   - 1행: 컬럼명 (이름, 연락처, 제출일시 등 — 아래 필드 매핑과 맞추기).  
   - 2행부터: 데이터 (한 사람당 한 행). **과거~최근까지 전부** 넣으면 한 번에 불러올 수 있음.
3. **Make**에서 **새 시나리오** 생성:
   - **모듈 1**: Google Sheets - **Get Rows** (또는 **Search Rows**).  
     - 스프레드시트·시트 선택 후, **범위**를 데이터가 있는 전체로 지정 (예: `A2:Z500` 또는 시트 전체).  
     - 이렇게 하면 **모든 행**이 한 번에 한 번들로 넘어감.
   - **모듈 2**: **Iterator** — 모듈 1의 배열 출력 연결 (Get Rows가 여러 행 반환하면 Iterator가 행마다 한 번씩 실행).
   - **모듈 3**: **Notion - Create a Database Item (Legacy)** — Iterator의 각 항목(행)을 Notion 속성에 매핑.
4. 시트 컬럼 → Notion 속성 매핑 (아래 4장 표와 기존 Wix_Make_Lead_Agent 문서와 동일하게).
5. 시나리오 **Run once** **한 번만** 실행.  
   - 실행 한 번에 시트의 **모든 행**이 순서대로 Notion에 생성됨 (한 사람씩 누적이 아니라 한 번에 처리).
6. Notion에서 건수·샘플 확인 후, 이 시나리오는 **비활성화**해 두면 됨 (평소에는 웹훅 시나리오만 사용).

이렇게 하면 “끊긴 시점 ~ 최근” 리드를 **한 번에** Notion에 채울 수 있음.

### 3-4. 재연동 방법 B: Wix API (새 폼만 해당 시 가능 시)

- Make의 **Wix** 커넥터에 **Form Submissions 목록 조회** 같은 모듈이 있고,  
  사용 중인 폼(Old Wix Forms)이 그 API를 지원하면:
  - 트리거: **수동 실행** 또는 **Schedule once**.
  - Wix에서 “특정 기간 제출 목록” 조회 → 각 제출에 대해 Notion에서 **같은 연락처/제출일시**로 검색 → 없으면 Create.
- **Old Wix Forms**는 Wix Form Submissions API 대상이 아닐 수 있어, 이 방법이 되지 않으면 **방법 A(시트 재연동)**를 쓰면 됨.

---

## 4. 필드 매핑 (재연동 시 참고)

Wix CSV 컬럼명이 다르면 시트에서 아래와 같이 매핑해서 Make에서 사용하면 됨.

| Notion 속성 | 타입 | Wix 필드 ID / CSV 컬럼 | 비고 |
|------------|------|------------------------|------|
| 이름 | Title | comp-mi5q29w3 | 없으면 "미입력" |
| 생년월일 | Text | comp-mi5q29wn1 | |
| 연락처 | Text | comp-mi5q29wp1 | |
| 지역 | Select | comp-mkgk7o90 | |
| 직업상태 | Select | comp-mi5q4cuc | |
| 희망시간 | Select | comp-mkgla33c | |
| 상담방식 | Select | comp-mi5q29x31 | |
| cg (캠페인) | Text | comp-mi5q29xg1 | |
| 제출일시 | Date | submissionTime | |

---

## 5. 체크리스트

### 자동화 끊김 방지

- [ ] Make 시나리오에 Webhook 다음 **Router** 추가.
- [ ] Route 1: 이름(또는 필수 필드) **존재·비어있지 않음** 조건.
- [ ] Route 2: 그 외 → Notion 호출 없이 종료.
- [ ] Notion Create에서 이름 = `ifempty(1.comp-mi5q29w3; "미입력")` 등 기본값 설정.
- [ ] Notion 모듈 에러 시 **Ignore/Error handler**로 시나리오 비활성화 방지.

### 끊긴 리드 재연동

- [ ] Wix에서 해당 기간 **제출 내역 CSV** 내보내기.
- [ ] Notion DB **동일 기간** export 후, 중복 제거할 목록 확인.
- [ ] Google Sheet에 “Notion에 없는 리드만” 붙여넣기.
- [ ] Make 일회성 시나리오(Sheet → Notion Create)로 재연동 실행.
- [ ] Notion에서 건수·샘플 확인 후 시나리오 비활성화.

---

## 6. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-02-12 | 자동화 끊김 방지 + 끊긴 리드 재연동 가이드 작성 |
