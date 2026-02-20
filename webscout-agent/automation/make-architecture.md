# Make 연동 아키텍처

## Phase 2 자동화 흐름

```
DM / Form
    ↓
Webhook
    ↓
Make.com
    ↓
Notion or Supabase (DB)
    ↓
Slack 알림
```

## 구성 요소

| 단계 | 도구 | 역할 |
|------|------|------|
| 수집 | Instagram DM, 웹폼 | 리드 유입 |
| 트리거 | Webhook | 실시간 전달 |
| 처리 | Make | 분류, 매핑 |
| 저장 | Notion DB / Supabase | 리드 DB |
| 알림 | Slack | 팀 공유 |

## 태그 분류

- `industry`
- `usecase`
- `urgency`
