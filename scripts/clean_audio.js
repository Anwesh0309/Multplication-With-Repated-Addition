import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/assets/audio/multiplication');
const mapFile  = path.join(__dirname, '../src/utils/audioMap.js');

const content = fs.readFileSync(mapFile, 'utf-8');
const match   = content.match(/export const audioMap = ({[\s\S]*?});/);
if (!match) { console.error('Could not parse audioMap.js'); process.exit(1); }

const map = JSON.parse(match[1]);
const usedFiles = new Set(Object.values(map).map(p => path.basename(p)));

const allFiles = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));
let deleted = 0;

for (const file of allFiles) {
  if (!usedFiles.has(file)) {
    fs.unlinkSync(path.join(audioDir, file));
    console.log(`Deleted orphan: ${file}`);
    deleted++;
  }
}

console.log(`\nClean done. Deleted ${deleted} orphaned file(s).`);
