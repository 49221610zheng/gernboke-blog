# 🚀 GitHub Actions自动部署指南

由于Firebase CLI本地登录问题，我们使用GitHub Actions进行自动部署。

## 📋 部署步骤

### 步骤1: 推送代码到GitHub

```powershell
# 1. 初始化Git仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交代码
git commit -m "Initial commit - Firebase blog project"

# 4. 创建GitHub仓库后，连接远程仓库
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 5. 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤2: 获取Firebase令牌

#### 方法1: 使用Firebase Console (推荐)

1. 访问：https://console.firebase.google.com/project/gernboke/settings/serviceaccounts/adminsdk
2. 点击"生成新的私钥"
3. 下载JSON文件
4. 将整个JSON内容作为GitHub Secret

#### 方法2: 尝试在线Firebase CLI

1. 访问：https://shell.cloud.google.com/
2. 运行：`firebase login:ci`
3. 复制生成的令牌

#### 方法3: 使用其他设备

如果您有其他电脑或设备：
1. 安装Firebase CLI
2. 运行：`firebase login:ci`
3. 复制令牌

### 步骤3: 配置GitHub Secrets

1. 访问：`https://github.com/您的用户名/您的仓库名/settings/secrets/actions`
2. 点击"New repository secret"
3. 添加以下secrets：

**如果使用CI令牌**：
```
Name: FIREBASE_TOKEN
Value: [从firebase login:ci获取的令牌]
```

**如果使用服务账户JSON**：
```
Name: FIREBASE_SERVICE_ACCOUNT
Value: [完整的JSON文件内容]
```

### 步骤4: 触发自动部署

推送任何更改到main分支：

```powershell
git add .
git commit -m "Trigger deployment"
git push
```

## 🌐 部署后访问

- **网站地址**: https://gernboke.web.app
- **Firebase Console**: https://console.firebase.google.com/project/gernboke
- **GitHub Actions**: https://github.com/您的用户名/您的仓库名/actions

## 🔧 无令牌的临时方案

如果暂时无法获取Firebase令牌，您可以：

### 1. 使用GitHub Pages

```yaml
# .github/workflows/github-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

### 2. 使用Netlify

1. 访问：https://netlify.com
2. 连接GitHub仓库
3. 自动部署

### 3. 使用Vercel

1. 访问：https://vercel.com
2. 导入GitHub仓库
3. 自动部署

## 🎯 推荐流程

1. **立即可用**: 先推送到GitHub，使用GitHub Pages临时部署
2. **获取令牌**: 稍后获取Firebase令牌
3. **切换到Firebase**: 配置令牌后自动部署到Firebase

## 📱 移动端访问

无论使用哪种部署方式，您的博客都将：
- ✅ 响应式设计
- ✅ 移动端友好
- ✅ 快速加载
- ✅ SEO优化

---

🎉 **选择最适合您的部署方式，立即让您的博客上线！**
