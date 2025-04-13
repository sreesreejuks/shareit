import { readdir, unlink, rm } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function cleanup() {
  try {
    // Remove the entire uploads directory and its contents
    await rm(join(__dirname, 'uploads'), { recursive: true, force: true });
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

cleanup();