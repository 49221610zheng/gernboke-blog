# 光影与代码博客系统 - 项目启动指南

## 📋 项目概述

这是一个融合摄影作品展示与技术分享的现代化博客系统，采用前后端分离架构，使用 Firebase 作为后端服务。

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + 原生JavaScript (ES6+)
- **样式**: Tailwind CSS v3
- **后端**: Firebase (Firestore + Storage + Authentication + Hosting)
- **构建工具**: 无需构建工具（原生开发）
- **部署**: Firebase Hosting

## 📁 项目结构

```
项目根目录/
├── index.html                    # 前台主页
├── admin.html                    # 后台管理页面
├── js/                          # JavaScript 模块
│   ├── app.js                   # 前台应用主文件
│   ├── admin.js                 # 后台应用主文件
│   ├── firebase-config.js       # Firebase 配置
│   ├── config/                  # 配置文件
│   │   └── app-config.js        # 应用配置
│   ├── services/                # 服务层
│   │   ├── database.js          # 数据库服务
│   │   ├── auth.js              # 认证服务
│   │   └── storage.js           # 存储服务
│   └── utils/                   # 工具类
│       ├── module-loader.js     # 模块加载器
│       ├── state-manager.js     # 状态管理
│       └── error-handler.js     # 错误处理
├── firestore.rules              # Firestore 安全规则
├── FIREBASE_SETUP.md            # Firebase 配置指南
└── PROJECT_SETUP.md             # 项目启动指南（本文件）
```

## 🚀 快速开始

### 1. 环境准备

确保您的开发环境已安装：
- Node.js (v14+) 和 npm
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- Git

### 2. 克隆项目

```bash
git clone <repository-url>
cd light-and-code-blog
```

### 3. Firebase 配置

按照 `FIREBASE_SETUP.md` 中的详细说明配置 Firebase 项目：

1. 创建 Firebase 项目
2. 配置 Firestore 数据库
3. 设置 Authentication
4. 配置 Storage
5. 更新 `js/firebase-config.js` 中的配置信息

### 4. 本地开发

#### 使用 Firebase 模拟器（推荐）

```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录 Firebase
firebase login

# 初始化项目
firebase init

# 启动模拟器
firebase emulators:start
```

#### 使用本地服务器

```bash
# 使用 Python 3
python -m http.server 8000

# 或使用 Python 2
python -m SimpleHTTPServer 8000

# 或使用 Node.js
npx http-server -p 8000

# 或使用 Live Server (VS Code 扩展)
```

访问 `http://localhost:8000` 查看前台页面
访问 `http://localhost:8000/admin.html` 查看后台管理页面

### 5. 初始数据设置

在 Firestore 中创建初始数据：

#### 管理员用户
在 Authentication 中创建管理员用户，然后在 Firestore 的 `users` 集合中添加：

```json
{
  "uid": "管理员用户ID",
  "email": "admin@example.com",
  "name": "管理员",
  "role": "admin",
  "avatarUrl": "",
  "createdAt": "2023-01-01T00:00:00Z",
  "lastLoginAt": "2023-01-01T00:00:00Z"
}
```

#### 系统设置
在 `settings` 集合中添加 `site_settings` 文档：

```json
{
  "siteName": "光影与代码",
  "siteDescription": "融合摄影艺术与编程技术的个人博客",
  "logoUrl": "",
  "faviconUrl": "",
  "contactEmail": "contact@example.com",
  "socialLinks": {
    "github": "https://github.com/username",
    "instagram": "https://instagram.com/username"
  },
  "theme": {
    "primaryColor": "#165DFF",
    "accentColor": "#36CFC9"
  }
}
```

## 🔧 开发指南

### 模块化架构

项目采用模块化架构，主要模块包括：

- **模块加载器**: 管理模块依赖和初始化
- **状态管理**: 统一管理应用状态
- **错误处理**: 全局错误捕获和用户友好提示
- **服务层**: 封装 Firebase 操作

### 添加新功能

1. **创建服务模块**：在 `js/services/` 目录下创建新的服务文件
2. **注册模块**：在 `js/utils/module-loader.js` 中注册新模块
3. **更新状态**：在状态管理器中添加相关状态
4. **添加 UI**：在 HTML 文件中添加相应的界面元素

### 代码规范

- 使用 ES6+ 语法
- 采用模块化开发
- 遵循单一职责原则
- 添加适当的错误处理
- 编写清晰的注释

## 🧪 测试

### 功能测试

1. **前台功能**：
   - 页面加载和响应式布局
   - 摄影作品展示
   - 文章列表显示
   - 导航和交互效果

2. **后台功能**：
   - 管理员登录
   - 内容管理（增删改查）
   - 文件上传
   - 数据统计

### 浏览器兼容性测试

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

### 移动端测试

- iOS Safari
- Android Chrome
- 响应式布局测试

## 📱 部署

### 部署到 Firebase Hosting

```bash
# 构建项目（如果需要）
# 本项目无需构建步骤

# 部署到 Firebase
firebase deploy

# 仅部署 Hosting
firebase deploy --only hosting

# 部署到预览环境
firebase hosting:channel:deploy preview
```

### 自定义域名

1. 在 Firebase Console 中配置自定义域名
2. 更新 DNS 记录
3. 等待 SSL 证书生成

### 环境变量

生产环境中需要配置的环境变量：

- Firebase 配置信息
- Google Analytics ID
- 其他第三方服务密钥

## 🔍 监控和维护

### 性能监控

- Firebase Performance Monitoring
- Google Analytics
- 自定义性能指标

### 错误监控

- 全局错误捕获
- 用户反馈收集
- 日志记录

### 备份策略

- Firestore 数据定期备份
- Storage 文件备份
- 配置文件版本控制

## 🆘 故障排除

### 常见问题

1. **Firebase 连接失败**
   - 检查网络连接
   - 验证 Firebase 配置
   - 查看浏览器控制台错误

2. **认证失败**
   - 检查用户权限
   - 验证安全规则
   - 确认用户角色设置

3. **文件上传失败**
   - 检查文件大小限制
   - 验证文件类型
   - 查看 Storage 安全规则

4. **页面加载缓慢**
   - 优化图片大小
   - 启用缓存
   - 检查网络性能

### 调试技巧

- 使用浏览器开发者工具
- 启用 Firebase 调试模式
- 查看网络请求
- 检查控制台错误

## 📞 获取帮助

- 查看项目文档
- 搜索相关问题
- 提交 Issue
- 联系开发团队

## 📝 更新日志

### v1.0.0 (2023-XX-XX)
- 初始版本发布
- 基础功能实现
- Firebase 集成完成

---

## 🎯 下一步计划

1. 添加评论系统
2. 实现搜索功能
3. 优化 SEO
4. 添加更多主题
5. 移动端应用开发

祝您使用愉快！如有问题，请随时联系。
