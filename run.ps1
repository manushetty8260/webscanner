# Web Application Vulnerability Scanner - Setup Script
# Run this script to set up and start the scanner

Write-Host ""
Write-Host "========================================"
Write-Host "Web Vulnerability Scanner Setup"
Write-Host "========================================"
Write-Host ""

# Check Python installation
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[1/4] Checking Python installation... OK"
    Write-Host "      $pythonVersion"
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from python.org"
    Read-Host "Press Enter to exit"
    exit 1
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path -Path "venv")) {
    Write-Host "[2/4] Creating virtual environment..."
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "[2/4] Virtual environment already exists... OK"
}

# Activate virtual environment
Write-Host "[3/4] Activating virtual environment..."
& .\venv\Scripts\Activate.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to activate virtual environment" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install requirements
Write-Host "[4/4] Installing dependencies..."
pip install -r requirements.txt --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "Setup Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Starting Web Vulnerability Scanner..."
Write-Host ""
Write-Host "Navigate to: http://localhost:5000"
Write-Host ""
Write-Host "Press CTRL+C to stop the server"
Write-Host ""

# Run the application
python app/app.py
