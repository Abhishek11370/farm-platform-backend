const http = require('http');

const BASE_URL = 'http://localhost:5003';

function request(method, path, headers = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    });
    req.on('error', e => resolve({ statusCode: 0, error: e.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('Logging in as admin...');
  const loginRes = await request('POST', '/auth/login', {}, {
    email: 'admin@farmplatform.com',
    password: 'Admin@123'
  });
  console.log('Login Response Status:', loginRes.statusCode);
  console.log('Login Response:', loginRes.data);

  if (loginRes.statusCode !== 201 && loginRes.statusCode !== 200) {
    console.log('Failed to log in');
    return;
  }

  const parsed = JSON.parse(loginRes.data);
  const token = parsed.data?.token || parsed.token;
  console.log('Token extracted:', token ? token.slice(0, 20) + '...' : 'NONE');

  if (!token) return;

  console.log('\nFetching /auth/me...');
  const meRes = await request('GET', '/auth/me', {
    'Authorization': `Bearer ${token}`
  });
  console.log('Me Response Status:', meRes.statusCode);
  console.log('Me Response:', meRes.data);
}

test();
