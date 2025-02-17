@echo off

cd .\server\
start cmd /k "node --watch .\index.js" 
timeout /t 3 /nobreak >nul


start cmd /k 
cd ..\
cd .\client\
npm run start

pause