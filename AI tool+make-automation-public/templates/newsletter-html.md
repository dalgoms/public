# 뉴스레터 HTML 템플릿

## Text Aggregator 템플릿

### 매거진형 (현재 사용 중)

```html
<div style="margin-bottom: 36px; padding-bottom: 36px; border-bottom: 1px solid #eee;">
  <p style="font-size: 14px; color: #0066FF; font-weight: bold; margin: 0 0 8px 0; letter-spacing: 1px;">📍 TREND</p>
  <h3 style="margin: 0 0 16px 0; color: #111; font-size: 26px; line-height: 1.4;">{{12.title}}</h3>
  <p style="margin: 0 0 20px 0; color: #444; font-size: 20px; line-height: 1.8;">{{12.description}}</p>
  <a href="{{12.link}}" style="color: #0066FF; font-size: 18px; text-decoration: none;">원문 보기 →</a>
</div>
```

---

### 카드형

```html
<div style="margin-bottom: 32px; padding: 20px; border-left: 4px solid #0066FF; background: #f8f9fa;">
  <h3 style="margin: 0 0 12px 0; color: #111; font-size: 24px;">{{12.title}}</h3>
  <p style="margin: 0 0 16px 0; color: #555; font-size: 20px; line-height: 1.8;">{{12.description}}</p>
  <a href="{{12.link}}" style="color: #0066FF; font-size: 18px;">원문 보기 →</a>
</div>
```

---

### 심플형

```html
<div style="margin-bottom: 24px;">
  <h3 style="margin: 0 0 8px 0; font-size: 20px;">{{12.title}}</h3>
  <p style="margin: 0 0 8px 0; color: #666; font-size: 16px;">{{12.description}}</p>
  <a href="{{12.link}}" style="color: #0066FF;">원문 보기 →</a>
</div>
<hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
```

---

## Gmail Content 템플릿

### 매거진형 (현재 사용 중)

```html
<div style="max-width: 600px; margin: 0 auto; padding: 24px; font-family: -apple-system, sans-serif; background: #ffffff;">
  <div style="border-bottom: 3px solid #0066FF; padding-bottom: 20px; margin-bottom: 32px;">
    <h1 style="font-size: 32px; color: #111; margin: 0 0 8px 0;">🌅 TIMBEL DAILY BRIEF</h1>
    <p style="font-size: 18px; color: #888; margin: 0;">AI 마케팅 뉴스 | {{formatDate(now; "YYYY.MM.DD")}}</p>
  </div>
  
  {{14.text}}
  
  <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #eee; text-align: center;">
    <p style="font-size: 16px; color: #888; margin: 0;">TIMBEL 마케팅팀 드림</p>
    <p style="font-size: 14px; color: #aaa; margin: 8px 0 0 0;">매일 아침, AI 마케팅 트렌드를 전해드립니다.</p>
  </div>
</div>
```

---

### 심플형

```html
<h1 style="font-size: 28px;">🌅 오늘의 AI 마케팅 뉴스</h1>
<p style="font-size: 18px;">TIMBEL 마케팅팀이 엄선한 오늘의 뉴스입니다.</p>
<hr>
{{14.text}}
<hr>
<p style="font-size: 18px;">TIMBEL 마케팅팀 드림</p>
```

---

## 폰트 사이즈 가이드

| 요소 | 데스크탑 | 모바일 권장 |
|------|----------|-------------|
| 제목 | 24px | 28-32px |
| 뉴스 제목 | 18px | 22-26px |
| 본문 | 14px | 18-22px |
| 링크 | 14px | 16-18px |
| 서명 | 12px | 14-16px |

---

## 색상 코드

| 용도 | 색상 코드 |
|------|-----------|
| 메인 블루 | `#0066FF` |
| 제목 | `#111111` |
| 본문 | `#444444` |
| 서브텍스트 | `#888888` |
| 구분선 | `#EEEEEE` |
| 배경 | `#F8F9FA` |

