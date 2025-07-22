@echo off
title Quick Firebase Deploy

echo ==========================================
echo          Quick Firebase Deploy
echo ==========================================
echo.

echo Step 1: Install Firebase CLI
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo ERROR: Installation failed
    echo Try running as Administrator
    pause
    exit /b 1
)
echo SUCCESS: Firebase CLI installed
echo.

echo Step 2: Login to Firebase
firebase login
if %errorlevel% neq 0 (
    echo ERROR: Login failed
    pause
    exit /b 1
)
echo SUCCESS: Logged in
echo.

echo Step 3: Set project
firebase use gernboke
if %errorlevel% neq 0 (
    echo ERROR: Project setup failed
    pause
    exit /b 1
)
echo SUCCESS: Project set
echo.

echo Step 4: Deploy to hosting
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo ==========================================
echo           DEPLOYMENT SUCCESS!
echo ==========================================
echo.
echo Your website is live at:
echo https://gernboke.web.app
echo https://gernboke.firebaseapp.com
echo.
echo Firebase Console:
echo https://console.firebase.google.com/project/gernboke
echo.
pause
