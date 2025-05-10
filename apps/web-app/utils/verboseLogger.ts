// Central verbose logger for browser and SSR
export function logVerbose(...args: any[]) {
  if (typeof window !== "undefined" && window.localStorage?.ZERONET_VERBOSE !== "true") return;
  // eslint-disable-next-line no-console
  console.debug("[zeronet:verbose]", ...args);
}
export function logError(...args: any[]) {
  // eslint-disable-next-line no-console
  console.error("[zeronet:error]", ...args);
}
export function logInfo(...args: any[]) {
  // eslint-disable-next-line no-console
  console.info("[zeronet:info]", ...args);
}
export function logWarn(...args: any[]) {
  // eslint-disable-next-line no-console
  console.warn("[zeronet:warn]", ...args);
}
