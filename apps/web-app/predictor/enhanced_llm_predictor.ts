import { LRUCache } from 'lru-cache';
const predictionCache = new LRUCache({ max: 100, ttl: 1000*60*5 }); // 5 min

export async function getPredictedRoutes(history: string[]): Promise<{route: string, confidence: number}[]> {
  const key = JSON.stringify(history);
  if (predictionCache.has(key)) return predictionCache.get(key);

  async function tryAllProviders(): Promise<any[]> {
    // Local first
    try {
      const resp = await fetch(process.env.VLM_ENDPOINT!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.VLM_MODEL_NAME,
          prompt: JSON.stringify(history)
        })
      });
      const text = await resp.text();
      return JSON.parse(text.match(/\[.*\]/s)![0]);
    } catch {}
    // OpenRouter fallback
    try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`
        },
        body: JSON.stringify({ model: process.env.VLM_FALLBACK_MODEL, messages: [ { content: JSON.stringify(history), role: "user" } ]})
      });
      const data = await resp.json();
      const match = data.choices?.[0]?.message?.content.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : [];
    } catch {}
    // Static
    return [{route:"/",confidence:1.0}];
  }

  const v = await tryAllProviders();
  predictionCache.set(key, v);
  return v;
}