@echo off
chcp 65001 >nul
echo ========================================
echo Emergency Deploy Script - GitHub Pages
echo ========================================
echo.

echo Step 1: Commit current changes...
git add .
git commit -m "Emergency deploy: Fix GitHub Pages configuration"
git push

echo.
echo Step 2: Wait 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo Step 3: Opening GitHub Pages settings...
start https://github.com/49221610zheng/gernboke-blog/settings/pages

echo.
echo Step 4: Opening Actions permissions...
timeout /t 2 /nobreak >nul
start https://github.com/49221610zheng/gernboke-blog/settings/actions

echo.
echo Step 5: Opening Actions page...
timeout /t 2 /nobreak >nul
start https://github.com/49221610zheng/gernboke-blog/actions

echo.
echo ========================================
echo IMPORTANT REMINDERS:
echo 1. In Pages settings, select "GitHub Actions"
echo 2. In Actions settings, enable "Read and write permissions"
echo 3. Manually trigger workflow run
echo 4. Wait for deployment to complete
echo ========================================
echo.

echo After deployment, visit:
echo https://49221610zheng.github.io/gernboke-blog/
echo.

pause
