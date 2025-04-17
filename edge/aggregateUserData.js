export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");
    const [profileRes, prefsRes] = await Promise.all([
      fetch(`https://api.example.com/users/${userId}`),
      fetch(`https://api.example.com/users/${userId}/preferences`),
    ]);
    const profile = await profileRes.json();
    const prefs = await prefsRes.json();
    return new Response(JSON.stringify({
      id: userId,
      profile,
      preferences: prefs
    }), {
      headers: { "content-type": "application/json" }
    });
  }
};