export function abTestRouter(request: Request) {
  const cookie = request.headers.get('cookie');
  let variant: string;
  if (cookie && /ab_variant=([AB])/.test(cookie)) {
    variant = RegExp.$1;
  } else {
    variant = Math.random() < 0.5 ? 'A' : 'B';
    // Set cookie header using Response
    return new Response(null, {
      status: 307,
      headers: {
        'Set-Cookie': `ab_variant=${variant}; Path=/; SameSite=Lax`,
        'Location': request.url
      }
    });
  }
  // Route to variant-specific upstream/resource
  return fetch(`https://site.com/${variant}${new URL(request.url).pathname}`, request);
}