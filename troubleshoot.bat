@echo off
echo 🔧 Netflix Clone Troubleshooting Guide
echo.
echo 🚀 Step 1: Testing Backend Connectivity...
echo.

curl http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo ❌ Backend is not responding!
    echo 💡 Make sure to run: npm run start:all
    goto :end
)

echo.
echo ✅ Backend is running!
echo.

echo 🧪 Step 2: Testing API Endpoints...
echo.
echo Movies API:
curl http://localhost:5000/api/movies
echo.
echo.
echo Series API:
curl http://localhost:5000/api/series
echo.
echo.

echo 🔍 Step 3: Manual Debugging Steps:
echo.
echo 1. Open your browser and go to: http://localhost:5173
echo 2. Open DevTools (F12) and check the Console tab for errors
echo 3. Check the Network tab for failed requests (red entries)
echo 4. If you see authentication errors, clear browser data:
echo    - Copy this into browser console: localStorage.clear()
echo    - Refresh the page
echo.
echo 5. Copy and paste this test script in browser console:
echo.
type test-system.js
echo.
echo.

echo 📊 Step 4: System Information:
echo.
echo Checking running Node processes...
tasklist /FI "IMAGENAME eq node.exe" 2>nul
if %errorlevel% neq 0 (
    echo ❌ No Node.js processes found!
    echo 💡 Run: npm run start:all
) else (
    echo ✅ Node.js processes are running
)

echo.
echo 🎯 Common "Failed to Fetch" Solutions:
echo 1. Clear browser cache and cookies
echo 2. Try incognito/private browsing mode
echo 3. Check if antivirus/firewall is blocking localhost
echo 4. Verify both servers are running (see URLs above)
echo 5. Check browser console for detailed error messages

:end
echo.
pause
