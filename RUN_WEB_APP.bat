@echo off
title Launching ChronoScheduler Full-Stack App
echo ========================================================
echo  Starting ChronoScheduler (Java Backend + React UI)...
echo ========================================================

echo Starting Java Backend on Port 8080...
start "ChronoScheduler Java Backend" cmd /c "cd /d "%~dp0backend" && java -cp "bin;lib/*" com.timetable.MainApp"

timeout /t 2 /nobreak >nul

echo Starting React Frontend on Port 5173...
start "ChronoScheduler React UI" cmd /c "cd /d "%~dp0" && npm run dev"

timeout /t 3 /nobreak >nul

start http://localhost:5173
echo Both servers are running!
pause
