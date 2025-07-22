@echo off
chcp 65001 >nul

echo 🔥 Firebase 自动化配置
echo =====================

echo.
echo 正在启动Firebase配置工具...
echo.

node firebase-setup.js

echo.
echo 配置完成！
pause
