@echo off
echo ========================================================
echo   BLUEWUD BUILD DEPLOYER (Dist Folder -> GitHub)
echo ========================================================
echo.

:: 1. Build the project
echo [1/5] Building project for production...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed. Exiting.
    exit /b %errorlevel%
)

:: 2. Prepare dist folder
cd dist
echo [2/5] Initializing temporary git repo in 'dist' folder...
git init
git add .
git commit -m "Deploy: Production Build Artifacts"

:: 3. Configure Remote
echo [3/5] Configuring remote 'origin'...
git branch -M main
git remote add origin https://github.com/shubhkrishna19/WireFrame

:: 4. Warning
echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo [WARNING] CRITICAL ALERT
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo You are about to overwrite 'https://github.com/shubhkrishna19/WireFrame'
echo with ONLY the compiled files (HTML/CSS/JS).
echo.
echo The source code (React/TypeScript) will NOT be on GitHub.
echo Only the final result (the website) will be there.
echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.
pause

:: 5. Push
echo [5/5] Pushing to GitHub...
echo (You may need to enter your GitHub credentials now)
git push -f -u origin main

echo.
echo Done! The repository now contains only the build files.
pause
