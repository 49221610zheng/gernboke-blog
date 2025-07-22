# 🚀 Firebase 部署完整指南

本指南将帮助您将"光影与代码博客系统"部署到Firebase Hosting。

## 📋 部署前准备

### 1. 环境检查

确保您已安装：
- [Node.js](https://nodejs.org/) (v14+)
- [Firebase CLI](https://firebase.google.com/docs/cli)

```bash
# 检查版本
node --version
npm --version
firebase --version
```

### 2. Firebase 项目设置

#### 创建 Firebase 项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"创建项目"
3. 输入项目名称（如：`light-and-code-blog`）
4. 启用 Google Analytics（推荐）
5. 等待项目创建完成

#### 启用必要服务
在 Firebase Console 中启用以下服务：

**Firestore Database:**
1. 进入 "Firestore Database"
2. 点击 "创建数据库"
3. 选择 "以测试模式启动"
4. 选择数据库位置

**Authentication:**
1. 进入 "Authentication"
2. 点击 "开始使用"
3. 在 "Sign-in method" 中启用 "电子邮件地址/密码"

**Storage:**
1. 进入 "Storage"
2. 点击 "开始使用"
3. 选择 "以测试模式启动"

**Hosting:**
1. 进入 "Hosting"
2. 点击 "开始使用"
3. 按照指引完成设置

### 3. 获取 Firebase 配置

1. 在 Firebase Console 中，点击项目设置（齿轮图标）
2. 滚动到 "您的应用" 部分
3. 点击 Web 图标 `</>`
4. 输入应用昵称
5. 复制配置对象

### 4. 更新项目配置

编辑 `js/firebase-config.js` 文件：

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id",
  measurementId: "your-measurement-id"
};
```

编辑 `.firebaserc` 文件：

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## 🚀 部署步骤

### 方法一：使用部署脚本（推荐）

**Windows 用户：**
```bash
deploy.bat
```

**Linux/macOS 用户：**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 方法二：手动部署

#### 1. 登录 Firebase

```bash
firebase login
```

#### 2. 初始化项目（如果尚未完成）

```bash
firebase init
```

选择以下服务：
- Firestore
- Storage
- Hosting

#### 3. 部署安全规则

```bash
# 部署 Firestore 规则
firebase deploy --only firestore:rules

# 部署 Storage 规则
firebase deploy --only storage
```

#### 4. 部署网站

```bash
# 部署到 Hosting
firebase deploy --only hosting
```

#### 5. 完整部署

```bash
# 一次性部署所有服务
firebase deploy
```

## 🔧 部署选项

### 预览部署

在正式部署前，可以创建预览版本：

```bash
# 创建预览频道
firebase hosting:channel:deploy preview --expires 7d

# 创建自定义预览频道
firebase hosting:channel:deploy staging --expires 30d
```

### 多环境部署

配置多个环境：

```bash
# 添加项目别名
firebase use --add

# 部署到特定环境
firebase deploy --project staging
firebase deploy --project production
```

## 🌐 自定义域名配置

### 1. 添加自定义域名

在 Firebase Console 的 Hosting 部分：
1. 点击 "添加自定义域名"
2. 输入您的域名
3. 按照指引验证域名所有权

### 2. 更新 DNS 记录

根据 Firebase 提供的信息，在您的域名提供商处添加：
- A 记录指向 Firebase IP
- 或 CNAME 记录指向 Firebase 域名

### 3. 等待 SSL 证书

Firebase 会自动为您的域名生成 SSL 证书，通常需要几分钟到几小时。

## 📊 部署后配置

### 1. 创建管理员账户

在 Firebase Console 的 Authentication 中：
1. 添加新用户
2. 记录用户 UID
3. 在 Firestore 的 `users` 集合中添加用户信息

### 2. 初始化数据

如果需要添加示例数据：

```bash
# 下载服务账户密钥
# 将密钥文件重命名为 firebase-service-account.json
# 运行数据种子脚本
node scripts/seed-data.js
```

### 3. 配置 Google Analytics

在 Firebase Console 中：
1. 进入 "Analytics"
2. 按照指引配置 Google Analytics
3. 获取跟踪 ID 并更新配置

## 🔍 部署验证

### 自动检查

部署完成后，访问以下 URL 验证：

- **主页**: https://your-domain.com
- **管理后台**: https://your-domain.com/admin
- **API 连接**: 检查浏览器控制台是否有错误

### 手动测试

1. **功能测试**
   - 用户登录
   - 内容管理
   - 图片上传
   - 响应式设计

2. **性能测试**
   - 页面加载速度
   - 图片加载
   - 移动端性能

3. **安全测试**
   - 权限验证
   - 数据访问控制
   - HTTPS 强制

## 🛠️ 常见问题

### 部署失败

**问题**: `Error: HTTP Error: 403, The caller does not have permission`
**解决**: 检查 Firebase 项目权限，确保已登录正确账户

**问题**: `Error: Cannot find module 'firebase-admin'`
**解决**: 运行 `npm install firebase-admin`

### 配置错误

**问题**: 网站显示 Firebase 配置错误
**解决**: 检查 `js/firebase-config.js` 中的配置信息是否正确

**问题**: 管理员无法登录
**解决**: 确保在 Firestore 中正确设置了用户角色

### 性能问题

**问题**: 网站加载缓慢
**解决**: 
- 启用 Firebase Hosting 的 CDN
- 优化图片大小
- 检查网络连接

## 📈 监控和维护

### 性能监控

在 Firebase Console 中启用：
- Performance Monitoring
- Crashlytics（如果使用移动端）

### 使用分析

配置 Google Analytics 来跟踪：
- 页面浏览量
- 用户行为
- 转化率

### 定期维护

- 定期备份 Firestore 数据
- 更新安全规则
- 监控使用配额
- 更新依赖项

## 🎉 部署完成

恭喜！您的博客系统已成功部署到 Firebase。

**下一步操作：**
1. 添加您的第一篇文章
2. 上传摄影作品
3. 配置 SEO 设置
4. 分享您的网站

**有用链接：**
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase 文档](https://firebase.google.com/docs)
- [性能监控](https://console.firebase.google.com/project/your-project-id/performance)

---

如果遇到问题，请查看 [故障排除指南](./PROJECT_SETUP.md#故障排除) 或提交 Issue。
