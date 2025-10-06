@echo off
echo Testing Employee Hub Integration...
echo.

echo Testing Backend Health...
curl -s http://localhost:8080/api/auth/me > nul
if %errorlevel% equ 0 (
    echo ✓ Backend is running
) else (
    echo ✗ Backend is not responding
    echo Please start the backend first: cd backend && mvn spring-boot:run
    pause
    exit /b 1
)

echo.
echo Testing Frontend...
curl -s http://localhost:3000 > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is not responding
    echo Please start the frontend first: cd frontend && npm run dev
    pause
    exit /b 1
)

echo.
echo ✓ Integration test passed!
echo.
echo You can now access:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8080/api
echo.
echo Try logging in with test credentials or register a new account.
echo.
pause

