#!/bin/bash

# 光影与代码博客系统 - 部署脚本

echo "🚀 开始部署光影与代码博客系统"
echo "================================"

# 检查是否已登录 Firebase
echo "🔐 检查 Firebase 登录状态..."
firebase projects:list &> /dev/null

if [ $? -ne 0 ]; then
    echo "🔑 请先登录 Firebase..."
    firebase login
    
    if [ $? -ne 0 ]; then
        echo "❌ Firebase 登录失败"
        exit 1
    fi
fi

echo "✅ Firebase 登录成功"

# 检查 Firebase 配置
if [ ! -f "js/firebase-config.js" ]; then
    echo "❌ Firebase 配置文件不存在，请先配置 js/firebase-config.js"
    exit 1
fi

# 检查配置是否已更新
if grep -q "YOUR_API_KEY" js/firebase-config.js; then
    echo "❌ Firebase 配置尚未更新，请在 js/firebase-config.js 中填入正确的配置信息"
    exit 1
fi

echo "✅ Firebase 配置检查通过"

# 部署选项菜单
echo ""
echo "请选择部署选项："
echo "1) 完整部署 (Firestore + Storage + Hosting)"
echo "2) 仅部署 Hosting"
echo "3) 仅部署数据库规则 (Firestore + Storage)"
echo "4) 预览部署"
echo "5) 部署到预览频道"

read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo "🚀 开始完整部署..."
        
        # 部署数据库规则
        echo "📋 部署 Firestore 规则..."
        firebase deploy --only firestore:rules
        
        if [ $? -ne 0 ]; then
            echo "❌ Firestore 规则部署失败"
            exit 1
        fi
        
        # 部署存储规则
        echo "📁 部署 Storage 规则..."
        firebase deploy --only storage
        
        if [ $? -ne 0 ]; then
            echo "❌ Storage 规则部署失败"
            exit 1
        fi
        
        # 部署 Hosting
        echo "🌐 部署 Hosting..."
        firebase deploy --only hosting
        
        if [ $? -ne 0 ]; then
            echo "❌ Hosting 部署失败"
            exit 1
        fi
        
        echo "🎉 完整部署成功！"
        ;;
    2)
        echo "🌐 部署 Hosting..."
        firebase deploy --only hosting
        
        if [ $? -ne 0 ]; then
            echo "❌ Hosting 部署失败"
            exit 1
        fi
        
        echo "🎉 Hosting 部署成功！"
        ;;
    3)
        echo "📋 部署数据库规则..."
        firebase deploy --only firestore:rules,storage
        
        if [ $? -ne 0 ]; then
            echo "❌ 数据库规则部署失败"
            exit 1
        fi
        
        echo "🎉 数据库规则部署成功！"
        ;;
    4)
        echo "👀 预览部署..."
        firebase hosting:channel:deploy preview --expires 7d
        
        if [ $? -ne 0 ]; then
            echo "❌ 预览部署失败"
            exit 1
        fi
        
        echo "🎉 预览部署成功！"
        ;;
    5)
        read -p "请输入预览频道名称: " channel_name
        
        if [ -z "$channel_name" ]; then
            echo "❌ 频道名称不能为空"
            exit 1
        fi
        
        echo "🚀 部署到预览频道: $channel_name"
        firebase hosting:channel:deploy $channel_name --expires 30d
        
        if [ $? -ne 0 ]; then
            echo "❌ 预览频道部署失败"
            exit 1
        fi
        
        echo "🎉 预览频道部署成功！"
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

# 获取部署信息
echo ""
echo "📊 获取部署信息..."
firebase hosting:sites:list

echo ""
echo "🎉 部署完成！"
echo "📱 您的网站已上线，可以通过以下方式访问："
echo "   - Firebase 默认域名: https://your-project-id.web.app"
echo "   - Firebase 自定义域名: https://your-project-id.firebaseapp.com"
echo ""
echo "🔧 后续操作："
echo "   1. 在 Firebase Console 中配置自定义域名"
echo "   2. 设置 Google Analytics"
echo "   3. 配置性能监控"
echo "   4. 创建管理员账户"
