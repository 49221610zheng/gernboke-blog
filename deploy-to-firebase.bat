@echo off
chcp 65001 >nul

echo 🚀 一键部署到Firebase
echo =====================

echo.
echo 正在检查环境...
echo.

REM 检查Firebase CLI
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI未安装
    echo.
    set /p install="是否现在安装Firebase CLI? (y/n): "
    if /i "%install%"=="y" (
        echo 正在安装Firebase CLI...
        npm install -g firebase-tools
        if %errorlevel% neq 0 (
            echo ❌ 安装失败，请手动安装
            pause
            exit /b 1
        )
        echo ✅ Firebase CLI安装成功
    ) else (
        echo 请先安装Firebase CLI
        pause
        exit /b 1
    )
)

echo ✅ Firebase CLI已安装
echo.

REM 检查登录状态
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 需要登录Firebase...
    firebase login
    if %errorlevel% neq 0 (
        echo ❌ 登录失败
        pause
        exit /b 1
    )
)

echo ✅ Firebase已登录
echo.

REM 设置项目
echo 🏗️ 设置项目...
firebase use gernboke
if %errorlevel% neq 0 (
    echo ❌ 项目设置失败
    echo 请确认项目 "gernboke" 是否存在且有权限访问
    pause
    exit /b 1
)

echo ✅ 项目设置成功
echo.

REM 选择部署类型
echo 📋 选择部署类型:
echo 1. 完整部署 (hosting + firestore + storage)
echo 2. 仅托管 (hosting only)
echo 3. 预览部署 (preview channel)
echo 4. 取消
echo.

set /p choice="请选择 (1-4): "

if "%choice%"=="1" goto full_deploy
if "%choice%"=="2" goto hosting_only
if "%choice%"=="3" goto preview_deploy
if "%choice%"=="4" goto cancel
goto invalid_choice

:full_deploy
echo 🚀 开始完整部署...
firebase deploy
goto deploy_complete

:hosting_only
echo 🌐 开始托管部署...
firebase deploy --only hosting
goto deploy_complete

:preview_deploy
echo 🔍 开始预览部署...
firebase hosting:channel:deploy preview --expires 7d
goto deploy_complete

:invalid_choice
echo ❌ 无效选择
pause
exit /b 1

:cancel
echo 👋 部署已取消
pause
exit /b 0

:deploy_complete
if %errorlevel% neq 0 (
    echo ❌ 部署失败
    echo.
    echo 💡 可能的解决方案:
    echo 1. 检查网络连接
    echo 2. 确认项目权限
    echo 3. 检查firebase.json配置
    echo 4. 查看详细错误信息
    pause
    exit /b 1
)

echo.
echo 🎉 部署成功！
echo.
echo 🌐 您的网站地址:
echo • 主域名: https://gernboke.web.app
echo • 备用域名: https://gernboke.firebaseapp.com
echo.

if "%choice%"=="3" (
    echo 🔍 预览地址:
    echo • https://gernboke--preview-<random-id>.web.app
    echo.
)

echo 📋 其他有用命令:
echo • firebase serve           - 本地预览
echo • firebase hosting:sites:list - 查看所有站点
echo • firebase projects:list   - 查看所有项目
echo.

echo 🔧 管理面板:
echo • Firebase Console: https://console.firebase.google.com/project/gernboke
echo • 托管设置: https://console.firebase.google.com/project/gernboke/hosting
echo.

pause
