Write-Host "=== Flutter Diagnostics ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Flutter version..." -ForegroundColor Yellow
flutter --version

Write-Host ""
Write-Host "Checking available devices..." -ForegroundColor Yellow
flutter devices

Write-Host ""
Write-Host "Checking Flutter configuration..." -ForegroundColor Yellow
flutter config

Write-Host ""
Write-Host "Setting JAVA_HOME..." -ForegroundColor Yellow
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
Write-Host "JAVA_HOME set to: $env:JAVA_HOME"

Write-Host ""
Write-Host "Attempting to run Flutter app..." -ForegroundColor Green
flutter run

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
