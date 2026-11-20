@echo off
title ChronoScheduler - Java Terminal Project
cd /d "%~dp0backend"
echo ========================================================
echo  Launching Terminal-Based Timetable Conflict Detector
echo ========================================================
java -cp "bin;lib/*" com.timetable.cli.TimetableCLI
pause
