// Simple route-prefetch predictor; can be LLM-powered in production
export function predictNextRoutes(current: string): { route: string, confidence: number }[] {
  // Static example
  if (current === "/") return [{ route: "/about", confidence: 0.9 }, { route: "/products", confidence: 0.6 }];
  return [];
}