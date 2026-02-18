# 📊 KPI Dashboard

Content Factory v1.1 KPI 프레임워크 및 대시보드 설계.

---

## Input

- **Quality Links** – 수집 링크 수, Quality Score 평균

---

## Processing

- **Insights** – NotebookLM 처리 여부, 인사이트 건수
- **Content** – Draft 생성 여부, 최종 업로드 건수

---

## Revenue

- **Leads** – Inbound Leads 신규/Contacted/Meeting
- **Meetings** – Meeting Date, Keyword별 미팅 수
- **Won Deals** – Deal Amount, Keyword Attribution
- **Keyword Attribution** – 콘텐츠→문의→미팅→계약 연결

---

## 추적 지표 요약

| 지표 | 설명 |
|------|------|
| Daily Collected Links | 일일 수집 링크 수 |
| Quality Score (Avg) | Research Inbox 품질 점수 평균 |
| Generated Contents | 생성된 콘텐츠 수 |
| Conversion Count | 전환(미팅/계약) 수 |
| Keyword Sales Interest Score | 키워드별 매출 관심 점수 |
| First Response Time | 첫 응답 시간 |
| Won Deals by Keyword | 키워드별 낙찰 건수/금액 |

---

## Daily Healthcheck 연동

매일 09:30 Healthcheck 메일에서 확인:

- 오늘 수집 링크 수
- Quality Score 평균
- NotebookLM 처리 여부
- Draft 생성 여부
- Open Errors 개수
- Today Sales Keywords Top3

---

*Full spec: [content-factory-full-spec.md](../content-factory-full-spec.md)*
