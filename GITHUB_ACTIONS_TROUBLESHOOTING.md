# 🔧 GitHub Actions 故障排除指南

## 📋 常见警告和解决方案

### 1. "Context access might be invalid" 警告

**问题描述**: IDE显示 `Context access might be invalid: FIREBASE_PROJECT_ID`

**原因**: VSCode的GitHub Actions扩展对secrets访问的静态分析警告

**解决方案**:
1. **使用简化的工作流**: 推荐使用 `deploy-simple.yml` 而不是复杂的 `deploy.yml`
2. **配置VSCode设置**: 已在 `.vscode/settings.json` 中添加YAML schema支持
3. **忽略警告**: 这些是静态分析警告，不影响实际运行

### 2. "Unexpected symbol" 错误

**问题描述**: JavaScript模板字符串在YAML中的语法错误

**解决方案**: 
- 使用 `process.env.VARIABLE_NAME` 而不是 `${{ secrets.VARIABLE }}`
- 在script块中添加 `env:` 部分传递secrets

### 3. 推荐的工作流文件

我们提供了两个GitHub Actions工作流：

#### 🎯 推荐使用: `deploy-simple.yml`
- ✅ 简化的配置，减少警告
- ✅ 更好的错误处理
- ✅ 清晰的步骤分离
- ✅ 条件检查secrets是否配置

#### 🔧 高级版本: `deploy.yml`
- ⚠️ 功能更全面但配置复杂
- ⚠️ 可能有IDE警告（不影响功能）
- ✅ 包含性能测试、可访问性测试等

## 🚀 快速修复步骤

### 1. 使用简化工作流
```bash
# 重命名复杂工作流（可选）
mv .github/workflows/deploy.yml .github/workflows/deploy-complex.yml.backup

# 使用简化工作流
mv .github/workflows/deploy-simple.yml .github/workflows/deploy.yml
```

### 2. 配置必要的Secrets
在GitHub仓库设置中添加：
- `FIREBASE_PROJECT_ID`: 您的Firebase项目ID
- `FIREBASE_TOKEN`: Firebase CLI令牌

### 3. 测试工作流
1. 推送代码到main分支 → 触发生产部署
2. 创建Pull Request → 触发预览部署

## 🔍 调试技巧

### 1. 检查工作流语法
```bash
# 本地验证YAML语法
yamllint .github/workflows/deploy.yml
```

### 2. 查看GitHub Actions日志
1. 访问GitHub仓库的"Actions"标签页
2. 点击具体的工作流运行
3. 查看详细的步骤日志

### 3. 本地测试Firebase命令
```bash
# 测试Firebase登录
firebase login

# 测试项目访问
firebase projects:list

# 测试部署命令
firebase hosting:channel:deploy test --expires 1h
```

## 📊 工作流对比

| 特性 | deploy-simple.yml | deploy.yml |
|------|------------------|------------|
| 配置复杂度 | 简单 ⭐ | 复杂 ⭐⭐⭐ |
| IDE警告 | 少 ✅ | 多 ⚠️ |
| 功能完整性 | 基础 ⭐⭐ | 完整 ⭐⭐⭐ |
| 维护难度 | 低 ✅ | 高 ⚠️ |
| 推荐使用 | ✅ 是 | ⚠️ 高级用户 |

## 🛠️ 自定义配置

### 添加新的部署环境
```yaml
deploy_staging:
  name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  steps:
    - name: Deploy to staging
      run: |
        firebase hosting:channel:deploy staging \
          --project ${{ secrets.FIREBASE_PROJECT_ID }} \
          --token ${{ secrets.FIREBASE_TOKEN }} \
          --expires 30d
```

### 添加测试步骤
```yaml
- name: Run tests
  run: |
    npm test
    npm run test:e2e
```

### 添加通知
```yaml
- name: Notify deployment
  uses: actions/github-script@v7
  with:
    script: |
      console.log('🎉 Deployment completed!');
```

## 🆘 获取帮助

如果遇到问题：

1. **检查Secrets配置**: 确保在GitHub仓库设置中正确配置了secrets
2. **查看Actions日志**: GitHub Actions标签页中的详细日志
3. **使用简化工作流**: 推荐使用 `deploy-simple.yml`
4. **Firebase文档**: [Firebase Hosting GitHub集成](https://firebase.google.com/docs/hosting/github-integration)

## 📝 最佳实践

1. **使用简化工作流**: 除非需要高级功能，否则使用 `deploy-simple.yml`
2. **保护敏感信息**: 始终使用GitHub Secrets，不要硬编码
3. **测试部署**: 使用预览部署测试更改
4. **监控部署**: 定期检查部署日志和网站状态
5. **备份策略**: 重要更改前创建备份

---

**记住**: IDE中的警告不会影响GitHub Actions的实际运行！ 🎉
