#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying ShareIt application..."

# Build the Docker image
echo "📦 Building Docker image..."
docker-compose build

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Start the containers
echo "▶️ Starting containers..."
docker-compose up -d

# Check if the application is running
echo "🔍 Checking application status..."
sleep 5
if curl -s http://localhost:4040 > /dev/null; then
  echo "✅ Application is running successfully!"
else
  echo "⚠️ Application might not be running. Please check the logs."
  docker-compose logs
fi

echo "📝 Deployment complete!"
echo "🌐 Application should be available at http://localhost:4040" 