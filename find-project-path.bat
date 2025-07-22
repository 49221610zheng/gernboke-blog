@echo off
title Find Project Path

echo ========================================
echo    Finding Project Path
echo ========================================
echo.

echo Current directory: %cd%
echo.

echo Checking if this is the correct project directory...
echo.

REM Check for key project files
if exist "index.html" (
    echo [OK] index.html found
) else (
    echo [ERROR] index.html not found
)

if exist "admin.html" (
    echo [OK] admin.html found
) else (
    echo [ERROR] admin.html not found
)

if exist "firebase.json" (
    echo [OK] firebase.json found
) else (
    echo [ERROR] firebase.json not found
)

if exist "js\firebase-config.js" (
    echo [OK] js\firebase-config.js found
) else (
    echo [ERROR] js\firebase-config.js not found
)

if exist "package.json" (
    echo [OK] package.json found
) else (
    echo [ERROR] package.json not found
)

echo.
echo ========================================

if exist "index.html" if exist "firebase.json" if exist "package.json" (
    echo [SUCCESS] This appears to be the correct project directory!
    echo.
    echo Your project path is: %cd%
    echo.
    echo You can use this path in the deployment commands:
    echo cd /d "%cd%"
    echo.
    echo Or simply run the deployment from this current directory.
) else (
    echo [ERROR] This does not appear to be the project directory.
    echo.
    echo Please navigate to the directory containing:
    echo - index.html
    echo - admin.html  
    echo - firebase.json
    echo - package.json
    echo - js folder
    echo.
    echo Common locations to check:
    echo - Desktop
    echo - Documents
    echo - Downloads
    echo - C:\Users\%USERNAME%\
    echo.
    echo You can also search for "firebase.json" file to find the project.
)

echo.
echo ========================================
echo.

echo Available deployment options from current directory:
echo.
echo 1. If this is correct directory:
echo    - Double-click: run-auto-deploy.bat
echo    - Or run: node simple-deploy.js
echo.
echo 2. If you need to navigate to project:
echo    - Find the folder with index.html and firebase.json
echo    - Copy the path and update the commands
echo.

pause
