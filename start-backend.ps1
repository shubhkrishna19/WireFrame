Write-Host "Starting Mulary Backend Server..." -ForegroundColor Green
Set-Location backend
& ".\node_modules\.bin\ts-node.cmd" src/server.ts
