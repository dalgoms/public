# 뉴스레터 자동화

## 시나리오 개요

| 항목 | 내용 |
|------|------|
| 시나리오명 | AI 마케팅 모닝 뉴스 |
| 트리거 | 매일 오전 9시 |
| 출력 | Gmail (HTML 이메일) |

---

## 모듈 구성

```
[RSS 12] Watch RSS feed items
    ↓
[Tools 14] Text Aggregator
    ↓
[Gmail 13] Send an Email
```

---

## 모듈 상세 설정

### 1. RSS 모듈 (12번)

| 설정 | 값 |
|------|-----|
| URL | `https://byline.network/feed/` |
| Maximum number of items | `5` |

---

### 2. Text Aggregator 모듈 (14번)

**Source Module:** RSS - Watch RSS feed items [12]

**Row separator:** (없음)

**Text:**
```html
<div style="margin-bottom: 36px; padding-bottom: 36px; border-bottom: 1px solid #eee;"><p style="font-size: 14px; color: #0066FF; font-weight: bold; margin: 0 0 8px 0; letter-spacing: 1px;">📍 TREND</p><h3 style="margin: 0 0 16px 0; color: #111; font-size: 26px; line-height: 1.4;">{{12.title}}</h3><p style="margin: 0 0 20px 0; color: #444; font-size: 20px; line-height: 1.8;">{{12.description}}</p><a href="{{12.link}}" style="color: #0066FF; font-size: 18px; text-decoration: none;">원문 보기 →</a></div>
```

---

### 3. Gmail 모듈 (13번)

| 설정 | 값 |
|------|-----|
| To | 수신자 이메일 (콤마로 구분) |
| Subject | 🌅 TIMBEL DAILY BRIEF |
| Content type | HTML |

**Content:**
```html
<div style="max-width: 600px; margin: 0 auto; padding: 24px; font-family: -apple-system, sans-serif; background: #ffffff;"><div style="border-bottom: 3px solid #0066FF; padding-bottom: 20px; margin-bottom: 32px;"><h1 style="font-size: 32px; color: #111; margin: 0 0 8px 0;">🌅 TIMBEL DAILY BRIEF</h1><p style="font-size: 18px; color: #888; margin: 0;">AI 마케팅 뉴스 | 2026.02.08</p></div>{{14.text}}<div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #eee; text-align: center;"><p style="font-size: 16px; color: #888; margin: 0;">TIMBEL 마케팅팀 드림</p><p style="font-size: 14px; color: #aaa; margin: 8px 0 0 0;">매일 아침, AI 마케팅 트렌드를 전해드립니다.</p></div></div>
```

---

## 이메일 미리보기

```
┌─────────────────────────────────┐
│  🌅 TIMBEL DAILY BRIEF          │
│  AI 마케팅 뉴스 | 2026.02.08    │
│  ═══════════════════════════    │
│                                 │
│  📍 TREND                       │
│  ─────────                      │
│  뉴스 제목 1                    │
│  요약 내용...                   │
│  원문 보기 →                    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  📍 TREND                       │
│  ─────────                      │
│  뉴스 제목 2                    │
│  요약 내용...                   │
│  원문 보기 →                    │
│                                 │
│  ═══════════════════════════    │
│      TIMBEL 마케팅팀 드림       │
└─────────────────────────────────┘
```

---

## 트러블슈팅

### 문제: 내용이 안 보임
- **원인:** 변수가 텍스트로 입력됨
- **해결:** 변수 패널에서 클릭으로 선택

### 문제: 이메일 5통 옴
- **원인:** Text Aggregator 없이 RSS → Gmail 직접 연결
- **해결:** 중간에 Text Aggregator 추가

### 문제: 글자 수 초과
- **원인:** description이 2000자 초과
- **해결:** `{{substring(12.description; 0; 1900)}}` 사용

---

## 스케줄 설정

1. 하단 토글 **ON**
2. Run scenario: **Every day**
3. Time: **09:00**
4. Time zone: **Asia/Seoul**

