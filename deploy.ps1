# GitHub Pages Emergency Deploy Script
# PowerShell version for better Unicode support

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Pages Emergency Deploy" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Committing current changes..." -ForegroundColor Green
git add .
git commit -m "🚨 Emergency deploy: Fix GitHub Pages configuration"
git push

Write-Host ""
Write-Host "Step 2: Opening GitHub Pages settings..." -ForegroundColor Green
Start-Process "https://github.com/49221610zheng/gernboke-blog/settings/pages"

Start-Sleep -Seconds 2

Write-Host "Step 3: Opening Actions permissions..." -ForegroundColor Green
Start-Process "https://github.com/49221610zheng/gernboke-blog/settings/actions"

Start-Sleep -Seconds 2

Write-Host "Step 4: Opening Actions page..." -ForegroundColor Green
Start-Process "https://github.com/49221610zheng/gernboke-blog/actions"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IMPORTANT CONFIGURATION STEPS:" -ForegroundColor Red
Write-Host "1. In Pages settings, select 'GitHub Actions'" -ForegroundColor Yellow
Write-Host "2. In Actions settings, enable 'Read and write permissions'" -ForegroundColor Yellow
Write-Host "3. Manually trigger workflow run" -ForegroundColor Yellow
Write-Host "4. Wait for deployment to complete" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "After deployment, your site will be available at:" -ForegroundColor Green
Write-Host "https://49221610zheng.github.io/gernboke-blog/" -ForegroundColor Blue
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
