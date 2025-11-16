/**
 * MixLab System - Automated Test Suite
 * Run with: node test-automation.js
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Test results
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to make API calls
async function apiCall(method, endpoint, token = null, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      data,
      ok: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message,
      ok: false
    };
  }
}

// Test function
function test(name, testFn) {
  return async () => {
    try {
      await testFn();
      results.passed++;
      console.log(`✅ ${name}`);
    } catch (error) {
      results.failed++;
      results.errors.push({ name, error: error.message });
      console.log(`❌ ${name}: ${error.message}`);
    }
  };
}

// Test Suite
async function runTests() {
  console.log('🧪 Starting MixLab System Tests...\n');

  let studentToken = null;
  let adminToken = null;

  // ============================================
  // AUTHENTICATION TESTS
  // ============================================

  await test('1. Send Registration OTP', async () => {
    const result = await apiCall('POST', '/api/auth/send-registration-otp', null, {
      email: 'testuser@example.com',
      username: 'testuser123'
    });
    if (!result.ok) throw new Error(`Status: ${result.status}`);
  })();

  await test('2. User Login', async () => {
    const result = await apiCall('POST', '/api/auth/login', null, {
      username: 'testuser123',
      password: 'Test@1234'
    });
    if (!result.ok) throw new Error(`Status: ${result.status}`);
    if (!result.data.token) throw new Error('No token received');
    studentToken = result.data.token;
  })();

  await test('3. Get Current User', async () => {
    if (!studentToken) throw new Error('No token available');
    const result = await apiCall('GET', '/api/auth/me', studentToken);
    if (!result.ok) throw new Error(`Status: ${result.status}`);
    if (!result.data.id) throw new Error('User data not returned');
  })();

  // ============================================
  // LEARNING SYSTEM TESTS
  // ============================================

  await test('4. Get All Instruments', async () => {
    const result = await apiCall('GET', '/api/lessons/instruments');
    if (!result.ok) throw new Error(`Status: ${result.status}`);
    if (!Array.isArray(result.data)) throw new Error('Invalid response format');
  })();

  await test('5. Get Modules by Instrument', async () => {
    const result = await apiCall('GET', '/api/lessons/modules/1');
    if (!result.ok) throw new Error(`Status: ${result.status}`);
  })();

  await test('6. Get Lessons by Module', async () => {
    const result = await apiCall('GET', '/api/lessons/module/1/lessons');
    if (!result.ok) throw new Error(`Status: ${result.status}`);
  })();

  await test('7. Get User Progress', async () => {
    if (!studentToken) throw new Error('No token available');
    const result = await apiCall('GET', '/api/lessons/progress', studentToken);
    if (!result.ok) throw new Error(`Status: ${result.status}`);
  })();

  // ============================================
  // QUIZ SYSTEM TESTS
  // ============================================

  await test('8. Get Quizzes by Instrument and Level', async () => {
    const result = await apiCall('GET', '/api/quiz/quizzes/1/1');
    if (!result.ok && result.status !== 404) throw new Error(`Status: ${result.status}`);
  })();

  await test('9. Get Quiz Statistics', async () => {
    if (!studentToken) throw new Error('No token available');
    const result = await apiCall('GET', '/api/quiz/stats', studentToken);
    if (!result.ok) throw new Error(`Status: ${result.status}`);
  })();

  // ============================================
  // BOOKING SYSTEM TESTS
  // ============================================

  await test('10. Get User Booking Data', async () => {
    if (!studentToken) throw new Error('No token available');
    const result = await apiCall('GET', '/api/bookings/user-data', studentToken);
    if (!result.ok) throw new Error(`Status: ${result.status}`);
  })();

  // ============================================
  // ADMIN PANEL TESTS (Requires Admin Token)
  // ============================================

  // First, login as admin
  await test('11. Admin Login', async () => {
    const result = await apiCall('POST', '/api/auth/login', null, {
      username: 'admin',
      password: 'Admin@1234'
    });
    if (!result.ok) throw new Error(`Status: ${result.status}`);
    if (!result.data.token) throw new Error('No token received');
    adminToken = result.data.token;
  })();

  if (adminToken) {
    await test('12. Get Admin Dashboard', async () => {
      const result = await apiCall('GET', '/api/admin/dashboard', adminToken);
      if (!result.ok) throw new Error(`Status: ${result.status}`);
    })();

    await test('13. Get All Users (Admin)', async () => {
      const result = await apiCall('GET', '/api/admin/users?page=1&limit=10', adminToken);
      if (!result.ok) throw new Error(`Status: ${result.status}`);
    })();

    await test('14. Get Notifications (Admin)', async () => {
      const result = await apiCall('GET', '/api/admin/notifications?limit=50', adminToken);
      if (!result.ok) throw new Error(`Status: ${result.status}`);
    })();

    await test('15. Get Unread Count (Admin)', async () => {
      const result = await apiCall('GET', '/api/admin/notifications/unread-count', adminToken);
      if (!result.ok) throw new Error(`Status: ${result.status}`);
    })();

    await test('16. Get Appointments (Admin)', async () => {
      const result = await apiCall('GET', '/api/admin/appointments', adminToken);
      if (!result.ok) throw new Error(`Status: ${result.status}`);
    })();

    await test('17. Get Modules (Admin)', async () => {
      const result = await apiCall('GET', '/api/admin/modules', adminToken);
      if (!result.ok) throw new Error(`Status: ${result.status}`);
    })();

    await test('18. Get Analytics (Admin)', async () => {
      const result = await apiCall('GET', '/api/admin/analytics', adminToken);
      if (!result.ok) throw new Error(`Status: ${result.status}`);
    })();
  }

  // ============================================
  // TEST SUMMARY
  // ============================================

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or install node-fetch');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite error:', error);
  process.exit(1);
});

