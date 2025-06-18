#!/bin/bash
# Azure Web App startup script

echo "Starting application setup..."

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Check if client build exists
if [ ! -d "client/build" ]; then
    echo "Client build directory not found. Building client..."
    cd client && npm ci && npm run build && cd ..
fi

# Start the server
echo "Starting server..."
node server/index.js
