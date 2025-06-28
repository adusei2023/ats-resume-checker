@echo off
echo Starting ATS Resume Checker...

echo.
echo Starting backend server on port 3001...
start "Backend Server" cmd /k "node server/simple-server.js"

timeout /t 3 /nobreak > nul

echo Starting frontend server on port 5173...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 🚀 ATS Resume Checker is now running!
echo 📖 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:3001
echo.
echo Close the terminal windows to stop the servers
pause
