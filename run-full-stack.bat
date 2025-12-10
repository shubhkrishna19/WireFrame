@echo off
echo ================================================
echo MULARY ECOMMERCE - FULL STACK LOCAL SERVER
echo ================================================
echo.
echo Starting both Frontend and Backend servers...
echo.
echo Frontend will run on: http://localhost:5173
echo Backend will run on: http://localhost:5000
echo.
echo Press Ctrl+C in either window to stop servers.
echo.
pause

echo Starting Backend Server...
start "Mulary Backend API" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Mulary Frontend" cmd /k "npm run dev"

echo.
echo ================================================
echo Both servers are starting!
echo ================================================
echo.
echo Open your browser to: http://localhost:5173
echo API is available at: http://localhost:5000/api
echo.
echo To stop: Close the server windows or press Ctrl+C
echo.
