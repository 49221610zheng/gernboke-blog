# 🔧 GitHub Pages 配置指南

## ❌ 当前问题

您遇到的错误：
```
HttpError：未找到
获取页面网站失败。请验证存储库是否启用了 Pages 并配置为使用 GitHub Actions 进行构建
```

这表明GitHub Pages没有正确配置。

## ✅ 解决步骤

### 1. 启用GitHub Pages

#### 方法一：通过GitHub网页界面

1. **访问仓库设置**
   - 打开：https://github.com/49221610zheng/gernboke-blog
   - 点击右上角的 "Settings" 标签

2. **找到Pages设置**
   - 在左侧菜单中找到 "Pages"
   - 点击进入Pages设置页面

3. **配置部署源**
   - 在 "Source" 部分
   - 选择 "GitHub Actions" （不要选择 "Deploy from a branch"）
   - 点击 "Save" 保存设置

4. **确认权限设置**
   - 在左侧菜单找到 "Actions" → "General"
   - 确保 "Actions permissions" 设置为 "Allow all actions and reusable workflows"
   - 在 "Workflow permissions" 部分选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
   - 点击 "Save" 保存

#### 方法二：通过GitHub CLI（如果已安装）

```bash
# 启用GitHub Pages
gh api repos/49221610zheng/gernboke-blog/pages \
  --method POST \
  --field source='{"branch":"main","path":"/"}'

# 或者使用Actions源
gh api repos/49221610zheng/gernboke-blog/pages \
  --method POST \
  --field build_type=workflow
```

### 2. 验证配置

#### 检查Pages状态
1. 访问：https://github.com/49221610zheng/gernboke-blog/settings/pages
2. 应该看到：
   - ✅ Source: GitHub Actions
   - ✅ Custom domain: (空白或您的域名)
   - ✅ Enforce HTTPS: 已勾选

#### 检查Actions权限
1. 访问：https://github.com/49221610zheng/gernboke-blog/settings/actions
2. 确认：
   - ✅ Actions permissions: Allow all actions
   - ✅ Workflow permissions: Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests: 已勾选

### 3. 重新触发部署

#### 方法一：推送新提交
```bash
git add .
git commit -m "🔧 Configure GitHub Pages settings"
git push
```

#### 方法二：手动触发工作流
1. 访问：https://github.com/49221610zheng/gernboke-blog/actions
2. 点击 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow" 按钮
4. 选择 "main" 分支
5. 点击绿色的 "Run workflow" 按钮

### 4. 等待部署完成

- 部署通常需要1-3分钟
- 在Actions页面可以看到实时进度
- 成功后会显示绿色✅

### 5. 访问网站

部署成功后，您的网站将在以下地址可用：
- 🌐 主页：https://49221610zheng.github.io/gernboke-blog/
- 🛠️ 管理：https://49221610zheng.github.io/gernboke-blog/admin.html

## 🔍 故障排除

### 问题1：仍然显示"未找到"错误

**解决方案**：
1. 确认仓库是公开的（Private仓库需要GitHub Pro）
2. 检查仓库名称是否正确
3. 等待几分钟让设置生效

### 问题2：Pages设置中没有"GitHub Actions"选项

**解决方案**：
1. 确保仓库中有 `.github/workflows/` 目录
2. 确保工作流文件语法正确
3. 推送工作流文件到main分支

### 问题3：Actions运行失败

**解决方案**：
1. 检查Actions页面的错误日志
2. 确认所有必需文件存在
3. 验证工作流文件语法

### 问题4：网站显示404

**解决方案**：
1. 确认index.html文件存在
2. 检查文件路径是否正确
3. 等待DNS传播（可能需要几分钟）

## 📋 配置检查清单

### ✅ 仓库设置
- [ ] 仓库是公开的
- [ ] Pages已启用
- [ ] Source设置为"GitHub Actions"
- [ ] Actions权限已正确配置

### ✅ 文件结构
- [ ] `.github/workflows/deploy.yml` 存在
- [ ] `index.html` 存在
- [ ] `admin.html` 存在
- [ ] `js/` 目录存在

### ✅ 部署状态
- [ ] Actions运行成功（绿色✅）
- [ ] 网站可以访问
- [ ] 所有功能正常工作

## 🎯 快速修复命令

如果您想立即尝试修复，请运行：

```bash
# 1. 提交当前更改
git add .
git commit -m "🔧 Fix GitHub Pages configuration"
git push

# 2. 然后按照上述步骤配置GitHub Pages设置
```

## 📞 需要帮助？

如果按照以上步骤仍然无法解决问题：

1. **检查GitHub状态**：https://www.githubstatus.com/
2. **查看GitHub文档**：https://docs.github.com/en/pages
3. **检查仓库权限**：确保您有管理员权限

---

## 🎉 成功标志

配置成功后，您应该看到：
- ✅ Actions页面显示绿色对勾
- ✅ Pages设置显示"Your site is live at..."
- ✅ 网站可以正常访问
- ✅ 所有功能正常工作

**按照这些步骤，您的博客系统很快就会上线！** 🚀
