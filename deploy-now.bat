@echo off
chcp 65001 >nul

echo 🚀 Firebase 立即部署
echo ===================
echo.

echo 📋 按照Firebase官方指引部署您的博客网站
echo.

echo 🔍 检查环境...

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js已安装

REM 检查npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm未安装
    pause
    exit /b 1
)
echo ✅ npm已安装

echo.
echo 📦 安装Firebase CLI...
echo.

REM 安装Firebase CLI
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI安装失败
    echo.
    echo 💡 请尝试以下解决方案:
    echo 1. 以管理员身份运行此脚本
    echo 2. 或手动运行: npm install -g firebase-tools
    echo 3. 或使用yarn: yarn global add firebase-tools
    echo.
    echo 📖 详细指南请查看: FIREBASE_DEPLOY_GUIDE.md
    pause
    exit /b 1
)

echo ✅ Firebase CLI安装成功
echo.

REM 验证Firebase CLI
firebase --version
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI验证失败
    pause
    exit /b 1
)

echo.
echo 🔐 Firebase登录...
echo 将打开浏览器进行Google账户登录...
echo.

firebase login
if %errorlevel% neq 0 (
    echo ❌ Firebase登录失败
    echo.
    echo 💡 请尝试:
    echo 1. 确保网络连接正常
    echo 2. 使用正确的Google账户
    echo 3. 手动运行: firebase login --reauth
    pause
    exit /b 1
)

echo ✅ Firebase登录成功
echo.

echo 🏗️ 设置项目...
firebase use gernboke
if %errorlevel% neq 0 (
    echo ❌ 项目设置失败
    echo.
    echo 💡 可能的原因:
    echo 1. 项目"gernboke"不存在
    echo 2. 没有项目访问权限
    echo 3. 项目ID错误
    echo.
    echo 请在Firebase Console确认项目: https://console.firebase.google.com/
    pause
    exit /b 1
)

echo ✅ 项目设置成功
echo.

echo 📋 选择部署方式:
echo 1. 完整部署 (推荐首次部署)
echo 2. 仅托管部署 (快速)
echo 3. 初始化项目 (如果是首次使用)
echo 4. 取消
echo.

set /p choice="请选择 (1-4): "

if "%choice%"=="1" goto full_deploy
if "%choice%"=="2" goto hosting_deploy
if "%choice%"=="3" goto init_project
if "%choice%"=="4" goto cancel
goto invalid

:init_project
echo 🔧 初始化Firebase项目...
echo.
echo 📝 配置提示:
echo • 选择 Firestore, Hosting, Storage
echo • 使用现有项目: gernboke
echo • Public directory: . (点号，表示当前目录)
echo • Single-page app: No
echo.
firebase init
if %errorlevel% neq 0 (
    echo ❌ 项目初始化失败
    pause
    exit /b 1
)
echo ✅ 项目初始化成功
echo.
echo 现在可以运行部署了
goto menu

:full_deploy
echo 🚀 开始完整部署...
firebase deploy
goto check_result

:hosting_deploy
echo 🌐 开始托管部署...
firebase deploy --only hosting
goto check_result

:check_result
if %errorlevel% neq 0 (
    echo ❌ 部署失败
    echo.
    echo 💡 可能的解决方案:
    echo 1. 检查网络连接
    echo 2. 确认项目权限
    echo 3. 检查firebase.json配置
    echo 4. 查看详细错误信息
    echo.
    echo 📖 详细指南: FIREBASE_DEPLOY_GUIDE.md
    pause
    exit /b 1
)

echo.
echo 🎉 部署成功！
echo.
echo 🌐 您的博客网站现在可以访问:
echo • 主域名: https://gernboke.web.app
echo • 备用域名: https://gernboke.firebaseapp.com
echo.
echo 🔧 Firebase管理面板:
echo • 项目概览: https://console.firebase.google.com/project/gernboke
echo • 托管管理: https://console.firebase.google.com/project/gernboke/hosting
echo • 数据库管理: https://console.firebase.google.com/project/gernboke/firestore
echo.
echo 📱 建议测试:
echo 1. 在不同设备上访问网站
echo 2. 测试管理后台功能
echo 3. 检查响应式设计
echo.
goto end

:invalid
echo ❌ 无效选择
goto menu

:cancel
echo 👋 部署已取消
goto end

:menu
echo.
echo 📋 其他可用命令:
echo • firebase serve          - 本地预览
echo • firebase deploy         - 完整部署
echo • firebase deploy --only hosting - 仅托管部署
echo.

:end
echo 📚 更多帮助:
echo • 部署指南: FIREBASE_DEPLOY_GUIDE.md
echo • Firebase文档: https://firebase.google.com/docs/hosting
echo.
pause
