@echo off
echo Development Helper - Rebuild Services...

if "%1"=="" (
    echo Usage: rebuild.bat [service-name]
    echo.
    echo Available services:
    echo   frontend
    echo   lancamento-service
    echo   consolidacao-service
    echo   notificacao-service
    echo   all
    echo.
    echo Example: rebuild.bat frontend
    pause
    exit /b
)

if "%1"=="all" (
    echo Rebuilding all services...
    docker-compose up --build -d
) else (
    echo Rebuilding %1...
    docker-compose up --build -d %1
)

echo.
echo Checking service status...
docker-compose ps

echo.
echo Service %1 rebuilt successfully!
pause
