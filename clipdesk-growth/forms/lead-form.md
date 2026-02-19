# Clipdesk 리드 폼 설계

## 필수 필드

| 필드 | 타입 | placeholder |
|------|------|-------------|
| name | text | 이름 |
| company | text | 회사명 |
| email | email | 이메일 |
| phone | tel | 전화 (선택) |

## 선택 필드

| 필드 | 타입 | 옵션 |
|------|------|------|
| interest | select | caption / transcription / edit / 기타 |
| meeting | select | Y / N |
| source | hidden | koba, landing 등 |

## CTA

- 제출 버튼: "상담 신청" / "데모 요청"

## 수집 후

- Webhook → DB (Notion/Supabase 등)
- Slack 알림
- thankyou 페이지 or 자동 응답 이메일
