# 🌟 格恩博克博客系统

> 融合摄影艺术与编程技术的现代化个人博客系统

[![Deploy to GitHub Pages](https://github.com/49221610zheng/gernboke-blog/actions/workflows/pages.yml/badge.svg)](https://github.com/49221610zheng/gernboke-blog/actions/workflows/pages.yml)

🌐 **在线访问**:
[https://49221610zheng.github.io/gernboke-blog/](https://49221610zheng.github.io/gernboke-blog/)

## 🚨 部署问题？立即修复！

如果部署失败，请按照以下步骤：

### 快速修复

1. **双击运行**: `emergency-deploy.bat`
2. **或查看**: `GITHUB_PAGES_FIX.txt`

### 手动修复

1. 访问
   [Pages 设置](https://github.com/49221610zheng/gernboke-blog/settings/pages)
2. 选择 "GitHub Actions" 作为源
3. 访问
   [Actions 设置](https://github.com/49221610zheng/gernboke-blog/settings/actions)
4. 启用 "Read and write permissions"
5. 手动触发工作流

![项目预览](https://picsum.photos/800/400?random=1)

## ✨ 特性

- 🎨 **现代化设计** - 基于 Tailwind CSS 的响应式设计
- 📸 **摄影作品展示** - 专业的摄影作品管理和展示
- 📝 **技术文章分享** - 支持 Markdown 的文章编辑系统
- 🔥 **Firebase 后端** - 无服务器架构，自动扩展
- 🛡️ **安全可靠** - 完整的安全规则和权限控制
- 📱 **移动端优化** - 完美适配各种设备
- ⚡ **性能优化** - 图片懒加载、缓存策略
- 🎯 **SEO 友好** - 优化的元数据和结构化数据

## 🚀 快速开始

### 方法一：使用启动脚本（推荐）

**Windows 用户：**

```bash
# 双击运行或在命令行中执行
start-dev.bat
```

**Linux/macOS 用户：**

```bash
# 给脚本执行权限
chmod +x start-dev.sh

# 运行脚本
./start-dev.sh
```

### 方法二：手动设置

#### 1. 环境准备

确保已安装以下软件：

- [Node.js](https://nodejs.org/) (v14+)
- [Git](https://git-scm.com/)

#### 2. 克隆项目

```bash
git clone <repository-url>
cd light-and-code-blog
```

#### 3. 安装 Firebase CLI

```bash
npm install -g firebase-tools
```

#### 4. 登录 Firebase

```bash
firebase login
```

#### 5. 配置 Firebase 项目

1. 在 [Firebase Console](https://console.firebase.google.com/) 创建新项目
2. 启用以下服务：

   - Firestore Database
   - Authentication (Email/Password)
   - Storage
   - Hosting

3. 获取项目配置信息，更新 `js/firebase-config.js`：

```javascript
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'your-app-id',
  measurementId: 'your-measurement-id'
};
```

#### 6. 初始化 Firebase 项目

```bash
firebase init
```

选择以下服务：

- Firestore
- Storage
- Hosting

#### 7. 启动开发环境

```bash
# 启动 Firebase 模拟器
firebase emulators:start

# 在另一个终端启动 HTTP 服务器
python -m http.server 8000
# 或
npx http-server -p 8000
```

#### 8. 访问应用

- 前台页面：http://localhost:8000
- 后台管理：http://localhost:8000/admin.html
- Firebase 模拟器：http://localhost:4000

## 📖 使用指南

### 创建管理员账户

1. 在 Firebase Console 的 Authentication 中创建用户
2. 在 Firestore 的 `users` 集合中添加用户信息：

```json
{
  "uid": "用户ID",
  "email": "admin@example.com",
  "name": "管理员",
  "role": "admin",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

### 添加内容

1. 访问后台管理页面：http://localhost:8000/admin.html
2. 使用管理员账户登录
3. 在相应模块中添加文章或摄影作品

### 自定义配置

编辑 `js/config/app-config.js` 文件来自定义：

- 网站信息
- 主题颜色
- 功能开关
- 性能配置

## 📁 项目结构

```
light-and-code-blog/
├── index.html              # 前台主页
├── admin.html              # 后台管理页面
├── js/                     # JavaScript 模块
│   ├── app.js              # 前台应用
│   ├── admin.js            # 后台应用
│   ├── firebase-config.js  # Firebase 配置
│   ├── config/             # 配置文件
│   ├── services/           # 服务层
│   └── utils/              # 工具类
├── scripts/                # 脚本文件
├── firebase.json           # Firebase 配置
├── firestore.rules         # 数据库安全规则
├── storage.rules           # 存储安全规则
└── README.md               # 项目说明
```

## 🛠️ 开发

### 添加新功能

1. 在 `js/services/` 中创建服务模块
2. 在 `js/utils/module-loader.js` 中注册模块
3. 更新相应的 UI 组件

### 数据库操作

使用封装好的服务层进行数据操作：

```javascript
// 获取文章列表
const articles = await articleService.getList(1, 10);

// 创建摄影作品
const photoId = await photographyService.create(photoData);

// 上传图片
const result = await storageService.uploadImage(file, 'images');
```

### 状态管理

使用内置的状态管理器：

```javascript
// 更新状态
stateManager.setState({ loading: true });

// 监听状态变化
stateManager.subscribe('loading', loading => {
  // 处理加载状态变化
});
```

## 🚀 部署

### 部署到 Firebase Hosting

```bash
# 构建项目（如果需要）
npm run build

# 部署到 Firebase
firebase deploy

# 仅部署 Hosting
firebase deploy --only hosting
```

### 自定义域名

1. 在 Firebase Console 中配置自定义域名
2. 更新 DNS 记录
3. 等待 SSL 证书生成

## 📊 监控

### 性能监控

- Firebase Performance Monitoring
- Google Analytics
- 自定义性能指标

### 错误监控

- 全局错误捕获
- 用户反馈收集
- 实时错误报告

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 获取帮助

- 📖 [项目文档](./PROJECT_SETUP.md)
- 🔥 [Firebase 配置指南](./FIREBASE_SETUP.md)
- 💬 [提交 Issue](https://github.com/username/light-and-code-blog/issues)
- 📧 [联系作者](mailto:contact@example.com)

## 🎯 路线图

- [ ] 评论系统
- [ ] 搜索功能
- [ ] 标签管理
- [ ] 数据导出
- [ ] 多语言支持
- [ ] PWA 支持
- [ ] 移动端应用

---

**如果这个项目对您有帮助，请给个 ⭐ Star！**
