@echo off
echo Stopping Fluxo Caixa Application (Docker)...

echo.
echo Stopping all Docker containers...
docker-compose down

echo.
echo Removing unused containers and networks...
docker system prune -f --filter "label=com.docker.compose.project=fluxo-caixa"

echo.
echo All services stopped successfully!
echo.
echo To remove volumes (database data): docker-compose down -v
echo.
pause
