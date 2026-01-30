@echo off
echo ==========================================
echo   Smart Queue Management System
echo   One-Port Startup Script
echo ==========================================

echo [1/2] Building Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Error building frontend!
    pause
    exit /b %errorlevel%
)
cd ..

echo [2/2] Starting Backend Server...
echo The app will be available at http://localhost:5001
cd backend
npm start
