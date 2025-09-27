@echo off
echo Starting KalamKriti Handloom Platform...
echo.

echo Installing backend dependencies...
npm install

echo.
echo Starting backend server...
echo Backend will run on http://localhost:3000
echo.

start cmd /k "npm run dev"

echo.
echo Backend server started!
echo.
echo To view the website:
echo 1. Open handloom.html in your browser
echo 2. Or use a local server like Live Server
echo.
echo Press any key to exit...
pause > nul
