import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fileUpload from 'express-fileupload';
import QRCode from 'qrcode';
import { networkInterfaces } from 'os';
import bytes from 'bytes';
import mime from 'mime-types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 5555;
let inactivityTimer;
const TIMEOUT = 10 * 60 * 1000; // 10 minutes
const MAX_FILE_SIZE = '2GB';

// Create uploads directory if it doesn't exist
import { mkdir } from 'fs/promises';
try {
  await mkdir(join(__dirname, 'uploads'), { recursive: true });
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error('Error creating uploads directory:', err);
  }
}

// Middleware
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: bytes(MAX_FILE_SIZE) },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: join(__dirname, 'uploads', 'temp')
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Get local IP address
const getLocalIP = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Prioritize 192.168.1.xx network
      if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192.168.1.')) {
        return net.address;
      }
    }
  }
  // Fallback to any non-internal IPv4 address if 192.168.1.xx is not found
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

// Reset inactivity timer
const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    console.log('Server shutting down due to inactivity');
    process.exit(0);
  }, TIMEOUT);
};

// Routes
app.get('/api/qr', async (req, res) => {
  const localIP = getLocalIP();
  const url = `http://${localIP}:${PORT}`;
  try {
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode, url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.post('/api/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.files.file;
  const uploadPath = join(__dirname, 'uploads', file.name);
  const fileInfo = {
    name: file.name,
    size: bytes(file.size),
    type: mime.lookup(file.name) || 'application/octet-stream',
    uploadedAt: new Date().toISOString()
  };

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
    io.emit('fileUploaded', fileInfo);
    res.json({ message: 'File uploaded successfully', file: fileInfo });
  });

  resetInactivityTimer();
});

app.get('/api/files', async (req, res) => {
  const fs = await import('fs/promises');
  try {
    const files = await fs.readdir(join(__dirname, 'uploads'));
    const fileStats = await Promise.all(
      files.map(async (filename) => {
        const stats = await fs.stat(join(__dirname, 'uploads', filename));
        return {
          name: filename,
          size: bytes(stats.size),
          type: mime.lookup(filename) || 'application/octet-stream',
          uploadedAt: stats.mtime.toISOString()
        };
      })
    );
    res.json({ files: fileStats });
  } catch (error) {
    console.error('Error reading files:', error);
    res.json({ files: [] });
  }
  resetInactivityTimer();
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
httpServer.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log(`\nServer running at http://${localIP}:${PORT}`);
  QRCode.toString(`http://${localIP}:${PORT}`, { type: 'terminal' })
    .then(qr => console.log('\nScan this QR code to access:\n\n' + qr));
  resetInactivityTimer();
});

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\nCleaning up and shutting down...');
  process.exit();
});