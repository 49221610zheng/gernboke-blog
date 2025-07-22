Write-Host "Firebase Deploy Tool" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
npm install -g firebase-tools

Write-Host "Login to Firebase..." -ForegroundColor Yellow
firebase login

Write-Host "Setting project..." -ForegroundColor Yellow
firebase use gernboke

Write-Host "Deploying to hosting..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host ""
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host "Your website: https://gernboke.web.app" -ForegroundColor White
Write-Host "Firebase Console: https://console.firebase.google.com/project/gernboke" -ForegroundColor White

Start-Process "https://gernboke.web.app"

Read-Host "Press Enter to exit"
