# 블로그 자동 포스팅 에이전트

## 시나리오 개요

| 항목 | 내용 |
|------|------|
| 목적 | 수집한 뉴스/콘텐츠를 자동으로 블로그에 포스팅 |
| 트리거 | 수동 실행 또는 스케줄 (예: 매일 오전 9시) |
| 출력 | 블로그 포스팅 생성 |

---

## 플랫폼별 자동화 가능 여부

| 플랫폼 | 자동 포스팅 가능 | 방법 | 비고 |
|--------|------------------|------|------|
| **네이버 블로그** | ✅ 가능 | 네이버 블로그 API 또는 웹훅 | API는 제한적, 웹훅/자동화 도구 사용 |
| **티스토리** | ✅ 가능 | 티스토리 Open API | Access Token 필요 |
| **브런치** | ❌ 제한적 | 공식 API 없음 | 웹 자동화 도구 필요 (제한적) |
| **워드프레스** | ✅ 가능 | WordPress REST API | 가장 자유롭게 가능 |
| **미디엄** | ✅ 가능 | Medium API | API 키 필요 |
| **벨로그** | ❌ 제한적 | 공식 API 없음 | 웹 자동화 도구 필요 |

---

## 네이버 블로그 자동 포스팅

### 방법 1: 네이버 블로그 API 사용 (제한적)

네이버 블로그 API는 공식적으로 제공되지만, Make.com에 네이버 블로그 모듈이 없을 수 있습니다.

**대안: HTTP 모듈로 직접 API 호출**

**플로우:**
```
[Notion 2] 또는 [RSS] → [Iterator] → [HTTP] → [네이버 블로그 API]
```

**HTTP 모듈 설정:**
- **URL:** `https://openapi.naver.com/blog/writePost.json`
- **Method:** `POST`
- **Headers:**
  - `X-Naver-Client-Id`: (네이버 개발자센터 Client ID)
  - `X-Naver-Client-Secret`: (네이버 개발자센터 Client Secret)
- **Body:**
  ```json
  {
    "title": "{{4.title}}",
    "contents": "{{4.description}}",
    "categoryNo": "0"
  }
  ```

**⚠️ 제한사항:**
- 네이버 블로그 API는 인증이 복잡함 (OAuth 2.0)
- Make.com에 네이버 블로그 전용 모듈이 없을 수 있음
- 웹훅이나 자동화 도구 사용 권장

---

### 방법 2: 웹훅/자동화 도구 사용 (추천)

**플로우:**
```
[Notion 2] 또는 [RSS] → [Iterator] → [HTTP] → [웹훅/자동화 서비스] → [네이버 블로그]
```

**예시:**
- Zapier, IFTTT 등 자동화 플랫폼 활용
- 또는 Make.com의 HTTP 모듈로 웹훅 호출

---

## 티스토리 자동 포스팅

### 티스토리 Open API 사용

**플로우:**
```
[Notion 2] 또는 [RSS] → [Iterator] → [HTTP] → [티스토리 API]
```

**설정:**

1. **티스토리 Access Token 발급:**
   - 티스토리 관리자 → 오픈 API 메뉴
   - App ID, Secret Key 발급
   - Access Token 발급

2. **HTTP 모듈 설정:**
   - **URL:** `https://www.tistory.com/apis/post/write`
   - **Method:** `POST`
   - **Query Parameters:**
     - `access_token`: (발급받은 Access Token)
     - `blogName`: (블로그 이름)
     - `title`: `{{4.title}}`
     - `content`: `{{4.description}}`
     - `visibility`: `3` (공개)

**참고:** Make.com에 티스토리 모듈이 있을 수도 있음. 모듈 검색에서 "Tistory" 확인.

---

## 워드프레스 자동 포스팅 (가장 추천) ⭐

워드프레스는 REST API가 잘 되어 있어서 자동화가 가장 쉽습니다. 네이버 키워드 수집 에이전트와 연동하여 수집한 내용을 자동으로 블로그에 포스팅할 수 있습니다.

---

### 시나리오 1: 수집과 동시에 포스팅 (기존 플로우 확장)

**플로우:**
```
[HTTP 1] 네이버 API 호출
    ↓
[Iterator 4] 뉴스 항목 배열 처리
    ↓
[Notion 2] DB에 저장
    ↓
[WordPress 6] 블로그 포스팅 생성 (신규 추가)
    ↓
[Tools 5] Text aggregator (이메일용)
    ↓
[Gmail 3] 이메일 발송
```

**모듈 추가 순서:**
1. 기존 플로우: `HTTP 1 → Iterator 4 → Notion 2 → Tools 5 → Gmail 3`
2. `Notion 2` 다음에 `WordPress 6` 모듈 추가
3. `WordPress 6`의 입력은 `Iterator 4`의 출력 사용

---

### 시나리오 2: Notion에 저장된 데이터를 읽어서 포스팅 (별도 시나리오)

**플로우:**
```
[Notion 1] Search Database Items (최근 수집된 항목)
    ↓
[Iterator 4] 각 항목 처리
    ↓
[Router 5] 중복 체크 (이미 포스팅된 항목 제외)
    ↓
[WordPress 6] Create a Post
    ↓
[Notion 2] Update Database Item (포스팅 완료 표시)
```

**장점:**
- 수집과 포스팅을 분리하여 관리 가능
- 이미 포스팅한 항목은 제외하고 신규 항목만 포스팅
- 포스팅 상태를 Notion에 기록하여 추적 가능

---

### 워드프레스 모듈 상세 설정

#### 방법 1: Make.com WordPress 모듈 사용 (추천) ⭐

---

#### 1단계: WordPress Connection 생성

**1-1. WordPress 모듈 추가:**
- Make.com 시나리오 편집 화면에서 `+` 버튼 클릭
- 모듈 검색창에 "WordPress" 입력
- "WordPress" 모듈 선택 → "Create a Post" 액션 선택

**1-2. Connection 설정 (처음 사용 시):**

| 설정 항목 | 입력 값 | 상세 설명 |
|-----------|---------|-----------|
| **Connection Name** | `My WordPress Blog` (임의 이름) | 나중에 구분하기 위한 이름 |
| **WordPress Site URL** | `https://your-site.com` | ⚠️ **주의:** 마지막 `/` 제외. 예: `https://example.com` (O), `https://example.com/` (X) |
| **Username** | 워드프레스 관리자 계정 사용자명 | WordPress 로그인 시 사용하는 사용자명 |
| **Application Password** | (Application Password) | ⚠️ **일반 비밀번호가 아닌 Application Password 필요!** |

**⚠️ Application Password 생성 방법 (단계별):**

1. **WordPress 관리자 페이지 접속**
   - `https://your-site.com/wp-admin` 접속
   - 관리자 계정으로 로그인

2. **프로필 페이지 이동**
   - 좌측 메뉴: **사용자** → **프로필** 클릭
   - 또는 URL 직접 입력: `https://your-site.com/wp-admin/profile.php`

3. **애플리케이션 비밀번호 섹션 찾기**
   - 페이지 하단으로 스크롤
   - "애플리케이션 비밀번호" 또는 "Application Passwords" 섹션 찾기
   - (WordPress 5.6 이상 버전에만 있음)

4. **새 비밀번호 생성**
   - "애플리케이션 이름" 입력: `Make.com` (또는 원하는 이름)
   - "새 애플리케이션 비밀번호 추가" 또는 "Add New Application Password" 버튼 클릭

5. **비밀번호 복사**
   - 생성된 비밀번호가 표시됨 (예: `xxxx xxxx xxxx xxxx`)
   - ⚠️ **이 비밀번호는 한 번만 표시되므로 즉시 복사!**
   - Make.com Connection 설정의 "Application Password" 필드에 붙여넣기
   - 공백 포함하여 그대로 입력 (예: `xxxx xxxx xxxx xxxx`)

6. **Connection 저장**
   - "Save" 또는 "저장" 버튼 클릭
   - Connection이 생성되면 다음 단계로 진행

**⚠️ Application Password가 보이지 않는 경우:**
- WordPress 버전이 5.6 미만일 수 있음 → WordPress 업데이트 필요
- 또는 플러그인으로 Application Password 기능 활성화 필요

---

#### 2단계: Create a Post 모듈 설정

**2-1. 모듈 배치 위치:**

기존 플로우에 WordPress 모듈을 추가하는 위치:
```
[HTTP 1] 네이버 API 호출
    ↓
[Iterator 4] 뉴스 항목 배열 처리
    ↓
[Notion 2] DB에 저장
    ↓
[WordPress 6] Create a Post ← 여기에 추가!
    ↓
[Tools 5] Text aggregator
    ↓
[Gmail 3] 이메일 발송
```

**⚠️ 중요:** WordPress 모듈은 **Iterator(4) 바로 다음** 또는 **Notion(2) 다음**에 배치해야 합니다. Iterator 밖에 있으면 첫 번째 항목만 처리됩니다.

**2-2. Create a Post 모듈 필드 설정:**

| 필드명 | 매핑 값 | 설명 및 주의사항 |
|--------|---------|------------------|
| **Title** | `{{4.title}}` | ⚠️ **반드시 Iterator(4)의 title 사용** - `1.Data.items[]: title`이 아닌 `4.title` |
| **Content** | HTML 템플릿 (아래 참고) | 포스팅 본문. HTML 형식 지원. Make.com 매퍼로 변수 삽입 |
| **Status** | `publish` | `publish` = 즉시 발행, `draft` = 초안 저장 |
| **Categories** | (선택) `["뉴스"]` | 카테고리 배열. WordPress에 존재하는 카테고리 이름 사용 |
| **Tags** | (선택) `["팀블로", "자동화"]` | 태그 배열. 쉼표로 구분된 문자열 또는 배열 |
| **Featured Image** | (선택) `{{4.image}}` | 대표 이미지 URL. Naver API의 경우 `image` 필드 확인 필요 |
| **Excerpt** | (선택) `{{4.description}}` | 요약문. 일부 테마에서 사용 |
| **Slug** | (선택) 자동 생성 | URL 슬러그. 비워두면 제목 기반으로 자동 생성 |

**⚠️ 필드 매핑 방법 (Make.com 매퍼 사용):**

1. **Title 필드:**
   - Title 필드를 클릭하여 매퍼 열기
   - 왼쪽 패널에서 `Iterator 4` → `title` 선택
   - 또는 직접 입력: `{{4.title}}`
   - ⚠️ **주의:** `1.Data.items[]: title`이 아닌 `4.title` 사용!

2. **Content 필드:**
   - Content 필드를 클릭하여 매퍼 열기
   - 왼쪽 패널에서 변수 선택하거나, HTML 템플릿을 직접 입력
   - HTML 템플릿 사용 시: 아래 "Content HTML 템플릿" 섹션 참고

3. **Categories 필드:**
   - Categories 필드를 클릭
   - 배열 형식으로 입력: `["뉴스", "IT"]`
   - 또는 WordPress에서 카테고리 ID 확인 후: `[1, 2]` (숫자 배열)

4. **Tags 필드:**
   - Tags 필드를 클릭
   - 배열 형식으로 입력: `["팀블로", "자동화"]`
   - 또는 쉼표로 구분된 문자열: `팀블로, 자동화`

---

#### 3단계: Content HTML 템플릿 작성

**3-1. 기본 템플릿 (Iterator 4 데이터 사용):**

Content 필드에 아래 HTML 템플릿을 입력하되, 변수는 Make.com 매퍼로 삽입:

```html
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #333;">{{4.title}}</h2>
<div style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
{{4.description}}
</div>
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="font-size: 14px; color: #666; margin-bottom: 8px;">
<strong>출처:</strong> <a href="{{4.link}}" target="_blank" style="color: #0066FF; text-decoration: none;">{{4.link}}</a>
</p>
<p style="font-size: 14px; color: #666;">
<strong>발행일:</strong> {{4.pubDate}}
</p>
</div>
</div>
```

**3-2. Notion 데이터 사용 시 (Notion 2 출력):**

Notion에 저장된 데이터를 사용하는 경우:

```html
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #333;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h2>
<div style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}
</div>
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="font-size: 14px; color: #666; margin-bottom: 8px;">
<strong>출처:</strong> <a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" target="_blank" style="color: #0066FF; text-decoration: none;">원문 보기</a>
</p>
<p style="font-size: 14px; color: #666;">
<strong>발행일:</strong> {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}
</p>
</div>
</div>
```

**3-3. HTML 템플릿 입력 방법:**

1. Content 필드를 클릭하여 매퍼 열기
2. 오른쪽 상단의 "텍스트 모드" 또는 "Text mode" 토글 활성화
3. 위 HTML 템플릿을 복사하여 붙여넣기
4. 변수 부분(`{{4.title}}` 등)은 Make.com 매퍼로 삽입:
   - 변수 부분을 클릭 → 왼쪽 패널에서 해당 모듈의 필드 선택
   - 또는 직접 입력: `{{4.title}}`

**⚠️ 주의사항:**
- HTML 템플릿 내의 변수는 Make.com 매퍼로 삽입해야 정상 작동합니다
- 직접 텍스트로 `{{4.title}}`을 입력해도 작동하지만, 매퍼로 삽입하는 것이 더 안전합니다

---

#### 4단계: 카테고리 및 태그 설정

**4-1. WordPress에서 카테고리 확인:**

1. WordPress 관리자 → **글** → **카테고리** 이동
2. 사용할 카테고리 이름 확인 (예: "뉴스", "IT")
3. 또는 카테고리 ID 확인 (URL에서 `tag_ID=1` 등)

**4-2. Categories 필드 설정:**

**방법 A: 카테고리 이름으로 설정 (추천)**
- Categories 필드에 배열 입력: `["뉴스", "IT"]`
- WordPress에 해당 카테고리가 없으면 자동 생성됨

**방법 B: 카테고리 ID로 설정**
- Categories 필드에 숫자 배열 입력: `[1, 2]`
- WordPress에서 카테고리 ID 확인 필요

**4-3. Tags 필드 설정:**

- Tags 필드에 배열 입력: `["팀블로", "자동화", "뉴스레터"]`
- 또는 동적으로 Iterator 데이터 사용:
  - Make.com 매퍼에서 배열 생성: `["팀블로", "{{4.category}}"]`

---

#### 5단계: 테스트 및 실행

**5-1. 단일 실행 테스트:**

1. Make.com 시나리오 편집 화면에서 **"Run once"** 또는 **"한 번 실행"** 클릭
2. 각 모듈의 실행 로그 확인:
   - HTTP(1): 네이버 API 호출 성공 여부 확인
   - Iterator(4): 배열 항목 수 확인 (예: 5개)
   - Notion(2): DB 항목 생성 확인
   - **WordPress(6): 포스팅 생성 확인** ← 여기 확인!
   - Gmail(3): 이메일 발송 확인

**5-2. WordPress 포스팅 확인:**

1. WordPress 관리자 → **글** → **모든 글** 이동
2. 새로 생성된 포스팅 확인:
   - 제목이 올바르게 표시되는지
   - 본문 내용이 HTML로 렌더링되는지
   - 카테고리/태그가 적용되었는지
   - 링크가 정상 작동하는지

**5-3. 에러 발생 시 확인 사항:**

| 에러 메시지 | 원인 | 해결 방법 |
|------------|------|-----------|
| `401 Unauthorized` | Application Password 오류 | WordPress 프로필에서 Application Password 재생성 |
| `403 Forbidden` | 사용자 권한 부족 | WordPress 사용자 권한 확인 (관리자 권한 필요) |
| `404 Not Found` | WordPress Site URL 오류 | URL에 마지막 `/` 제거 확인, `wp-json` 경로 접근 가능한지 확인 |
| `Title is required` | Title 필드 비어있음 | Title 필드에 `{{4.title}}` 매핑 확인 |
| 포스팅은 생성되지만 내용이 비어있음 | Content 필드 매핑 오류 | Content 필드에 HTML 템플릿 또는 `{{4.description}}` 확인 |

---

#### 6단계: 중복 포스팅 방지 (선택사항)

**6-1. Notion에 포스팅 상태 필드 추가:**

1. Notion DB에 "포스팅 완료" 체크박스 속성 추가
2. WordPress 포스팅 성공 후 Notion 항목 업데이트

**플로우:**
```
[HTTP 1] 네이버 API 호출
    ↓
[Iterator 4] 뉴스 항목 배열 처리
    ↓
[Notion Search] 원문링크로 중복 체크
    ↓
[Router] Route 1: 신규 / Route 2: 중복
    ↓ (Route 1만)
[Notion 2] Create Database Item
    ↓
[WordPress 6] Create a Post
    ↓
[Notion Update] Update Database Item (포스팅 완료 = 체크) ← 추가
    ↓
[Tools 5] Text aggregator
    ↓
[Gmail 3] 이메일 발송
```

**6-2. Router로 WordPress 중복 체크:**

WordPress에 이미 같은 제목의 포스팅이 있는지 확인:

**플로우:**
```
[Iterator 4]
    ↓
[HTTP 5] WordPress Search API 호출
    ↓
[Router 6] Route 1: 검색 결과 없음 (신규) / Route 2: 검색 결과 있음 (중복)
    ↓ (Route 1만)
[WordPress 7] Create a Post
```

**HTTP 5 모듈 설정:**
- **URL:** `https://your-site.com/wp-json/wp/v2/posts?search={{4.title}}`
- **Method:** `GET`
- **Authentication:** WordPress Connection 사용

**Router 6 설정:**
- **Route 1 조건:** `5.length = 0` (검색 결과 없음 = 신규)
- **Route 2 조건:** `5.length > 0` (검색 결과 있음 = 중복)

---

### 실전 예시: 완전한 설정 가이드

#### 예시 1: 기본 포스팅 (Iterator 4 데이터 사용)

**WordPress 6 모듈 설정:**

| 필드 | 설정 값 | 설명 |
|------|---------|------|
| **Connection** | `My WordPress Blog` | 위에서 생성한 Connection 선택 |
| **Title** | `{{4.title}}` | 네이버 API에서 가져온 제목 |
| **Content** | 아래 HTML 템플릿 사용 | - |
| **Status** | `publish` | 즉시 발행 |
| **Categories** | `["뉴스"]` | 고정 카테고리 |
| **Tags** | `["팀블로", "자동화"]` | 고정 태그 |

**Content HTML 템플릿:**
```html
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #333;">{{4.title}}</h2>
<div style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
{{4.description}}
</div>
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="font-size: 14px; color: #666; margin-bottom: 8px;">
<strong>출처:</strong> <a href="{{4.link}}" target="_blank" style="color: #0066FF; text-decoration: none;">원문 보기</a>
</p>
<p style="font-size: 14px; color: #666;">
<strong>발행일:</strong> {{4.pubDate}}
</p>
</div>
</div>
```

---

#### 예시 2: Notion 데이터 사용 + 동적 카테고리/태그

**WordPress 6 모듈 설정:**

| 필드 | 설정 값 | 설명 |
|------|---------|------|
| **Title** | `{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}` | Notion 제목 속성 |
| **Content** | 아래 HTML 템플릿 사용 | - |
| **Status** | `draft` | 초안으로 저장 (수동 검토 후 발행) |
| **Categories** | `["뉴스", "{{2.properties_value.`카테고리`[].plain_text}}"]` | Notion 카테고리 속성 동적 사용 |
| **Tags** | `["팀블로", "자동화", "{{2.properties_value.`키워드`[].plain_text}}"]` | Notion 키워드 속성 동적 사용 |

**Content HTML 템플릿:**
```html
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #333;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h2>
<div style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}
</div>
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="font-size: 14px; color: #666; margin-bottom: 8px;">
<strong>출처:</strong> <a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" target="_blank" style="color: #0066FF; text-decoration: none;">원문 보기</a>
</p>
<p style="font-size: 14px; color: #666;">
<strong>발행일:</strong> {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}
</p>
</div>
</div>
```

---

#### 예시 3: 이미지 포함 포스팅

**WordPress 6 모듈 설정:**

| 필드 | 설정 값 | 설명 |
|------|---------|------|
| **Title** | `{{4.title}}` | - |
| **Content** | 아래 HTML 템플릿 사용 (이미지 포함) | - |
| **Featured Image** | `{{4.image}}` | 대표 이미지 (Naver API의 경우 `image` 필드 확인) |
| **Status** | `publish` | - |

**Content HTML 템플릿 (이미지 포함):**
```html
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
{{ifempty(4.image; ""; "<img src=\"{{4.image}}\" alt=\"{{4.title}}\" style=\"width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin-bottom: 20px;\" />")}}
<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #333;">{{4.title}}</h2>
<div style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
{{4.description}}
</div>
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="font-size: 14px; color: #666; margin-bottom: 8px;">
<strong>출처:</strong> <a href="{{4.link}}" target="_blank" style="color: #0066FF; text-decoration: none;">원문 보기</a>
</p>
<p style="font-size: 14px; color: #666;">
<strong>발행일:</strong> {{4.pubDate}}
</p>
</div>
</div>
```

**⚠️ 이미지 URL 확인 방법:**
- Naver API 응답에서 `image` 필드 확인
- Iterator(4) 모듈 실행 로그에서 `image` 필드 값 확인
- 이미지가 없는 경우 `ifempty` 함수로 처리

---

### 고급 설정 옵션

#### 1. 커스텀 필드 추가

WordPress 커스텀 필드를 사용하는 경우:

**WordPress 6 모듈 Advanced Settings:**
- **Custom Fields** 섹션에서 추가
- 예: `원문링크` = `{{4.link}}`

#### 2. 포스팅 날짜 설정

**Published Date 필드:**
- `{{4.pubDate}}` 또는 `{{formatDate(4.pubDate; "YYYY-MM-DDTHH:mm:ss")}}`
- Naver API의 `pubDate` 형식에 따라 조정 필요

#### 3. SEO 설정 (Yoast SEO 플러그인 사용 시)

Yoast SEO 플러그인을 사용하는 경우, 커스텀 필드로 설정:

| 커스텀 필드 이름 | 값 | 설명 |
|----------------|-----|------|
| `_yoast_wpseo_title` | `{{4.title}}` | SEO 제목 |
| `_yoast_wpseo_metadesc` | `{{4.description}}` | 메타 설명 |
| `_yoast_wpseo_focuskw` | `팀블로` | 포커스 키워드 |

#### 4. 다국어 설정 (WPML 플러그인 사용 시)

WPML 플러그인을 사용하는 경우:

- **Language** 필드: `ko` (한국어) 또는 `en` (영어)
- 또는 WPML 커스텀 필드 사용

---

### 트러블슈팅 상세 가이드

#### 문제 1: "401 Unauthorized" 에러

**증상:**
- WordPress 모듈 실행 시 `401 Unauthorized` 에러 발생
- 포스팅이 생성되지 않음

**원인:**
- Application Password가 잘못되었거나 만료됨
- WordPress Site URL이 잘못됨
- 사용자 권한 부족

**해결 방법:**

1. **Application Password 재생성:**
   - WordPress 관리자 → 사용자 → 프로필
   - 기존 Application Password 삭제
   - 새 Application Password 생성
   - Make.com Connection 설정에서 새 비밀번호 입력

2. **WordPress Site URL 확인:**
   - URL에 마지막 `/` 제거 확인
   - 예: `https://example.com` (O), `https://example.com/` (X)
   - `https://example.com/wp-json/wp/v2/posts` 접근 가능한지 브라우저에서 확인

3. **사용자 권한 확인:**
   - WordPress 사용자 권한이 "관리자"인지 확인
   - "편집자" 권한으로는 포스팅 생성 가능하지만 일부 제한 있을 수 있음

---

#### 문제 2: 포스팅은 생성되지만 내용이 비어있음

**증상:**
- WordPress에 포스팅은 생성되지만 제목만 있고 본문이 비어있음
- 또는 HTML 코드가 그대로 텍스트로 표시됨

**원인:**
- Content 필드 매핑 오류
- HTML 템플릿의 변수가 제대로 삽입되지 않음
- WordPress가 HTML을 이스케이프 처리함

**해결 방법:**

1. **Content 필드 확인:**
   - WordPress 6 모듈의 Content 필드 클릭
   - 매퍼에서 변수가 올바르게 매핑되었는지 확인
   - 예: `{{4.description}}` 또는 HTML 템플릿

2. **HTML 템플릿 변수 확인:**
   - HTML 템플릿 내의 변수(`{{4.title}}` 등)가 Make.com 매퍼로 삽입되었는지 확인
   - 직접 텍스트로 입력한 경우 매퍼로 다시 삽입

3. **WordPress 설정 확인:**
   - WordPress 관리자 → 설정 → 글쓰기
   - "시각 편집기 사용" 옵션 확인
   - 또는 WordPress 테마가 HTML을 지원하는지 확인

---

#### 문제 3: 카테고리/태그가 적용되지 않음

**증상:**
- 포스팅은 생성되지만 카테고리나 태그가 적용되지 않음

**원인:**
- 카테고리/태그 이름 오타
- 카테고리 ID 오류
- 배열 형식 오류

**해결 방법:**

1. **카테고리 이름 확인:**
   - WordPress 관리자 → 글 → 카테고리
   - 정확한 카테고리 이름 확인 (대소문자, 공백 주의)
   - Categories 필드에 정확한 이름 입력: `["뉴스"]`

2. **배열 형식 확인:**
   - 올바른 형식: `["뉴스", "IT"]` (문자열 배열)
   - 잘못된 형식: `뉴스, IT` (문자열), `[뉴스, IT]` (따옴표 없음)

3. **카테고리 ID 사용:**
   - 카테고리 이름 대신 ID 사용: `[1, 2]` (숫자 배열)
   - WordPress에서 카테고리 ID 확인 방법:
     - 카테고리 목록에서 카테고리 이름에 마우스 오버
     - 브라우저 하단 URL에서 `tag_ID=1` 확인

---

#### 문제 4: 이미지가 표시되지 않음

**증상:**
- Featured Image 또는 Content 내 이미지가 표시되지 않음
- 이미지 URL은 있지만 WordPress에서 로드되지 않음

**원인:**
- 이미지 URL이 상대 경로이거나 접근 불가
- 외부 이미지 URL이 WordPress에서 차단됨
- 이미지 URL 형식 오류

**해결 방법:**

1. **이미지 URL 확인:**
   - Iterator(4) 모듈 실행 로그에서 `image` 필드 값 확인
   - 절대 URL인지 확인 (예: `https://example.com/image.jpg`)
   - 브라우저에서 이미지 URL 직접 접근하여 확인

2. **이미지를 WordPress 미디어 라이브러리에 업로드:**
   - HTTP 모듈로 이미지 다운로드
   - WordPress Upload Media API로 업로드
   - 업로드된 이미지 URL을 Featured Image에 사용

3. **외부 이미지 허용:**
   - WordPress 설정에서 외부 이미지 허용 확인
   - 또는 플러그인으로 외부 이미지 허용 설정

---

#### 문제 5: 포스팅이 여러 개 생성됨 (중복)

**증상:**
- 같은 뉴스 항목이 여러 번 포스팅됨
- Iterator가 각 항목마다 포스팅을 생성하지만 중복 체크가 안 됨

**원인:**
- 중복 방지 로직 없음
- WordPress 중복 체크 없음

**해결 방법:**

1. **Notion에 포스팅 상태 필드 추가 (추천):**
   - Notion DB에 "포스팅 완료" 체크박스 속성 추가
   - WordPress 포스팅 성공 후 Notion 항목 업데이트
   - 다음 실행 시 "포스팅 완료"가 체크되지 않은 항목만 포스팅

2. **Router로 WordPress 중복 체크:**
   - 위 "6-2. Router로 WordPress 중복 체크" 섹션 참고

3. **WordPress 제목 중복 체크:**
   - WordPress Search API로 제목 검색
   - 검색 결과가 있으면 포스팅 건너뛰기

---

### 최종 체크리스트

WordPress 자동 포스팅 설정 완료 후 확인 사항:

- [ ] WordPress Connection 생성 완료 (Application Password 확인)
- [ ] WordPress 6 모듈이 Iterator(4) 다음에 배치됨
- [ ] Title 필드에 `{{4.title}}` 매핑됨
- [ ] Content 필드에 HTML 템플릿 또는 `{{4.description}}` 매핑됨
- [ ] Status 필드 설정 (`publish` 또는 `draft`)
- [ ] Categories/Tags 필드 설정 (선택사항)
- [ ] 테스트 실행 성공 확인
- [ ] WordPress에서 포스팅 생성 확인
- [ ] 중복 방지 로직 설정 (선택사항)

---

### 참고 자료

- [WordPress REST API 문서](https://developer.wordpress.org/rest-api/)
- [Make.com WordPress 모듈 문서](https://www.make.com/en/help/app/wordpress)
- [Application Passwords 가이드](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/)

**3. Content 필드 HTML 템플릿 예시:**

**기본 템플릿 (Iterator 4 데이터 사용):**
```html
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">{{4.title}}</h2>
<p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">{{4.description}}</p>
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="font-size: 14px; color: #666;">출처: <a href="{{4.link}}" target="_blank">{{4.link}}</a></p>
<p style="font-size: 14px; color: #666;">발행일: {{4.pubDate}}</p>
</div>
</div>
```

**Notion 데이터 사용 시 (Notion 2 출력):**
```html
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h2>
<div style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}
</div>
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="font-size: 14px; color: #666;">출처: <a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" target="_blank">원문 보기</a></p>
<p style="font-size: 14px; color: #666;">발행일: {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</p>
</div>
</div>
```

---

#### 방법 2: HTTP 모듈로 WordPress REST API 직접 호출

Make.com에 WordPress 모듈이 없거나 더 세밀한 제어가 필요한 경우 사용.

**플로우:**
```
[Iterator 4] 또는 [Notion 2]
    ↓
[HTTP 6] WordPress REST API 호출
```

**HTTP 모듈 설정:**

| 설정 | 값 |
|------|-----|
| **URL** | `https://your-site.com/wp-json/wp/v2/posts` |
| **Method** | `POST` |
| **Authentication** | Basic Auth 또는 Bearer Token |

**Headers:**
- **Basic Auth 사용 시:**
  - `Authorization`: `Basic base64(username:application_password)`
  - 또는 Make.com의 Basic Auth 옵션 사용

- **Bearer Token 사용 시:**
  - `Authorization`: `Bearer YOUR_TOKEN`

**Body (JSON):**
```json
{
  "title": "{{4.title}}",
  "content": "{{4.description}}",
  "status": "publish",
  "categories": [1, 2],
  "tags": [3, 4]
}
```

**Body (Form Data):**
```
title={{4.title}}
content={{4.description}}
status=publish
```

---

### 중복 포스팅 방지 방법

**방법 1: Notion에 포스팅 상태 필드 추가**

1. Notion DB에 "포스팅 완료" 체크박스 속성 추가
2. WordPress 포스팅 성공 후 Notion 항목 업데이트
3. 다음 실행 시 "포스팅 완료"가 체크되지 않은 항목만 포스팅

**플로우:**
```
[Notion 1] Search Database Items (포스팅 완료 = 체크 안됨)
    ↓
[Iterator 4]
    ↓
[WordPress 6] Create a Post
    ↓
[Notion 2] Update Database Item (포스팅 완료 = 체크)
```

**방법 2: Router로 중복 체크**

WordPress에 이미 포스팅된 제목/링크가 있는지 확인 후 신규만 포스팅.

**플로우:**
```
[Iterator 4]
    ↓
[HTTP 5] WordPress Search API (제목으로 검색)
    ↓
[Router 6] Route 1: 검색 결과 없음 (신규) / Route 2: 검색 결과 있음 (중복)
    ↓ (Route 1만)
[WordPress 7] Create a Post
```

---

### 워드프레스 포스팅 플로우 예시 (기존 수집 에이전트 확장)

**전체 플로우:**
```
[HTTP 1] 네이버 뉴스 API 호출
    ↓
[Iterator 4] 뉴스 항목 배열 처리 (Map: ON, Array: 1.data.items[])
    ↓
[Notion Search] 원문링크로 중복 체크
    ↓
[Router] Route 1: 신규 / Route 2: 중복
    ↓ (Route 1만)
[Notion 2] Create Database Item
    ↓
[WordPress 6] Create a Post (신규 추가)
    ↓
[Tools 5] Text aggregator (이메일용)
    ↓
[Gmail 3] Send an Email
```

**WordPress 6 모듈 설정:**
- **Title:** `{{4.title}}`
- **Content:** HTML 템플릿 (위 참고)
- **Status:** `publish` 또는 `draft`
- **Categories:** (선택) `["뉴스"]`
- **Tags:** (선택) `["팀블로", "자동화"]`

---

### 트러블슈팅 (워드프레스)

| 문제 | 원인 | 해결 |
|------|------|------|
| **인증 실패 (401 Unauthorized)** | Application Password 미사용 또는 잘못됨 | WordPress 프로필에서 Application Password 재생성 |
| **포스팅이 생성되지 않음** | 권한 부족 또는 필수 필드 누락 | WordPress 사용자 권한 확인 (관리자 권한 필요), Title 필드 필수 확인 |
| **HTML이 그대로 보임** | Content 필드가 텍스트로 인식됨 | WordPress 모듈의 Content 필드에 HTML 직접 입력 (자동 처리됨) |
| **이미지가 안 보임** | 이미지 URL이 상대 경로이거나 접근 불가 | 절대 URL 사용, 또는 이미지를 WordPress 미디어 라이브러리에 업로드 후 사용 |
| **카테고리/태그가 적용 안 됨** | 카테고리 ID 또는 이름 오류 | WordPress에서 카테고리/태그 ID 확인, 또는 이름으로 직접 입력 |

---

### 장점

- ✅ Make.com에 WordPress 모듈이 있어 설정이 간단함
- ✅ REST API가 잘 되어 있어 다양한 커스터마이징 가능
- ✅ HTML 형식의 콘텐츠 지원
- ✅ 카테고리, 태그, 이미지 등 메타데이터 설정 가능
- ✅ 초안 저장 후 수동 검토 후 발행 가능 (`draft` 상태)

---

## 일반적인 블로그 자동 포스팅 플로우

**기본 구조:**
```
[데이터 소스] → [Iterator] → [블로그 API/모듈] → [포스팅 생성]
```

**데이터 소스 옵션:**
- Notion DB (이미 수집한 뉴스/콘텐츠)
- RSS 피드
- Google Sheets
- 데이터베이스

**예시 플로우 (Notion → 블로그):**
```
[Notion - Search Database Items] → [Iterator] → [WordPress/Tistory/HTTP] → [포스팅 생성]
```

---

## 트러블슈팅

| 문제 | 원인 | 해결 |
|------|------|------|
| 블로그 API 인증 실패 | Access Token 만료 또는 잘못됨 | 토큰 재발급 및 갱신 |
| 포스팅이 생성되지 않음 | API 권한 부족 또는 필수 필드 누락 | 블로그 API 권한 확인, 필수 필드(title, content 등) 확인 |
| HTML이 그대로 보임 | Content 필드에 HTML이 아닌 텍스트로 들어감 | Content 필드를 HTML 형식으로 변환하거나, 블로그 API의 HTML 지원 옵션 확인 |

---

## 권장 방법

1. **워드프레스 사용 시:** Make.com WordPress 모듈 사용 (가장 간단)
2. **티스토리 사용 시:** HTTP 모듈로 티스토리 API 직접 호출
3. **네이버 블로그 사용 시:** 웹훅/자동화 도구 활용 또는 HTTP 모듈로 API 호출 (복잡함)

---

## 참고

- 각 플랫폼의 API 문서 확인 필요
- API 키/토큰 발급 및 권한 설정 필요
- 일부 플랫폼은 자동 포스팅을 제한할 수 있음 (이용약관 확인)
- 
# 워드프레스 자동 포스팅 방법 비교 가이드

## 개요

Make.com을 활용한 워드프레스 자동 포스팅 방법과 AI 초안 + 수동 작성 방법을 비교 분석한 가이드입니다.

---

## Make.com 플랫폼 특성

### 기본 정보
- **플랫폼 유형**: No-code 자동화 플랫폼
- **주요 사용자**: 시니어 마케터, 비전공자
- **복잡도**: 설정 단계가 일부 복잡할 수 있음

### 실제 마케터 사용 패턴

1. **간단한 템플릿 사용** (가장 일반적)
   - 복잡한 HTML 템플릿 대신 기본 필드만 사용
   - Title, Content만 매핑하고 나머지는 WordPress 기본 스타일 사용

2. **초안(draft)으로 저장 후 수동 검토**
   - 자동으로 `draft` 상태로 저장
   - 수동으로 검토 후 발행 (SEO, 톤앤매너 확인)

3. **템플릿 플러그인 활용**
   - WordPress에서 미리 만든 템플릿 사용
   - Make.com에서는 제목/내용만 전달

4. **단계별 학습**
   - 처음엔 간단하게 시작 (Title + Content만)
   - 점진적으로 HTML, 카테고리, 태그 추가

### 복잡도 평가
- **제가 설명한 방법의 복잡도**: ⭐⭐⭐⭐ (4/5) - 중급~고급 수준
- **필요한 기술**:
  - Application Password 생성
  - HTML 템플릿 작성
  - 변수 매핑
  - Iterator 설정

---

## 비전공자/마케터를 위한 단계별 방법

### 1. 초보자용: 최소 설정으로 시작하기

**목표**: 복잡한 HTML 없이 기본 포스팅만 자동화

**WordPress 모듈 최소 설정:**

| 필드 | 설정 값 | 설명 |
|------|---------|------|
| **Title** | `{{4.title}}` | 제목만 매핑 |
| **Content** | `{{4.description}}` | 본문만 매핑 (HTML 없이) |
| **Status** | `draft` | ⚠️ **초안으로 저장** (수동 검토 후 발행) |

**장점:**
- ✅ 설정이 매우 간단함 (3개 필드만)
- ✅ HTML 지식 불필요
- ✅ WordPress 기본 스타일 사용
- ✅ 초안으로 저장되어 수동 검토 가능

**단점:**
- ❌ 스타일링이 WordPress 기본값에 의존
- ❌ 출처 링크, 날짜 등 추가 정보는 수동 입력 필요

---

### 2. 중급자용: 기본 HTML 템플릿 사용

**목표**: 출처 링크와 날짜를 포함한 기본 포스팅

**WordPress 모듈 설정:**

| 필드 | 설정 값 |
|------|---------|
| **Title** | `{{4.title}}` |
| **Content** | 아래 간단한 HTML 템플릿 사용 |
| **Status** | `draft` (또는 `publish`) |

**간단한 HTML 템플릿:**
```html
<p>{{4.description}}</p>
<p><strong>출처:</strong> <a href="{{4.link}}">원문 보기</a></p>
<p><strong>발행일:</strong> {{4.pubDate}}</p>
```

**특징:**
- 복잡한 스타일링 없음
- 기본 HTML 태그만 사용 (`<p>`, `<a>`, `<strong>`)
- WordPress가 자동으로 스타일 적용

---

### 3. 고급자용: 상세한 HTML 템플릿

- Pretendard 폰트
- 커스텀 스타일링
- 카드형 레이아웃
- 등등...

**→ 상세한 설정은 별도 문서 참고**

---

## 방법 비교: Make.com 자동화 vs AI 초안 + 수동 작성

### 비교표

| 비교 항목 | Make.com 자동화 | AI 초안 + 수동 작성 |
|-----------|----------------|-------------------|
| **초기 설정 시간** | ⏱️ 2-4시간 (복잡) | ⏱️ 5분 (간단) |
| **매번 작업 시간** | ✅ 0분 (완전 자동) | ⏱️ 10-20분/건 (AI 초안 작성 + 편집) |
| **품질 관리** | ⚠️ 제한적 (템플릿 의존) | ✅ 높음 (수동 검토/편집 가능) |
| **유연성** | ⚠️ 낮음 (템플릿 고정) | ✅ 높음 (매번 커스터마이징) |
| **SEO 최적화** | ⚠️ 템플릿 기반 | ✅ 매번 최적화 가능 |
| **에러 대응** | ⚠️ 기술적 해결 필요 | ✅ 즉시 수정 가능 |
| **비용** | 💰 Make.com 구독료 | 💰 AI 구독료 (ChatGPT Plus 등) |
| **학습 곡선** | 📈 가파름 (기술 지식 필요) | 📈 완만함 (누구나 가능) |
| **대량 처리** | ✅ 매우 효율적 (100건도 자동) | ❌ 비효율적 (건당 시간 소요) |
| **일관성** | ✅ 높음 (동일 템플릿) | ⚠️ 낮음 (작성자에 따라 다름) |

---

## 상황별 추천 방법

### ✅ Make.com 자동화가 더 편한 경우

1. **대량 포스팅이 필요한 경우**
   - 예: 매일 10건 이상 포스팅
   - 예: 뉴스레터 수집 → 블로그 포스팅 (반복 작업)

2. **일관된 형식이 중요한 경우**
   - 예: 뉴스 요약 블로그 (형식 통일 필요)
   - 예: 제품 소개 포스팅 (템플릿 활용)

3. **시간이 부족한 경우**
   - 예: 마케터 1인이 여러 채널 관리
   - 예: 반복 작업 자동화로 다른 업무에 집중

4. **기술에 익숙한 경우**
   - 예: Make.com 사용 경험 있음
   - 예: HTML/API 기본 지식 있음

**예상 시간 절약:**
- 매일 10건 포스팅 시: **2시간/일 → 0분/일** (자동화 후)
- 월간: **40시간 → 0시간** (초기 설정 4시간 투자)

---

### ✅ AI 초안 + 수동 작성이 더 편한 경우

1. **품질이 최우선인 경우**
   - 예: 브랜드 블로그 (톤앤매너 중요)
   - 예: 전문 콘텐츠 (정확성/깊이 중요)

2. **포스팅 빈도가 낮은 경우**
   - 예: 주 1-2회 포스팅
   - 예: 이벤트성 포스팅 (비정기)

3. **매번 다른 형식이 필요한 경우**
   - 예: 케이스 스터디 (형식 다양)
   - 예: 인터뷰 기사 (구조가 매번 다름)

4. **비전공자/초보자인 경우**
   - 예: Make.com 경험 없음
   - 예: 기술 설정이 부담스러움

**예상 작업 시간:**
- 1건당: **10-20분** (AI 초안 5분 + 편집 5-15분)
- 주 5건: **50-100분/주** (약 1-2시간)

---

## 하이브리드 방법 (추천!)

### 방법 1: Make.com으로 초안 자동 생성 → AI로 개선

**플로우:**
```
[Make.com] 자동 포스팅 생성 (Status: draft)
    ↓
[WordPress] 초안 확인
    ↓
[ChatGPT/Claude] 초안을 AI에게 보내서 개선 요청
    - "이 포스팅을 더 읽기 쉽게 만들어줘"
    - "SEO를 최적화해줘"
    - "브랜드 톤앤매너에 맞게 수정해줘"
    ↓
[WordPress] 수정된 내용으로 발행
```

**장점:**
- ✅ 자동화의 효율성 + 품질 관리 가능
- ✅ 초안은 자동, 개선은 선택적
- ✅ 시간 절약 + 품질 보장

---

### 방법 2: AI 초안 → Make.com으로 자동 포스팅

**플로우:**
```
[ChatGPT/Claude] 뉴스 기사 요약 + 블로그 포스팅 초안 생성
    ↓
[Make.com] ChatGPT API 호출 → WordPress 자동 포스팅
```

**장점:**
- ✅ AI의 창의성 + 자동화의 편의성
- ✅ 매번 다른 스타일 가능
- ✅ 기술 설정은 한 번만

**단점:**
- ⚠️ ChatGPT API 비용 추가
- ⚠️ 초기 설정 복잡

---

## 실제 사용 사례별 추천

| 사용 사례 | 추천 방법 | 이유 |
|-----------|----------|------|
| **뉴스 요약 블로그** (매일 10건) | Make.com 자동화 | 대량 + 일관된 형식 |
| **브랜드 블로그** (주 2회) | AI 초안 + 수동 | 품질 > 속도 |
| **제품 소개** (템플릿 기반) | Make.com 자동화 | 형식 통일 필요 |
| **케이스 스터디** (형식 다양) | AI 초안 + 수동 | 유연성 필요 |
| **개인 블로그** (비정기) | AI 초안 + 수동 | 간단함 > 자동화 |
| **기업 블로그** (팀 운영) | 하이브리드 | 효율 + 품질 모두 |

---

## 결론 및 실용적인 추천

### 비전공자/마케터 관점에서

1. **처음 시작할 때:**
   - ✅ **AI 초안 + 수동 작성**으로 시작
   - 이유: 학습 곡선이 완만하고, 품질 관리가 쉬움

2. **포스팅이 늘어나면:**
   - ✅ **Make.com 자동화**로 전환
   - 이유: 시간 절약 효과가 큼

3. **최종 목표:**
   - ✅ **하이브리드 방법** (Make.com 초안 + AI 개선)
   - 이유: 효율성과 품질의 균형

### 실용적인 조언

- 포스팅이 **주 5건 이상**이면 → Make.com 자동화 고려
- 포스팅이 **주 2건 이하**면 → AI 초안 + 수동 작성이 더 간단
- **품질이 최우선**이면 → 항상 수동 검토/편집 포함

### 핵심 요약

**Make.com 자동화:**
- 대량 포스팅 (매일 10건 이상)
- 일관된 형식이 중요할 때
- 시간이 부족할 때
- 기술에 익숙할 때

**AI 초안 + 수동 작성:**
- 품질이 최우선일 때
- 포스팅 빈도가 낮을 때 (주 1-2회)
- 매번 다른 형식이 필요할 때
- 비전공자/초보자일 때

**하이브리드 방법:**
- Make.com으로 초안 자동 생성 → AI로 개선
- AI 초안 → Make.com으로 자동 포스팅

---

## 참고

- Make.com은 시니어 마케터와 비전공자도 많이 사용하는 no-code 플랫폼입니다
- 하지만 초기 설정이 복잡할 수 있으므로, 처음엔 간단한 방법으로 시작하는 것을 권장합니다
- 상황에 맞는 방법을 선택하세요!





