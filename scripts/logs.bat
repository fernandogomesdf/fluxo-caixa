@echo off
echo Docker Logs Viewer...

if "%1"=="" (
    echo Usage: logs.bat [service-name] [optional: -f for follow]
    echo.
    echo Available services:
    echo   frontend
    echo   lancamento-service
    echo   consolidacao-service
    echo   notificacao-service
    echo   kafka
    echo   redis
    echo   prometheus
    echo   grafana
    echo   all (shows all services)
    echo.
    echo Examples:
    echo   logs.bat frontend
    echo   logs.bat lancamento-service -f
    echo   logs.bat all
    pause
    exit /b
)

if "%1"=="all" (
    echo Showing logs for all services...
    docker-compose logs %2
) else (
    echo Showing logs for %1...
    docker-compose logs %1 %2
)

pause
