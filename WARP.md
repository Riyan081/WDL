# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Quick Start
```bash
# Windows - One-click startup
start.bat          # Production mode
dev.bat           # Development mode with hot reload

# Cross-platform startup
npm run dev:all        # Start both frontend and backend in dev mode
npm run start:all      # Start both frontend and backend in production mode
npm run install:all    # Install all dependencies (frontend + backend)
```

### Individual Server Management
```bash
# Frontend only (React + Vite)
npm run dev           # Development server at http://localhost:5173
npm run build         # Build for production
npm run preview       # Preview production build

# Backend only (Express + Prisma)
npm run backend       # Start backend at http://localhost:5000
npm run backend:dev   # Start backend with nodemon
cd server && npm run dev  # Alternative backend dev mode
```

### Database Operations
```bash
cd server
npm run db:generate   # Generate Prisma client after schema changes
npm run db:push       # Push schema changes to database
npm run db:migrate    # Run database migrations
npm run db:studio     # Open Prisma Studio for database management
npm run db:seed       # Seed database with sample data
```

### Content Management
```bash
cd server
node create-admin.js         # Create admin user
node add-content.js          # Add sample movies/series
node add-more-episodes.js    # Add additional episodes
node check-content.js        # Verify database content
```

### Code Quality
```bash
npm run lint          # Run ESLint on frontend code
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Express.js + Prisma ORM
- **Database**: PostgreSQL (Neon DB)
- **Authentication**: JWT + bcrypt
- **Deployment**: Firebase Hosting

### Project Structure
```
Netflix/
├── src/                    # Frontend React application
│   ├── components/         # React components (Browse, Header, Login, etc.)
│   ├── assets/            # Redux slices and utilities
│   └── services/          # API service layer
├── server/                # Backend Express API
│   ├── routes/            # API route handlers
│   ├── config/            # Database and service configurations
│   └── prisma/            # Database schema and migrations
├── start.bat/dev.bat      # Windows startup scripts
└── package.json           # Root package with combined scripts
```

### Key Components Architecture

#### Frontend State Management (Redux)
- **User Slice**: Authentication state and user data
- **Movies Slice**: Movie categories (now playing, popular, top rated, trending)
- **GPT Slice**: AI search functionality state
- **Config Slice**: Application configuration (language, etc.)

#### Backend API Structure
- **Authentication**: JWT-based auth with role-based access (USER/ADMIN)
- **Movies API**: CRUD operations for movie content
- **Series API**: Management of TV series, seasons, and episodes
- **User API**: Favorites, watch history, and user preferences
- **Admin API**: Dashboard analytics and content management

#### Database Schema (Prisma)
- **Users**: Authentication and profile data with role-based access
- **Movies**: Film content with metadata (title, description, genres, etc.)
- **Series**: TV show structure with seasons and episodes
- **Watch History**: User viewing progress tracking
- **Favorites**: User-saved content lists

### Authentication Flow
1. Login/Register through `/api/auth` endpoints
2. JWT token stored in localStorage as `netflix_token`
3. User data stored in localStorage as `netflix_user`
4. Redux store hydrated from localStorage on app load
5. Role-based routing (ADMIN → `/admin`, USER → `/browse`)

### Content Management System
- **Admin Panel**: Full CRUD operations for movies and series
- **User Roles**: ADMIN users can manage content, regular users can browse
- **Episode Management**: Series can have multiple seasons with episodes
- **Video Streaming**: YouTube trailer integration for content playback

### Development Notes
- Frontend runs on port 5173 (Vite default)
- Backend runs on port 5000
- Database uses Neon PostgreSQL with connection pooling
- CORS configured for localhost development
- Hot reload enabled for both frontend and backend in dev mode

### Default Credentials
```bash
# Admin Access
Email: admin@netflix.com
Password: Admin@123

# Demo User
Email: demo@netflix.com  
Password: demo123
```

### Environment Setup
Backend requires `.env` file in `server/` directory:
```bash
DATABASE_URL="postgresql://..."  # Neon DB connection string
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"  # For media uploads
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Common Development Patterns
- **API Services**: Centralized in `src/services/api.js` with axios
- **Error Handling**: Try-catch blocks with user-friendly error messages
- **Loading States**: Component-level loading indicators during API calls
- **Route Protection**: useEffect hooks checking authentication status
- **Redux Integration**: useSelector for state, useDispatch for actions

### Testing and Debugging
```bash
# API Health Check
curl http://localhost:5000/api/health

# Database inspection
cd server && npm run db:studio

# Check server connectivity
npm run backend     # Should show server startup message
```