# Project Structure and Function Index

This document provides a detailed structure of all core code files, including every function and class, plus a clear explanation for each.

---

## apps/web-app/app/page.tsx

**Functions/Components:**
- `HomePage()`: Top-level React page component. Renders the main landing page, integrates `<SnapshotMounter>` for demo of ultra-low-latency snapshots, and (via dynamic imports) islands for interactivity like `<CounterIsland>`. Showcases the frontend's appDir layout.

---

## apps/web-app/app/SnapshotMounter.tsx

**Functions/Components:**
- `SnapshotMounter({ url })`: Client-side React component. Uses the custom `useBinarySnapshot` hook to fetch and decode a binary FlatBuffer DOM snapshot, morphs the DOM into a target node. Provides a showcase for streaming/morphing.

---

## apps/web-app/app/_document.tsx

**Functions/Components:**
- `Document()`: Next.js custom Document for HTML output. Sets up critical preloads (fonts, CSS), preconnect hints, and shows how resource hinting is done for instant LCP.

---

## apps/web-app/components/SkeletonLoader.island.tsx

**Functions/Components:**
- `SkeletonLoader()`: Mini React skeleton loader (shimmer effect) for loading states. Used for islands/hydration test.

---

## apps/web-app/components/AbTestStats.tsx

**Functions/Components:**
- `AbTestStats()`: Fetches and displays (demo/fake) A/B test statistics data for current deployment. Tied to analytics and frontend RUM.

---

## apps/web-app/components/SkeletonLoader.stories.tsx

**Functions/Components:**
- `Default`: Storybook demo for visual testing, renders `SkeletonLoader`.

---

## apps/web-app/hooks/useBinarySnapshot.ts

**Functions/Components:**
- `useBinarySnapshot(url)`: React hook. Requests a binary DOM snapshot from backend, decodes using FlatBuffers, returns HTML contents. Has progressive enhancement logic for fallback to classic endpoint.

---

## apps/web-app/hooks/useDataProcessor.ts

**Functions/Components:**
- `useDataProcessor()`: Instantiates web worker (via Comlink) for off-main-thread work (e.g. calculating stats on large arrays). Returns worker API interface.

---

## apps/web-app/loader/UISnapshot/DOMSnapshot.ts

**Functions/Classes:**
- `DOMSnapshot`: Auto-generated FlatBuffers class for decoding binary DOM snapshot objects. Has methods for `url()`, `html()`, `timestamp()`, and `metadata()` – decodes flatbuffer fields returned by backend.

---

## apps/web-app/monitoring/enhanced_rum.ts

**Functions/Components:**
- `initRUM()`: Bootstraps real user monitoring – wires up web-vitals, session/user ID generation, and analytics events. Sends data via Beacon or POST to `/api/rum`.

---

## apps/web-app/pages/api/binary-snapshot.ts

**Functions:**
- `handler(req, res)`: Next.js API route. Proxies request to FastAPI backend to fetch binary DOM snapshot for demoing morph/stream.

---

## apps/web-app/pages/api/ab_stats.ts

**Functions:**
- `handler(req, res)`: Returns demo stats for A/B routing, for use in frontend dashboard/testing.

---

## apps/web-app/pages/api/classic-snapshot.ts

**Functions:**
- `handler(req, res)`: Fallback: serves plain old HTML if FlatBuffers decode fails.

---

## apps/web-app/pages/api/rum.ts

**Functions:**
- `handler(req, res)`: Receives and stores (or, in prod, would forward) user and performance metrics from browser real-user-monitoring clients.

---

## apps/web-app/pages/api/[...all].ts

**Functions:**
- `handler(req, res)`: Example API with cache/multi-tier headers; handles all routes, returns demo content and cache-control/etag.

---

## apps/web-app/utils/domMorph.ts

**Functions:**
- `morphDom(target, nextHtml)`: Uses [morphdom](https://github.com/patrick-steele-idem/morphdom) to perform a virtual DOM patch between server/worker-generated HTML and current page, with robust diffing and fallback.

- `initMorphCache()`: (If present) Example initializing a FlexSearch cache for storing previous morph diffs. Optional.

---

## apps/web-app/utils/resourcePrefetcher.ts

**Functions:**
- `prefetchResourcesWithPrerender(history)`: Uses predicted next routes, prefetches/prerenders using `<link rel="prerender">` for performance.

---

## apps/web-app/predictor/enhanced_llm_predictor.ts

**Classes/Functions:**
- `getPredictedRoutes(history)`: High-availability LLM/AI-powered route prediction, with local VLM, OpenRouter fallback, and LRU cache.

- `LocalVLLMProvider`, `OpenRouterProvider`: Helper classes for querying local/OpenRouter LLM endpoints robustly.

---

## apps/web-app/worker/dataProcessor.ts

**Functions:**
- `complexStats(data)`: Web worker for heavy analytics; calculates mean/std off-thread for UI responsiveness.

---

## apps/render-api/main.py

**Functions:**
- `read_root()`: Healthcheck/index endpoint.
- `render_snapshot(req, fastapi_res, request)`: POST: Given a URL, returns a binary DOM snapshot. Pipeline: parse HTML, prune, FlatBuffers encode, set cache and ETag, support early hints.
- (Wired to `prune_dom`, `serialize_dom_snapshot`.)

---

## apps/render-api/models/snapshot_request.py / snapshot_response.py

**Classes:**
- `SnapshotRequest`: Pydantic model; input to snapshot API.
- `SnapshotResponse`: Pydantic model; output for legacy JSON API.

---

## apps/render-api/prune_dom.py

**Functions:**
- `prune_dom(html)`: Parses and removes unwanted/hidden/script/meta/test-only nodes with real HTML parsing (`BeautifulSoup`).

---

## apps/render-api/serialize_snapshot.py

**Functions:**
- `serialize_dom_snapshot(data)`: Serializes a Python dict/object representing the DOM snapshot into FlatBuffers binary using auto-generated code.

---

## apps/render-api/snapshot_diff.py

**Functions:**
- `binary_diff(a, b)`: Performs a binary diff for snapshot delta updates.
- `structural_diff(a, b)`: Performs a unified diff on HTML lines for structural changes.

---

## apps/render-api/set_headers.py

**Functions:**
- `set_microcache_headers(response, body)`: Sets state-while-revalidate/public cache and computes real ETag for binary responses.

---

## edge/aggregateUserData.js

**Functions:**
- `fetch(request, env, ctx)`: Cloudflare/Edge Function. Given a user ID param, requests user profile and prefs from origin APIs, merges/shapes output, implements timeout, and handles all error cases.

---

## edge/predictivePrefetch.js

**Functions:**
- `fetch(request, env, ctx)`: Receives {resource, confidence}, fetches with edge TTL for high-confidence paths (primes CDN with client/LLM hints).

---

## edge/compressImage.js

**Functions:**
- `fetch(request, env, ctx)`: Fetches image resource, uses Cloudflare/Deno edge image resizing/compression.

---

## tools/snapshotctl/index.ts

**Functions:**
- CLI entrypoint; implements:
    - `generate`: Requests binary snapshot and saves to file.
    - `diff`: Computes binary diff (calls Python binary_diff).
    - `deploy_delta`: Posts binary diff/delta to deployment endpoint.
- Connects backend/CLI/test deployment lifecycle.

---

## scripts/analyze_perf.py

**Functions:**
- `fetch_rum_data()`: Fetches observed RUM metrics.
- `ask_llm_for_suggestions(data)`: Queries LLM for optimization hints.
- `create_github_issue(suggestion)`: Posts new optimization issues to GitHub via REST API.

---

## scripts/monitor_deployment.js

**Functions:**
- Runs post-deploy in CI: Queries `/api/rum` for performance regression, opens a GitHub issue if LCP budget exceeded. (Automates plan "auto-issue.")

---

## infra/cdn_and_headers.tf

**Terraform Resources:**
- Edge/CDN HTTP/2 push and early hints Worker.

---

## infra/ab_test_router.ts

**Functions:**
- `abTestRouter(request)`: Assigns and stores A/B variant cookie, proxies request to correct upstream, sets cookie as needed.

---

## apps/web-app/.storybook/main.js

**Functions:**
- Storybook config: discovers component stories for rapid development/devX.

---

## apps/web-app/scripts/subset_fonts.py

**Functions:**
- `subset_fonts(font_src_dir, font_out_dir)`: Uses `glyphhanger` to subset/compress font files and outputs to deployment folder.

---

## Other package.json, next.config.js, tailwind.config.js, ...etc

- Setup and config code for each package, not containing app logic.

---