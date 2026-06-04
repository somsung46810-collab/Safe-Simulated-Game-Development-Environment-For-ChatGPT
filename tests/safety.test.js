import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'index.html',
  'package.json',
  'src/main.js',
  'src/styles.css',
  '.github/workflows/build.yml',
  'scripts/package-zip.js',
  'docs/README.md',
  'assets/.gitkeep'
];

for (const file of requiredFiles) {
  assert.equal(existsSync(file), true, `Missing required file: ${file}`);
}

const html = readFileSync('index.html', 'utf8');
const main = readFileSync('src/main.js', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');

assert.match(html, /Safe Redraw Mode/, 'HTML must expose Safe Redraw Mode toggle');
assert.match(main, /THREE/, 'Simulation must import and use Three.js');
assert.match(main, /redSafe/, 'Simulation must include red safety bounds');
assert.match(main, /greenCheck/, 'Simulation must include green checkpoints');
assert.match(main, /blueWire/, 'Simulation must include blue wireframe materials');
assert.match(styles, /MVP → CLIP SPACE → SAFE RENDER OUTPUT/, 'Styles must label the MVP safe render pipeline');

console.log('Safe simulation repository checks passed.');
