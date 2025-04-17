const RUM_SAMPLE_RATE = 0.1;
function shouldSampleRUM() {
  return Math.random() < RUM_SAMPLE_RATE;
}
export function initRUM() {
  if (!shouldSampleRUM()) return; // Only send from a subset of clients
  /*... rest of metrics collection ...*/
}