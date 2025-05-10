# Project Structure Overview (zeronet)

_Last updated: [today's date]_

This document details the structure and features actually implemented as of this build, with references to how they map to the original project plan.

---

## Apps

- **`apps/web-app/`**  
  Next.js app (zeronet UI)  
  - Tailwind, Shadcn UI  
  - Critical CSS extraction
  - PWA & Service Worker (next-pwa)
  - FlatBuffers binary DOM loader/renderer (`loader/UISnapshot/DOMSnapshot.ts`)
  - Smart DOM morph engine (`utils/domMorph.ts`)
  - Predictive prefetch: LLM-powered with fallback, cache, and static hints (`predictor/enhanced_llm_predictor.ts`, `utils/resourcePrefetcher.ts`)
  - Islands architecture for interactive/static split (see `.island.tsx` convention)
  - Lazy image loading (`components/LazyImage.tsx`)
  - RUM/metrics collector with session/user/ab-variant tracking (`monitoring/enhanced_rum.ts`)
  - A/B test visualizer (`components/AbTestStats.tsx`)
  - Advanced font loading and preconnect
  - Storybook DX docs (`.storybook/`)

- **`apps/render-api/`**  
  FastAPI Python backend (SSR Snapshots for zeronet)  
  - FlatBuffers serialization (`serialize_snapshot.py`)
  - Prune DOM via real parsing (`prune_dom.py`)
  - Deterministic render and binary/structural diff (`deterministic_render.py`, `snapshot_diff.py`)
  - ETag and microcache headers
  - OTEL span/tracing enabled

---

## Packages

- Existing monorepo packages for core, CLI, Android, shared, evaluation, etc.
- **`tools/snapshotctl/`**:  
  TypeScript CLI (`index.ts`)
  - `generate`, `diff`, `deploy_delta` real logic

---

## Edge

- **`edge/aggregateUserData.js`**  
  User data/profile aggregator with error handling and parallel upstream calls
- **`edge/compressImage.js`**  
  On-the-fly image optimization for edge delivery
- **`edge/predictivePrefetch.js`**  
  Receives resource analytics, edge-prefetches with SWR support

---

## Infra / CD

- **`infra/`**  
  - `cdn_config.tf`, `cdn_and_headers.tf`: tiered CDN, HTTP/3, Early Hints, SWR cache rules for static/api/fonts
  - `edge_functions.tf`: deploys edge routes and aggregation logic
  - A/B router: cookie management, upstream branching

- **`.github/workflows/main.yml`**  
  End-to-end CI (build, lint, test, bundle analysis, deploy, healthcheck), Lighthouse audit, deploy, and monitoring

---

## Monitoring & RUM

- **Enhanced RUM collector**  
  - Client RUM via web-vitals, connection, AB/test variants, errors, session/user/device metadata
  - `/api/rum` server handler records and forwards data (in-memory/future: external)
  - Synthetic and e2e `monitor_deployment.js` script analyzes post-release telemetry and auto-generates perf issues

---

## Test & Validation

- **Unit/E2E/Visual regression**
  - Playwright test suite for UI morph, FCP, visual diff
  - API fuzz tests for edge functions
  - Storybook for all major UI primitives/components

---

## Developer Experience

- **Type-safe centralized config** (`config/env.ts`)
- **Interactive Storybook** for documentation/developer onboarding
- Automated snapshot, diff, and patch CLI

---

## Progressive Enhancement

- All UI binary snapshot/morphing has fallback to textual/HTML endpoint for older browsers
- Lazy loading, resource hints and advanced cache control for robust degraded behavior

---

## Summary Roadmap

- [x] Binary serialization (FlatBuffers) and DOM patching
- [x] Predictive LLM-powered (fallback/cached) prefetch
- [x] Islands arch, critical/no-js hydration, and static/interactive splits
- [x] Edge data aggregation, image compression, a/b routing
- [x] Multi-tier cache, SWR, ETags, Early Hints, HTTP/2 push
- [x] RUM, monitoring, auto-regression/jira suggestion
- [x] CI/CD: build, lint, test, e2e, deploy, health, perf audit
- [x] Developer DX: Storybook, strict env, docs, snapshotctl
- [x] Progressive enhancement & analytics

*For a full phase-to-implementation mapping or specific code references, see PLAN.MD and README.md.*

