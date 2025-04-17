export function sendPrefetchTriggered(predicted_resource: string, confidence: number) {
  // Send analytics event, e.g. via fetch or 3rd party
  // fetch("/analytics/prefetch", { method: "POST", body: JSON.stringify({ predicted_resource, confidence }) })
  console.info("[analytics] prefetch_triggered", predicted_resource, confidence);
}