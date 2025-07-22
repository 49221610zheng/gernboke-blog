@echo off
chcp 65001 >nul

echo 🔥 Firebase CLI 安装和设置
echo ========================

echo.
echo 正在安装Firebase CLI...
echo.

REM 安装Firebase CLI
npm install -g firebase-tools

if %errorlevel% neq 0 (
    echo.
    echo ❌ Firebase CLI安装失败
    echo 💡 请尝试以下解决方案:
    echo.
    echo 1. 以管理员身份运行此脚本
    echo 2. 或者手动运行: npm install -g firebase-tools
    echo 3. 或者使用yarn: yarn global add firebase-tools
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Firebase CLI安装成功！
echo.

REM 验证安装
echo 🔍 验证Firebase CLI安装...
firebase --version

if %errorlevel% neq 0 (
    echo ❌ Firebase CLI验证失败
    pause
    exit /b 1
)

echo.
echo ✅ Firebase CLI验证成功！
echo.

echo 📋 下一步操作:
echo 1. 运行 firebase login 登录Firebase
echo 2. 运行 firebase init 初始化项目
echo 3. 或者运行 setup-firebase-hosting.bat 自动设置
echo.

pause
