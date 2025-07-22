@echo off
title Smart Firebase Deploy

echo ========================================
echo    Smart Firebase Deploy
echo ========================================
echo.

echo [INFO] Checking current directory...
echo Current path: %cd%
echo.

REM Check if we're in the correct project directory
if not exist "index.html" (
    echo [ERROR] index.html not found in current directory
    echo.
    echo This script must be run from the project root directory.
    echo Please navigate to the folder containing:
    echo - index.html
    echo - firebase.json
    echo - package.json
    echo.
    echo Common locations:
    echo - Desktop\light-and-code-blog
    echo - Documents\light-and-code-blog
    echo - Downloads\light-and-code-blog
    echo.
    echo Or drag this .bat file into the project folder and run it there.
    echo.
    pause
    exit /b 1
)

if not exist "firebase.json" (
    echo [ERROR] firebase.json not found
    echo This doesn't appear to be a Firebase project directory.
    echo.
    pause
    exit /b 1
)

echo [OK] Project files found in current directory
echo [OK] Ready to deploy from: %cd%
echo.

REM Check Node.js
echo [INFO] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not installed
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js is installed

REM Check npm
echo [INFO] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not installed
    echo.
    pause
    exit /b 1
)
echo [OK] npm is installed

echo.
echo [INFO] Installing Firebase CLI...
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI installation failed
    echo.
    echo Try these solutions:
    echo 1. Run this script as Administrator
    echo 2. Or manually run: npm install -g firebase-tools
    echo.
    pause
    exit /b 1
)

echo [OK] Firebase CLI installed
echo.

echo [INFO] Verifying Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI verification failed
    echo.
    pause
    exit /b 1
)

echo.
echo [INFO] Firebase login (browser will open)...
firebase login
if %errorlevel% neq 0 (
    echo [ERROR] Firebase login failed
    echo.
    pause
    exit /b 1
)

echo [OK] Firebase login successful
echo.

echo [INFO] Setting Firebase project...
firebase use gernboke
if %errorlevel% neq 0 (
    echo [ERROR] Project setup failed
    echo.
    echo Please check:
    echo 1. Project "gernboke" exists in Firebase Console
    echo 2. You have access to the project
    echo 3. Project ID is correct
    echo.
    echo Firebase Console: https://console.firebase.google.com/
    echo.
    pause
    exit /b 1
)

echo [OK] Project set successfully
echo.

echo [INFO] Deploying to Firebase Hosting...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed
    echo.
    echo Please check:
    echo 1. Network connection
    echo 2. Project permissions
    echo 3. firebase.json configuration
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo           DEPLOYMENT SUCCESS!
echo ========================================
echo.
echo [SUCCESS] Your website is now live at:
echo.
echo Main URL: https://gernboke.web.app
echo Alt URL:  https://gernboke.firebaseapp.com
echo Admin:    https://gernboke.web.app/admin
echo.
echo Firebase Console:
echo https://console.firebase.google.com/project/gernboke
echo.
echo [INFO] Testing website accessibility...
echo.

REM Try to open the website
start https://gernboke.web.app

echo.
echo Deployment completed successfully!
echo You can now close this window.
echo.
pause
