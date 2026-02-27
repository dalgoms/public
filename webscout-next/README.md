### WebScout Next — Live demo / 라이브 데모

- Vercel deployment / 배포 주소:  
  `https://webscout-six.vercel.app/`

---

### WebScout Next — Collect API configuration

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
      → **개발 환경**에서도 더 이상 자동으로 `localhost`로 떨어지지 않고, 환경 변수가 없으면 명확한 에러 메시지와 함께 HTTP 500을 반환합니다.


