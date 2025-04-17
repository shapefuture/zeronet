import fs from 'fs';
import path from 'path';

export default function VisualDiff() {
  try {
    const DIFF_DIR = path.resolve(process.cwd(), 'screenshots/diff');
    const files = fs.existsSync(DIFF_DIR) ? fs.readdirSync(DIFF_DIR) : [];
    return (
      <div>
        <h1>Visual Regression Diffs</h1>
        <ul>
          {files.map(file => (
            <li key={file}><img src={`/screenshots/diff/${file}`} alt={file} style={{maxWidth:"100%"}} /></li>
          ))}
        </ul>
      </div>
    );
  } catch {
    return <div>No diffs available.</div>;
  }
}