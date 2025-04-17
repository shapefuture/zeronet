import { LRUCache } from 'lru-cache';

// LRU cache for prediction results (avoids redundant LLM calls)
const predictionCache = new LRUCache<string, Promise<PredictionResult[]>>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minute cache
});

interface PredictionResult {
  route: string;
  confidence: number;
}

interface ModelProvider {
  getRouteInsights(history: string[]): Promise<PredictionResult[]>;
}

class LocalVLLMProvider implements ModelProvider {
  private endpoint: string;
  private modelName: string;
  
  constructor(endpoint: string, modelName: string) {
    this.endpoint = endpoint;
    this.modelName = modelName;
  }
  
  async getRouteInsights(history: string[]): Promise<PredictionResult[]> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          prompt: `Given this navigation history: ${JSON.stringify(history)}, predict the next likely user routes and confidence scores as JSON array of {route, confidence}:`,
          max_tokens: 200,
          temperature: 0.1,
        }),
        signal: AbortSignal.timeout(3000), // 3s timeout
      });
      
      if (!response.ok) throw new Error(`VLM error: ${response.status}`);
      
      const text = await response.text();
      const jsonMatch = text.match(/\[\s*\{.+\}\s*\]/s);
      if (!jsonMatch) return [];
      
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.warn(`LocalVLLM provider error: ${e}`);
      throw e;
    }
  }
}

class OpenRouterProvider implements ModelProvider {
  private apiKey: string;
  private modelName: string;
  
  constructor(apiKey: string, modelName: string) {
    this.apiKey = apiKey;
    this.modelName = modelName;
  }
  
  async getRouteInsights(history: string[]): Promise<PredictionResult[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: 'You analyze navigation patterns and predict next likely routes with confidence scores.'
            },
            {
              role: 'user',
              content: `Given this navigation history: ${JSON.stringify(history)}, predict the next 3 likely user routes with confidence scores (0-1). Return ONLY a JSON array of objects with "route" and "confidence" properties.`
            }
          ],
          temperature: 0.1,
        }),
        signal: AbortSignal.timeout(5000), // 5s timeout
      });
      
      if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      const jsonMatch = content.match(/\[\s*\{.+\}\s*\]/s);
      if (!jsonMatch) return [];
      
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.warn(`OpenRouter provider error: ${e}`);
      throw e;
    }
  }
}

// Fallback to static predictions based on URL patterns
function getStaticPredictions(history: string[]): PredictionResult[] {
  const currentPage = history[history.length - 1] || '/';
  
  if (currentPage === '/') {
    return [
      { route: '/about', confidence: 0.8 },
      { route: '/products', confidence: 0.7 },
      { route: '/contact', confidence: 0.5 }
    ];
  }
  
  if (currentPage.startsWith('/products')) {
    return [
      { route: '/cart', confidence: 0.8 },
      { route: '/products/featured', confidence: 0.7 }
    ];
  }
  
  // Default fallback
  return [
    { route: '/', confidence: 0.7 },
    { route: '/about', confidence: 0.5 }
  ];
}

// Export the resilient prediction API
export async function getPredictedRoutes(
  history: string[],
  options = { useCache: true }
): Promise<PredictionResult[]> {
  // Generate cache key from input
  const cacheKey = JSON.stringify(history);
  
  // Return cached prediction if available
  if (options.useCache && predictionCache.has(cacheKey)) {
    return predictionCache.get(cacheKey) || [];
  }
  
  // Create new prediction with fallback strategy
  const predictionPromise = (async () => {
    // Set up providers
    const localProvider = new LocalVLLMProvider(
      process.env.VLM_ENDPOINT || 'http://localhost:8000/v1/completions',
      process.env.VLM_MODEL_NAME || 'ui-tars'
    );
    
    const fallbackProvider = new OpenRouterProvider(
      process.env.OPENROUTER_API_KEY || '',
      process.env.VLM_FALLBACK_MODEL || 'gpt-3.5-turbo'
    );
    
    try {
      // First try local provider
      return await localProvider.getRouteInsights(history);
    } catch (e) {
      console.log("Local VLM failed, trying fallback", e);
      try {
        // Then try fallback provider
        return await fallbackProvider.getRouteInsights(history);
      } catch (e2) {
        console.log("All LLM providers failed, using static predictions", e2);
        // Finally use static predictions
        return getStaticPredictions(history);
      }
    }
  })();
  
  // Store in cache
  if (options.useCache) {
    predictionCache.set(cacheKey, predictionPromise);
  }
  
  return predictionPromise;
}