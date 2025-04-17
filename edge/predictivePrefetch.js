export default {
  async fetch(request, env, ctx) {
    const { resource, confidence } = await request.json();
    if (confidence > 0.8 && typeof resource === "string") {
      // Actually fetch resource to warm edge cache
      await fetch(resource, { cf: { cacheTtl: 3600 } });
      return new Response('Prefetched', { status: 200 });
    }
    return new Response('Skipped', { status: 200 });
  }
};