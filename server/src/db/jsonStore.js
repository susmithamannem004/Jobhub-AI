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

// Use a writable tmp directory on serverless instances to persist between function
// invocations on the same instance. This is ephemeral but better than pure RAM.
const TMP_DIR = process.env.TMPDIR || '/tmp';

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
    const tmpPath = path.join(TMP_DIR, filename);
    try {
      // Prefer persisted file in tmp if it exists
      const content = await fs.readFile(tmpPath, 'utf-8');
      memoryStore[filename] = JSON.parse(content);
      return JSON.parse(JSON.stringify(memoryStore[filename]));
    } catch (err) {
      // If file not found, seed from bundled data and write to tmp for instance lifetime
      if (err.code === 'ENOENT') {
        if (!(filename in memoryStore)) {
          memoryStore[filename] = getSeed(filename);
        }
        try {
          await fs.mkdir(TMP_DIR, { recursive: true });
          await fs.writeFile(tmpPath, JSON.stringify(memoryStore[filename], null, 2), 'utf-8');
        } catch (werr) {
          // Non-fatal: log and continue with in-memory seed
          console.warn(`[jsonStore] Failed to persist seed to tmp for ${filename}:`, werr.message);
        }
        return JSON.parse(JSON.stringify(memoryStore[filename]));
      }
      console.error(`[jsonStore] Error reading tmp ${filename}:`, err);
      throw err;
    }
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
    const tmpPath = path.join(TMP_DIR, filename);
    memoryStore[filename] = JSON.parse(JSON.stringify(data));
    try {
      await fs.mkdir(TMP_DIR, { recursive: true });
      await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`[jsonStore] Demo mode — persisted write to tmp/${filename} (${Array.isArray(data) ? data.length : '?'} records)`);
      return true;
    } catch (err) {
      // Fallback to in-memory storage if tmp write fails
      console.warn(`[jsonStore] Failed to write to tmp for ${filename}:`, err.message);
      return true;
    }
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
