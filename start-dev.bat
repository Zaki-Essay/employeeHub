@echo off
echo Starting Employee Hub Development Environment...
echo.

echo Starting Spring Boot Backend...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Starting Angular Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting up...
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul

