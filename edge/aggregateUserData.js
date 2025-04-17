export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("id");
      
      if (!userId || !/^\d+$/.test(userId)) {
        return new Response(JSON.stringify({ error: "Invalid user ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Fetch both endpoints in parallel with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      
      try {
        const [profileRes, prefsRes] = await Promise.all([
          fetch(`https://api.example.com/users/${userId}`, { 
            signal: controller.signal,
            cf: { cacheTtl: 60, cacheEverything: true }
          }),
          fetch(`https://api.example.com/users/${userId}/preferences`, { 
            signal: controller.signal,
            cf: { cacheTtl: 60, cacheEverything: true }
          })
        ]);
        
        clearTimeout(timeout);
        
        if (!profileRes.ok) {
          throw new Error(`Profile API error: ${profileRes.status}`);
        }
        
        if (!prefsRes.ok) {
          throw new Error(`Preferences API error: ${prefsRes.status}`);
        }
        
        const profile = await profileRes.json();
        const prefs = await prefsRes.json();
        
        // Construct minimal response with only needed fields
        const response = {
          id: userId,
          displayName: profile.displayName,
          avatar: profile.avatarUrl,
          theme: prefs.theme || "default",
          notifications: !!prefs.enableNotifications
        };
        
        return new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
            "Timing-Allow-Origin": "*"
          }
        });
      } catch (apiError) {
        clearTimeout(timeout);
        throw apiError; // Re-throw for outer handler
      }
    } catch (error) {
      // Log error, then respond gracefully
      console.error(`[aggregateUserData] ${error.message}`);
      
      return new Response(JSON.stringify({
        error: "Service temporarily unavailable",
        retry: true
      }), {
        status: error.message.includes("API error") ? 502 : 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    }
  }
};