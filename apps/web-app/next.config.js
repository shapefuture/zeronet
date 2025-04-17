const withPWA = require('@ducanh2912/next-pwa').default;

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: "public",
  enable: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^\/api\/.*$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
        },
      },
      {
        urlPattern: /\.(?:js|css|woff2|woff|ttf|eot|png|jpg|jpeg|svg|gif|webp|avif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'asset-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 604800,
          },
        },
      },
    ],
  },
  reactStrictMode: true,
  experimental: { appDir: true }
});
module.exports = nextConfig;