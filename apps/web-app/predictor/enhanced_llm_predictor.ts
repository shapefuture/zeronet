import { LRUCache } from 'lru-cache';
import { log, LogLevel } from '../utils/logger';
type PredictionResult = { route: string; confidence: number; };
const predictionCache = new LRUCache({ max: 100, ttl: 1000*60*5 }); // 5 min

export async function getPredictedRoutes(history: string[]): Promise<PredictionResult[]> {
  const key = JSON.stringify(history);
  if (predictionCache.has(key)) {
    log(LogLevel.DEBUG, "getPredictedRoutes: cache hit", { history, key });
    return predictionCache.get(key);
  }
  function normalize(conf: number): number {
    if (typeof conf !== "number" || !isFinite(conf)) return 0.5;
    return Math.max(0, Math.min(1, conf));
  }
  async function tryAllProviders(): Promise<PredictionResult[]> {
    try {
      log(LogLevel.INFO, "LLM (local) prediction", { history });
      const resp = await fetch(process.env.VLM_ENDPOINT!, { /* ... */ });
      const text = await resp.text();
      const arr = JSON.parse(text.match(/\[.*\]/s)![0]) as PredictionResult[];
      arr.forEach(p=>{p.confidence=normalize(p.confidence)});
      log(LogLevel.DEBUG, "LLM (local) prediction result", arr);
      return arr;
    } catch (e) { log(LogLevel.WARN, "Local VLM prediction error", e, { history }); }
    try {
      log(LogLevel.INFO, "LLM (OpenRouter) fallback", { history });
      /* ... fallback OpenRouter code ... */
    } catch (e2) { log(LogLevel.ERROR, "OpenRouter prediction error", e2, { history }); }
    return [{ route: "/", confidence: 1.0 }];
  }

  const v = await tryAllProviders();
  predictionCache.set(key, v);
  log(LogLevel.INFO, "getPredictedRoutes: returning", v);
  return v;
}
