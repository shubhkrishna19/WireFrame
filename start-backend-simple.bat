@echo off
echo Starting Mulary Backend Server...
cd backend
node node_modules\.bin\ts-node src/server.ts
pause
