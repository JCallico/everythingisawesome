@echo off
echo.
echo ======================================
echo   Azure Web App Deployment Script
echo ======================================
echo.

echo Installing root dependencies...
call npm install --production --no-optional --prefer-offline --no-audit

if errorlevel 1 (
  echo ERROR: Root npm install failed
  exit /b 1
)

echo ✅ Root dependencies installed

echo.
echo Installing client dependencies...
if exist "client\package.json" (
  cd client
  call npm install --production --no-optional --prefer-offline --no-audit
  if errorlevel 1 (
    echo ERROR: Client npm install failed
    cd ..
    exit /b 1
  )
  cd ..
  echo ✅ Client dependencies installed
) else (
  echo ⚠️ Client package.json not found, skipping client dependencies
)

echo.
echo Installing shared package dependencies...
if exist "packages" (
  for /d %%i in (packages\*) do (
    if exist "%%i\package.json" (
      echo Installing dependencies for %%i...
      cd "%%i"
      call npm install --production --no-optional --prefer-offline --no-audit
      if errorlevel 1 (
        echo ERROR: %%i npm install failed
        cd ..\..
        exit /b 1
      )
      cd ..\..
      echo ✅ %%i dependencies installed
    )
  )
) else (
  echo ⚠️ Packages folder not found, skipping shared package dependencies
)

echo.
echo ✅ All dependencies installed successfully
echo ✅ Deployment completed
echo.
echo Application is ready to start with: node app.js
