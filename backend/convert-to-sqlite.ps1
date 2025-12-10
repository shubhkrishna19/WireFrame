# PowerShell script to convert PostgreSQL $N placeholders to SQLite ? placeholders
$servicesPath = "c:\Users\shubh\Downloads\ecommerce-app\backend\src\services"
$files = Get-ChildItem -Path $servicesPath -Filter "*.ts" -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if already converted or no placeholders
    if ($content -notmatch '\$\d+') {
        Write-Host "Skipping $($file.Name) - no PostgreSQL placeholders found"
        continue
    }
    
    Write-Host "Converting $($file.Name)..."
    
    # Replace $1, $2, $3, etc. with ?
    # We need to do this carefully to maintain parameter order
    $content = $content -replace '\$\d+', '?'
    
    # Replace NOW() with datetime('now') for SQLite
    $content = $content -replace 'NOW\(\)', "datetime('now')"
    
    # Replace ILIKE with LIKE (SQLite doesn't support ILIKE)
    $content = $content -replace '\bILIKE\b', 'LIKE'
    
    # Save the file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "  Converted $($file.Name)"
}

Write-Host "Conversion complete!"
