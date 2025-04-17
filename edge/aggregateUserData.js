export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("id");
      if (!userId || !/^\d+$/.test(userId)) 
        return new Response(JSON.stringify({error:"Invalid user ID"}), {status:400, headers:{"content-type":"application/json"}});
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      try {
        const [profileRes, prefsRes] = await Promise.all([
          fetch(`https://api.example.com/users/${userId}`, { signal:controller.signal }),
          fetch(`https://api.example.com/users/${userId}/preferences`, { signal:controller.signal })
        ]);
        clearTimeout(timeout);
        if (!profileRes.ok || !prefsRes.ok) throw new Error("Upstream API failed");
        const profile = await profileRes.json();
        const prefs = await prefsRes.json();
        return new Response(JSON.stringify({
          id: userId,
          displayName: profile.displayName,
          avatar: profile.avatarUrl,
          theme: prefs.theme ?? "default",
          notifications: !!prefs.enableNotifications
        }), {
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"
          }
        });
      } catch (apiErr) {
        clearTimeout(timeout);
        throw apiErr;
      }
    } catch (err) {
      console.error(`[aggregateUserData] ${err && err.message}`);
      return new Response(JSON.stringify({error:"Service unavailable",retry:true}),{status:502,headers:{"content-type":"application/json"}});
    }
  }
};