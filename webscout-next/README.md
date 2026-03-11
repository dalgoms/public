# WebScout Next

AI-powered website structure analyzer. Paste a URL and get site map, key pages, SEO signals, and UX insights in seconds.

URL만 넣으면 사이트맵, 핵심 페이지, SEO·UX 인사이트를 바로 확인할 수 있는 웹 구조 분석 도구입니다.

---

### Live demo / 라이브 데모

- **[https://webscout-six.vercel.app/](https://webscout-next-8veo.vercel.app/)**

---

### Features / 기능

- **Sitemap view** — URL 목록, depth·query·external 구분, 필터·페이지네이션
- **Insights** — Heuristic 점수 (Insight Score, SEO, UX/Structure), Priority Fixes, 개선 팁
- **Bookmarks & export** — URL 북마크, 필터 기준 Export (다운로드·복사)
- **Figma Ready / Page Types / Importance** — 탭별 뷰
- **Product info panel** — 랜딩 우측 정보 패널 (데스크톱)

---

### Tech stack

- Next.js 14 (App Router), React, TypeScript
- Tailwind CSS
- Proxy to Express collect API (`/api/collect`)

---

### Collect API configuration / API 설정

This app proxies crawl requests through the existing Express backend used by the original WebScout Agent.

이 앱은 기존 WebScout Agent에서 사용하던 **Express 기반 크롤러 백엔드**로 모든 크롤 요청을 프록시합니다.

#### Required environment variables / 필수 환경 변수

- **`COLLECT_API_URL`** (required in production / 프로덕션에서 필수)
  - URL of the Express collect endpoint.  
    크롤을 담당하는 Express 서버의 `/api/collect` 엔드포인트 URL입니다.
  - Example / 예시:
    - `https://your-express-deployment.example.com/api/collect`
  - The Next.js route `app/api/collect/route.ts` will:  
    Next.js 측 `app/api/collect/route.ts` 동작:
  - In **production**: return HTTP 500 if `COLLECT_API_URL` is not set.  
    → **프로덕션**에서 `COLLECT_API_URL`이 설정되어 있지 않으면 HTTP 500을 반환합니다.
  - In **development**: also return HTTP 500 with a clear message if missing, instead of silently falling back to `localhost`.  
    → **개발 환경**에서도 환경 변수가 없으면 명확한 에러 메시지와 함께 HTTP 500을 반환합니다.

---

### Docs

- **`docs/`** — 1차 고도화 정리 (product overview, UX/UI, insights·scoring, tech·security, next steps)
- **`WEBSCOUT_AUDIT.md`** — 구현 스펙·보안 점검

---

### Run locally

```bash
cd webscout-next
npm install
npm run dev
```

Set `COLLECT_API_URL` to your Express collect endpoint, or use the default `http://localhost:3003/api/collect` in development.

