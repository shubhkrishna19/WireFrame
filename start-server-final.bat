@echo off
cd backend
echo 🚀 Starting Mulary Backend Server...
echo 📍 Working directory: %cd%
npx tsx src/server.ts
pause
