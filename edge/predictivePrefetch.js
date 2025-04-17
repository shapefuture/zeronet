// Cloudflare Worker: listens for analytics/client signal, prefetches based on predictor

export default {
  async fetch(request, env, ctx) {
    const { resource, confidence } = await request.json();
    if (confidence > 0.8) {
      await fetch(resource, { cf: { cacheTtl: 3600 }, method: "GET" }); // caches at edge
    }
    return new Response('Prefetched', { status: 200 });
  }
};