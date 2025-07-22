# 🔥 Firebase CLI 安装和设置指南

## 📋 安装方式

### 方式1: 使用自动化脚本 (推荐)

**Windows用户**:
```bash
# 双击运行或在命令行执行
install-firebase-cli.bat
```

**Linux/macOS用户**:
```bash
# 使用npm安装
npm install -g firebase-tools

# 或使用yarn
yarn global add firebase-tools
```

### 方式2: 手动安装

#### 使用npm (推荐)
```bash
npm install -g firebase-tools
```

#### 使用yarn
```bash
yarn global add firebase-tools
```

#### 使用独立二进制文件
```bash
# 下载并安装独立二进制文件
curl -sL https://firebase.tools | bash
```

## 🔍 验证安装

安装完成后，验证Firebase CLI是否正确安装：

```bash
firebase --version
```

应该显示类似以下内容：
```
12.9.1
```

## 🔐 Firebase登录

### 交互式登录
```bash
firebase login
```
这将打开浏览器进行Google账户登录。

### CI/CD环境登录
```bash
firebase login:ci
```
生成用于CI/CD的令牌。

## 🏗️ 项目设置

### 使用现有项目
```bash
firebase use gernboke
```

### 查看可用项目
```bash
firebase projects:list
```

### 查看当前项目
```bash
firebase use
```

## 🚀 部署命令

### 完整部署
```bash
firebase deploy
```

### 仅部署托管
```bash
firebase deploy --only hosting
```

### 部署到预览频道
```bash
firebase hosting:channel:deploy preview
```

### 本地预览
```bash
firebase serve
```

## 🛠️ 常用命令

### 项目管理
```bash
firebase init                    # 初始化项目
firebase use <project-id>        # 切换项目
firebase projects:list           # 列出所有项目
```

### 托管管理
```bash
firebase serve                   # 本地预览
firebase deploy --only hosting   # 部署托管
firebase hosting:sites:list      # 列出托管站点
```

### 数据库管理
```bash
firebase deploy --only firestore # 部署Firestore规则
firebase firestore:delete --recursive /path # 删除数据
```

### 函数管理
```bash
firebase deploy --only functions # 部署云函数
firebase functions:log           # 查看函数日志
```

## 🆘 故障排除

### 问题1: 权限错误
**错误**: `EACCES: permission denied`

**解决方案**:
```bash
# 方案1: 使用sudo (Linux/macOS)
sudo npm install -g firebase-tools

# 方案2: 修改npm权限
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# 方案3: 使用nvm
nvm install node
npm install -g firebase-tools
```

### 问题2: 网络连接问题
**错误**: 网络超时或连接失败

**解决方案**:
```bash
# 设置npm镜像
npm config set registry https://registry.npmmirror.com

# 或使用cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install -g firebase-tools
```

### 问题3: 登录失败
**错误**: Firebase登录失败

**解决方案**:
```bash
# 清除登录状态
firebase logout

# 重新登录
firebase login

# 或使用令牌登录
firebase login --token <your-token>
```

### 问题4: 项目不存在
**错误**: `Project gernboke does not exist`

**解决方案**:
1. 确认项目ID是否正确
2. 检查是否有项目访问权限
3. 在Firebase Console中确认项目存在

## 📚 有用的资源

- [Firebase CLI参考文档](https://firebase.google.com/docs/cli)
- [Firebase托管指南](https://firebase.google.com/docs/hosting)
- [Firebase CLI GitHub](https://github.com/firebase/firebase-tools)

## 🎯 快速开始

1. **安装CLI**: 运行 `install-firebase-cli.bat`
2. **登录**: 运行 `firebase login`
3. **设置项目**: 运行 `firebase use gernboke`
4. **部署**: 运行 `firebase deploy --only hosting`

或者使用一键设置脚本：
```bash
setup-firebase-hosting.bat
```

---

🎉 **现在您可以使用Firebase CLI管理和部署您的项目了！**
