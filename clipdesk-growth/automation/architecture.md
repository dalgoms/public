# Clipdesk 리드 자동화 아키텍처

## 흐름

```
QR → Form → Webhook → DB → Slack → Sales
```

---

## 필드

| 필드 | 용도 |
|------|------|
| name | 이름 |
| company | 회사명 |
| email | 이메일 |
| interest | 관심 분야 (자막, 번역, 글로벌 등) |
| meeting | 미팅 희망 (Y/N) |

---

## 규칙

- 폼 제출 시 Slack 알림
- 영업 48시간 내 1차 연락
- source: koba, landing 등 UTM 유지
