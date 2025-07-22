# 🚀 手动部署步骤指南

由于命令行环境限制，请按照以下步骤手动完成Firebase部署：

## 📋 部署步骤

### 步骤1: 打开命令提示符
1. 按 `Win + R` 键
2. 输入 `cmd` 并按回车
3. 或者以管理员身份运行命令提示符

### 步骤2: 导航到项目目录

**重要**: 请先找到您的实际项目路径！

#### 方法1: 使用路径检测脚本
双击运行 `find-project-path.bat` 来找到正确的项目路径。

#### 方法2: 手动查找项目
在文件资源管理器中找到包含以下文件的文件夹：
- index.html
- firebase.json
- package.json
- admin.html

#### 方法3: 常见路径
```cmd
# 如果项目在桌面
cd /d "%USERPROFILE%\Desktop\light-and-code-blog"

# 如果项目在文档文件夹
cd /d "%USERPROFILE%\Documents\light-and-code-blog"

# 如果项目在下载文件夹
cd /d "%USERPROFILE%\Downloads\light-and-code-blog"

# 或者使用您找到的实际路径
cd /d "您的实际项目路径"
```

#### 验证路径正确性
运行以下命令确认您在正确的目录：
```cmd
dir index.html
dir firebase.json
```
如果显示文件存在，说明路径正确。

### 步骤3: 安装Firebase CLI
```cmd
npm install -g firebase-tools
```

如果遇到权限错误，请：
- 以管理员身份运行命令提示符
- 或者使用：`npm config set prefix %APPDATA%\npm`

### 步骤4: 验证安装
```cmd
firebase --version
```

应该显示Firebase CLI版本号。

### 步骤5: 登录Firebase
```cmd
firebase login
```

这将打开浏览器，请使用您的Google账户登录。

### 步骤6: 设置项目
```cmd
firebase use gernboke
```

### 步骤7: 部署到Firebase Hosting
```cmd
firebase deploy --only hosting
```

### 步骤8: 验证部署
部署完成后，访问以下地址验证：
- https://gernboke.web.app
- https://gernboke.firebaseapp.com

## 🔧 一键运行脚本

我已经创建了以下脚本文件，您可以直接运行：

### 方式1: 双击运行批处理文件
- `run-auto-deploy.bat` - 运行自动化脚本
- `quick-deploy.bat` - 快速部署
- `deploy-firebase.bat` - 完整部署脚本

### 方式2: 使用PowerShell
右键点击 `deploy-firebase.ps1` -> "使用PowerShell运行"

### 方式3: 使用npm命令
```cmd
npm run firebase:login
npm run firebase:hosting
```

## 🆘 故障排除

### 问题1: npm命令不识别
**解决方案**: 
1. 确保已安装Node.js
2. 重启命令提示符
3. 检查环境变量PATH

### 问题2: Firebase CLI安装失败
**解决方案**:
```cmd
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install -g firebase-tools
```

### 问题3: 权限错误
**解决方案**:
1. 以管理员身份运行命令提示符
2. 或使用：`npm install -g firebase-tools --unsafe-perm=true`

### 问题4: 登录失败
**解决方案**:
```cmd
firebase logout
firebase login --reauth
```

### 问题5: 项目不存在
**解决方案**:
1. 确认项目ID: `gernboke`
2. 检查Firebase Console: https://console.firebase.google.com/
3. 确认有项目访问权限

## 📱 部署后检查

### 自动检查脚本
```cmd
node check-deployment.js
```

### 手动检查
1. 访问 https://gernboke.web.app
2. 访问 https://gernboke.web.app/admin
3. 测试响应式设计
4. 检查所有功能

## 🌐 部署成功后的地址

- **主域名**: https://gernboke.web.app
- **备用域名**: https://gernboke.firebaseapp.com
- **管理后台**: https://gernboke.web.app/admin

## 🔧 Firebase管理

- **项目概览**: https://console.firebase.google.com/project/gernboke
- **托管管理**: https://console.firebase.google.com/project/gernboke/hosting
- **数据库管理**: https://console.firebase.google.com/project/gernboke/firestore

## 📊 常用命令

```cmd
# 本地预览
firebase serve

# 完整部署
firebase deploy

# 仅托管部署
firebase deploy --only hosting

# 查看项目列表
firebase projects:list

# 查看当前项目
firebase use

# 查看部署历史
firebase hosting:sites:list
```

## 🎯 快速命令序列

如果您想快速部署，可以复制以下命令序列，逐行粘贴到命令提示符中：

```cmd
npm install -g firebase-tools
firebase login
firebase use gernboke
firebase deploy --only hosting
```

---

🎉 **按照以上步骤，您的博客网站将成功部署到Firebase！**

如果遇到任何问题，请参考故障排除部分或直接运行提供的批处理文件。
