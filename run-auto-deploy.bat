@echo off
title Auto Deploy to Firebase

echo ========================================
echo    Auto Deploy to Firebase
echo ========================================
echo.

echo Running automated deployment script...
echo.

node simple-deploy.js

if %errorlevel% neq 0 (
    echo.
    echo Deployment script failed.
    echo Please check the error messages above.
    echo.
    echo Manual commands:
    echo 1. npm install -g firebase-tools
    echo 2. firebase login
    echo 3. firebase use gernboke
    echo 4. firebase deploy --only hosting
    echo.
)

echo.
echo Press any key to exit...
pause >nul
