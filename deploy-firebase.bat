@echo off
title Firebase Deploy Tool

echo ========================================
echo    Firebase Deploy Tool
echo ========================================
echo.

echo [INFO] Checking environment...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not installed
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js installed

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not installed
    pause
    exit /b 1
)
echo [OK] npm installed

echo.
echo [INFO] Installing Firebase CLI...
echo.

REM Install Firebase CLI
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI installation failed
    echo.
    echo Try these solutions:
    echo 1. Run as Administrator
    echo 2. Manual install: npm install -g firebase-tools
    echo 3. Use yarn: yarn global add firebase-tools
    echo.
    pause
    exit /b 1
)

echo [OK] Firebase CLI installed successfully
echo.

REM Verify Firebase CLI
firebase --version
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI verification failed
    pause
    exit /b 1
)

echo.
echo [INFO] Firebase login...
echo Browser will open for Google account login...
echo.

firebase login
if %errorlevel% neq 0 (
    echo [ERROR] Firebase login failed
    echo.
    echo Try:
    echo 1. Check network connection
    echo 2. Use correct Google account
    echo 3. Manual: firebase login --reauth
    pause
    exit /b 1
)

echo [OK] Firebase login successful
echo.

echo [INFO] Setting up project...
firebase use gernboke
if %errorlevel% neq 0 (
    echo [ERROR] Project setup failed
    echo.
    echo Possible reasons:
    echo 1. Project "gernboke" does not exist
    echo 2. No project access permission
    echo 3. Incorrect project ID
    echo.
    echo Check Firebase Console: https://console.firebase.google.com/
    pause
    exit /b 1
)

echo [OK] Project setup successful
echo.

echo Choose deployment type:
echo 1. Full deploy (recommended for first time)
echo 2. Hosting only (fast)
echo 3. Initialize project (if first time)
echo 4. Cancel
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto full_deploy
if "%choice%"=="2" goto hosting_deploy
if "%choice%"=="3" goto init_project
if "%choice%"=="4" goto cancel
goto invalid

:init_project
echo [INFO] Initializing Firebase project...
echo.
echo Configuration tips:
echo - Select: Firestore, Hosting, Storage
echo - Use existing project: gernboke
echo - Public directory: . (current directory)
echo - Single-page app: No
echo.
firebase init
if %errorlevel% neq 0 (
    echo [ERROR] Project initialization failed
    pause
    exit /b 1
)
echo [OK] Project initialization successful
echo.
echo You can now run deployment
goto menu

:full_deploy
echo [INFO] Starting full deployment...
firebase deploy
goto check_result

:hosting_deploy
echo [INFO] Starting hosting deployment...
firebase deploy --only hosting
goto check_result

:check_result
if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed
    echo.
    echo Possible solutions:
    echo 1. Check network connection
    echo 2. Verify project permissions
    echo 3. Check firebase.json configuration
    echo 4. Review error details
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your blog website is now available at:
echo - Main URL: https://gernboke.web.app
echo - Alt URL: https://gernboke.firebaseapp.com
echo.
echo Firebase Management:
echo - Project: https://console.firebase.google.com/project/gernboke
echo - Hosting: https://console.firebase.google.com/project/gernboke/hosting
echo - Database: https://console.firebase.google.com/project/gernboke/firestore
echo.
echo Recommended testing:
echo 1. Access website on different devices
echo 2. Test admin panel functionality
echo 3. Check responsive design
echo.
goto end

:invalid
echo [ERROR] Invalid choice
goto menu

:cancel
echo [INFO] Deployment cancelled
goto end

:menu
echo.
echo Other available commands:
echo - firebase serve          : Local preview
echo - firebase deploy         : Full deployment
echo - firebase deploy --only hosting : Hosting only
echo.

:end
echo.
echo For more help:
echo - Deploy guide: FIREBASE_DEPLOY_GUIDE.md
echo - Firebase docs: https://firebase.google.com/docs/hosting
echo.
pause
