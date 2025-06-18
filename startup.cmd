@echo off
REM Azure Web App startup script for Windows

echo Starting application setup...

REM Set environment variables for production
set NODE_ENV=production

echo Node version:
node --version

echo NPM version:
npm --version

echo Environment: %NODE_ENV%
echo Port: %PORT%

REM Check if client build exists
if not exist "client\build" (
    echo Client build directory not found. Building client...
    cd client
    call npm ci
    call npm run build
    cd ..
)

REM Start the server
echo Starting server...
node server\index.js
