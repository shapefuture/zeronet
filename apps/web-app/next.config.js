// ...existing config above...
const withBundleAnalyzer = require('next-bundle-analyzer');
module.exports = withBundleAnalyzer(
  withPWA({
    ...nextConfig,
    // rest as previous
  })
);