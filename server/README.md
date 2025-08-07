# 🎬 Netflix Backend Setup Instructions

## 📋 Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon DB)
- Git

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and update:
```bash
# Your Neon DB URL is already configured
DATABASE_URL="postgresql://neondb_owner:npg_i2dosZpKP0XW@ep-green-truth-aek2q646-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Update these:
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key" 
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/popular` - Popular movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### Series & Episodes
- `GET /api/series` - Get all series
- `GET /api/series/:id` - Get series by ID
- `POST /api/series` - Create series (Admin)
- `POST /api/series/:seriesId/seasons` - Add season (Admin)
- `POST /api/series/seasons/:seasonId/episodes` - Add episode (Admin)

### User Features
- `POST /api/user/favorites` - Add to favorites
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/watch-history` - Update watch progress
- `GET /api/user/watch-history` - Get watch history
- `POST /api/user/reviews` - Add review

### Admin Dashboard
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/:id/status` - Update user status

## 🔑 Default Admin Credentials
```
Email: admin@netflix.com
Password: Admin@123
```

## 🔑 Demo User Credentials
```
Email: demo@netflix.com
Password: demo123
```

## 🎬 Sample Data Included
- 3 Movies with trailers
- 2 Series with seasons/episodes
- Admin and Demo users

## 🛠️ Tech Stack
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Framework**: Express.js
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **File Upload**: Cloudinary ready

## 📱 Frontend Integration
Update your React frontend to use the new API:

```javascript
import { moviesAPI, authAPI } from '../services/api';

// Login user
const handleLogin = async (credentials) => {
  const response = await authAPI.login(credentials);
  localStorage.setItem('netflix_token', response.data.token);
};

// Get movies
const getMovies = async () => {
  const response = await moviesAPI.getAllMovies();
  return response.data.movies;
};
```

## 🎥 Video Streaming
- Supports trailer playback
- Watch progress tracking
- Video player with full controls
- Favorites and watch history

## 📊 Admin Features
- User management
- Content management (CRUD)
- Dashboard analytics
- User activity monitoring

## 🚀 Deployment Ready
- Environment-based configuration
- Production error handling
- Database connection pooling
- CORS configured

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull
```

### Reset Database
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

## 📈 Next Steps
1. Setup Cloudinary for media uploads
2. Configure video streaming CDN
3. Add payment integration
4. Implement real-time features
5. Deploy to production

---

**Your Netflix backend is ready! 🎬**
