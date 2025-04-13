import { copyFile, cp, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function copyToUploads(sourcePath) {
  try {
    // Create uploads directory if it doesn't exist
    await mkdir(join(__dirname, 'uploads'), { recursive: true });
    
    // Copy the file or directory to uploads
    await cp(sourcePath, join(__dirname, 'uploads'), { 
      recursive: true,
      force: true
    });
    
    console.log(`Successfully copied ${sourcePath} to uploads directory`);
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
}

async function main() {
  const sourcePath = process.argv[2];
  
  if (!sourcePath) {
    console.log('Usage: shareit <directory_or_file>');
    process.exit(1);
  }

  // Copy files to uploads
  await copyToUploads(sourcePath);
  
  // Start the server
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit'
  });

  // Handle server process
  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    server.kill();
    process.exit();
  });
}

main(); 