@echo off
title AarogyaSpeech X - Full Stack AI Platform Launcher
echo ===================================================
echo   AarogyaSpeech X - Starting AI Platform & Server  
echo ===================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] WARNING: Python is not detected in PATH.
    echo Please ensure Python 3.10+ is installed to run the Real AI Backend.
    echo Frontend will still start in offline mode.
    echo.
)

:: Step 1: Start Python FastAPI AI Backend in a separate window
echo [1/2] Launching Python AI Speech Backend on http://localhost:8000 ...
start "AarogyaSpeech AI Backend" cmd /k "cd /d %~dp0backend && python main.py"

:: Step 2: Start Vite React Frontend
echo [2/2] Launching Vite React Frontend ...
timeout /t 2 /nobreak >nul
start "AarogyaSpeech React Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ===================================================
echo   Both Servers Started Successfully!
echo   - AI Backend: http://localhost:8000
echo   - Frontend UI: http://localhost:5173
echo ===================================================
echo.
pause
