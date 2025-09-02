@echo off
echo Starting Fluxo Caixa Application (Production Mode - Docker)...

echo.
echo Building and starting all services with Docker Compose...
docker-compose up --build -d

echo.
echo Waiting for all services to start...
timeout /t 60

echo.
echo Checking service status...
docker-compose ps

echo.
echo All services started successfully!
echo.
echo Services available at:
echo Frontend: http://localhost:4200
echo Lancamento Service: http://localhost:8081
echo Consolidacao Service: http://localhost:8082
echo Notificacao Service: http://localhost:8083
echo Kafka UI: http://localhost:8080
echo Grafana: http://localhost:3000 (admin/admin)
echo Prometheus: http://localhost:9090
echo.
echo Useful commands:
echo   View logs: docker-compose logs [service-name]
echo   Stop all: docker-compose down
echo   Restart: docker-compose restart [service-name]
echo.
pause
