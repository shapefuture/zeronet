# Ultra-Low-Latency Web Delivery Platform (Monorepo)

**Midscene.js Ultra** is an open-source, agent- and AI-driven monorepo for ultra-low-latency web app delivery, combining bleeding-edge frontend, backend, edge, and developer tooling.  
Designed for OSS-first, free-tier-optimized, and cloud-edge-native environments—this platform tightly integrates advanced automation, observability, and performance optimization at every layer.

---

## 🚀 Key Features

- **Binary DOM Serialization:**  
  Ultra-efficient, FlatBuffers-based server-to-client DOM snapshots for minimal network overhead and ultra-fast updates.
- **Intelligent DOM Morphing:**  
  Smart client patching with fine-grained diffing (morphdom), performance metrics, and progressive enhancement fallback.
- **Edge Compute Functions:**  
  Cloudflare Workers for data aggregation, predictive prefetch, image optimization, and A/B routing—configurable and robust.
- **Predictive Navigation (LLM-powered):**  
  Local-first, fallback-to-cloud LLMs predict user navigation and prefetch/prerender the most likely routes, with caching and resilience.
- **Advanced Resource Loading & Caching:**  
  HTTP/3, Early Hints, tiered caching, SWR, ETags, font subsetting, preconnect, and critical CSS.
- **A/B Testing & Analytics:**  
  Cookie-based split with edge routing, built-in metrics, and real-time reporting UI.
- **Comprehensive Real User Monitoring (RUM):**  
  Web-vitals, session/user/ab-variant tracking, and Beacon/fetch APIs for full UX observability.
- **CI/CD & Visual Regression:**  
  Modern GitHub Actions pipelines for build, test, e2e, visual diff (pixelmatch/Playwright), deploy, and healthcheck.
- **Developer Experience:**  
  Type-safe config, codegen, Storybook, CLI tooling (`snapshotctl`), and strict environment validation.

---

## 🏗️ Monorepo Structure

```
apps/
  web-app/            # Next.js UI, binary DOM loader/morph, RUM, Storybook, A/B UI
  render-api/         # FastAPI backend, FlatBuffers, deterministic render, diff
edge/
  aggregateUserData.js  # Edge profile/prefs aggregator
  compressImage.js      # Edge image optimizer (Cloudflare)
  predictivePrefetch.js # Edge cache warmer
infra/
  cdn_config.tf         # CDN, HTTP/3, TLS, Early Hints, SWR
  ab_test_router.ts     # Edge A/B router
tools/
  snapshotctl/          # CLI: snapshot, diff, deploy_delta
.github/workflows/
  main.yml              # Build, lint, test, audit, deploy, health
  visual_test.yml       # Playwright pixelmatch visual regression
...
```

---

## 🧠 How It Works

- **Ultra-fast Delivery:**  
  Server renders DOM snapshots as FlatBuffers, shipped as binary to the client and morphed into the live UI with near-zero overhead.
- **Edge-First Architecture:**  
  Aggregation, prefetching, and optimizations at the CDN/worker layer, not just the origin.
- **AI-Driven Prefetch:**  
  LLMs (local or cloud) predict what the user will do next and prefetch/prerender accordingly.
- **Continuous Monitoring:**  
  Real-user metrics, visual diffs, and automated issue creation for regressions.
- **Progressive Enhancement:**  
  Fallback to HTML when binary/JS fails, ensuring compatibility for all users.

---

## 🛠️ Getting Started

1. **Clone:**  
   ```bash
   git clone https://github.com/your-org/ultra-low-latency-web.git
   cd ultra-low-latency-web
   ```
2. **Install (with pnpm 9.3+):**  
   ```bash
   pnpm install --no-frozen-lockfile
   ```
3. **Run Dev:**  
   ```bash
   pnpm --filter web-app dev
   pnpm --filter render-api dev
   ```
4. **Run Tests:**  
   ```bash
   pnpm test
   pnpm --filter web-app test:e2e
   ```
5. **Build & Deploy:**  
   See `.github/workflows/main.yml` for automated pipeline details.

---

## 📦 Local LLM (UI-TARS) Setup

- Download the ByteDance/UI-TARS-7B-DPO model and run a local vLLM server.
- Set `VLM_ENDPOINT` and `VLM_MODEL_NAME` in `.env` or GitHub secrets for predictive prefetch.
- See `README.md` in `render-api` and `web-app` for exact steps.

---

## 📊 Real User Monitoring

- RUM metrics sent to `/api/rum` and used for analytics, A/B analysis, and automated performance issue creation in CI.

---

## 👩‍💻 Developer Experience

- Storybook (`apps/web-app/.storybook/`)
- CLI (`tools/snapshotctl`)
- Type-safe config (`config/env.ts`)
- Monorepo powered by pnpm workspaces and TurboRepo

---

## 🛡️ Security & Best Practices

- No secrets in code, all credentials via environment variables or GitHub secrets.
- Feature flags for experimental/edge code.
- All builds and deploys are idempotent and CI-verified.

---

## 📝 License

Open source, MIT/Apache-2.0 dual-licensed.

---

**For more, see the detailed technical plan in PLAN.MD and the architecture diagrams in the docs folder.**
