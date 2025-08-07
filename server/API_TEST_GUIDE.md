# 🎬 Netflix Backend API Testing Guide

## 🚀 Quick Tests

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Authentication Tests

#### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@netflix.com",
    "password": "Admin@123"
  }'
```

#### Login Demo User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@netflix.com",
    "password": "demo123"
  }'
```

### 3. Content Tests

#### Get All Movies
```bash
curl http://localhost:5000/api/movies
```

#### Get Popular Movies
```bash
curl http://localhost:5000/api/movies/popular
```

#### Get All Series
```bash
curl http://localhost:5000/api/series
```

#### Get Movie by ID (replace with actual ID)
```bash
curl http://localhost:5000/api/movies/[MOVIE_ID]
```

### 4. Protected Endpoints (Need JWT Token)

#### Get User Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Add to Favorites
```bash
curl -X POST http://localhost:5000/api/user/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "contentType": "MOVIE",
    "movieId": "MOVIE_ID"
  }'
```

### 5. Admin Endpoints (Need Admin JWT Token)

#### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### Get All Users
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### Create New Movie
```bash
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "title": "Test Movie",
    "description": "A test movie for our Netflix platform",
    "duration": 120,
    "releaseYear": 2025,
    "genres": ["Action", "Drama"],
    "director": "Test Director",
    "cast": ["Actor 1", "Actor 2"],
    "poster": "https://example.com/poster.jpg",
    "trailerUrl": "https://youtube.com/watch?v=test"
  }'
```

## 🔧 PowerShell Commands (for Windows)

### Test Authentication Flow
```powershell
# Health Check
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Login and get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email": "admin@netflix.com", "password": "Admin@123"}'
$token = $loginResponse.data.token
Write-Host "Admin Token: $token"

# Get movies
Invoke-RestMethod -Uri "http://localhost:5000/api/movies"

# Get admin dashboard (with token)
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard" -Headers $headers
```

## 📊 Expected Responses

### Health Check Response
```json
{
  "success": true,
  "message": "🎬 Netflix Backend API is running!",
  "timestamp": "2025-08-07T...",
  "version": "1.0.0"
}
```

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@netflix.com",
      "name": "Admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Movies Response
```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": "...",
        "title": "Stranger Things: The Movie",
        "description": "When supernatural forces return...",
        "duration": 150,
        "releaseYear": 2024,
        "genres": ["Horror", "Sci-Fi", "Drama"],
        "poster": "https://image.tmdb.org/t/p/w500/...",
        "rating": 4.8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "pages": 1
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues:
1. **Server not running**: Make sure `node server.js` is running
2. **Database connection**: Check your .env DATABASE_URL
3. **401 Unauthorized**: Token expired or invalid
4. **403 Forbidden**: Insufficient permissions (need admin role)
5. **404 Not Found**: Wrong endpoint or resource doesn't exist

### Check Server Status:
```bash
# See if server is running
netstat -an | findstr 5000

# Or check the terminal where you started the server
```

### Database Issues:
```bash
# Check database connection
cd e:\Netflix\server
npx prisma db pull

# View database in browser
npx prisma studio
```

## 🎯 What Should Work:

✅ **Authentication**
- User registration
- User login
- JWT token generation
- Protected routes

✅ **Content Management**
- Get all movies/series
- Get individual content
- Search and filtering
- Admin CRUD operations

✅ **User Features**
- Favorites management
- Watch history tracking
- Profile management

✅ **Admin Features**
- Dashboard statistics
- User management
- Content analytics

✅ **Database**
- PostgreSQL connection
- Prisma ORM
- Sample data seeded
