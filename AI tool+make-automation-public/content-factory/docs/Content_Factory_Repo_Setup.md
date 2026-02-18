# Content Factory – GitHub Repository Setup

레포지토리 Topics, 커밋 규칙, First Commit, About/태그라인 가이드.

---

# 🏷 GitHub Repository Topics

**Repo Settings → Topics** 에 추가:

```
ai
automation
content-factory
revenue-system
inbound-sales
market-intelligence
notion
make
llm
sales-playbook
marketing-ops
ai-operations
```

**선택 (외부 공개용):**

```
b2b
saas
growth
revops
```

---

# 🧾 Commit Message Convention

이 프로젝트는 **코드보다 시스템 진화 로그**가 중요함.  
일반 개발 스타일보다 **운영 중심 커밋 규칙** 사용.

## 기본 포맷

```
[type]: short description
```

## type 목록

| type | 용도 | 예시 |
|------|------|------|
| **🏗 arch** | 시스템 구조 변경 | `arch: add inbound revenue layer` |
| **🤖 auto** | 자동화 추가/수정 | `auto: add daily keyword agent` |
| **🧠 intel** | 리서치/AI 로직 변경 | `intel: update notebooklm insight prompt` |
| **💼 sales** | 영업 관련 구조 | `sales: introduce inbound playbook schema` |
| **📊 kpi** | 지표/대시보드 | `kpi: add sales interest scoring model` |
| **🧩 ui** | Notion 화면 설계 | `ui: finalize inbound command center layout` |
| **📝 docs** | 문서 업데이트 | `docs: add full system specification` |
| **🔐 ops** | 운영 규칙 / 타임박스 / 알림 | `ops: add 60min timebox alert` |

---

# 🚀 First Commit (그대로 사용)

## 터미널에서

```bash
git commit -m "arch: initialize Content Factory AI revenue system"
```

## GitHub UI에서

**Commit Title**
```
arch: initialize Content Factory AI revenue system
```

**Commit Description**
```
This commit introduces the foundational architecture for Content Factory:

- Market sensing via daily keyword agents
- Research Inbox + NotebookLM intelligence layer
- AI-driven content generation pipeline
- Inbound Sales Playbook system
- Revenue feedback loop with keyword scoring
- Operational timebox safeguards
- Notion-based sales command center UI

Content Factory is designed as an AI-powered Revenue Support System,
connecting market signals directly to inbound sales execution.

Humans make decisions.
AI handles repetition.
Data continuously loops back.
```

---

# ✨ Repo About + Tagline (최종 추천)

**About (짧은 설명)**

```
AI-powered Content Factory connecting market sensing, content generation, and inbound sales into one revenue support system.
```

**Short Description / Tagline**

```
AI reads the market. Humans close the deals.
```

---

# 참고

- 메인 스펙: [content-factory-full-spec.md](../content-factory-full-spec.md)
