@echo off
chcp 65001 >nul
title 光影与代码博客系统 - 开发环境

echo 🚀 启动光影与代码博客系统开发环境
echo ==================================

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js ^(v14+^)
    pause
    exit /b 1
)

REM 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

REM 检查 Firebase CLI 是否安装
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Firebase CLI 未安装，正在安装...
    npm install -g firebase-tools
    
    if %errorlevel% neq 0 (
        echo ❌ Firebase CLI 安装失败
        pause
        exit /b 1
    )
    
    echo ✅ Firebase CLI 安装成功
)

REM 检查是否已登录 Firebase
echo 🔐 检查 Firebase 登录状态...
firebase projects:list >nul 2>&1

if %errorlevel% neq 0 (
    echo 🔑 请登录 Firebase...
    firebase login
    
    if %errorlevel% neq 0 (
        echo ❌ Firebase 登录失败
        pause
        exit /b 1
    )
)

echo ✅ Firebase 登录成功

REM 检查是否存在 Firebase 项目配置
if not exist "firebase.json" (
    echo ⚙️  初始化 Firebase 项目...
    firebase init
    
    if %errorlevel% neq 0 (
        echo ❌ Firebase 项目初始化失败
        pause
        exit /b 1
    )
    
    echo ✅ Firebase 项目初始化成功
)

REM 检查 Firebase 配置文件
if not exist "js\firebase-config.js" (
    echo ⚠️  请配置 Firebase 项目信息：
    echo    1. 在 Firebase Console 中获取项目配置
    echo    2. 更新 js\firebase-config.js 文件
    echo    3. 重新运行此脚本
    pause
    exit /b 1
)

REM 启动选项菜单
echo.
echo 请选择启动模式：
echo 1^) 启动 Firebase 模拟器 ^(推荐用于开发^)
echo 2^) 启动本地 HTTP 服务器
echo 3^) 同时启动模拟器和 HTTP 服务器
echo 4^) 部署到 Firebase Hosting
echo 5^) 初始化示例数据

set /p choice="请输入选项 (1-5): "

if "%choice%"=="1" (
    echo 🔥 启动 Firebase 模拟器...
    firebase emulators:start
) else if "%choice%"=="2" (
    echo 🌐 启动本地 HTTP 服务器...
    
    REM 检查 Python 3
    python --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo 使用 Python 启动服务器 ^(http://localhost:8000^)
        python -m http.server 8000
    ) else (
        REM 检查 npx
        npx --version >nul 2>&1
        if %errorlevel% equ 0 (
            echo 使用 http-server 启动服务器 ^(http://localhost:8000^)
            npx http-server -p 8000 -c-1
        ) else (
            echo ❌ 未找到可用的 HTTP 服务器
            pause
            exit /b 1
        )
    )
) else if "%choice%"=="3" (
    echo 🚀 同时启动模拟器和 HTTP 服务器...
    
    REM 启动 Firebase 模拟器（后台运行）
    echo 启动 Firebase 模拟器...
    start "Firebase Emulator" firebase emulators:start
    
    REM 等待模拟器启动
    timeout /t 5 /nobreak >nul
    
    REM 启动 HTTP 服务器
    echo 启动 HTTP 服务器...
    python --version >nul 2>&1
    if %errorlevel% equ 0 (
        start "HTTP Server" python -m http.server 8000
    ) else (
        npx --version >nul 2>&1
        if %errorlevel% equ 0 (
            start "HTTP Server" npx http-server -p 8000 -c-1
        )
    )
    
    echo.
    echo 🎉 开发环境启动成功！
    echo 📱 前台页面: http://localhost:8000
    echo 🔧 后台管理: http://localhost:8000/admin.html
    echo 🔥 Firebase 模拟器: http://localhost:4000
    echo.
    echo 按任意键关闭此窗口
    pause >nul
    
) else if "%choice%"=="4" (
    echo 🚀 部署到 Firebase Hosting...
    firebase deploy
    pause
) else if "%choice%"=="5" (
    echo 📊 初始化示例数据...
    if exist "scripts\seed-data.js" (
        if exist "firebase-service-account.json" (
            node scripts\seed-data.js
        ) else (
            echo ❌ 请先下载 Firebase 服务账户密钥文件
            echo    1. 在 Firebase Console 中生成服务账户密钥
            echo    2. 将文件重命名为 firebase-service-account.json
            echo    3. 放置在项目根目录
        )
    ) else (
        echo ❌ 未找到数据种子脚本
    )
    pause
) else (
    echo ❌ 无效选项
    pause
    exit /b 1
)
