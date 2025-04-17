export function speculativePrerender(route: string, confidence: number) {
  if (!window.__SPECULATIVE_PRERENDER_ENABLED__) return;
  if ('prerender' in document.createElement('link')) {
    if (confidence > 0.8) {
      const link = document.createElement("link");
      link.rel = "prerender";
      link.href = route;
      document.head.appendChild(link);
    }
  }
}