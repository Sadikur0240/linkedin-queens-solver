# LinkedIn Queens Solver - Package Script
# Creates a release-ready ZIP file for the Chrome Extension

# PowerShell script to package the extension
# Run this script from the root directory of the repository

$version = "1.1.0"
$extensionName = "linkedin-queens-solver"
$releaseFile = "${extensionName}-v${version}.zip"

Write-Host "📦 Packaging LinkedIn Queens Solver v${version}" -ForegroundColor Green

# Ensure we're in the root directory
$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

# Create temporary directory for packaging
$tempDir = "temp_package"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy extension files to temp directory
Write-Host "📂 Copying extension files..." -ForegroundColor Yellow
Copy-Item "extensions\*" -Destination $tempDir -Recurse

# Remove any development files from the package
$devFiles = @("*.log", ".DS_Store", "Thumbs.db")
foreach ($pattern in $devFiles) {
    Get-ChildItem -Path $tempDir -Name $pattern -Recurse | Remove-Item -Force -ErrorAction SilentlyContinue
}

# Create ZIP file
Write-Host "🗜️  Creating ZIP archive..." -ForegroundColor Yellow
if (Test-Path $releaseFile) {
    Remove-Item $releaseFile -Force
}

# Use PowerShell's built-in compression
Compress-Archive -Path "${tempDir}\*" -DestinationPath $releaseFile -CompressionLevel Optimal

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

Write-Host "✅ Package created: ${releaseFile}" -ForegroundColor Green
Write-Host "📏 File size: $((Get-Item $releaseFile).Length / 1KB) KB" -ForegroundColor Cyan

# Verification
Write-Host "`n🔍 Package contents:" -ForegroundColor Blue
$zip = [System.IO.Compression.ZipFile]::OpenRead($releaseFile)
$zip.Entries | Select-Object Name, Length | Format-Table -AutoSize
$zip.Dispose()

Write-Host "`n🚀 Ready for GitHub release!" -ForegroundColor Green
Write-Host "Upload ${releaseFile} to GitHub Releases" -ForegroundColor White
