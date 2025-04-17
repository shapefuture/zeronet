type PredictionResult = { route: string; confidence: number; };
export async function getPredictedRoutes(history: string[]): Promise<PredictionResult[]> {
  const key = JSON.stringify(history);
  if (predictionCache.has(key)) return predictionCache.get(key);

  function normalize(conf: number): number {
    if (typeof conf !== "number" || !isFinite(conf)) return 0.5;
    return Math.max(0, Math.min(1, conf));
  }
  async function tryAllProviders(): Promise<PredictionResult[]> {
    try {
      const resp = await fetch(process.env.VLM_ENDPOINT!, { /* ... */ });
      const text = await resp.text();
      const arr = JSON.parse(text.match(/\[.*\]/s)![0]) as PredictionResult[];
      arr.forEach(p=>{p.confidence=normalize(p.confidence)});
      return arr;
    } catch (e) { console.warn("Local VLM prediction error", e); }
    try {
      /* ... fallback OpenRouter code ... */
    } catch (e2) { console.warn("OpenRouter prediction error", e2); }
    return [{ route: "/", confidence: 1.0 }];
  }

  const v = await tryAllProviders();
  predictionCache.set(key, v);
  return v;
}