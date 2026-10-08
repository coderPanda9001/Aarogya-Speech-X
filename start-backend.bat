@echo off
title AarogyaSpeech X - AI Backend Launcher
echo ===================================================
echo   AarogyaSpeech X - Python AI Backend Server
echo ===================================================
echo.
cd /d %~dp0backend
echo Installing requirements if needed...
pip install -r requirements.txt
echo.
echo Starting FastAPI AI Backend on http://localhost:8000 ...
python main.py
pause
