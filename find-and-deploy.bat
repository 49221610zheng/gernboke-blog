@echo off
title Find and Deploy Firebase Project

echo ========================================
echo    Find and Deploy Firebase Project
echo ========================================
echo.

echo [INFO] Searching for Firebase project...
echo.

REM Check current directory first
if exist "index.html" if exist "firebase.json" (
    echo [FOUND] Project found in current directory: %cd%
    goto :deploy
)

REM Check common locations
set "locations=%USERPROFILE%\Desktop\light-and-code-blog %USERPROFILE%\Documents\light-and-code-blog %USERPROFILE%\Downloads\light-and-code-blog %USERPROFILE%\Desktop\个人完美博客 %USERPROFILE%\Documents\个人完美博客"

for %%i in (%locations%) do (
    if exist "%%i\index.html" if exist "%%i\firebase.json" (
        echo [FOUND] Project found at: %%i
        cd /d "%%i"
        goto :deploy
    )
)

REM Search in Desktop subdirectories
echo [INFO] Searching in Desktop subdirectories...
for /d %%i in ("%USERPROFILE%\Desktop\*") do (
    if exist "%%i\index.html" if exist "%%i\firebase.json" (
        echo [FOUND] Project found at: %%i
        cd /d "%%i"
        goto :deploy
    )
)

REM Search in Documents subdirectories  
echo [INFO] Searching in Documents subdirectories...
for /d %%i in ("%USERPROFILE%\Documents\*") do (
    if exist "%%i\index.html" if exist "%%i\firebase.json" (
        echo [FOUND] Project found at: %%i
        cd /d "%%i"
        goto :deploy
    )
)

REM Project not found
echo [ERROR] Firebase project not found!
echo.
echo Please manually navigate to your project directory and run:
echo smart-deploy.bat
echo.
echo Or make sure your project contains:
echo - index.html
echo - firebase.json
echo - package.json
echo.
pause
exit /b 1

:deploy
echo.
echo [SUCCESS] Found project at: %cd%
echo.
echo [INFO] Starting deployment...
echo.

REM Verify project files
if not exist "index.html" (
    echo [ERROR] index.html not found
    goto :error
)

if not exist "firebase.json" (
    echo [ERROR] firebase.json not found  
    goto :error
)

if not exist "package.json" (
    echo [ERROR] package.json not found
    goto :error
)

echo [OK] All required files found
echo.

REM Check Node.js
echo [INFO] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not installed
    echo Please install from: https://nodejs.org/
    goto :error
)
echo [OK] Node.js installed

REM Install Firebase CLI
echo [INFO] Installing Firebase CLI...
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo [WARNING] Firebase CLI installation failed
    echo Trying to continue with existing installation...
)

REM Verify Firebase CLI
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI not available
    echo Please install manually: npm install -g firebase-tools
    goto :error
)
echo [OK] Firebase CLI ready

echo.
echo [INFO] Firebase login...
firebase login
if %errorlevel% neq 0 (
    echo [ERROR] Firebase login failed
    goto :error
)
echo [OK] Login successful

echo.
echo [INFO] Setting project...
firebase use gernboke
if %errorlevel% neq 0 (
    echo [ERROR] Project setup failed
    echo Check: https://console.firebase.google.com/project/gernboke
    goto :error
)
echo [OK] Project set

echo.
echo [INFO] Deploying to hosting...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed
    goto :error
)

echo.
echo ========================================
echo           DEPLOYMENT SUCCESS!
echo ========================================
echo.
echo Your website is live at:
echo https://gernboke.web.app
echo https://gernboke.firebaseapp.com
echo.
echo Opening website...
start https://gernboke.web.app
echo.
echo Deployment completed successfully!
goto :end

:error
echo.
echo [ERROR] Deployment failed
echo Please check the error messages above
echo.
echo For manual deployment, see: MANUAL_DEPLOY_STEPS.md
echo.

:end
pause
