function sendToAnalytics(metric: any) {
  fetch('/api/rum', {
    method: 'POST',
    body: JSON.stringify({ ...metric, ab_variant: document.cookie.replace(/(?:(?:^|.*;\s*)ab_variant\s*\=\s*([^;]*).*$)|^.*$/, "$1") }),
    keepalive: true
  });
}