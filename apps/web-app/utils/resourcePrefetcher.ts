export function prefetchResources(predictions: { route: string, confidence: number }[]) {
  predictions.forEach(({ route, confidence }) => {
    if (confidence > 0.7) {
      // Prefetch only high-confidence resources
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = route;
      document.head.appendChild(link);
    }
  });
}