# Share It

A lightweight, cross-platform file sharing tool that works like AirDrop for your local network. Share files instantly between devices using QR codes and a web interface.

## Features

- 🚀 **Instant Sharing**: Share files quickly over your local network
- 📱 **Cross-Platform**: Works on any device with a web browser
- 📷 **QR Code Access**: Scan and connect instantly from mobile devices
- 🖥️ **Web Interface**: Upload and download files through a clean, modern UI
- 🔌 **Headless Support**: Works on devices without GUI (e.g., Raspberry Pi)
- ⚡ **Resource Efficient**: Lightweight and optimized for performance
- 🔄 **Auto Shutdown**: Automatically stops after 10 minutes of inactivity
- 📂 **Bi-directional**: Upload and download files from any connected device

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/share-it.git

# Navigate to the project directory
cd share-it

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### GUI Environments (Windows, macOS, Linux Desktop)

1. Start the application:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the displayed URL
3. Use the web interface to upload and download files
4. Share the QR code or URL with devices on your network

### Headless Environments (Raspberry Pi, Servers)

1. Create an alias in your `.bashrc` or `.zshrc`:
   ```bash
   # Add this line to your ~/.bashrc or ~/.zshrc
   alias shareit='cd /path/to/share-it && node server.js'
   ```

2. Source your shell configuration:
   ```bash
   source ~/.bashrc  # or source ~/.zshrc
   ```

3. Share a file or folder:
   ```bash
   # Navigate to the directory containing your files
   cd /path/to/your/files

   # Start the sharing server
   shareit
   ```

4. The terminal will display:
   - A QR code for quick access
   - The local network URL (e.g., `http://192.168.1.100:5555`)

5. On other devices:
   - Scan the QR code with your camera
   - Or enter the URL in your browser
   - Upload/download files through the web interface

### Command Line Quick Share

Create a function in your `.bashrc` or `.zshrc` for quick sharing:

```bash
function share() {
  local share_dir="${1:-.}"  # Use current directory if no argument provided
  cd "$share_dir" && shareit
}
```

Now you can quickly share any directory:
```bash
# Share current directory
share

# Share a specific directory
share /path/to/directory
```

## Technical Details

- **Port**: Uses port 5555 by default
- **Auto Shutdown**: Server automatically stops after 10 minutes of inactivity
- **Network**: Works on your local network (LAN)
- **Security**: Files are only accessible while the server is running
- **Supported Devices**: Any device with a modern web browser

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Project Structure

```
share-it/
├── src/               # Frontend React application
├── server.js          # Express server implementation
├── dist/              # Built frontend files
└── uploads/          # Temporary file storage
```

## Security Considerations

- The server only runs on your local network
- Files are only accessible while the server is running
- Auto-shutdown prevents unintended file exposure
- No files are stored permanently - they're removed when the server stops

## Limitations

- Only works within your local network
- No built-in encryption for file transfers
- Files are stored temporarily in the `uploads` directory
- Server must remain running during file transfers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.