import * as fs from 'fs';
import fetch from 'node-fetch';

const [cmd, ...args] = process.argv.slice(2);

if (cmd === "generate") {
  const [url, outfile] = args;
  fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => fs.writeFileSync(outfile, Buffer.from(buf)))
    .then(() => console.log(`Snapshot saved to ${outfile}`));
} else if (cmd === "diff") {
  const [fileA, fileB, patchFile] = args;
  // Minimal binary diff for FlatBuffers
  const a = fs.readFileSync(fileA);
  const b = fs.readFileSync(fileB);
  let patch = [];
  for (let i = 0; i < Math.min(a.length, b.length); ++i) {
    if (a[i] !== b[i]) patch.push(i, b[i]);
  }
  fs.writeFileSync(patchFile, Buffer.from(patch));
  console.log(`Diff patch written to ${patchFile}`);
} else if (cmd === "deploy_delta") {
  const [patchFile, apiUrl] = args;
  const patch = fs.readFileSync(patchFile);
  fetch(apiUrl, { method: "POST", body: patch });
  console.log(`Delta patch sent to ${apiUrl}`);
} else {
  console.log("snapshotctl [generate|diff|deploy_delta] ...");
}