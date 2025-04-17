const fetch = require('node-fetch');
const { Octokit } = require('@octokit/rest');

// This would run in CI post-deploy (see step in main.yml)
(async function () {
  // Query RUM endpoint for last 5 minutes
  const data = await fetch('https://your-app.example.com/api/rum?since=' + (Date.now() - 5 * 60000)).then(r => r.json());

  // Analyze synthetic: if LCP AVG > 1000ms, create optimization issue!
  const avgLCP = (data.filter((e) => e.name === "LCP").map(e => e.value).reduce((a, b) => a + b, 0) / (data.length || 1));
  if (avgLCP > 1000) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    await octokit.issues.create({
      owner: "myorg",
      repo: "myrepo",
      title: `Performance regression: LCP > 1000ms (${avgLCP})`,
      body: "Automated detector: last deployment shows an LCP regression.",
      labels: ["performance", "ai-suggestion", "needs-triage"]
    });
    process.exit(1); // fail build for visibility
  }
  process.exit(0);
})();