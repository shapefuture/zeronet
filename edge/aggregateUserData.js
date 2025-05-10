/**
 * @param {Request} request
 * @param {any} env
 * @param {any} ctx
 */
export default {
  async fetch(request, env, ctx) {
    const config = {
      profileApi: env.PROFILE_API || "https://api.example.com/users",
      prefsApi: env.PREFS_API || "https://api.example.com/users",
      timeoutMs: Number(env.AGG_TIMEOUT_MS ?? 2000),
    };
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("id");
      if (!userId || !/^\d+$/.test(userId)) {
        console.error("[zeronet:edge] Invalid user ID:", userId, "Request:", request.url);
        return new Response(JSON.stringify({ error: "Invalid user ID" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        const [profileRes, prefsRes] = await Promise.all([
          fetch(`${config.profileApi}/${userId}`, { signal: controller.signal }),
          fetch(`${config.prefsApi}/${userId}/preferences`, {
            signal: controller.signal,
          }),
        ]);
        clearTimeout(timeout);

        if (!profileRes.ok || !prefsRes.ok) {
          console.error("[zeronet:edge] Upstream API failed", { profileRes, prefsRes });
          throw new Error("Upstream API failed");
        }
        const profile = await profileRes.json();
        const prefs = await prefsRes.json();
        console.debug("[zeronet:edge] Aggregated data", {profile, prefs});
        return new Response(
          JSON.stringify({
            id: userId,
            displayName: profile.displayName,
            avatar: profile.avatarUrl,
            theme: prefs.theme ?? "default",
            notifications: !!prefs.enableNotifications,
          }),
          {
            headers: {
              "content-type": "application/json",
              "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
            },
          }
        );
      } catch (apiErr) {
        clearTimeout(timeout);
        console.error("[zeronet:edge] API error", apiErr, "Request:", request.url);
        throw apiErr;
      }
    } catch (err) {
      console.error("[zeronet:edge] Service unavailable", err, "Request:", request.url);
      return new Response(JSON.stringify({ error: "Service unavailable", retry: true }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }
  },
};
