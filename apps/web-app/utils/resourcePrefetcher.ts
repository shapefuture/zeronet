import { llmRoutePrediction } from "../predictor/llm_predictor";
import { sendPrefetchTriggered } from "./analytics";

export async function prefetchResourcesWithLLM(history: string[]) {
  const predictions = await llmRoutePrediction(history);
  predictions.forEach(({ route, confidence }) => {
    if (confidence > 0.7) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = route;
      document.head.appendChild(link);
      sendPrefetchTriggered(route, confidence);
    }
  });
}