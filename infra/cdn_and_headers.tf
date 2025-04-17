resource "cloudflare_worker_script" "early_hints" {
  name = "sendEarlyHints"
  content = <<EOW
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const headers = new Headers();
  headers.append("Link", '</fonts/optimized.woff2>; rel=preload; as=font; type="font/woff2"; crossorigin, </styles/critical.css>; rel=preload; as=style');
  headers.append("Status", "103 Early Hints");
  // Real implementation: return 103 hint + 200 content
  return new Response(null, { status: 103, headers });
}
EOW
}