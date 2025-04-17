const withPWA = require('@ducanh2912/next-pwa').default;

// Islands middleware to disable JS for purely static components
const isIsland = (filename) => /\.island\.(tsx|jsx)$/.test(filename);

module.exports = withPWA({
  dest: "public",
  enable: true,
  workboxOptions: {
    runtimeCaching: [
      // ...previous settings...
    ],
  },
  experimental: { appDir: true },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.island\.(tsx|jsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            plugins: [["react-remove-properties", { "properties": ["data-island"] }]]
          }
        }
      ]
    });
    return config;
  }
});