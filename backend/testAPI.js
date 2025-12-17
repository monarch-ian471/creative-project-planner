const API_BASE = 'http://localhost:3000/api';

// Test Login
async function testLogin() {
  console.log('\n🔐 Testing Admin Login...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@creativeprojects.com',
        password: 'Admin@123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('📧 Email:', data.user.email);
      console.log('👤 Name:', data.user.firstName, data.user.lastName);
      console.log('🔑 Token:', data.token.substring(0, 50) + '...');
      return data.token;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

// Test User Registration
async function testRegister() {
  console.log('\n👤 Testing User Registration...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const randomNum = Math.floor(Math.random() * 10000);
  const newUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser${randomNum}@example.com`,
    password: 'Test@123'
  };
  
  try {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('📧 Email:', data.user.email);
      console.log('👤 Name:', data.user.firstName, data.user.lastName);
      console.log('🆔 User ID:', data.user.id);
      console.log('🔑 Token received:', data.token.substring(0, 50) + '...');
      return data;
    } else {
      console.log('❌ Registration failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

// Test Get Profile
async function testGetProfile(token) {
  console.log('\n👤 Testing Get Profile...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Profile retrieved!');
      console.log('📧 Email:', data.email);
      console.log('👤 Name:', data.firstName, data.lastName);
      console.log('🆔 User ID:', data._id);
      console.log('👑 Is Admin:', data.isAdmin);
      console.log('📊 Account Status:', data.accountStatus);
      return data;
    } else {
      console.log('❌ Failed to get profile:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🧪 API ENDPOINT TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Backend URL:', API_BASE);
  
  // Test 1: Admin Login
  const adminToken = await testLogin();
  
  if (adminToken) {
    // Test 2: Get Admin Profile
    await testGetProfile(adminToken);
  }
  
  // Test 3: New User Registration
  const newUser = await testRegister();
  
  if (newUser && newUser.token) {
    // Test 4: Get New User Profile
    await testGetProfile(newUser.token);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ All tests completed!\n');
}

// Run the tests
runTests();
