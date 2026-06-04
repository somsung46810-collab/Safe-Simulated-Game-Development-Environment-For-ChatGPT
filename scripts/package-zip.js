import { mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import JSZip from 'jszip';

const root = process.cwd();
const outputDir = join(root, 'dist');
const outputFile = join(outputDir, 'safe-simulated-game-development-environment.zip');
const zip = new JSZip();

const ignored = new Set(['.git', 'node_modules', 'dist']);

function addDirectory(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignored.has(entry)) continue;
    const fullPath = join(directory, entry);
    const repoPath = relative(root, fullPath).replaceAll('\\\\', '/');
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      addDirectory(fullPath);
    } else {
      zip.file(repoPath, readFileSync(fullPath));
    }
  }
}

mkdirSync(outputDir, { recursive: true });
addDirectory(root);
const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
writeFileSync(outputFile, content);
console.log(`Created ${outputFile}`);
