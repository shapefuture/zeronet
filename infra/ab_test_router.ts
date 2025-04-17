export function abTestRouter(request: Request, env: any) {
  // Domain configurable via ENV
  const upstream = env.UPSTREAM_HOST || 'https://site.com';
  // ... other logic as before ...
  if (!['A','B'].includes(variant)) variant = 'A';
  if (!cookie || !cookie.includes('ab_variant=')) {
    // Analytics: record assignment
    fetch(`${upstream}/api/ab_assignment`, { method: 'POST', body: JSON.stringify({ variant }) });
  }
  // ... return redirect or proxy as before ...
}