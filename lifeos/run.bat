@echo off
TITLE LifeOS — Personal Digital Command Center
echo ========================================================
echo               L I F E O S   S T A R T U P
echo ========================================================
echo.

WHERE python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not found in PATH!
    echo Please install Python 3.12+ from python.org and check 'Add to PATH'.
    pause
    exit /b 1
)

IF NOT EXIST ".venv" (
    echo [1/3] Creating Python virtual environment...
    python -m venv .venv
)

echo [2/3] Activating virtual environment...
call .venv\Scripts\activate.bat

echo [3/3] Checking dependencies...
pip install -r requirements.txt --quiet

echo.
echo Starting LifeOS Command Center...
python main.py

pause
