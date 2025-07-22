# Firebase Deploy PowerShell Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "        Firebase Deploy Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check command existence
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm not installed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Install Firebase CLI
Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
try {
    npm install -g firebase-tools
    Write-Host "✓ Firebase CLI installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Firebase CLI installation failed" -ForegroundColor Red
    Write-Host "Try running PowerShell as Administrator" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Verify Firebase CLI
Write-Host "Verifying Firebase CLI..." -ForegroundColor Yellow
if (Test-Command "firebase") {
    $firebaseVersion = firebase --version
    Write-Host "✓ Firebase CLI verified: $firebaseVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Firebase CLI verification failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Firebase login
Write-Host "Firebase login (browser will open)..." -ForegroundColor Yellow
try {
    firebase login
    Write-Host "✓ Firebase login successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Firebase login failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Set project
Write-Host "Setting up project..." -ForegroundColor Yellow
try {
    firebase use gernboke
    Write-Host "✓ Project setup successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Project setup failed" -ForegroundColor Red
    Write-Host "Please check if project 'gernboke' exists and you have access" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Choose deployment type
Write-Host "Choose deployment type:" -ForegroundColor Cyan
Write-Host "1. Full deploy (recommended for first time)"
Write-Host "2. Hosting only (fast)"
Write-Host "3. Initialize project (if first time)"
Write-Host "4. Cancel"
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Starting full deployment..." -ForegroundColor Yellow
        firebase deploy
    }
    "2" {
        Write-Host "Starting hosting deployment..." -ForegroundColor Yellow
        firebase deploy --only hosting
    }
    "3" {
        Write-Host "Initializing Firebase project..." -ForegroundColor Yellow
        Write-Host "Configuration tips:" -ForegroundColor Cyan
        Write-Host "- Select: Firestore, Hosting, Storage"
        Write-Host "- Use existing project: gernboke"
        Write-Host "- Public directory: . (current directory)"
        Write-Host "- Single-page app: No"
        Write-Host ""
        firebase init
        Write-Host "Project initialized. You can now run deployment." -ForegroundColor Green
        Read-Host "Press Enter to exit"
        exit 0
    }
    "4" {
        Write-Host "Deployment cancelled" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 0
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check deployment result
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "       DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your blog website is now available at:" -ForegroundColor Cyan
    Write-Host "• Main URL: https://gernboke.web.app" -ForegroundColor White
    Write-Host "• Alt URL: https://gernboke.firebaseapp.com" -ForegroundColor White
    Write-Host ""
    Write-Host "Firebase Management:" -ForegroundColor Cyan
    Write-Host "• Project: https://console.firebase.google.com/project/gernboke" -ForegroundColor White
    Write-Host "• Hosting: https://console.firebase.google.com/project/gernboke/hosting" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Deployment failed" -ForegroundColor Red
    Write-Host "Please check the error messages above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Other useful commands:" -ForegroundColor Cyan
Write-Host "• firebase serve          - Local preview"
Write-Host "• firebase deploy         - Full deployment"
Write-Host "• firebase deploy --only hosting - Hosting only"
Write-Host ""

Read-Host "Press Enter to exit"
