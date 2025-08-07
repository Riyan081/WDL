// Full system test for Netflix clone
console.log('🎬 Netflix Clone Full System Test');

// Test 1: API Base Configuration
console.log('\n📋 Configuration Check:');
const API_BASE_URL = 'http://localhost:5000/api';
console.log('API Base URL:', API_BASE_URL);
console.log('Current Origin:', window.location.origin);
console.log('Expected Frontend URL:', 'http://localhost:5173');

// Test 2: Authentication State
console.log('\n🔐 Authentication State:');
const token = localStorage.getItem('netflix_token');
const userData = localStorage.getItem('netflix_user');
console.log('Token present:', !!token);
console.log('User data present:', !!userData);
if (userData) {
  try {
    const user = JSON.parse(userData);
    console.log('User data:', { id: user.id, name: user.name, role: user.role });
  } catch (e) {
    console.error('Invalid user data in localStorage:', e);
  }
}

// Test 3: Mock the exact API calls the app makes
console.log('\n🧪 Testing Actual App API Calls:');

// Simulate the movies API call
async function testMoviesLikeApp() {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Movies API (like app):', data.success ? 'SUCCESS' : 'FAILED', data);
  } catch (error) {
    console.error('❌ Movies API (like app) FAILED:', error);
  }
}

// Simulate the series API call
async function testSeriesLikeApp() {
  try {
    const response = await fetch(`${API_BASE_URL}/series`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Series API (like app):', data.success ? 'SUCCESS' : 'FAILED', data);
  } catch (error) {
    console.error('❌ Series API (like app) FAILED:', error);
  }
}

// Test 4: Authentication endpoint if token exists
async function testAuthIfLoggedIn() {
  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Auth profile:', data.success ? 'SUCCESS' : 'FAILED', data);
    } catch (error) {
      console.error('❌ Auth profile FAILED:', error);
      console.log('💡 This might be why you see "failed to fetch" - invalid/expired token');
    }
  } else {
    console.log('ℹ️ No token found, skipping auth test');
  }
}

// Run all tests
Promise.all([
  testMoviesLikeApp(),
  testSeriesLikeApp(),
  testAuthIfLoggedIn()
]).then(() => {
  console.log('\n🎯 Debugging Tips:');
  console.log('1. If auth profile fails, try: localStorage.clear() and refresh');
  console.log('2. If CORS errors appear, check browser DevTools → Console');
  console.log('3. If network errors, verify both servers are running');
  console.log('4. Check browser DevTools → Network tab for failed requests');
});
