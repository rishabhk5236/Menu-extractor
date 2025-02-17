@echo off

:: Start the server
cd /d "%~dp0server"
start "Server" cmd /k "node --watch index.js"

:: Wait a few seconds for the server to start
timeout /t 3 /nobreak >nul

:: Start the client
cd /d "%~dp0client"
start "Client" cmd /k "npm run start"