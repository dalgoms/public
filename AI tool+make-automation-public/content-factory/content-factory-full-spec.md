# 🏭 Content Factory v1.1 – Full System Specification

AI 기반 콘텐츠 자동화 + 인바운드 영업 Revenue Support System

| 항목 | 내용 |
|------|------|
| **Version** | 1.1 |
| **Status** | Production Design |
| **Owner** | Content Factory PM |

**관련 문서**
- [Content Factory Repo Setup](./docs/Content_Factory_Repo_Setup.md) – GitHub Topics, 커밋 규칙, First Commit, About/태그라인

---

# 0. Introduction

Content Factory는 단순 콘텐츠 자동화 시스템이 아니다.

본 시스템은 다음을 **하나의 파이프라인**으로 통합한다:

- 시장 자동 감지
- 경쟁사 모니터링
- AI 기반 리서치 구조화
- 콘텐츠 자동 생성
- 인바운드 영업 메시지 자동 생성
- 키워드 성과 학습
- Revenue Intelligence

> **Content Factory는 AI 기반 Inbound Revenue Operating System이다.**

- **사람**: 판단, 관계
- **AI**: 반복 업무, 구조화

---

# 1. Core Philosophy

## 1.1 Principles

- Humans think
- AI executes
- Data loops back

## 1.2 Operational Goals

- 매일 시장이 자동 수집될 것
- 매일 콘텐츠가 생성될 것
- 매일 영업 스크립트가 생성될 것
- 모든 결과가 다음날 전략에 반영될 것

---

# 2. High-Level Pipeline

```
Daily Flow:

Keyword Master (Score-based Top3)
    ↓
Daily Keyword Agent (Make)
    ↓
Research Inbox (Quality Filtered)
    ↓
NotebookLM (5 Insight Types)
    ↓
Newsletter Input
    ↓
AI Content Engine (GPT / Claude)
    ↓
Newsletter Archive
    ↓
Sales Angle Generator
    ↓
Inbound Sales Playbook
    ↓
Inbound Leads DB
    ↓
Sales Execution
    ↓
Conversion Data
    ↓
Keyword Score Update
    ↓
Next Day Top Keywords
```

---

# 2.5 설계 시 빠지기 쉬운 핵심 구멍 (Gaps)

운영하다 보면 드러나는 구멍들. v1.1 보완으로 메꿔야 할 부분.

---

## A. 소스 품질/중복/노이즈 제어 부족

- **문제:** "링크 10건"을 채우는 게 목표가 되면 쓰레기 링크가 쌓임.
- **중복:** URL 동일 기준만이면 UTM/리다이렉트/미러 페이지로 중복이 계속 들어옴.
- **보완:** URL 정규화 + 도메인 신뢰도(Source Registry) + 스팸 필터 + **최소 품질 점수** 도입.

---

## B. NotebookLM 수동 단계의 리스크 관리

- **문제:** NotebookLM은 API가 없어 "반자동"이 현실인데,  
  - 누락(오늘 안 함)  
  - 품질 낮음(요약이 별로)  
  - 시간 초과(몰입)  
  이 3가지가 항상 발생함.
- **보완:** **대체 경로(Fallback)** + 품질 기준 + **타임박스 자동 강제**.

---

## C. 콘텐츠/영업 스크립트의 "버전 관리" 부재

- **문제:** 프롬프트/템플릿은 반드시 버전이 쌓여야 개선됨. "좋은 프롬프트가 있다" 수준이면 나중에 바뀌어도 왜 좋아졌는지 추적 어려움.
- **보완:** **Prompt Registry** + Output QA 로그 + 변경 이력.

---

## D. 전환/성과 데이터의 연결 규칙이 약함

- **문제:** 인바운드 기반이면 "콘텐츠→문의→미팅→계약"까지 최소한의 연결이 있어야 진짜 돈이 됨. 문의 중심으로만 KPI가 닿아 있음.
- **보완:** **Inbound Leads DB** + Deal DB 최소 스키마 + **키워드/콘텐츠 attribution** 규칙.

---

## E. 운영 모니터링/장애 대응(실패했을 때) 설계 부족

- **문제:** Make 시나리오는 언젠가 실패함: RSS 끊김, 검색 API 에러, Notion rate limit, 중복 폭증, 메일 발송 실패.
- **보완:** **Error Log DB** + 재시도 + **데일리 헬스체크 메일**.

---

# 3. Notion Database Architecture

## 3.1 Keyword Master

**Purpose:** Strategic Core

| Property | Type | 비고 |
|---------|------|------|
| Keyword | Title | |
| Business Unit | Select | |
| Topic | Multi-select | |
| Funnel Default | Select | |
| Active | Checkbox | |
| Priority | Legacy | |
| Last Used | Date | |
| Collected Count | Rollup | |
| Insight Count | Rollup | |
| Conversion Count | Rollup | |
| **Sales Interest Score** | Formula | Top3 선정 기준 |

**Sales Interest Score (v1.1):**

- Last 7d Collected × 1
- Last 7d Content × 2
- Last 30d Meetings × 5
- Last 30d Won Deals × 10

→ **Top3 = Sales Interest Score 상위 3개 (Active=true).**  
→ Priority 수동이 아닌 **Score 자동 산정**. 인바운드 기반이면 문의보다 **미팅/계약** 가중치를 더 높임.

---

## 3.2 Research Inbox

**Purpose:** Raw Market Intake

| Property | Type | 비고 |
|---------|------|------|
| Title | Title | |
| URL | URL | |
| Canonical URL | URL | 정규화 후 |
| Domain | Text | |
| Keyword | Relation | |
| Business Unit | Select | |
| Topic | Multi-select | |
| Funnel Stage | Select | |
| Source | Text | |
| Trust Score | Rollup | Source Registry 연동 |
| Quality Score | Formula | 아래 예시 참고 |
| Reason Excluded | Text | (optional) 제외 사유 |
| Status | Select | New / Sent / Done |
| Collected At | Date | |

**URL 정규화 규칙 (권장):**

- `utm_*`, `fbclid`, `gclid` 제거
- trailing slash 통일
- http/https 통일
- 리다이렉트 최종 URL 가능하면 저장(HTTP HEAD)

**Quality Score 예시 (단순):**  
Trust Score(1~5) + (Title 길이 조건) + (키워드 포함 여부)

**Daily goal:** "링크 10개 채우기"가 아니라 **Quality Score 상위 10개**를 목표로 변경.

---

## 3.3 Newsletter Input

NotebookLM 출력 스테이징.

| Property | 비고 |
|----------|------|
| Hook | |
| Problem (3) | |
| Authority | |
| Principles | |
| Example | |
| Raw Research | |
| Status | Draft Requested / Completed |

---

## 3.4 Newsletter Archive

**Purpose:** Final Content Store

| Property | Type | 비고 |
|---------|------|------|
| Title | Title | |
| Publish Date | Date | |
| Keyword | Relation | |
| Business Unit | Select | |
| Topic | Multi-select | |
| Funnel Stage | Select | |
| Content Type | Select | |
| Summary | Text | |
| Full Content | Text/Block | |
| Sales Angle | Text | |
| QA Score | Number | |
| QA Notes | Text | |
| QA Status | Select | Pass / Revise |
| Conversion Count | Rollup | |
| Status | Select | |

**QA Checklist (1 min):**

1. 사실/오해 소지 문장 있는가? (Factual risk?)
2. 너무 AI 말투인가? (Too generic AI tone?)
3. CTA가 명확한가?
4. 카테고리/퍼널 태깅이 맞는가?
5. 영업팀이 바로 쓰기 쉬운가?

**Pass가 아니면** "발행"으로 가지 않고 **Revise**로 분기.

---

## 3.5 Inbound Sales Playbook

**Purpose:** Auto-generated Sales Intelligence

| Property | 비고 |
|----------|------|
| Keyword | |
| Funnel Stage | |
| Customer Intent | |
| First Response Script | |
| Qualification Questions | |
| Objection Handling | |
| Value Proposition | |
| Closing CTA | |
| Source Content | Relation |

**Customer Intent Types:**

- Information Seeking
- Solution Comparison
- Purchase Evaluation
- Urgent Implementation

---

## 3.6 Inbound Leads (NEW – Revenue Core)

**Purpose:** 실제 영업 운영 DB. 모든 인바운드 자동화가 여기로 집결.

| Property | Type | 비고 |
|---------|------|------|
| Lead Name | Title | |
| Company | Text | |
| Contact | Text/Email | |
| Received At | Date | |
| Keyword | Relation | |
| Source Content | Relation | |
| Customer Intent | Select | |
| First Response Script | Text | |
| Owner | Person | |
| Status | Select | New / Contacted / Meeting / Won / Lost |
| Meeting Date | Date | |
| Deal Amount | Number | |
| Notes | Text | |

---

## 3.7 Source Registry (NEW)

**Purpose:** 신뢰할 수 있는 출처 목록/점수 관리. 수집 에이전트가 링크 저장 전에 Domain을 조회해 Trust Score가 낮으면 제외.

| Property | Type |
|----------|------|
| Domain | Title |
| Source Type | Select: News / Blog / Vendor / Community |
| Trust Score | Number (1–5) |
| Active | Checkbox |
| Notes | Text |

---

## 3.8 Prompt Registry (NEW)

**Purpose:** Prompt 버전 관리. 모든 프롬프트는 여기 등록.

| Property | Type |
|----------|------|
| Name | Title |
| Purpose | Select | NotebookLM / Content / Sales / Intent |
| Version | Text |
| Prompt Text | Text |
| Output Format Spec | Text |
| Owner | Person |
| Updated At | Date |

---

## 3.9 Error Log (NEW)

**Purpose:** 자동화 실패 추적. Make 시나리오 실패 시 여기 기록.

| Property | Type |
|----------|------|
| Timestamp | Created time (자동) |
| Scenario | Select |
| Step | Text |
| Error Message | Text |
| Payload | Text |
| Severity | Select: Low / Med / High |
| Status | Select: Open / Resolved |

---

## 3.10 Content Factory Log

**Purpose:** 일일 운영 추적

| Property | Type |
|----------|------|
| Date | Date |
| Work Started | Date/Time |
| Research Completed | Date/Time |
| Draft Generated | Date/Time |
| Final Uploaded | Date/Time |
| Total Time | Formula |
| Status | Select | Completed / Over 60 / Skipped |
| Notes | Text |

---

# 4. Automation Layers (Make.com)

## 4.1 Daily Keyword Agent (09:00)

1. Keyword Master `Active = true`
2. Sort by **Sales Interest Score DESC**
3. **Pick Top3**
4. Crawl RSS / HTTP (3–4 per keyword)
5. Normalize URLs
6. **Domain Trust Check** (Source Registry)
7. Save to **Research Inbox**
8. Update **Last Used**

---

## 4.2 NotebookLM Research (Human-in-loop)

**Timebox:** 3–5 minutes (자동 강제 권장)

**Output (5 Insight Types):**

- Repeated Problems (3)
- Market Trends
- Practical Insights (5)
- Hooks (2)
- Sales Angles

**Fallback A (시간 없을 때):**  
Raw Research만 저장하고 Draft 생성 스킵 가능(주 1회 제한). 시스템은 "미실행"이 아니라 "리서치만"으로 기록.

**Fallback B (품질이 낮을 때):**  
NotebookLM에게 "재요약"을 요구하는 2nd-pass 프롬프트 준비 (Prompt Registry에 버전 관리):
- "위 결과가 추상적이다. 숫자/사례/명확한 주장 위주로 재작성"
- "각 인사이트에 근거 문장을 1개씩 붙여라"
- "훅은 질문형 1개, 선언형 1개, 데이터형 1개"

---

## 4.3 Content Generation

**Trigger:** Newsletter Input `Draft Requested`

- GPT / Claude
- Archive creation
- QA Status default = **Revise**

---

## 4.4 Sales Playbook Generation

**Trigger:** Newsletter Archive Published

LLM generates:

- Customer Intent
- First Response
- Questions
- Objections
- Closing

→ Stored in **Playbook** + injected into future **Leads**

---

## 4.5 Inbound Lead Automation

**Trigger:** Webhook (문의 발생)

**플로우 (v1.1 리팩토링):**

1. 문의(Webhook) 수신
2. **Keyword/UTM 파싱**
3. **관련 콘텐츠(Source Content)** 매칭
4. **Intent 분류** (LLM)
5. **First Response / Questions / Objection / Closing** 생성
6. **Inbound Leads DB** 생성
7. **영업팀 회사메일 발송** (Lead 링크 포함)

영업팀 화면은 **Inbound Leads**를 바라보게 설계하는 게 안정적. Playbook만이 아니라 실제 운영 DB에 꽂혀야 함.

---

## 4.6 Today Sales Keywords (16:00)

- Top3 Keywords by Sales Interest Score
- Auto-email to Sales:
  - Keyword
  - Intent trend
  - Script snippets

---

## 4.7 Timebox Enforcement

**On Work Started:**

- Sleep 3600s
- If Status ≠ Completed → **Company Email Alert**

---

## 4.8 Daily Healthcheck Email (NEW, 강추)

**Sent:** 09:30 또는 10:00, 회사메일로 자동 발송

**Contents:**

- 오늘 수집 링크 수
- Quality Score 평균
- NotebookLM 처리 여부 (로그 기반)
- Draft 생성 여부
- 에러 로그(Open) 개수
- Today Sales Keywords Top3

→ **이거 하나면 "시스템이 살아있는지" 매일 확인 가능.**

---

# 5. Inbound Sales UI (Notion)

**Main Page:** Inbound Command Center

**Views:**

1. **Inbound Queue** (sorted by Intent → Score → Time)
2. **Lead Detail** (AI Sales Assistant)
3. **Today Sales Keywords** (Board)
4. **Performance** (Admin only)

**Sales flow:**

Open Notion → Top Lead → Copy First Response → Contact → Update Status

---

# 6. Operational Rules

**Daily (리팩토링 반영):**

- NotebookLM ≤ 5 min
- **Total ≤ 60 min (강제)**  
- **추가: 수정 상한 10분(절대) + 타이머 알림**  
- 데일리에서 완벽을 추구하지 않고, 주간 슬롯에서 개선하는 구조로 "지속 가능성" 확보

**Weekly – 리팩토링 슬롯 (30~60 min):**

- 매주 1회 "리팩토링 슬롯"
- 프롬프트 개선
- 카테고리 정리
- 품질 낮은 출처 제거 (Source Registry)
- Top Keyword 로직 튜닝

---

# 7. KPI Framework

| Layer | Metrics |
|-------|---------|
| **Input** | Quality Links |
| **Processing** | Insights, Content |
| **Revenue** | Leads, Meetings, Won Deals, Keyword Attribution |

---

# 8. Organization Model

```
CEO
  ↓
Content Factory (AI Ops Hub)
  ↓
Business Units (Technical Validation)
  ↓
Sales Team (Inbound Execution)
```

---

# 9. Before / After

| Before | After |
|--------|--------|
| Manual research | AI market sensing |
| Content by intuition | Structured content |
| Sales by personal skill | AI-generated sales scripts + data-driven keyword strategy |

---

# 10. Roadmap

| Month | Focus |
|-------|--------|
| **Month 1** | Foundation |
| **Month 2** | Conversion |
| **Month 3** | Prediction |

---

# 11. Final State

**System performs:**

- Market sensing
- Content generation
- Sales scripting
- Revenue keyword prediction

**Humans perform:**

- Judgment
- Relationships
- Decisions

---

# 11.5 리팩토링 적용 요약 및 우선순위

## 추천 우선순위 (실제 적용 순서)

1. **Inbound Leads DB 도입** – 영업 실행 데이터 코어
2. **URL 정규화 + 중복/품질 점수** – 노이즈 방지
3. **Prompt Registry** – 개선의 누적
4. **Error Log + Healthcheck 메일** – 운영 안정화
5. **Top3 자동 산정(Score)** – 학습형 운영

---

## 리팩토링 완료 후 시스템 상태

- 링크가 **많이** 쌓이는 게 아니라 **좋은 링크만** 쌓임
- NotebookLM이 흔들려도 **Fallback**으로 운영이 멈추지 않음
- 콘텐츠/영업 스크립트가 **버전 관리**되며 계속 좋아짐
- 영업팀은 Notion에서 **리드 중심**으로 바로 실행
- 대표/부서장은 매일 **Healthcheck**로 운영 상태 확인

즉, "잘 만든 자동화"가 아니라 **운영 가능한 Revenue System**이 됨.

---

# 12. Conclusion

Content Factory v1.1 is not automation.

It is an **AI-driven inbound revenue operating system.**

---

*END*
