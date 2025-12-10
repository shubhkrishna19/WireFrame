@echo off
title Mulary E-Commerce App
color 0A
echo.
echo ================================================
echo   MULARY E-COMMERCE APP
echo ================================================
echo.
echo Starting server...
echo.
cd /d "%~dp0"
call npm run dev
pause

