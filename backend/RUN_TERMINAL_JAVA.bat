@echo off
title SMS - Java Terminal Timetable Conflict Detector
cd /d "%~dp0"
if exist "backend" cd /d "%~dp0backend"
echo ========================================================
echo  Launching Terminal-Based Timetable Conflict Detector
echo ========================================================
java -cp "bin;lib/*" com.timetable.cli.TimetableCLI
pause
