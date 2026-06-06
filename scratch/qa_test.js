const fetch = require('node-fetch');
const crypto = require('crypto');

const BASE = 'http://127.0.0.1:5001';

function randEmail() {
  return `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}@example.com`;
}

async function post(path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function get(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

(async () => {
  const results = {};

  // 1. Register BUYER
  const buyerEmail = randEmail();
  const buyerPass = 'Pass123!';
  const regBuyer = await post('/auth/register', { name: 'Buyer', email: buyerEmail, password: buyerPass, role: 'BUYER' });
  results.registerBuyer = regBuyer;

  // 2. Login BUYER
  const loginBuyer = await post('/auth/login', { email: buyerEmail, password: buyerPass });
  results.loginBuyer = loginBuyer;
  const buyerToken = loginBuyer.data?.token;

  // 3. GET /me with buyer token
  if (buyerToken) results.meBuyer = await get('/me', buyerToken);

  // 4. Register ADMIN for product creation
  const adminEmail = randEmail();
  const adminPass = 'Admin123!';
  const regAdmin = await post('/auth/register', { name: 'Admin', email: adminEmail, password: adminPass, role: 'ADMIN' });
  results.registerAdmin = regAdmin;
  const loginAdmin = await post('/auth/login', { email: adminEmail, password: adminPass });
  results.loginAdmin = loginAdmin;
  const adminToken = loginAdmin.data?.token;

  // 5. GET /health
  results.health = await get('/health');

  // 6. GET /products (public auth required)
  results.getProducts = await get('/products', buyerToken);

  // 7. POST /products as ADMIN
  if (adminToken) {
    const product = {
      title: 'Test Product',
      description: 'Sample',
      price: 10,
      quantity: 5,
    };
    results.postProduct = await post('/products', product, adminToken);
  }

  // 8. POST /orders as BUYER
  if (buyerToken && results.postProduct?.data?.id) {
    const orderPayload = { items: [{ productId: results.postProduct.data.id, qty: 2 }] };
    results.postOrder = await post('/orders', orderPayload, buyerToken);
  }

  // 9. GET /orders as BUYER
  if (buyerToken) results.getOrders = await get('/orders', buyerToken);

  // 10. GET /stats (requires auth)
  if (adminToken) results.stats = await get('/stats', adminToken);

  // 11. Security tests
  results.invalidToken = await get('/me', 'invalidtoken');
  results.missingToken = await get('/me');
  results.invalidRegister = await post('/auth/register', { name: 'Bad', email: 'bad@example.com' }); // missing password

  console.log(JSON.stringify({ results }, null, 2));
})();
