@echo off
echo ========================================================
echo Starting Tactyqal Local PostgreSQL Database on port 5432...
echo ========================================================
if exist "C:\Program Files\PostgreSQL\18\bin\postgres.exe" (
    "C:\Program Files\PostgreSQL\18\bin\postgres.exe" -D "%~dp0pgdata" -p 5432
) else if exist "C:\Program Files\PostgreSQL\16\bin\postgres.exe" (
    "C:\Program Files\PostgreSQL\16\bin\postgres.exe" -D "%~dp0pgdata" -p 5432
) else (
    echo PostgreSQL binary not found in standard paths.
    echo Please ensure PostgreSQL is installed or run with Docker: docker-compose up db
    pause
)
