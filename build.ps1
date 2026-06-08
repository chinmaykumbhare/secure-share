$ErrorActionPreference = "Stop"

Write-Host "Building Rust WASM module..."

Push-Location crypto-engine

wasm-pack build --target web

Pop-Location

Write-Host "Copying WASM artifacts..."

New-Item -ItemType Directory -Force -Path "frontend\wasm" | Out-Null

Copy-Item "crypto-engine\pkg\*" "frontend\wasm\" -Recurse -Force
Remove-Item "frontend\wasm\.gitignore" -ErrorAction SilentlyContinue

Write-Host "Build complete."