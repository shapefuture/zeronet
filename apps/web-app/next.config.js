// ...previous config...
console.info("Loaded zeronet Next.js config (verbose mode)");

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception in Next.js:", err);
});
process.on('unhandledRejection', (reason, p) => {
  console.error("Unhandled Rejection in Next.js:", reason, p);
});
module.exports = nextConfig;
