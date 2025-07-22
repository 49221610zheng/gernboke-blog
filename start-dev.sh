#!/bin/bash

# 光影与代码博客系统 - 开发环境启动脚本

echo "🚀 启动光影与代码博客系统开发环境"
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js (v14+)"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查 Firebase CLI 是否安装
if ! command -v firebase &> /dev/null; then
    echo "📦 Firebase CLI 未安装，正在安装..."
    npm install -g firebase-tools
    
    if [ $? -ne 0 ]; then
        echo "❌ Firebase CLI 安装失败"
        exit 1
    fi
    
    echo "✅ Firebase CLI 安装成功"
fi

# 检查是否已登录 Firebase
echo "🔐 检查 Firebase 登录状态..."
firebase projects:list &> /dev/null

if [ $? -ne 0 ]; then
    echo "🔑 请登录 Firebase..."
    firebase login
    
    if [ $? -ne 0 ]; then
        echo "❌ Firebase 登录失败"
        exit 1
    fi
fi

echo "✅ Firebase 登录成功"

# 检查是否存在 Firebase 项目配置
if [ ! -f "firebase.json" ]; then
    echo "⚙️  初始化 Firebase 项目..."
    firebase init
    
    if [ $? -ne 0 ]; then
        echo "❌ Firebase 项目初始化失败"
        exit 1
    fi
    
    echo "✅ Firebase 项目初始化成功"
fi

# 检查 Firebase 配置文件
if [ ! -f "js/firebase-config.js" ]; then
    echo "⚠️  请配置 Firebase 项目信息："
    echo "   1. 在 Firebase Console 中获取项目配置"
    echo "   2. 更新 js/firebase-config.js 文件"
    echo "   3. 重新运行此脚本"
    exit 1
fi

# 启动选项菜单
echo ""
echo "请选择启动模式："
echo "1) 启动 Firebase 模拟器 (推荐用于开发)"
echo "2) 启动本地 HTTP 服务器"
echo "3) 同时启动模拟器和 HTTP 服务器"
echo "4) 部署到 Firebase Hosting"
echo "5) 初始化示例数据"

read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo "🔥 启动 Firebase 模拟器..."
        firebase emulators:start
        ;;
    2)
        echo "🌐 启动本地 HTTP 服务器..."
        if command -v python3 &> /dev/null; then
            echo "使用 Python 3 启动服务器 (http://localhost:8000)"
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            echo "使用 Python 2 启动服务器 (http://localhost:8000)"
            python -m SimpleHTTPServer 8000
        elif command -v npx &> /dev/null; then
            echo "使用 http-server 启动服务器 (http://localhost:8000)"
            npx http-server -p 8000 -c-1
        else
            echo "❌ 未找到可用的 HTTP 服务器"
            exit 1
        fi
        ;;
    3)
        echo "🚀 同时启动模拟器和 HTTP 服务器..."
        
        # 启动 Firebase 模拟器（后台运行）
        echo "启动 Firebase 模拟器..."
        firebase emulators:start &
        FIREBASE_PID=$!
        
        # 等待模拟器启动
        sleep 5
        
        # 启动 HTTP 服务器
        echo "启动 HTTP 服务器..."
        if command -v python3 &> /dev/null; then
            python3 -m http.server 8000 &
            HTTP_PID=$!
        elif command -v npx &> /dev/null; then
            npx http-server -p 8000 -c-1 &
            HTTP_PID=$!
        fi
        
        echo ""
        echo "🎉 开发环境启动成功！"
        echo "📱 前台页面: http://localhost:8000"
        echo "🔧 后台管理: http://localhost:8000/admin.html"
        echo "🔥 Firebase 模拟器: http://localhost:4000"
        echo ""
        echo "按 Ctrl+C 停止所有服务"
        
        # 等待用户中断
        trap "echo '停止服务...'; kill $FIREBASE_PID $HTTP_PID 2>/dev/null; exit" INT
        wait
        ;;
    4)
        echo "🚀 部署到 Firebase Hosting..."
        firebase deploy
        ;;
    5)
        echo "📊 初始化示例数据..."
        if [ -f "scripts/seed-data.js" ]; then
            if [ -f "firebase-service-account.json" ]; then
                node scripts/seed-data.js
            else
                echo "❌ 请先下载 Firebase 服务账户密钥文件"
                echo "   1. 在 Firebase Console 中生成服务账户密钥"
                echo "   2. 将文件重命名为 firebase-service-account.json"
                echo "   3. 放置在项目根目录"
            fi
        else
            echo "❌ 未找到数据种子脚本"
        fi
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac
