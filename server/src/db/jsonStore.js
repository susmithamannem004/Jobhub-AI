import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// createRequire lets us load JSON without import assertion syntax,
// which differs between Node 20 (assert) and Node 22+ (with).
const require = createRequire(import.meta.url);

const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// In-memory store for Vercel demo mode.
// Seeded from bundled JSON on first access; persists for the function instance lifetime.
const memoryStore = {};

function getSeed(filename) {
  try {
    // require() resolves relative to this file — works locally and in Vercel bundle
    return JSON.parse(JSON.stringify(require(`../data/${filename}`)));
  } catch {
    return [];
  }
}

export async function readJson(filename) {
  if (IS_VERCEL) {
    if (!(filename in memoryStore)) {
      memoryStore[filename] = getSeed(filename);
    }
    return JSON.parse(JSON.stringify(memoryStore[filename]));
  }

  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    console.error(`[jsonStore] Error reading ${filename}:`, error);
    throw error;
  }
}

export async function writeJson(filename, data) {
  if (IS_VERCEL) {
    memoryStore[filename] = JSON.parse(JSON.stringify(data));
    console.log(`[jsonStore] Demo mode — in-memory write to ${filename} (${Array.isArray(data) ? data.length : '?'} records)`);
    return true;
  }

  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`[jsonStore] Error writing ${filename}:`, error);
    throw error;
  }
}
