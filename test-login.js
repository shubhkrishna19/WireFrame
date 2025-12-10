import axios from 'axios';

async function testLogin() {
  try {
    console.log('🔍 Testing login with admin@test.com / admin123...');

    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@test.com',
      password: 'admin123'
    });

    console.log('✅ Login successful!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
