@echo off

echo Firebase Deploy Tool
echo ====================

npm install -g firebase-tools
firebase login
firebase use gernboke
firebase deploy --only hosting

echo.
echo Success! Visit: https://gernboke.web.app
start https://gernboke.web.app

pause
