### WebScout Next — Collect API configuration

This app proxies crawl requests through the existing Express backend used by the original WebScout Agent.

#### Required environment variables

- **`COLLECT_API_URL`** (required in production)
  - URL of the Express collect endpoint.
  - Example:
    - `https://your-express-deployment.example.com/api/collect`
  - The Next.js route `app/api/collect/route.ts` will:
    - In **production**: return HTTP 500 if `COLLECT_API_URL` is not set.
    - In **development**: also return HTTP 500 with a clear message if missing, instead of silently falling back to `localhost`.

