const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["./app/page.tsx"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: "dist",
  splitting: true,
  format: "esm",
  treeShaking: true,
  target: ["esnext"],
  plugins: [],
}).catch(() => process.exit(1));