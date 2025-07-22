# Firebase 项目配置指南

本指南将帮助您设置 Firebase 项目并配置所需的服务。

## 📋 前置要求

- Google 账户
- Node.js 和 npm（用于 Firebase CLI）
- 现代浏览器

## 🚀 步骤 1：创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"创建项目"
3. 输入项目名称：`light-and-code-blog`
4. 选择是否启用 Google Analytics（推荐启用）
5. 等待项目创建完成

## ⚙️ 步骤 2：配置 Web 应用

1. 在项目概览页面，点击 Web 图标 `</>`
2. 输入应用昵称：`光影与代码博客`
3. 选择"同时为此应用设置 Firebase Hosting"
4. 点击"注册应用"
5. 复制配置对象，替换 `js/firebase-config.js` 中的配置

```javascript
// 示例配置（请使用您自己的配置）
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## 🗄️ 步骤 3：设置 Firestore 数据库

1. 在左侧菜单中选择"Firestore Database"
2. 点击"创建数据库"
3. 选择"以测试模式启动"（稍后会配置安全规则）
4. 选择数据库位置（推荐选择离用户最近的区域）

### 创建初始集合

手动创建以下集合和示例文档：

#### users 集合
```json
{
  "uid": "admin-user-id",
  "email": "admin@example.com",
  "name": "管理员",
  "role": "admin",
  "avatarUrl": "",
  "createdAt": "2023-01-01T00:00:00Z",
  "lastLoginAt": "2023-01-01T00:00:00Z"
}
```

#### settings 集合
```json
{
  "id": "site_settings",
  "siteName": "光影与代码",
  "siteDescription": "融合摄影艺术与编程技术的个人博客",
  "logoUrl": "",
  "faviconUrl": "",
  "contactEmail": "contact@example.com",
  "socialLinks": {
    "github": "https://github.com/username",
    "instagram": "https://instagram.com/username",
    "twitter": "https://twitter.com/username"
  },
  "theme": {
    "primaryColor": "#165DFF",
    "accentColor": "#36CFC9"
  },
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

## 🔐 步骤 4：配置 Authentication

1. 在左侧菜单中选择"Authentication"
2. 点击"开始使用"
3. 选择"Sign-in method"标签
4. 启用"电子邮件地址/密码"登录方式
5. 在"Users"标签中添加管理员用户

### 创建管理员账户
1. 点击"添加用户"
2. 输入邮箱和密码
3. 记住这些凭据，用于后台登录

## 📁 步骤 5：配置 Storage

1. 在左侧菜单中选择"Storage"
2. 点击"开始使用"
3. 选择"以测试模式启动"
4. 选择存储位置

### 创建文件夹结构
在 Storage 中创建以下文件夹：
- `images/` - 存储摄影作品原图
- `thumbnails/` - 存储缩略图
- `articles/` - 存储文章相关图片
- `avatars/` - 存储用户头像

## 🛡️ 步骤 6：配置安全规则

### Firestore 安全规则
1. 在 Firestore Database 中选择"规则"标签
2. 将 `firestore.rules` 文件的内容复制到规则编辑器
3. 点击"发布"

### Storage 安全规则
1. 在 Storage 中选择"规则"标签
2. 配置以下规则：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    match /articles/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    function isAdmin() {
      return request.auth != null 
        && exists(/databases/(default)/documents/users/$(request.auth.uid))
        && get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🌐 步骤 7：配置 Hosting

1. 安装 Firebase CLI：
```bash
npm install -g firebase-tools
```

2. 登录 Firebase：
```bash
firebase login
```

3. 在项目根目录初始化：
```bash
firebase init
```

4. 选择以下服务：
   - Firestore
   - Storage
   - Hosting

5. 配置选项：
   - 使用现有项目
   - 选择您创建的项目
   - 使用默认的 Firestore 规则文件
   - 设置 public 目录为项目根目录
   - 配置为单页应用

## 🧪 步骤 8：测试配置

1. 在浏览器中打开 `index.html`
2. 检查浏览器控制台是否有错误
3. 尝试访问后台管理页面 `admin.html`
4. 使用创建的管理员账户登录

## 📱 步骤 9：启用 Analytics（可选）

1. 在左侧菜单中选择"Analytics"
2. 按照指引配置 Google Analytics
3. 这将帮助您跟踪网站访问数据

## 🔧 开发环境配置

### 使用 Firebase 模拟器（推荐）

1. 安装模拟器：
```bash
firebase init emulators
```

2. 选择要模拟的服务：
   - Authentication
   - Firestore
   - Storage

3. 启动模拟器：
```bash
firebase emulators:start
```

4. 模拟器将在以下端口运行：
   - Firestore: http://localhost:8080
   - Authentication: http://localhost:9099
   - Storage: http://localhost:9199

## 🚀 部署到生产环境

1. 构建项目（如果需要）
2. 部署到 Firebase Hosting：
```bash
firebase deploy
```

3. 访问提供的 URL 查看您的网站

## 📝 注意事项

1. **安全规则**：确保在生产环境中使用严格的安全规则
2. **备份**：定期备份 Firestore 数据
3. **监控**：设置 Firebase 性能监控和错误报告
4. **配额**：注意 Firebase 的免费配额限制
5. **域名**：可以在 Hosting 设置中配置自定义域名

## 🆘 常见问题

### 问题 1：配置文件错误
- 确保 `firebase-config.js` 中的配置信息正确
- 检查项目 ID 是否匹配

### 问题 2：权限错误
- 检查 Firestore 安全规则是否正确配置
- 确保管理员用户的 role 字段设置为 "admin"

### 问题 3：文件上传失败
- 检查 Storage 安全规则
- 确保文件大小不超过限制

### 问题 4：认证失败
- 检查 Authentication 配置
- 确保启用了邮箱/密码登录方式

## 📞 获取帮助

- [Firebase 官方文档](https://firebase.google.com/docs)
- [Firebase 社区论坛](https://firebase.google.com/support)
- [Stack Overflow Firebase 标签](https://stackoverflow.com/questions/tagged/firebase)

---

完成以上步骤后，您的 Firebase 项目就配置完成了！现在可以开始开发和测试您的博客系统。
