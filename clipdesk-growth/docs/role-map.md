# Role Ownership Map

역할별 책임·산출물·KPI를 한눈에 보는 조직도 Blueprint.

---

## 조직 구조

```mermaid
flowchart TB
    subgraph GO["Growth Owner (1명)"]
        direction TB
        GO_R["Responsibility: 메시지·IA·KPI·퍼널·자동화"]
        GO_O["Weekly Output: 전략·IA·콘텐츠 취합·KPI 리뷰"]
        GO_K["KPI: 데모·미팅·계약·48h 후속률"]
    end

    subgraph DS["Designer (1명)"]
        direction TB
        DS_R["Responsibility: 시각물 전담"]
        DS_O["Weekly Output: Hero, 썸네일, 리플렛, 랜딩 UI"]
        DS_K["KPI: 산출물 납기"]
    end

    subgraph BU["Business Units"]
        subgraph ED["Edit (1명)"]
            direction TB
            ED_R["Responsibility: 영상·YouTube·Naver TV"]
            ED_O["Weekly Output: 콘텐츠 게시 주 2"]
            ED_K["KPI: 시청·링크·미팅"]
        end

        subgraph TR["Transcription (1명)"]
            direction TB
            TR_R["Responsibility: 글로벌 사례·LinkedIn India"]
            TR_O["Weekly Output: 블로그 2주1, SNS 주1"]
            TR_K["KPI: 유입·조회·리드 이관"]
        end

        subgraph CP["Caption (1명)"]
            direction TB
            CP_R["Responsibility: 국내 자막 Before/After"]
            CP_O["Weekly Output: 블로그 2주1, Naver TV 2주1"]
            CP_K["KPI: 시청·샘플 제공"]
        end
    end

    GO --> DS
    GO --> BU
```

**요약**
- Growth Owner는 전략·구조·KPI·자동화를 담당하고, Designer·사업부는 실행.
- Designer는 시각 자산, Edit·Transcription·Caption은 채널별 콘텐츠 담당.
- R=책임, O=주간 산출, K=KPI.

---

## 책임 흐름 (RACI 관점)

```mermaid
flowchart LR
    A[전략·IA] --> B[시각물] --> C[채널 실행]
    A -.->|Accountable| A
    B -.->|Responsible| B
    C -.->|Responsible| C

    style A fill:#e8f3ff
    style B fill:#f2f4f6
    style C fill:#e5e8eb
```

**요약**
- Growth Owner: A(책임) / Designer·사업부: R(실행).
- 총괄은 전략·구조·KPI에 집중하고, 콘텐츠·채널은 사업부가 직접 운영.
