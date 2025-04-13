import React, { useState, useEffect } from 'react';
import { Upload, Download, RefreshCw, Share2, Trash2, FileIcon, AlertCircle } from 'lucide-react';
import { io } from 'socket.io-client';

interface FileInfo {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface QRData {
  qrCode: string;
  url: string;
}

function App() {
  const [qrData, setQRData] = useState<QRData | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const socket = io();
    socket.on('fileUploaded', (fileInfo: FileInfo) => {
      setFiles(prev => [...prev, fileInfo]);
    });

    fetchQRCode();
    fetchFiles();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/qr');
      const data = await response.json();
      setQRData(data);
    } catch (error) {
      setError('Failed to fetch QR code');
      console.error('Failed to fetch QR code:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      setError('Failed to fetch files');
      console.error('Failed to fetch files:', error);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        await fetchFiles();
      } catch (error) {
        setError('Failed to upload file');
        console.error('Failed to upload file:', error);
      }
    }

    setUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Share2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Share It</h1>
          </div>
          <p className="text-gray-600">Quick and easy file sharing over your local network</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Share Files
            </h2>
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className="block text-center cursor-pointer">
                <span className="text-sm text-gray-600">
                  Drag and drop files here or click to select
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  multiple
                />
              </label>
            </div>
            {uploading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Connect
            </h2>
            {qrData && (
              <div className="space-y-4">
                <img
                  src={qrData.qrCode}
                  alt="QR Code"
                  className="mx-auto w-48 h-48"
                />
                <p className="text-sm text-center text-gray-600">
                  Scan QR code or visit:<br />
                  <a
                    href={qrData.url}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {qrData.url}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shared Files</h2>
          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-gray-700 font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.size} • {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/uploads/${file.name}`}
                    download
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No files shared yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;