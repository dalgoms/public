# Company System Map

회사 전체 Growth 구조를 한 장에 표현한 Blueprint.

---

## TIMBEL → timblo → Clipdesk 구조

```mermaid
flowchart TB
    subgraph TIMBEL[" "]
        A["TIMBEL
        ----
        Brand Hub
        모든 서비스 진입점 · 3월 완료"]
    end

    subgraph H1["상반기"]
        B["timblo
        ----
        H1 Revenue Engine
        데모 → 미팅 → 계약
        LinkedIn, Blog, Landing"]
    end

    subgraph H2["하반기"]
        C["Clipdesk
        ----
        H2 Channel + KOBA
        콘텐츠 자동화 확장
        LinkedIn, YouTube, Naver TV, 전시"]
    end

    TIMBEL --> H1
    TIMBEL --> H2
```

**요약**
- TIMBEL은 상반기·하반기 모든 제품의 공통 진입점.
- timblo는 상반기 Revenue 중심, Clipdesk는 하반기 Channel + KOBA 중심.
- 동시 운영 가능하며, 시즌별로 집중도만 조정.

---

## 간소화 트리 뷰

```mermaid
flowchart LR
    A[("TIMBEL<br/>Brand Hub")] --> B[("timblo<br/>H1 Revenue")]
    A --> C[("Clipdesk<br/>H2 Channel + KOBA")]

    style A fill:#e8f3ff
    style B fill:#d4edda
    style C fill:#fff3cd
```

**요약**
- 좌→우: 상위 브랜드 → 제품 단위.
- 색상: 브랜드(파랑), 상반기(초록), 하반기(노랑).
