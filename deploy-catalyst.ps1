# Zoho Catalyst Deployment Script
# Run this after creating your Catalyst project in the console

Write-Host "=== Bluewud Catalyst Deployment ===" -ForegroundColor Cyan

# Step 1: Build React app
Write-Host "`n[1/4] Building React app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Copy build to Catalyst client folder
Write-Host "`n[2/4] Copying build to Catalyst client..." -ForegroundColor Yellow
if (Test-Path "catalyst/client/bluewud_web") {
    Remove-Item -Recurse -Force "catalyst/client/bluewud_web/*"
}
Copy-Item -Recurse "dist/*" "catalyst/client/bluewud_web/"
Write-Host "Copied to catalyst/client/bluewud_web/" -ForegroundColor Green

# Step 3: Install function dependencies
Write-Host "`n[3/4] Installing function dependencies..." -ForegroundColor Yellow
Set-Location "catalyst/functions/bluewud_api"
npm install
Set-Location "../../.."

# Step 4: Deploy to Catalyst
Write-Host "`n[4/4] Deploying to Zoho Catalyst..." -ForegroundColor Yellow
Write-Host "Run: catalyst deploy" -ForegroundColor Magenta

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host @"

NEXT STEPS:
1. Login to Catalyst: catalyst login
2. Link to your project: catalyst link
3. Deploy: catalyst deploy

After deployment, your app will be available at:
https://bluewud-ecommerce-<id>.catalystserverless.com

"@ -ForegroundColor White
