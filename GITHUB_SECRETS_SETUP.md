# 🔐 GitHub Secrets 配置指南

为了使CI/CD流水线正常工作，您需要在GitHub仓库中配置以下Secrets。

## 📋 必需的 Secrets

### 1. FIREBASE_PROJECT_ID
- **描述**: Firebase项目ID
- **获取方式**: 
  1. 访问 [Firebase Console](https://console.firebase.google.com/)
  2. 选择您的项目
  3. 点击项目设置（齿轮图标）
  4. 在"常规"标签页中找到"项目ID"
- **示例值**: `my-blog-project-12345`

### 2. FIREBASE_TOKEN
- **描述**: Firebase CLI令牌，用于部署
- **获取方式**:
  ```bash
  # 在本地运行以下命令
  firebase login:ci
  ```
  这将生成一个令牌，复制该令牌作为Secret值
- **示例值**: `1//0GWYQRmsAlNHCgYIAR...`

## 🔧 配置步骤

### 1. 访问GitHub仓库设置
1. 打开您的GitHub仓库
2. 点击 "Settings" 标签页
3. 在左侧菜单中选择 "Secrets and variables" > "Actions"

### 2. 添加Secrets
1. 点击 "New repository secret" 按钮
2. 输入Secret名称和值
3. 点击 "Add secret" 保存

### 3. 验证配置
配置完成后，您的Secrets列表应该包含：
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_TOKEN`

## 🚀 测试CI/CD流水线

配置完Secrets后，您可以：

1. **推送代码到main分支** - 触发生产部署
2. **创建Pull Request** - 触发预览部署
3. **推送到develop分支** - 触发staging部署

## 🔒 安全注意事项

1. **不要在代码中硬编码敏感信息**
2. **定期轮换Firebase令牌**
3. **只给必要的人员访问Secrets的权限**
4. **监控部署日志，确保没有泄露敏感信息**

## 🛠️ 故障排除

### 问题：部署失败，提示权限错误
**解决方案**：
1. 检查Firebase令牌是否有效
2. 确认项目ID是否正确
3. 验证Firebase项目权限

### 问题：Secrets未生效
**解决方案**：
1. 检查Secret名称是否完全匹配（区分大小写）
2. 确认Secret值没有多余的空格
3. 重新生成Firebase令牌

### 问题：无法获取Firebase令牌
**解决方案**：
```bash
# 确保已安装Firebase CLI
npm install -g firebase-tools

# 重新登录
firebase logout
firebase login

# 生成CI令牌
firebase login:ci
```

## 📚 相关文档

- [GitHub Actions Secrets文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase CLI文档](https://firebase.google.com/docs/cli)
- [Firebase部署文档](https://firebase.google.com/docs/hosting/github-integration)

---

配置完成后，您的CI/CD流水线将自动处理测试、构建和部署流程！🎉
