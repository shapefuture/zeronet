const critical = require("critical");
const glob = require("glob");
const fs = require("fs");

const htmlFiles = glob.sync("out/**/*.html"); // Next.js export dir example
Promise.all(
  htmlFiles.map((file) =>
    critical.generate({
      base: "out/",
      src: file.replace("out/", ""),
      inline: true,
      css: ["out/_next/static/css/styles.chunk.css"],
      minify: true,
      width: 1300,
      height: 900,
    }).then(({ html }) => {
      fs.writeFileSync(file, html);
    })
  )
).then(() => {
  console.log("Critical CSS inlining complete");
});