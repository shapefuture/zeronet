// Requires Cloudflare's Image Resizing API, or (if Deno Deploy) use "image" API
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/opt-img/')) return fetch(request); // fallback

    const imgUrl = url.searchParams.get('url');
    if (!imgUrl) return new Response("Missing image URL", { status: 400 });

    // Cloudflare Image Resizing (automatic)
    const proxied = await fetch(imgUrl, {
      cf: {
        image: {
          width: 800,
          format: "auto",
          quality: 75
        }
      }
    });
    return proxied;
  }
};