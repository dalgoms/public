# Lead Flow Diagram

리드가 수집·전달·후속까지 흐르는 파이프라인 Blueprint.

---

## 단계별 파이프라인

```mermaid
flowchart LR
    subgraph IN["유입"]
        A["Content<br/>온라인 콘텐츠"]
    end

    subgraph TR["수집"]
        B["Landing/QR<br/>진입점"]
        C["Form<br/>필드 입력"]
    end

    subgraph DB["저장"]
        D["DB<br/>Notion/Supabase"]
    end

    subgraph AC["대응"]
        E["Notification<br/>Slack 알림"]
        F["48h Follow-up<br/>감사 메일 + 전화"]
        G["Sales<br/>미팅·견적·계약"]
    end

    A --> B --> C --> D --> E --> F --> G
```

**요약**
- Content → Landing/QR → Form → DB → Notification → 48h Follow-up → Sales 순서로 흐름.
- 48시간 내 후속이 기본 기준.
- DB 이후 알림·할당은 자동화 권장.

---

## 수평 파이프라인 (간소화)

```mermaid
flowchart LR
    A[Content] --> B[Landing/QR]
    B --> C[Form]
    C --> D[(DB)]
    D --> E[Notify]
    E --> F[48h]
    F --> G[Sales]

    style A fill:#e8f3ff
    style D fill:#fff3cd
    style G fill:#d4edda
```

**요약**
- 파랑: 유입 / 노랑: 저장 / 초록: 전환.
- Form → DB → Notify 구간은 자동화하여 수동 작업 최소화.

---

## KOBA 현장 흐름

```mermaid
flowchart TB
    subgraph ON["온라인"]
        A["사전 콘텐츠"]
        B["초대 이메일"]
    end

    subgraph OFF["현장"]
        C["부스 QR 스캔"]
        D["명함 / 태블릿"]
    end

    subgraph POST["전시 후"]
        E["리드 이관"]
        F["우선순위 분류"]
        G["48h 내 1차 연락"]
    end

    A --> C
    B --> C
    C --> D
    D --> E --> F --> G
```

**요약**
- 온라인(사전 콘텐츠·초대) → 현장(QR·명함) → 전시 후(이관·분류·48h 연락).
- D-day 종료 시 당일 리드 이관, D+2 내 연락 완료 목표.
