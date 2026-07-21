import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5003',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    const resData = response.data;
    if (resData && typeof resData === 'object' && ('success' in resData || 'data' in resData)) {
      if (resData.data !== undefined) {
        response.data = resData.data;
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function test() {
  try {
    const loginRes = await api.post('/auth/login', {
      email: 'admin@farmplatform.com',
      password: 'Admin@123'
    });
    const token = loginRes.data.access_token;
    console.log('Login token:', token);
    
    const usersRes = await api.get('/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Users res type:', typeof usersRes.data);
    console.log('Is Array?', Array.isArray(usersRes.data));
    console.log('First user:', usersRes.data[0]);
    console.log('Full res:', usersRes.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
