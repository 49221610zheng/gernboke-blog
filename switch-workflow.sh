#!/bin/bash

# GitHub Actions 工作流切换脚本

echo "🔄 GitHub Actions 工作流切换工具"
echo "=================================="

# 检查当前工作流
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "📄 当前活动工作流: deploy.yml"
else
    echo "⚠️ 没有找到活动的工作流文件"
fi

echo ""
echo "可用的工作流选项:"
echo "1. deploy-clean.yml    (推荐 - 无警告)"
echo "2. deploy-simple.yml   (简单版本)"
echo "3. deploy.yml          (完整版本 - 当前)"
echo "4. 查看工作流状态"
echo "5. 退出"

read -p "请选择 (1-5): " choice

case $choice in
    1)
        echo "🌟 切换到 deploy-clean.yml (无警告版本)..."
        
        # 备份当前工作流
        if [ -f ".github/workflows/deploy.yml" ]; then
            mv .github/workflows/deploy.yml .github/workflows/deploy-backup-$(date +%Y%m%d-%H%M%S).yml
            echo "✅ 已备份当前工作流"
        fi
        
        # 切换到clean版本
        if [ -f ".github/workflows/deploy-clean.yml" ]; then
            cp .github/workflows/deploy-clean.yml .github/workflows/deploy.yml
            echo "✅ 已切换到 deploy-clean.yml"
            echo "🎉 现在使用无警告的工作流配置！"
        else
            echo "❌ deploy-clean.yml 文件不存在"
        fi
        ;;
        
    2)
        echo "⚡ 切换到 deploy-simple.yml (简单版本)..."
        
        # 备份当前工作流
        if [ -f ".github/workflows/deploy.yml" ]; then
            mv .github/workflows/deploy.yml .github/workflows/deploy-backup-$(date +%Y%m%d-%H%M%S).yml
            echo "✅ 已备份当前工作流"
        fi
        
        # 切换到simple版本
        if [ -f ".github/workflows/deploy-simple.yml" ]; then
            cp .github/workflows/deploy-simple.yml .github/workflows/deploy.yml
            echo "✅ 已切换到 deploy-simple.yml"
        else
            echo "❌ deploy-simple.yml 文件不存在"
        fi
        ;;
        
    3)
        echo "🔧 保持使用完整版本 deploy.yml..."
        echo "⚠️ 注意: 此版本可能有IDE警告，但功能完整"
        ;;
        
    4)
        echo "📊 工作流状态:"
        echo "=============="
        
        if [ -f ".github/workflows/deploy.yml" ]; then
            echo "✅ deploy.yml (活动)"
        else
            echo "❌ deploy.yml (不存在)"
        fi
        
        if [ -f ".github/workflows/deploy-clean.yml" ]; then
            echo "✅ deploy-clean.yml (可用)"
        else
            echo "❌ deploy-clean.yml (不存在)"
        fi
        
        if [ -f ".github/workflows/deploy-simple.yml" ]; then
            echo "✅ deploy-simple.yml (可用)"
        else
            echo "❌ deploy-simple.yml (不存在)"
        fi
        
        echo ""
        echo "备份文件:"
        ls -la .github/workflows/deploy-backup-* 2>/dev/null || echo "无备份文件"
        ;;
        
    5)
        echo "👋 退出"
        exit 0
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🔍 下一步操作:"
echo "1. 检查 GitHub Secrets 配置 (FIREBASE_PROJECT_ID, FIREBASE_TOKEN)"
echo "2. 推送代码到 GitHub 测试工作流"
echo "3. 查看 Actions 标签页验证部署"

echo ""
echo "📚 更多信息:"
echo "- 工作流选择指南: WORKFLOW_SELECTION.md"
echo "- 故障排除: GITHUB_ACTIONS_TROUBLESHOOTING.md"
echo "- Secrets配置: GITHUB_SECRETS_SETUP.md"
