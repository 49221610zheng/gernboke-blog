# ⚡ 快速部署指南

> 5分钟内将您的博客系统部署到Firebase！

## 🚀 一键部署

### Windows 用户
```bash
# 双击运行
deploy.bat
```

### Linux/macOS 用户
```bash
# 给脚本执行权限并运行
chmod +x deploy.sh
./deploy.sh
```

## 📋 部署前检查清单

在部署前，请确保完成以下步骤：

### ✅ 必须完成
- [ ] 已创建 Firebase 项目
- [ ] 已更新 `js/firebase-config.js` 配置
- [ ] 已更新 `.firebaserc` 项目ID
- [ ] 已安装 Firebase CLI
- [ ] 已登录 Firebase 账户

### 🔧 推荐完成
- [ ] 已启用 Firestore Database
- [ ] 已启用 Authentication
- [ ] 已启用 Storage
- [ ] 已创建管理员账户

## ⚡ 超快速部署（3步）

### 1️⃣ 配置 Firebase

在 [Firebase Console](https://console.firebase.google.com/) 创建项目后，更新配置：

```javascript
// js/firebase-config.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... 其他配置
};
```

```json
// .firebaserc
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 2️⃣ 验证配置

```bash
npm run validate
```

### 3️⃣ 部署

```bash
npm run deploy
```

## 🎯 部署选项

### 完整部署
```bash
firebase deploy
```

### 仅部署网站
```bash
firebase deploy --only hosting
```

### 预览部署
```bash
firebase hosting:channel:deploy preview --expires 7d
```

## 🔍 部署后验证

部署完成后，访问以下链接验证：

- **主页**: https://your-project-id.web.app
- **管理后台**: https://your-project-id.web.app/admin
- **Firebase Console**: https://console.firebase.google.com/project/your-project-id

## 🆘 常见问题

### 问题：部署失败
```bash
# 检查登录状态
firebase login --reauth

# 检查项目配置
firebase projects:list
firebase use your-project-id
```

### 问题：配置错误
```bash
# 验证配置
npm run validate

# 重新初始化
firebase init
```

### 问题：权限错误
```bash
# 重新登录
firebase logout
firebase login
```

## 📱 移动端测试

部署后，在移动设备上测试：
- 响应式设计
- 触摸交互
- 加载速度
- 图片显示

## 🎉 部署成功！

恭喜！您的博客系统已成功部署。

**下一步：**
1. 创建管理员账户
2. 添加第一篇文章
3. 上传摄影作品
4. 配置自定义域名

**有用链接：**
- [Firebase Console](https://console.firebase.google.com/)
- [域名配置指南](./DEPLOYMENT_GUIDE.md#自定义域名配置)
- [内容管理指南](./PROJECT_SETUP.md#添加内容)

---

🎯 **提示**: 使用 `firebase hosting:channel:deploy preview` 可以创建预览版本，在正式部署前测试更改。
