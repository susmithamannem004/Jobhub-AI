import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Detect Vercel read-only filesystem
const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function readJson(filename) {
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
    console.log(`[jsonStore] Persistence disabled on Vercel — skipping write to ${filename}`);
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
