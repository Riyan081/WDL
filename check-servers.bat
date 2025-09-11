@echo off
echo 🔍 Netflix Backend Server Check...
echo.

echo 📍 Checking if backend dependencies are installed...
cd server
if not exist "node_modules" (
    echo ❌ Backend dependencies not found! Installing...
    npm install
    echo ✅ Backend dependencies installed!
) else (
    echo ✅ Backend dependencies found!
)

echo.
echo 📍 Checking database connection...
if exist ".env" (
    echo ✅ Environment file found!
) else (
    echo ❌ .env file not found in server directory!
    echo 🔧 Creating sample .env file...
    echo DATABASE_URL="postgresql://neondb_owner:npg_i2dosZpKP0XW@ep-green-truth-aek2q646-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" > .env
    echo JWT_SECRET="your-secret-key-here" >> .env
    echo NODE_ENV="development" >> .env
    echo ✅ Sample .env created! Please update with your actual values.
)

echo.
echo 📍 Checking Prisma setup...
npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Prisma generation failed!
) else (
    echo ✅ Prisma client generated!
)

echo.
echo 📍 Starting backend server test...
timeout 3 > nul
start cmd /c "npm run dev"
timeout 5 > nul

echo.
echo 📍 Testing backend health endpoint...
curl -s http://localhost:5000/api/health
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Backend server is running correctly!
) else (
    echo ❌ Backend server is not responding!
)

echo.
echo 📍 Going back to root directory...
cd ..

pause
