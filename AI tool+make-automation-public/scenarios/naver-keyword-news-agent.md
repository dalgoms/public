# 네이버 키워드 기반 언론보도 수집 에이전트

## 시나리오 개요

| 항목 | 내용 |
|------|------|
| 목적 | 네이버 뉴스 API로 키워드(팀블로) 관련 기사 수집 → Notion DB 저장 + 이메일 발송 |
| 트리거 | 수동 실행 또는 스케줄 (설정에 따름) |
| 출력 | Notion DB 항목 생성, Gmail (HTML 이메일) |

---

## 모듈 구성 (플로우)

```
[HTTP 1] Make a request
    ↓  (1)
[Iterator 4]  ← Array: 1.data.items[]
    ↓  (5)
[Notion 2] Create a Database Item (Legacy)
    ↓
[Tools 5] Text aggregator
    ↓  (1)
[Gmail 3] Send an email
```

- 괄호 안 숫자: 실행 시 처리된 번들 수 예시 (1 → 1 → 5 → 1).

---

## 모듈 상세 설정

### 1. HTTP 모듈 (1번)

네이버 뉴스 검색 API 호출.

| 설정 | 값 |
|------|-----|
| **URL** | `https://openapi.naver.com/v1/search/news.json?query=팀블로&display=5&sort=date` |
| **Method** | `GET` |
| **Authentication** | No authentication (API 키는 Header로 전달) |

**Query 파라미터 (URL에 포함):**

| 파라미터 | 값 | 설명 |
|----------|-----|------|
| `query` | `팀블로` | 검색 키워드 |
| `display` | `5` | 조회할 기사 수 |
| `sort` | `date` | 날짜순 정렬 |

**Headers (필수):**

| Name | 값 | 비고 |
|------|-----|------|
| `X-Naver-Client-Id` | (네이버 개발자센터에서 발급한 Client ID) | 필수 |
| `X-Naver-Client-Secret` | (네이버 개발자센터에서 발급한 Client Secret) | 필수 |

- API 키 발급: [네이버 개발자센터](https://developers.naver.com/) → Application 등록 후 Client ID / Client Secret 사용.

---

### 2. Iterator 모듈 (4번) – Flow Control

HTTP 응답의 뉴스 항목 배열을 한 건씩 처리.

| 설정 | 값 |
|------|-----|
| **Array** | `1. data: items[]` |
| **Map** | ON |

- HTTP(1) 응답의 `data.items[]` 배열을 순회하며, 각 항목마다 Notion(2) → Tools(5)가 순서대로 실행됩니다.

---

### 3. Notion 모듈 (2번)

각 뉴스 항목을 Notion DB에 한 행으로 저장.

| 설정 | 값 |
|------|-----|
| **Connection** | (Notion 연결 선택) |
| **Database ID** | `3019d51b336180638c49e7dab1d60826` |

**Fields (속성 매핑):**

| Notion 속성 | 매핑 값 | 비고 |
|-------------|---------|------|
| **제목** * | `4.title` | Iterator(4)의 title |
| **원문링크** | `4.link` | Iterator(4)의 link |
| **카테고리** | `네이버 (팀벨관련 키워드)` | 고정값 |

- DB ID는 사용 중인 Notion DB의 실제 ID로 맞춰 주세요.

---

### 4. Text Aggregator 모듈 (5번)

Iterator(4)에서 나온 항목들을 하나의 HTML 텍스트로 합침. Gmail 본문에 사용.

| 설정 | 값 |
|------|-----|
| **Source Module** | Iterator [4] (또는 Notion [2] - 데이터 소스에 따라) |
| **Row separator** | (없음, 템플릿 내 구분선 사용) |

**⭐ 최종 추천 템플릿 (Notion 데이터용 - 파란 그라데이션 배너):**

**Text (템플릿) - 기본 버전:**

```html
📰 <b>{{4.title}}</b><br>
{{4.description}}<br>
📅 {{ifempty(4.pubDate; "날짜 정보 없음")}}<br>
🔗 <a href="{{ifempty(4.link; 4.guid)}}">원문보기</a><br>
<br>━━━━━━━━━━━━━━━<br><br>
```

**Text (템플릿) - 개선된 레이아웃 (Pretendard 폰트 + 포스팅 내용 강조):**

```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: #f8f9fa; border-left: 4px solid #0066FF; padding: 20px; margin-bottom: 24px; border-radius: 8px;">
<h2 style="font-family: 'Pretendard', sans-serif; font-size: 20px; font-weight: 700; color: #111; margin: 0 0 12px 0; line-height: 1.5;">📰 {{4.title}}</h2>
<p style="font-family: 'Pretendard', sans-serif; font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">{{4.description}}</p>
<div style="display: flex; align-items: center; gap: 16px; font-size: 13px; color: #666;">
<span style="font-family: 'Pretendard', sans-serif;">📅 {{ifempty(4.pubDate; "날짜 정보 없음")}}</span>
<a href="{{ifempty(4.link; 4.guid)}}" style="font-family: 'Pretendard', sans-serif; color: #0066FF; text-decoration: none; font-weight: 500;">🔗 원문보기 →</a>
</div>
</div>
</div>
```

- `ifempty(4.link; 4.guid)`: link가 비어 있으면 guid 사용 (원문 링크 404/빈 링크 방지).
- `ifempty(4.pubDate; "날짜 정보 없음")`: 날짜가 비어 있으면 대체 텍스트 표시.
- 날짜가 여전히 안 보이면: Iterator(4)의 매퍼에서 실제 사용 가능한 날짜 필드명을 확인 (`pubDate`, `pubdate`, `date` 등).
- **개선 사항:** Pretendard 폰트 적용, 카드형 레이아웃, description 3줄 미리보기, 가독성 향상.

**Text (템플릿) - 배너 형태 레이아웃 옵션:**

**⭐ 최종 추천 버전 (Notion 데이터용 - 파란 그라데이션 + 버튼 오른쪽 고정):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: linear-gradient(to right, #0066FF 0%, #00A3FF 100%); padding: 22px; margin-bottom: 16px; border-radius: 10px; position: relative;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0; line-height: 1.4;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 13px; color: rgba(255,255,255,0.95); margin: 0 0 16px 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}</p>
<div style="display: flex; align-items: center; justify-content: space-between;">
<span style="font-family: 'Pretendard', sans-serif; font-size: 12px; color: rgba(255,255,255,0.9);">📅 {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</span>
<a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" style="font-family: 'Pretendard', sans-serif; background: rgba(255,255,255,0.25); color: #ffffff; padding: 9px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,0.3); white-space: nowrap; margin-left: auto;">원문보기 →</a>
</div>
</div>
</div>
```

**특징:**
- 파란색 그라데이션 배경 (`#0066FF → #00A3FF`)
- Pretendard 폰트 적용
- 제목, 내용(2줄 미리보기), 날짜, 원문보기 버튼 포함
- 원문보기 버튼이 배너 오른쪽 끝에 고정 (`margin-left: auto`)
- 날짜와 버튼이 겹치지 않도록 레이아웃 최적화

---

**옵션 1: 가로 배너 (컴팩트):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; margin-bottom: 16px; border-radius: 8px; color: #ffffff;">
<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
<div style="flex: 1;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; line-height: 1.4;">{{4.title}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 13px; color: rgba(255,255,255,0.9); margin: 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{4.description}}</p>
</div>
<a href="{{ifempty(4.link; 4.guid)}}" style="font-family: 'Pretendard', sans-serif; background: rgba(255,255,255,0.2); color: #ffffff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; white-space: nowrap; border: 1px solid rgba(255,255,255,0.3);">원문보기 →</a>
</div>
<div style="margin-top: 12px; font-size: 12px; color: rgba(255,255,255,0.8);">📅 {{ifempty(4.pubDate; "날짜 정보 없음")}}</div>
</div>
</div>
```

**옵션 2: 세로 배너 (이미지 스타일):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: #f8f9fa; border-radius: 12px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
<div style="background: linear-gradient(90deg, #0066FF 0%, #00A3FF 100%); padding: 16px 20px;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 19px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0; line-height: 1.4;">{{4.title}}</h3>
<div style="font-size: 12px; color: rgba(255,255,255,0.85);">📅 {{ifempty(4.pubDate; "날짜 정보 없음")}}</div>
</div>
<div style="padding: 16px 20px;">
<p style="font-family: 'Pretendard', sans-serif; font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">{{4.description}}</p>
<a href="{{ifempty(4.link; 4.guid)}}" style="font-family: 'Pretendard', sans-serif; display: inline-block; background: #0066FF; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">원문보기 →</a>
</div>
</div>
</div>
```

**옵션 3: 미니멀 배너 (간결):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="border-left: 5px solid #0066FF; padding-left: 20px; margin-bottom: 20px; padding-top: 4px; padding-bottom: 4px;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 17px; font-weight: 600; color: #111; margin: 0 0 6px 0; line-height: 1.4;">{{4.title}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 10px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{4.description}}</p>
<div style="display: flex; align-items: center; gap: 12px; font-size: 12px; color: #999;">
<span>📅 {{ifempty(4.pubDate; "날짜 정보 없음")}}</span>
<span>•</span>
<a href="{{ifempty(4.link; 4.guid)}}" style="font-family: 'Pretendard', sans-serif; color: #0066FF; text-decoration: none; font-weight: 500;">원문보기 →</a>
</div>
</div>
</div>
```

**옵션 4: 뉴스 카드 배너:**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 16px; transition: box-shadow 0.3s;">
<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
<span style="background: #0066FF; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; font-family: 'Pretendard', sans-serif;">NEWS</span>
<span style="font-size: 12px; color: #999; font-family: 'Pretendard', sans-serif;">📅 {{ifempty(4.pubDate; "날짜 정보 없음")}}</span>
</div>
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #111; margin: 0 0 10px 0; line-height: 1.4;">{{4.title}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{4.description}}</p>
<a href="{{ifempty(4.link; 4.guid)}}" style="font-family: 'Pretendard', sans-serif; color: #0066FF; text-decoration: none; font-size: 14px; font-weight: 500; border-bottom: 1px solid #0066FF; padding-bottom: 2px;">원문보기 →</a>
</div>
</div>
```

**Notion 데이터용 배너 레이아웃 - 최종 버전 (현재 사용 중):**

**프리미엄 카드 스타일 (왼쪽 파란 강조선 + 버튼) - 수정 버전:**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f7fa;">
<div style="background: #ffffff; border-radius: 12px; overflow: hidden; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border-left: 4px solid #0066FF;">
<div style="padding: 24px;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 19px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0; line-height: 1.4;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}</p>
<div style="padding-top: 16px; border-top: 1px solid #e8eaed;">
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
<span style="font-family: 'Pretendard', sans-serif; font-size: 12px; color: #999; flex-shrink: 0;">📅 {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</span>
<a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" style="font-family: 'Pretendard', sans-serif; background: #0066FF; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; white-space: nowrap; flex-shrink: 0;">원문보기 →</a>
</div>
</div>
</div>
</div>
</div>
```

**대안: 날짜와 버튼을 세로로 배치 (겹침 방지):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f7fa;">
<div style="background: #ffffff; border-radius: 12px; overflow: hidden; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border-left: 4px solid #0066FF;">
<div style="padding: 24px;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 19px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0; line-height: 1.4;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}</p>
<div style="padding-top: 16px; border-top: 1px solid #e8eaed;">
<div style="margin-bottom: 12px;">
<span style="font-family: 'Pretendard', sans-serif; font-size: 12px; color: #999;">📅 {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</span>
</div>
<a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" style="font-family: 'Pretendard', sans-serif; display: inline-block; background: #0066FF; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">원문보기 →</a>
</div>
</div>
</div>
</div>
```

**참고:** 내용이 보이지 않으면 Notion DB에 "내용", "요약", "설명" 속성이 없을 수 있습니다. Notion 모듈(2)의 매퍼에서 실제 사용 가능한 텍스트 속성명을 확인하고, 해당 필드명으로 변경하세요.

**미니멀 모던 배너 (토스 스타일 - 청록/초록 그라데이션):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: linear-gradient(to right, #00D9FF 0%, #00C982 100%); padding: 22px; margin-bottom: 16px; border-radius: 10px; position: relative; overflow: hidden;">
<div style="position: relative; z-index: 1;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0; line-height: 1.4;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 13px; color: rgba(255,255,255,0.95); margin: 0 0 16px 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}</p>
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
<span style="font-family: 'Pretendard', sans-serif; font-size: 12px; color: rgba(255,255,255,0.9); flex-shrink: 0;">📅 {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</span>
<a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" style="font-family: 'Pretendard', sans-serif; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); color: #ffffff; padding: 9px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,0.3); white-space: nowrap; flex-shrink: 0;">원문보기 →</a>
</div>
</div>
</div>
</div>
```

**미니멀 모던 배너 (파란 그라데이션 - 버튼 오른쪽 고정):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: linear-gradient(to right, #0066FF 0%, #00A3FF 100%); padding: 22px; margin-bottom: 16px; border-radius: 10px; position: relative;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0; line-height: 1.4;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 13px; color: rgba(255,255,255,0.95); margin: 0 0 16px 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}</p>
<div style="display: flex; align-items: center; justify-content: space-between;">
<span style="font-family: 'Pretendard', sans-serif; font-size: 12px; color: rgba(255,255,255,0.9);">📅 {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</span>
<a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" style="font-family: 'Pretendard', sans-serif; background: rgba(255,255,255,0.25); color: #ffffff; padding: 9px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,0.3); white-space: nowrap; margin-left: auto;">원문보기 →</a>
</div>
</div>
</div>
```

**클래식 배너 (원래 버전):**
```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; margin-bottom: 16px; border-radius: 8px; color: #ffffff;">
<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
<div style="flex: 1;">
<h3 style="font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; line-height: 1.4;">{{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h3>
<p style="font-family: 'Pretendard', sans-serif; font-size: 13px; color: rgba(255,255,255,0.9); margin: 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; "")}}</p>
</div>
<a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" style="font-family: 'Pretendard', sans-serif; background: rgba(255,255,255,0.2); color: #ffffff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; white-space: nowrap; border: 1px solid rgba(255,255,255,0.3);">원문보기 →</a>
</div>
<div style="margin-top: 12px; font-size: 12px; color: rgba(255,255,255,0.8);">📅 {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</div>
</div>
</div>
```

- **옵션 1**: 그라데이션 배경, 가로 배치, 컴팩트한 디자인
- **옵션 2**: 헤더+본문 분리, 버튼 스타일 링크
- **옵션 3**: 왼쪽 강조선, 미니멀 스타일
- **옵션 4**: 뉴스 카드 스타일, 라벨 포함

---

### 5. Gmail 모듈 (3번)

Text aggregator(5) 결과를 HTML 메일로 발송.

**참고:** 개선된 레이아웃 템플릿을 사용할 경우, Gmail의 **Body type**은 반드시 **"Raw HTML"**로 설정해야 `<style>` 태그와 인라인 스타일이 정상 작동합니다.

| 설정 | 값 |
|------|-----|
| **To** | 수신자 이메일 (예: 여러 명 시 콤마 구분) |
| **Subject** | 팀벨 신규 소식 도착 |
| **Body type** | Raw HTML |
| **Content** | `5. Tools - Text aggregator [bundle] 5. text` |

- Gmail 연결 만료 시 재인증 필요 (예: 2026년 8월 재인증 안내 시 반드시 갱신).

---

## 데이터 흐름 요약

1. **HTTP(1)**: 네이버 뉴스 API로 `팀블로` 키워드 기사 5건 조회 (`items[]`).
2. **Iterator(4)**: `items[]` 한 건씩 반복 → 각 반복에서 Notion(2) → Tools(5) 경로로 데이터 전달.
3. **Notion(2)**: 반복마다 제목·원문링크·카테고리를 DB에 한 행씩 생성.
4. **Tools(5)**: 반복된 모든 항목을 위 HTML 템플릿으로 합쳐 `5.text` 한 덩어리로 출력.
5. **Gmail(3)**: `5.text`를 HTML 본문으로 사용해 "팀벨 신규 소식 도착" 메일 발송.

---

## 트러블슈팅

| 문제 | 원인 | 해결 |
|------|------|------|
| **날짜 앞에 "page" 텍스트가 보이고 날짜 형식이 ISO로 나옴** | Notion의 `created_time`이 객체이거나 날짜 형식 변환이 안 됨 | `2.created_time` 대신 `2.created_time.formatted` 또는 날짜 형식 함수 사용, "page"는 다른 필드가 섞인 것일 수 있음 |
| **원문링크 `ifempty` 두 인자가 같아서 의미 없음** | `ifempty(2.properties_value.`원문링크`; 2.properties_value.`원문링크`)`처럼 동일 값 사용 | Notion URL 필드는 `2.url` 또는 `2.properties_value.`원문링크`.url` 사용, 폴백이 필요하면 다른 필드 사용 |
| **날짜 아이콘(📅)에 텍스트가 안 보임** | `4.pubDate` 필드가 비어 있거나 필드명이 다름, 또는 날짜 형식 문제 | Iterator(4)에서 실제 날짜 필드명 확인 (`pubDate`, `pubdate`, `date` 등), 비어있으면 `ifempty(4.pubDate; "날짜 없음")` 사용 |
| **메일에 `{"text":"` JSON 문자열이 보이고 링크가 클릭 안 됨** | Gmail Content 필드가 `5.text`가 아닌 `5` 전체를 선택했거나, Body type이 Raw HTML이 아님 | Gmail(3) Content = **`5.text`** (Text aggregator의 text 필드만), Body type = **Raw HTML** 확인 |
| **Notion에는 링크 들어가는데 메일에는 링크 연동 안 됨** | Text aggregator(5)에서 링크를 **직접 입력**해서 변수가 치환되지 않음 | Text aggregator **Text** 필드에서 `href` 값을 **변수 패널(매퍼)로 선택**해 넣기 (아래 상세 참고) |
| HTTP 401/403 | API 키 오류 또는 미설정 | Header에 `X-Naver-Client-Id`, `X-Naver-Client-Secret` 확인 및 재발급 |
| 원문 링크 404/빈 링크 | link 필드 비어 있음 | Text aggregator에서 `{{ifempty(4.link; 4.guid)}}` 사용 (이미 적용 권장) |
| 이메일 5통 옴 | Text aggregator 없이 Iterator → Gmail 직접 연결 | 반드시 Tools(5) Text aggregator를 중간에 두고, Gmail Content는 `5.text`로 설정 |
| Notion에 안 쌓임 | DB ID 또는 속성명 불일치 | Database ID·제목/원문링크/카테고리 속성명이 Notion DB와 동일한지 확인 |
| Gmail 연결 만료 | OAuth 재인증 필요 | Make 시나리오에서 Gmail 연결 재인증 |

### 날짜(📅) 텍스트가 안 보일 때

**증상:** 메일에서 날짜 아이콘(📅)은 보이지만 날짜 텍스트가 비어 있음.

**원인:**
1. `4.pubDate` 필드가 비어 있음
2. Iterator(4)에서 실제 날짜 필드명이 `pubDate`가 아님 (예: `pubdate`, `date`, `publishedDate` 등)
3. 날짜 값이 null이거나 빈 문자열

**해결 방법:**

1. **Iterator(4)에서 실제 필드명 확인:**
   - Make 시나리오에서 Iterator(4) 모듈을 연다
   - 실행 로그나 데이터 구조에서 날짜 관련 필드명을 확인한다
   - 네이버 API 응답에서는 보통 `pubDate`지만, 대소문자나 다른 이름일 수 있음

2. **Text aggregator 템플릿 수정:**
   - 날짜 부분을 `{{ifempty(4.pubDate; "날짜 정보 없음")}}` 로 변경
   - 또는 실제 필드명이 다르면 (예: `4.date`) 그에 맞게 수정
   - 매퍼로 `ifempty` 함수를 선택하고, 첫 번째 인자에 Iterator(4) → 실제 날짜 필드, 두 번째 인자에 "날짜 정보 없음" (또는 빈 문자열) 입력

3. **날짜 형식 변환 (선택):**
   - 날짜가 보이지만 형식이 이상하면, Make의 날짜 형식 함수 사용 가능
   - 예: `{{formatDate(4.pubDate; "YYYY-MM-DD")}}` (Make에서 지원하는 경우)

**확인 포인트:**
- Iterator(4)의 매퍼에서 사용 가능한 필드 목록을 확인해 날짜 필드명을 정확히 찾는다
- Text aggregator에서 날짜 변수는 **매퍼로 선택**해서 넣어야 함 (직접 타이핑 X)

---

### Notion에서 데이터 가져올 때 날짜/링크 문제

**증상:** 
- 날짜 앞에 "page" 텍스트가 보임
- 날짜가 ISO 형식(`2026-02-12T06:28:00.000Z`)으로 표시됨
- `ifempty`의 두 인자가 같아서 의미 없음

**원인:**
1. `2.created_time`이 객체이거나 날짜 형식 변환이 안 됨
2. Notion의 URL 필드 접근 방식이 잘못됨 (`properties_value.`원문링크`를 두 번 사용)
3. 날짜 앞의 "page"는 다른 필드가 섞였을 수 있음

**해결 방법:**

**1. 날짜 형식 수정:**
```html
📅 {{formatDate(2.created_time; "YYYY-MM-DD HH:mm")}}<br>
```
또는 Notion에서 날짜가 객체라면:
```html
📅 {{2.created_time.formatted}}<br>
```
또는 날짜만:
```html
📅 {{substring(2.created_time; 0; 10)}}<br>
```

**2. 원문링크 수정:**
`ifempty`의 두 인자가 같으면 의미 없으므로, Notion의 URL 필드를 올바르게 접근:
```html
🔗 <a href="{{2.properties_value.`원문링크`.url}}">원문보기</a><br>
```
또는 Notion 페이지 URL을 사용:
```html
🔗 <a href="{{2.url}}">원문보기</a><br>
```
폴백이 필요하면:
```html
🔗 <a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}">원문보기</a><br>
```

**3. "page" 텍스트 제거:**
- Text aggregator의 Text 필드에서 날짜 앞에 "page"가 들어간 부분이 있는지 확인
- Notion 모듈(2)의 매퍼에서 `created_time`만 선택하고 다른 필드가 섞이지 않았는지 확인

**최종 수정된 템플릿 예시 (기본):**
```html
📰 <b>{{2.properties_value.`제목`[].plain_text}}</b><br>
<br>
📅 {{formatDate(2.created_time; "YYYY-MM-DD")}}<br>
🔗 <a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}">원문보기</a><br>
<br>━━━━━━━━━━━━━━━<br><br>
```

**Notion 데이터용 개선된 레이아웃 (Pretendard 폰트 + 포스팅 내용 강조) - 수정 버전:**

```html
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
<div style="background: #f8f9fa; border-left: 4px solid #0066FF; padding: 20px; margin-bottom: 24px; border-radius: 8px;">
<h2 style="font-family: 'Pretendard', sans-serif; font-size: 20px; font-weight: 700; color: #111; margin: 0 0 12px 0; line-height: 1.5;">📰 {{ifempty(2.properties_value.`제목`[].plain_text; 2.properties_value.`제목`; "제목 없음")}}</h2>
<p style="font-family: 'Pretendard', sans-serif; font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">{{ifempty(2.properties_value.`내용`[].plain_text; 2.properties_value.`요약`[].plain_text; 2.properties_value.`설명`[].plain_text; "")}}</p>
<div style="display: flex; align-items: center; gap: 16px; font-size: 13px; color: #666;">
<span style="font-family: 'Pretendard', sans-serif;">📅 {{ifempty(substring(2.created_time; 0; 10); substring(2.last_edited_time; 0; 10); "날짜 정보 없음")}}</span>
<a href="{{ifempty(2.properties_value.`원문링크`.url; 2.url)}}" style="font-family: 'Pretendard', sans-serif; color: #0066FF; text-decoration: none; font-weight: 500;">🔗 원문보기 →</a>
</div>
</div>
</div>
```

**중요:** 위 템플릿의 변수들은 **반드시 매퍼로 선택**해서 넣어야 합니다. Notion 모듈(2)의 매퍼에서 실제 필드명을 확인하고 맞춰서 사용하세요.

**필드명 확인 방법:**
1. Notion 모듈(2)을 실행한 후 출력 데이터 구조 확인
2. Text aggregator(5)의 Text 필드에서 매퍼를 열어 Notion(2)의 사용 가능한 필드 목록 확인
3. 실제 필드명이 다르면 (예: `제목` 대신 `Title`, `내용` 대신 `Description` 등) 그에 맞게 수정

**확인 포인트:**
- Notion 모듈(2)의 매퍼에서 실제 사용 가능한 필드 구조 확인 (`properties_value.`원문링크`.url` vs `url` 등)
- 날짜 형식 함수(`formatDate`)가 Make에서 지원되는지 확인, 안 되면 `substring`으로 날짜 부분만 추출
- **제목/내용이 비어있으면:** Notion DB의 속성명이 템플릿과 다를 수 있음. 매퍼에서 실제 속성명 확인 (예: `제목` → `Title`, `내용` → `Description` 등)
- **포스팅 내용 필드가 없으면:** Notion DB에 "내용", "요약", "설명" 같은 텍스트 속성이 있는지 확인하고, 없으면 해당 `<p>` 태그를 제거하거나 빈 문자열로 설정

---

### 메일에 JSON 문자열(`{"text":"`)이 보이고 링크가 안 될 때

**증상:** 메일 본문에 `{"text":"제목...` 같은 JSON 문자열이 보이고, "원문보기" 링크가 클릭되지 않음.

**원인:** Gmail 모듈의 **Content** 필드가 Text aggregator의 **전체 출력(`5`)**을 선택했거나, `5.text`를 선택했지만 실제로는 JSON 객체가 그대로 들어감.

**해결 방법:**

1. **Gmail(3) 모듈**을 연다.
2. **Content** 필드를 확인한다.
   - ❌ 잘못된 예: `5. Tools - Text aggregator` (전체 객체)
   - ✅ 올바른 예: `5. Tools - Text aggregator [bundle] 5. text` 또는 매퍼에서 `5.text` 선택
3. **Body type**이 **"Raw HTML"**로 설정되어 있는지 확인한다.
   - ❌ "Plain text" 또는 "HTML" (일부 클라이언트는 HTML로 인식 안 함)
   - ✅ **"Raw HTML"** (반드시 이 옵션)
4. 저장 후 시나리오를 다시 실행해 본다.

**확인 포인트:**
- Content 필드에서 매퍼를 열면 `5.text`가 **보라색/파란색 pill**로 보여야 함.
- Body type 드롭다운에서 **"Raw HTML"**이 선택되어 있어야 함.

---

### 메일에서만 링크가 안 나올 때 (상세)

- **Notion**은 모듈에서 **매퍼로 `4.link`를 선택**해서 넣기 때문에 실제 URL이 들어갑니다.
- **메일** 본문은 **Text aggregator(5)의 출력 `5.text`**를 쓰는데, 여기 들어가는 내용은 Text aggregator의 **Text** 필드에 넣은 템플릿이 **실행 시점에 변수로 치환된 결과**입니다.
- **직접 `{{4.link}}`나 `ifempty(4.link; 4.guid)`를 타이핑**하면, Make가 “변수”로 인식하지 못하고 **문자 그대로** `5.text`에 들어갑니다. 그래서 메일 HTML에 `href="{{4.link}}"` 같은 문자열이 들어가고, 클릭해도 링크가 동작하지 않습니다.

**해결 방법:**

1. Make 시나리오에서 **Tools(5) Text aggregator** 모듈을 연다.
2. **Text** 필드에서 원문 링크가 들어가는 부분(`<a href="...">원문보기</a>`)을 찾는다.
3. `href=""` 안의 **기존 문자를 지우고**, **커서를 그 안에 둔 뒤** 오른쪽 **변수/매퍼 패널**에서:
   - **Iterator(4)** → `link` 또는 **Functions** → `ifempty` 선택 후 `4.link`, `4.guid`를 **클릭으로** 넣는다.
4. 저장 후 시나리오를 한 번 실행해 본다.  
   이렇게 하면 `5.text`에 실제 URL이 들어가서, 메일에서도 링크가 정상 연동됩니다.

---

## 체크리스트

- [ ] HTTP(1)에 네이버 API Header 설정
- [ ] Iterator(4) Array = `1.data.items[]`, Map ON
- [ ] Notion(2) DB ID 및 제목/원문링크/카테고리 매핑
- [ ] Text aggregator(5) Source = Iterator [4], 원문 링크에 `ifempty(4.link; 4.guid)` 사용
- [ ] Gmail(3) Content = `5.text`, Body type = Raw HTML
- [ ] 스케줄 사용 시 Run scenario / Time / Time zone 설정

---

## 키워드 변경 및 다중 키워드

### 1. 수집 키워드만 바꾸고 싶을 때

**방법:** HTTP(1) 모듈의 **URL**에서 `query` 값만 수정하면 됩니다.

| 현재 예시 | 변경 예시 |
|-----------|-----------|
| `query=팀블로` | `query=팀벨` 또는 `query=원하는키워드` |

- URL 인코딩: 한글/공백은 자동 처리되는 경우가 많지만, 문제 있으면 `팀벨` → `%ED%8C%80%EB%B2%A8` 형태로 인코딩해 넣을 수 있음.
- `display`, `sort`는 그대로 두면 됨.

---

### 2. 키워드를 여러 개 쓰고 싶을 때

**방법 A – 시나리오 복제 (가장 단순)**

- 시나리오를 **복제**한 뒤, 복제본마다 HTTP(1) URL의 `query`만 서로 다르게 설정.
- 키워드 3개 → 시나리오 3개 → 실행 시 이메일 3통(키워드당 1통), Notion에는 키워드별로 각각 쌓임.
- **장점:** 설정이 단순함. **단점:** 키워드가 늘어나면 시나리오 수가 늘어남.

---

**방법 B – 한 시나리오에서 키워드 배열로 반복 (고급)**

플로우 앞단에 **키워드 목록 → 키워드별 반복**을 넣고, 기존 HTTP 이후 플로우는 그대로 둡니다.

**추가/변경할 구조:**

```
[Tools] Set Variable  ← 키워드 배열 설정
    ↓
[Iterator]  ← Array: 키워드 배열 (키워드별 1번씩 반복)
    ↓
[HTTP 1]  ← URL의 query = Iterator.value (현재 키워드)
    ↓
[Iterator 4]  ← Array: 1.data.items[]  (기존과 동일)
    ↓
[Notion 2] → [Tools 5] → [Gmail 3]  (기존과 동일)
```

**설정 요약:**

| 단계 | 모듈 | 설정 |
|------|------|------|
| 1 | **Set Variable** | 변수 1개, 타입 **Array**, 값 `["팀블로", "팀벨", "AI마케팅"]` 등 키워드 배열 |
| 2 | **Iterator** (새로 추가) | Array = Set Variable에서 만든 배열 |
| 3 | **HTTP(1)** | URL에서 `query=` 부분을 **매퍼로** `{{Iterator.value}}` 로 설정 (고정 문자열 대신) |

- URL 예시:  
  `https://openapi.naver.com/v1/search/news.json?query={{Iterator.value}}&display=5&sort=date`
- 그 뒤 **Iterator(4)** 의 Array는 여전히 `1.data.items[]` (HTTP(1) 응답의 items).
- **Notion(2)** 카테고리: 키워드별로 구분하려면 `{{Iterator.value}}`(키워드용 Iterator)를 카테고리 필드에 매핑할 수 있음. 단 현재 Notion 모듈은 **HTTP 쪽 Iterator(4)** 다음에 있으므로, “키워드” Iterator의 값은 **Router로 합치거나**, Notion 앞에 **Set Variable** 하나 더 두어 “현재 키워드”를 저장해 두고 Notion에서 참조하는 식으로 넣어야 함. (선택 사항.)

**실행 결과 (방법 B):**

- 키워드 3개 × 기사 5건 = Notion 15건 생성.
- Text aggregator는 **키워드당 5건씩** 묶어서 한 번씩 실행되므로, **이메일은 키워드 수만큼** 발송됨 (예: 3키워드 → 3통).

---

### 3. 요약

| 목적 | 조치 |
|------|------|
| **키워드 1개만 바꾸기** | HTTP(1) URL의 `query=` 값만 수정 |
| **키워드 여러 개, 관리 간단** | 시나리오 복제 후 각각 `query`만 다르게 설정 |
| **키워드 여러 개, 한 시나리오로** | Set Variable(키워드 배열) → Iterator(키워드) → HTTP(query=Iterator.value) → 기존 플로우 유지 |

---

## 다양한 소스(블로그, 티스토리, 브런치, 스레드, 링크드인)로 수집하기

언론보도(뉴스) 말고 **네이버 블로그·카페**, 그리고 **티스토리·브런치·스레드·링크드인** 등 여러 채널을 키워드 기준으로 수집하고 싶을 때의 방법과 제한을 정리했습니다.

---

### 1. 소스별 가능 여부 요약

| 소스 | 키워드 검색 수집 | 방법 | 비고 |
|------|------------------|------|------|
| **네이버 뉴스** | ✅ 가능 | 현재 시나리오 그대로 (`/v1/search/news.json`) | 이미 구현됨 |
| **네이버 블로그** | ✅ 가능 | 같은 API 키, URL만 `blog.json`으로 변경 | 응답 구조 동일 (`items[]`, title, link, description) |
| **네이버 카페글** | ✅ 가능 | 같은 API 키, URL만 `cafearticle.json`으로 변경 | [카페글 API](https://developers.naver.com/docs/serviceapi/search/cafearticle/cafearticle.md) |
| **티스토리** | △ 간접 | 네이버 블로그 검색 결과에 티스토리 글이 포함됨. 전용 키워드 검색 API는 없음 | 블로그 검색으로 넓게 수집 후 URL/도메인으로 필터 가능 |
| **브런치** | △ 간접 | 네이버 블로그 검색에 포함될 수 있음. 전용 검색 API 없음 | 블로그 검색 + 필요 시 URL 필터 |
| **스레드(Threads)** | ❌ 제한적 | Meta 공개 키워드 검색 API 없음 | 공식 API는 본인/페이지 콘텐츠 위주 |
| **링크드인** | ❌ 제한적 | 공식 API는 게시물 관리용, 공개 키워드 검색은 서드파티(LinkUp 등) 위주 | 비용·승인 필요할 수 있음 |

---

### 2. 네이버만 쓸 때: 뉴스 → 블로그/카페로 바꾸기

**현재(뉴스):**
```
https://openapi.naver.com/v1/search/news.json?query=팀블로&display=5&sort=date
```

**블로그로 변경:** 경로만 `blog.json`으로 바꾸면 됨.

| 설정 | 값 |
|------|-----|
| **URL** | `https://openapi.naver.com/v1/search/blog.json?query=팀블로&display=5&sort=date` |

**카페글로 변경:** `cafearticle.json` 사용.

| 설정 | 값 |
|------|-----|
| **URL** | `https://openapi.naver.com/v1/search/cafearticle.json?query=팀블로&display=5&sort=date` |

- **Header**(`X-Naver-Client-Id`, `X-Naver-Client-Secret`)는 **동일**.
- 응답 구조가 같아서 **Iterator(4)** 의 `1.data.items[]`, **Notion(2)** 의 `4.title` / `4.link` / `4.description` 등은 **그대로** 사용 가능.
- Notion **카테고리**만 소스 구분용으로 바꾸면 됨 (예: `네이버 블로그`, `네이버 카페`).

---

### 3. 한 시나리오에서 뉴스 + 블로그 + 카페 동시 수집

**아이디어:** “소스 타입”을 배열로 두고, 그만큼 HTTP를 반복 호출한 뒤, 나온 결과를 모두 Notion/이메일로 모음.

**플로우 예시:**

```
[Set Variable]  소스 목록 = ["news", "blog", "cafearticle"]
    ↓
[Iterator]  Array = 소스 목록 (소스별 1번씩)
    ↓
[HTTP 1]  URL = https://openapi.naver.com/v1/search/{{Iterator.value}}.json?query=팀블로&display=5&sort=date
    ↓
[Iterator 4]  Array = 1.data.items[]
    ↓
[Notion 2]  제목=4.title, 원문링크=4.link, 카테고리="네이버 {{Iterator.value}}" 등
    ↓
[Tools 5] → [Gmail 3]  (기존과 동일, 소스별로 묶이거나 한 통으로 정리)
```

**설정 포인트:**

| 단계 | 내용 |
|------|------|
| **Set Variable** | 타입 Array, 값 `["news", "blog", "cafearticle"]` (필요한 소스만 포함) |
| **Iterator** | Array = 위 변수 |
| **HTTP(1)** | URL에 `{{Iterator.value}}` 사용 → `.../search/{{Iterator.value}}.json?query=...` |
| **Notion(2)** | 카테고리에 `네이버 뉴스` / `네이버 블로그` / `네이버 카페` 식으로 **소스 구분** (Iterator.value로 분기하거나, 고정값 매핑) |

- 실행 시: 소스 3종 × 5건 = 최대 15건 Notion, 이메일은 Text aggregator 설계에 따라 소스별 3통 또는 1통으로 구성 가능.

---

### 4. 티스토리·브런치 “키워드” 수집

- **전용 키워드 검색 API**는 없음.
- **실무에서 쓸 수 있는 방법:**
  - **네이버 블로그 검색** (`blog.json`)으로 키워드 검색 → 결과에 **티스토리·브런치 URL**이 많이 포함됨.
  - Make에서 HTTP(1)로 블로그 검색 후, Iterator(4) 다음에 **Router** 또는 **Filter**를 두고, `4.link`에 `tistory.com` / `brunch.co.kr` 포함 여부로 필터링하면 “키워드 + 티스토리/브런치”만 남길 수 있음.
- 정리: **블로그 검색 1개 시나리오**로 두고, **카테고리**나 **태그**를 `4.link` 기준으로 “티스토리”/“브런치”로 구분해 Notion에 넣는 방식 권장.

---

### 5. 스레드·링크드인

| 플랫폼 | 정리 |
|--------|------|
| **스레드(Threads)** | 공개 키워드 검색용 공식 API 없음. Make만으로 “키워드로 스레드 검색 수집”은 어렵고, 공식/서드파티 API가 열리면 그때 연동 검토. |
| **링크드인** | 공식 API는 주로 “내 회사/페이지 게시물 관리”. 키워드로 공개 포스트 검색은 서드파티(예: LinkUp 등)가 있으며, 비용·가입이 필요할 수 있음. Make에는 “HTTP + API 키”로 해당 서비스 연동하는 시나리오 구성이 필요. |

즉, **지금 구조를 그대로 확장하기 좋은 건 네이버(뉴스·블로그·카페)**이고, 티스토리/브런치는 네이버 블로그 검색으로 간접 수집, 스레드/링크드인은 별도 API·서비스 검토가 필요합니다.

---

### 6. 요약

| 목적 | 조치 |
|------|------|
| **뉴스 → 블로그/카페만** | HTTP(1) URL에서 `news.json` → `blog.json` 또는 `cafearticle.json`으로 변경 |
| **뉴스+블로그+카페 한 번에** | Set Variable(소스 배열) → Iterator(소스) → HTTP(`.../search/{{Iterator.value}}.json?query=...`) → 기존 Iterator(4)·Notion·Text aggregator·Gmail 유지 |
| **티스토리/브런치 포함** | 네이버 블로그 검색 사용 후, `4.link`에 tistory/brunch 포함 시 카테고리·필터로 구분 |
| **스레드/링크드인** | 공개 키워드 검색 API 제한적 → 서드파티/공식 API 문서 확인 후 별도 시나리오 구성 |

---

## 참고

- 네이버 검색 API: [뉴스](https://developers.naver.com/docs/serviceapi/search/news/news.md) · [블로그](https://developers.naver.com/docs/serviceapi/search/blog/blog.md) · [카페글](https://developers.naver.com/docs/serviceapi/search/cafearticle/cafearticle.md)
- `display` 값으로 **키워드당** 수집 기사 수 조절 가능 (기본 예시: 5).
