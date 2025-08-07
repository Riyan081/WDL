// Comprehensive API connectivity test
console.log('🧪 Starting comprehensive API connectivity test...');

const API_BASE_URL = 'http://localhost:5000/api';

// Test function with detailed error reporting
async function testEndpoint(name, url, options = {}) {
  console.log(`\n🔍 Testing ${name}: ${url}`);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log(`✅ ${name} SUCCESS:`, data);
    return data;
  } catch (error) {
    console.error(`❌ ${name} FAILED:`, error);
    console.error(`🔍 Error details:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Backend Server Tests:');
  
  // Basic connectivity
  await testEndpoint('Health Check', `${API_BASE_URL}/health`);
  
  // Public endpoints
  await testEndpoint('Movies API', `${API_BASE_URL}/movies`);
  await testEndpoint('Series API', `${API_BASE_URL}/series`);
  
  // Auth endpoints (should fail without token, but still respond)
  await testEndpoint('Profile (no token)', `${API_BASE_URL}/auth/profile`);
  
  // Test with fake token (should return proper error)
  await testEndpoint('Profile (fake token)', `${API_BASE_URL}/auth/profile`, {
    headers: { 'Authorization': 'Bearer fake-token' }
  });
  
  // CORS preflight test
  await testEndpoint('CORS Preflight', `${API_BASE_URL}/movies`, {
    method: 'OPTIONS'
  });
  
  console.log('\n🔍 Environment Check:');
  console.log('Current URL:', window.location.href);
  console.log('User Agent:', navigator.userAgent);
  console.log('Local Storage Token:', localStorage.getItem('netflix_token') ? 'Present' : 'Not found');
  console.log('Local Storage User:', localStorage.getItem('netflix_user') ? 'Present' : 'Not found');
  
  console.log('\n🎯 If tests pass but app still shows "failed to fetch":');
  console.log('1. Open browser DevTools → Network tab');
  console.log('2. Refresh the page and look for failed requests');
  console.log('3. Check the specific error message in the Console tab');
  console.log('4. Try clearing localStorage: localStorage.clear()');
}

// Run the tests
runAllTests();
