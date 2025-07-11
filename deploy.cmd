@echo off
echo.
echo ======================================
echo   Azure Web App Deployment Script
echo ======================================
echo.

echo Installing production dependencies...
call npm install --production --no-optional --prefer-offline --no-audit

if errorlevel 1 (
  echo ERROR: npm install failed
  exit /b 1
)

echo.
echo ✅ Dependencies installed successfully
echo ✅ Deployment completed
echo.
echo Application is ready to start with: node app.js
