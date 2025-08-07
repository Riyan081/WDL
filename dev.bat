@echo off
echo 🎬 Starting Netflix Clone in Development Mode...
echo.
echo 📍 Frontend will be available at: http://localhost:5173
echo 📍 Backend will be available at: http://localhost:5000
echo 📍 Backend Health: http://localhost:5000/api/health
echo.
echo ⚡ Starting both servers with hot reload...
echo ⚠️  If you see "failed to fetch", check that both servers are running
echo.

npm run dev:all
