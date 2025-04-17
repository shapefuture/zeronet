// Minimal oclif-style CLI tool for snapshots
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
  const [a, b] = args;
  // Diff logic (call Python snapshot_diff via child_process, placeholder)
  // ...
  console.log(`Diff (not implemented) for:`, a, b);
} else {
  console.log("snapshotctl [generate|diff] url outfile");
}