@echo off
chcp 65001 >nul

echo 🔥 Firebase 托管设置
echo ===================

echo.
echo 正在设置Firebase托管...
echo.

REM 检查Firebase CLI是否已安装
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI未安装
    echo 请先运行 install-firebase-cli.bat 安装Firebase CLI
    pause
    exit /b 1
)

echo ✅ Firebase CLI已安装
echo.

REM 登录Firebase
echo 🔐 Firebase登录...
echo 将打开浏览器进行登录...
firebase login

if %errorlevel% neq 0 (
    echo ❌ Firebase登录失败
    pause
    exit /b 1
)

echo ✅ Firebase登录成功！
echo.

REM 使用项目
echo 🏗️ 设置Firebase项目...
firebase use gernboke

if %errorlevel% neq 0 (
    echo ❌ 项目设置失败
    echo 请确认项目ID "gernboke" 是否正确
    pause
    exit /b 1
)

echo ✅ 项目设置成功！
echo.

REM 部署到Firebase托管
echo 🚀 部署到Firebase托管...
firebase deploy --only hosting

if %errorlevel% neq 0 (
    echo ❌ 部署失败
    pause
    exit /b 1
)

echo.
echo 🎉 部署成功！
echo.
echo 🌐 您的网站现在可以通过以下地址访问:
echo https://gernboke.web.app
echo https://gernboke.firebaseapp.com
echo.

echo 📋 其他有用命令:
echo firebase serve          - 本地预览
echo firebase deploy         - 完整部署
echo firebase hosting:channel:deploy staging - 部署到staging
echo.

pause
