@echo off
REM Web Application Vulnerability Scanner - Setup Script
REM This script sets up the environment and runs the application

echo.
echo ========================================
echo Web Vulnerability Scanner Setup
echo ========================================
echo.

REM Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

echo [1/4] Checking Python installation... OK

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo [2/4] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
) else (
    echo [2/4] Virtual environment already exists... OK
)

REM Activate virtual environment
echo [3/4] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Install requirements
echo [4/4] Installing dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Starting Web Vulnerability Scanner...
echo.
echo Navigate to: http://localhost:5000
echo.
echo Press CTRL+C to stop the server
echo.

REM Run the application
python app/app.py
