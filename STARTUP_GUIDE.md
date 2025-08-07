# 🎬 Netflix Clone - Quick Start Guide

## 🚀 Easy Startup Commands

### Option 1: One-Click Startup (Windows)
```bash
# Double-click or run in terminal:
start.bat          # Production mode
dev.bat           # Development mode (with hot reload)
```

### Option 2: NPM Scripts
```bash
# Install all dependencies (run once)
npm run install:all

# Start both frontend and backend together
npm run start:all      # Production mode
npm run dev:all        # Development mode (with hot reload)

# Start individually
npm run frontend       # Frontend only (http://localhost:5173)
npm run backend        # Backend only (http://localhost:5000)
npm run backend:dev    # Backend with nodemon
```

### Option 3: Manual Startup
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm start
```

## 📍 Application URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Prisma Studio**: `cd server && npm run db:studio`

## 🎯 Features
- ✅ 23 Episodes across 3 series (Breaking Bad, Stranger Things, The Witcher)
- ✅ Enhanced video player with episode navigation
- ✅ Admin panel for episode management
- ✅ Netflix-style UI with user authentication
- ✅ PostgreSQL database with Prisma ORM

## 🔧 Admin Access
1. Go to http://localhost:5173
2. Login with admin credentials
3. Click "Admin Panel" → "Episodes" tab
4. Add/manage episodes easily

## 🛠️ Development Commands
```bash
# Database management
cd server
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:studio      # Open Prisma Studio

# Content management
cd server
node add-more-episodes.js    # Add more episodes
node create-admin.js         # Create admin user
```

## 📦 Project Structure
```
Netflix/
├── src/                 # Frontend React app
├── server/             # Backend Express API
├── start.bat          # Windows startup script
├── dev.bat            # Windows dev script
└── package.json       # Root package with combined scripts
```

Enjoy your Netflix clone! 🍿✨
