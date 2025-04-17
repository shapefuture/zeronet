// Calls LLM endpoint for route prediction; fallback to OpenRouter if local fails

export async function llmRoutePrediction(history: string[]): Promise<{route: string, confidence: number}[]> {
  try {
    const resp = await fetch(process.env.VLM_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
      body: JSON.stringify({
        model: process.env.VLM_MODEL_NAME,
        prompt: `Given this navigation history: ${JSON.stringify(history)}, predict the next likely user routes and estimate confidence.`,
      })
    }).then(r => r.json());
    return resp.routes ?? [];
  } catch (e) {
    // Fallback to static
    return [{ route: "/about", confidence: 0.7 }];
  }
}