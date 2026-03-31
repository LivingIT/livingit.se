@echo off
echo Cleaning build and cache folders...

if exist ".astro" (
    rmdir /s /q ".astro"
    echo Deleted .astro
)

if exist "dist" (
    rmdir /s /q "dist"
    echo Deleted dist
)

if exist ".wrangler" (
    rmdir /s /q ".wrangler"
    echo Deleted .wrangler
)

echo Done. Run "npm install" then "npm run dev" to start fresh.
