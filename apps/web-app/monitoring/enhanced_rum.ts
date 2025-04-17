import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';
import { v4 as uuidv4 } from 'uuid';
let sessionId = sessionStorage.getItem('rum_session_id') || uuidv4();
sessionStorage.setItem('rum_session_id', sessionId);

const userId = localStorage.getItem('rum_user_id') || uuidv4();
localStorage.setItem('rum_user_id', userId);

function sendToAnalytics(metric: any) {
  const enriched = {
    ...metric,
    timestamp: Date.now(),
    userId,
    sessionId,
    url: window.location.href,
    ab_variant: document.cookie.replace(/(?:(?:^|.*;\s*)ab_variant\s*\=\s*([^;]*).*$)|^.*$/, "$1") || undefined
  };
  (navigator.sendBeacon
    ? navigator.sendBeacon('/api/rum', JSON.stringify(enriched))
    : fetch('/api/rum', { method:'POST',body:JSON.stringify(enriched),keepalive:true }));
}
export function initRUM() {
  onCLS(sendToAnalytics); onFID(sendToAnalytics);
  onLCP(sendToAnalytics); onINP && onINP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}