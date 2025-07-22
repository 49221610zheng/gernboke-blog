@echo off
chcp 65001 >nul

echo 🔄 GitHub Actions 工作流切换工具
echo ==================================

REM 检查当前工作流
if exist ".github\workflows\deploy.yml" (
    echo 📄 当前活动工作流: deploy.yml
) else (
    echo ⚠️ 没有找到活动的工作流文件
)

echo.
echo 可用的工作流选项:
echo 1. deploy-clean.yml    ^(推荐 - 无警告^)
echo 2. deploy-simple.yml   ^(简单版本^)
echo 3. deploy.yml          ^(完整版本 - 当前^)
echo 4. 查看工作流状态
echo 5. 退出

set /p choice="请选择 (1-5): "

if "%choice%"=="1" goto clean
if "%choice%"=="2" goto simple
if "%choice%"=="3" goto keep
if "%choice%"=="4" goto status
if "%choice%"=="5" goto exit
goto invalid

:clean
echo 🌟 切换到 deploy-clean.yml ^(无警告版本^)...

REM 备份当前工作流
if exist ".github\workflows\deploy.yml" (
    for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
    set "timestamp=%YYYY%%MM%%DD%-%HH%%Min%%Sec%"
    
    move ".github\workflows\deploy.yml" ".github\workflows\deploy-backup-!timestamp!.yml" >nul
    echo ✅ 已备份当前工作流
)

REM 切换到clean版本
if exist ".github\workflows\deploy-clean.yml" (
    copy ".github\workflows\deploy-clean.yml" ".github\workflows\deploy.yml" >nul
    echo ✅ 已切换到 deploy-clean.yml
    echo 🎉 现在使用无警告的工作流配置！
) else (
    echo ❌ deploy-clean.yml 文件不存在
)
goto end

:simple
echo ⚡ 切换到 deploy-simple.yml ^(简单版本^)...

REM 备份当前工作流
if exist ".github\workflows\deploy.yml" (
    for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
    set "timestamp=%YYYY%%MM%%DD%-%HH%%Min%%Sec%"
    
    move ".github\workflows\deploy.yml" ".github\workflows\deploy-backup-!timestamp!.yml" >nul
    echo ✅ 已备份当前工作流
)

REM 切换到simple版本
if exist ".github\workflows\deploy-simple.yml" (
    copy ".github\workflows\deploy-simple.yml" ".github\workflows\deploy.yml" >nul
    echo ✅ 已切换到 deploy-simple.yml
) else (
    echo ❌ deploy-simple.yml 文件不存在
)
goto end

:keep
echo 🔧 保持使用完整版本 deploy.yml...
echo ⚠️ 注意: 此版本可能有IDE警告，但功能完整
goto end

:status
echo 📊 工作流状态:
echo ==============

if exist ".github\workflows\deploy.yml" (
    echo ✅ deploy.yml ^(活动^)
) else (
    echo ❌ deploy.yml ^(不存在^)
)

if exist ".github\workflows\deploy-clean.yml" (
    echo ✅ deploy-clean.yml ^(可用^)
) else (
    echo ❌ deploy-clean.yml ^(不存在^)
)

if exist ".github\workflows\deploy-simple.yml" (
    echo ✅ deploy-simple.yml ^(可用^)
) else (
    echo ❌ deploy-simple.yml ^(不存在^)
)

echo.
echo 备份文件:
dir ".github\workflows\deploy-backup-*" 2>nul || echo 无备份文件
goto end

:invalid
echo ❌ 无效选择
goto end

:exit
echo 👋 退出
exit /b 0

:end
echo.
echo 🔍 下一步操作:
echo 1. 检查 GitHub Secrets 配置 ^(FIREBASE_PROJECT_ID, FIREBASE_TOKEN^)
echo 2. 推送代码到 GitHub 测试工作流
echo 3. 查看 Actions 标签页验证部署

echo.
echo 📚 更多信息:
echo - 工作流选择指南: WORKFLOW_SELECTION.md
echo - 故障排除: GITHUB_ACTIONS_TROUBLESHOOTING.md
echo - Secrets配置: GITHUB_SECRETS_SETUP.md

pause
