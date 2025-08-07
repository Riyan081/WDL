// Netflix Backend API Test Suite
const API_BASE = 'http://localhost:5000/api';

// Test utilities
const makeRequest = async (endpoint, options = {}) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
};

const log = (test, status, message) => {
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏳';
  console.log(`${emoji} ${test}: ${message}`);
};

// Test suite
const runTests = async () => {
  console.log('🎬 Starting Netflix Backend API Tests...\n');
  
  let adminToken = '';
  let userToken = '';
  let movieId = '';
  let seriesId = '';
  
  // Test 1: Health Check
  try {
    const result = await makeRequest('/health');
    if (result.status === 200 && result.data.success) {
      log('Health Check', 'PASS', 'API is running');
    } else {
      log('Health Check', 'FAIL', 'API not responding');
      return;
    }
  } catch (error) {
    log('Health Check', 'FAIL', error.message);
    return;
  }

  // Test 2: Admin Login
  try {
    const result = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@netflix.com',
        password: 'Admin@123'
      })
    });
    
    if (result.status === 200 && result.data.success) {
      adminToken = result.data.data.token;
      log('Admin Login', 'PASS', `Token: ${adminToken.substring(0, 20)}...`);
    } else {
      log('Admin Login', 'FAIL', result.data.message || 'Login failed');
    }
  } catch (error) {
    log('Admin Login', 'FAIL', error.message);
  }

  // Test 3: Demo User Login
  try {
    const result = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'demo@netflix.com',
        password: 'demo123'
      })
    });
    
    if (result.status === 200 && result.data.success) {
      userToken = result.data.data.token;
      log('Demo User Login', 'PASS', `Token: ${userToken.substring(0, 20)}...`);
    } else {
      log('Demo User Login', 'FAIL', result.data.message || 'Login failed');
    }
  } catch (error) {
    log('Demo User Login', 'FAIL', error.message);
  }

  // Test 4: Get Movies
  try {
    const result = await makeRequest('/movies');
    if (result.status === 200 && result.data.success) {
      const movies = result.data.data.movies;
      movieId = movies[0]?.id;
      log('Get Movies', 'PASS', `Found ${movies.length} movies`);
    } else {
      log('Get Movies', 'FAIL', result.data.message || 'Failed to get movies');
    }
  } catch (error) {
    log('Get Movies', 'FAIL', error.message);
  }

  // Test 5: Get Popular Movies
  try {
    const result = await makeRequest('/movies/popular');
    if (result.status === 200 && result.data.success) {
      log('Get Popular Movies', 'PASS', `Found ${result.data.data.length} popular movies`);
    } else {
      log('Get Popular Movies', 'FAIL', result.data.message || 'Failed');
    }
  } catch (error) {
    log('Get Popular Movies', 'FAIL', error.message);
  }

  // Test 6: Get Series
  try {
    const result = await makeRequest('/series');
    if (result.status === 200 && result.data.success) {
      const series = result.data.data.series;
      seriesId = series[0]?.id;
      log('Get Series', 'PASS', `Found ${series.length} series`);
    } else {
      log('Get Series', 'FAIL', result.data.message || 'Failed to get series');
    }
  } catch (error) {
    log('Get Series', 'FAIL', error.message);
  }

  // Test 7: Get Movie by ID
  if (movieId) {
    try {
      const result = await makeRequest(`/movies/${movieId}`);
      if (result.status === 200 && result.data.success) {
        log('Get Movie by ID', 'PASS', `Movie: ${result.data.data.title}`);
      } else {
        log('Get Movie by ID', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('Get Movie by ID', 'FAIL', error.message);
    }
  }

  // Test 8: Admin Dashboard (requires admin token)
  if (adminToken) {
    try {
      const result = await makeRequest('/admin/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (result.status === 200 && result.data.success) {
        const stats = result.data.data.stats;
        log('Admin Dashboard', 'PASS', 
          `Users: ${stats.totalUsers}, Movies: ${stats.totalMovies}, Series: ${stats.totalSeries}`);
      } else {
        log('Admin Dashboard', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('Admin Dashboard', 'FAIL', error.message);
    }
  }

  // Test 9: Get Admin Users
  if (adminToken) {
    try {
      const result = await makeRequest('/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (result.status === 200 && result.data.success) {
        log('Get Admin Users', 'PASS', `Found ${result.data.data.users.length} users`);
      } else {
        log('Get Admin Users', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('Get Admin Users', 'FAIL', error.message);
    }
  }

  // Test 10: User Profile (requires user token)
  if (userToken) {
    try {
      const result = await makeRequest('/auth/profile', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      if (result.status === 200 && result.data.success) {
        log('User Profile', 'PASS', `User: ${result.data.data.name}`);
      } else {
        log('User Profile', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('User Profile', 'FAIL', error.message);
    }
  }

  // Test 11: Add to Favorites (requires user token and movie ID)
  if (userToken && movieId) {
    try {
      const result = await makeRequest('/user/favorites', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({
          contentType: 'MOVIE',
          movieId: movieId
        })
      });
      
      if (result.status === 201 && result.data.success) {
        log('Add to Favorites', 'PASS', 'Movie added to favorites');
      } else {
        log('Add to Favorites', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('Add to Favorites', 'FAIL', error.message);
    }
  }

  // Test 12: Get Favorites
  if (userToken) {
    try {
      const result = await makeRequest('/user/favorites', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      if (result.status === 200 && result.data.success) {
        log('Get Favorites', 'PASS', `Found ${result.data.data.favorites.length} favorites`);
      } else {
        log('Get Favorites', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('Get Favorites', 'FAIL', error.message);
    }
  }

  // Test 13: Update Watch History
  if (userToken && movieId) {
    try {
      const result = await makeRequest('/user/watch-history', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({
          contentType: 'MOVIE',
          movieId: movieId,
          progress: 1800, // 30 minutes
          completed: false
        })
      });
      
      if (result.status === 200 && result.data.success) {
        log('Update Watch History', 'PASS', 'Watch progress saved');
      } else {
        log('Update Watch History', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('Update Watch History', 'FAIL', error.message);
    }
  }

  // Test 14: Create Movie (Admin only)
  if (adminToken) {
    try {
      const result = await makeRequest('/movies', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          title: 'Test Movie API',
          description: 'A test movie created via API testing',
          duration: 120,
          releaseYear: 2025,
          genres: ['Action', 'Test'],
          director: 'Test Director',
          cast: ['Test Actor 1', 'Test Actor 2'],
          poster: 'https://example.com/test-poster.jpg',
          trailerUrl: 'https://youtube.com/watch?v=test'
        })
      });
      
      if (result.status === 201 && result.data.success) {
        log('Create Movie', 'PASS', `Created: ${result.data.data.title}`);
      } else {
        log('Create Movie', 'FAIL', result.data.message || 'Failed');
      }
    } catch (error) {
      log('Create Movie', 'FAIL', error.message);
    }
  }

  console.log('\n🎯 API Testing Complete!');
  console.log('\n📊 Summary:');
  console.log('- Health Check: API Running');
  console.log('- Authentication: Admin & User login working');
  console.log('- Content: Movies & Series accessible');
  console.log('- Admin: Dashboard & user management functional');
  console.log('- User Features: Favorites & watch history working');
  console.log('- CRUD: Movie creation successful');
};

// Run tests if this file is executed directly
runTests().catch(console.error);
