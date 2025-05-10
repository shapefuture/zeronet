import { getPredictedRoutes } from "../predictor/enhanced_llm_predictor";

export async function prefetchResourcesWithPrerender(history: string[]) {
  const predictions = await getPredictedRoutes(history);
  predictions.forEach(({ route, confidence }) => {
    if (confidence > 0.7) {
      // For supported browsers, trigger prerender for near-instant navigation
      const link = document.createElement("link");
      link.rel = "prerender";
      link.href = route;
      document.head.appendChild(link);
    }
  });
}