@echo off
title Northern Connect — Dev Server
echo Killing any existing Node processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo Clearing Next.js cache...
if exist ".next" rmdir /S /Q ".next"

echo Starting Northern Connect dev server...
echo Open http://localhost:3000 in your browser
echo.
npm run dev
