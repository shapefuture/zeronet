// Calls LLM endpoint for route prediction; actually parses response

export async function llmRoutePrediction(history: string[]): Promise<{route: string, confidence: number}[]> {
  const body = {
    model: process.env.VLM_MODEL_NAME,
    prompt: `Given the navigation history: ${JSON.stringify(history)}, what are the next three likely user routes with confidence (JSON array of {route,confidence}):`
  };
  const resp = await fetch(process.env.VLM_ENDPOINT!, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`},
    body: JSON.stringify(body)
  });
  try {
    const text = await resp.text();
    // Try to extract JSON from LLM output
    const arrMatch = text.match(/\[.*?\]/s);
    if (arrMatch) return JSON.parse(arrMatch[0]);
    return [];
  } catch {
    return [];
  }
}