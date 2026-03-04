## 05 — Next Steps Toward a Paid Subscription

This document outlines recommended next steps if WebScout is taken to a paid, subscription-based product.

### 1. Accounts & Plans

- Add **authentication**:
  - Email + password or magic-link sign-in.
  - Optional social login (Google) for faster onboarding.
- Define **plans**:
  - Free tier: limited number of analyses per month and/or limited domains.
  - Pro tier: higher limits, bookmarks + exports, more depth.
  - Team tier (later): shared workspaces, notes, and exports.

### 2. Usage Limits & Quotas

- Implement server-side tracking of:
  - Number of crawls per user per month.
  - Number of distinct domains analyzed.
  - Maximum depth and maximum number of URLs per crawl.
- Show **usage meters** in the UI:
  - “You’ve used 3 / 10 analyses this month.”
  - Clear messaging when a limit is reached, with a path to upgrade.

### 3. Billing & Checkout

- Integrate with a billing provider (e.g. **Stripe Billing**):
  - Recurring subscriptions.
  - Automatic invoices and receipts.
  - Webhooks to update user plan status in the app.
- Add an **Upgrade** entry point:
  - From the main navigation.
  - From inline upsell spots (e.g. trying to export on the free tier).

### 4. Reliability & Observability

- Add monitoring for:
  - Collector health (latency, error rates).
  - Frontend errors via a tool like Sentry.
- Log key events:
  - Crawl started / completed / failed.
  - Upstream collector errors (domain unreachable, timeouts).
- Build a simple **status page** or health indicator on the Analyze screen:
  - For example, showing when the upstream collector is degraded.

### 5. UX Enhancements for Power Users

- Saved **projects** or **collections** of domains (e.g. “Competitors in segment X”).
- Notes or annotations attached to URLs or insights.
- Export presets:
  - “Share with UX designer”
  - “Share with SEO agency”
- Deeper integrations:
  - Direct Figma plugin or URL import.
  - CSV exports for SEO tools.

### 6. Documentation & Marketing

- Public docs:
  - “How WebScout works” (IA-focused explanation).
  - “How we calculate Insight Scores” (based on `03-insights-and-scoring.md`).
- Marketing pages:
  - Use real examples of competitor analyses.
  - Show before/after IA diagrams derived from WebScout crawls.

These steps can be added incrementally, using the current Next.js app and collector as a solid foundation. The first milestone is a **stable, invite-only paid beta** with authentication, basic limits, and Stripe-backed subscriptions.

