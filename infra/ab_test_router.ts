export function abTestRouter(request: Request) {
  const cookie = request.headers.get('cookie');
  let variant = '';
  if (cookie && /ab_variant=([AB])/.test(cookie)) {
    variant = RegExp.$1;
  } else {
    // Assign variant randomly
    variant = Math.random() < 0.5 ? 'A' : 'B';
    // Set-Cookie: ab_variant=...
  }
  // Proxy to appropriate upstream/route based on variant
  return fetch(`https://upstream.site/${variant}${request.url}`);
}