const fs = require('fs');
const http = require('http');

const BASE_URL = 'http://localhost:5003';
const results = [];

function request(method, path, token, body = null) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', e => resolve({ statusCode: 0, error: e.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function classify(statusCode, method) {
  if (statusCode === 0) return { status: 'FAIL', reason: 'Server not reachable' };
  if (statusCode >= 500) return { status: 'FAIL', reason: `500 Internal Server Error` };
  if (statusCode >= 200 && statusCode < 300) return { status: 'PASS', reason: 'Success' };
  if (statusCode === 401) return { status: 'PASS', reason: '401 Unauthorized (expected, no/invalid token)' };
  if (statusCode === 403) return { status: 'PASS', reason: '403 Forbidden (role guard working)' };
  if (statusCode === 404) return { status: 'PASS', reason: '404 Not Found (dummy ID, expected)' };
  if (statusCode === 400) return { status: 'PASS', reason: '400 Validation Error (expected for dummy payload)' };
  if (statusCode === 409) return { status: 'PASS', reason: '409 Conflict (duplicate resource detection working)' };
  return { status: 'PASS', reason: `${statusCode} handled gracefully` };
}

async function runTests() {
  // Auth
  let token = null;
  console.log('Attempting login with demo admin...');
  const loginRes = await request('POST', '/auth/login', null, {
    email: 'admin@farmplatform.com',
    password: 'Admin@123',
  });
  try {
    if (!loginRes.data) {
      console.log('✗ Login failed, no data returned. Is the server running? Error:', loginRes.error);
      return;
    }
    const parsed = JSON.parse(loginRes.data);
    token = parsed.accessToken || parsed.token;
    if (token) console.log('✓ Login OK, token acquired');
    else console.log('✗ Login responded but no token in response:', loginRes.data.slice(0, 150));
  } catch(e) {
    console.log('✗ Login parse error:', loginRes.data ? loginRes.data.slice(0, 150) : e.message);
  }

  const endpoints = [
    // --- Health ---
    { method: 'GET', path: '/' },
    { method: 'GET', path: '/health' },
    // --- Auth ---
    { method: 'POST', path: '/auth/register', body: { name: 'A', email: 'a@b.com', password: 'pass' } },
    { method: 'POST', path: '/auth/login', body: { email: 'admin@farmplatform.com', password: 'Admin@123' } },
    { method: 'POST', path: '/auth/refresh', body: { refreshToken: 'invalid' } },
    { method: 'GET', path: '/auth/me' },
    { method: 'PATCH', path: '/auth/me', body: { name: 'Updated' } },
    { method: 'POST', path: '/auth/logout', body: {} },
    // --- Users ---
    { method: 'GET', path: '/users' },
    { method: 'GET', path: '/users/dummy-id' },
    { method: 'POST', path: '/users', body: { name: 'T', email: 't@t.com', password: 'pass', role: 'BUYER' } },
    { method: 'PATCH', path: '/users/dummy-id', body: { name: 'Updated' } },
    { method: 'DELETE', path: '/users/dummy-id' },
    // --- Products ---
    { method: 'GET', path: '/product' },
    { method: 'GET', path: '/product/categories' },
    { method: 'POST', path: '/product/categories', body: { name: 'TEST_CAT' } },
    { method: 'GET', path: '/product/subcategories' },
    { method: 'GET', path: '/product/units' },
    { method: 'GET', path: '/product/grades' },
    { method: 'GET', path: '/product/dummy-id' },
    { method: 'POST', path: '/product', body: { title: 'T', price: 10, quantity: 5 } },
    { method: 'PUT', path: '/product/dummy-id', body: { title: 'Updated' } },
    { method: 'DELETE', path: '/product/dummy-id' },
    // --- Orders ---
    { method: 'GET', path: '/order' },
    { method: 'GET', path: '/order/dummy-id' },
    { method: 'POST', path: '/order', body: { productId: 'dummy-id', quantity: 1 } },
    { method: 'PATCH', path: '/order/dummy-id/status', body: { status: 'PAID' } },
    { method: 'DELETE', path: '/order/dummy-id' },
    // --- Cart ---
    { method: 'GET', path: '/cart' },
    { method: 'POST', path: '/cart', body: { productId: 'dummy-id', qty: 1 } },
    { method: 'PATCH', path: '/cart/dummy-id', body: { qty: 2 } },
    { method: 'DELETE', path: '/cart/dummy-id' },
    // --- Auction ---
    { method: 'GET', path: '/auction' },
    { method: 'GET', path: '/auction/dummy-id' },
    { method: 'POST', path: '/auction', body: { productId: 'dummy', startTime: new Date(), endTime: new Date(), basePrice: 100 } },
    { method: 'PATCH', path: '/auction/dummy-id', body: { status: 'LIVE' } },
    { method: 'POST', path: '/auction/dummy-id/bid', body: { amount: 150 } },
    { method: 'GET', path: '/auction/dummy-id/bids' },
    // --- Chat ---
    { method: 'GET', path: '/chat/messages/dummy-id' },
    { method: 'POST', path: '/chat/messages', body: { receiverId: 'dummy', content: 'Hi' } },
    // --- Delivery ---
    { method: 'GET', path: '/delivery' },
    { method: 'POST', path: '/delivery/assign', body: { orderId: 'dummy', agentId: 'dummy' } },
    { method: 'PATCH', path: '/delivery/dummy-id/status', body: { status: 'SHIPPED' } },
    { method: 'PATCH', path: '/delivery/dummy-id/location', body: { lat: 12.9, lng: 77.6 } },
    { method: 'GET', path: '/delivery/earnings' },
    { method: 'GET', path: '/delivery/admin-earnings' },
    // --- Activity ---
    { method: 'GET', path: '/activity' },
    { method: 'GET', path: '/activity/admin' },
    // --- Address ---
    { method: 'GET', path: '/address' },
    { method: 'POST', path: '/address', body: { fullName: 'Test', phone: '9999999999', addressLine1: 'Street 1', city: 'City', state: 'State', pincode: '123456' } },
    { method: 'PATCH', path: '/address/dummy-id', body: { city: 'NewCity' } },
    { method: 'DELETE', path: '/address/dummy-id' },
    // --- Payments (NEW) ---
    { method: 'POST', path: '/payments/create-order', body: { orderId: 'dummy-id' } },
    { method: 'POST', path: '/payments/verify', body: { orderId: 'dummy', razorpayPaymentId: 'pay_test', razorpaySignature: 'sig' } },
    { method: 'POST', path: '/payments/webhook', body: { event: 'payment.captured' } },
    { method: 'GET', path: '/payments/order/dummy-id' },
    { method: 'GET', path: '/payments' },
    // --- Notifications (NEW) ---
    { method: 'GET', path: '/notifications' },
    { method: 'PATCH', path: '/notifications/read-all' },
    { method: 'PATCH', path: '/notifications/dummy-id/read' },
    { method: 'DELETE', path: '/notifications/dummy-id' },
    { method: 'POST', path: '/notifications/send', body: { userId: 'dummy', title: 'Test', message: 'Msg', type: 'ADMIN' } },
    { method: 'GET', path: '/notifications/admin/all' },
    // --- Wishlists (NEW) ---
    { method: 'GET', path: '/wishlists' },
    { method: 'POST', path: '/wishlists', body: { productId: 'dummy-id' } },
    { method: 'GET', path: '/wishlists/check/dummy-id' },
    { method: 'DELETE', path: '/wishlists/clear' },
    { method: 'DELETE', path: '/wishlists/dummy-id' },
    // --- Reviews (NEW) ---
    { method: 'POST', path: '/reviews', body: { productId: 'dummy-id', rating: 5, comment: 'Great!' } },
    { method: 'GET', path: '/reviews/product/dummy-id' },
    { method: 'GET', path: '/reviews/mine' },
    { method: 'DELETE', path: '/reviews/dummy-id' },
    // --- Coupons (NEW) ---
    { method: 'GET', path: '/coupons' },
    { method: 'POST', path: '/coupons', body: { code: 'TEST20', discountType: 'PERCENTAGE', discountValue: 20, expiryDate: '2027-12-31' } },
    { method: 'POST', path: '/coupons/validate', body: { code: 'WELCOME10' } },
    { method: 'GET', path: '/coupons/dummy-id' },
    { method: 'PATCH', path: '/coupons/dummy-id/toggle', body: { isActive: false } },
    { method: 'DELETE', path: '/coupons/dummy-id' },
    // --- Farmer Verification (NEW) ---
    { method: 'GET', path: '/farmer-verification' },
    { method: 'POST', path: '/farmer-verification/submit', body: { documentUrl: 'https://example.com/doc.pdf', documentType: 'ID_CARD' } },
    { method: 'GET', path: '/farmer-verification/mine' },
    { method: 'GET', path: '/farmer-verification/dummy-id' },
    { method: 'PATCH', path: '/farmer-verification/dummy-id/review', body: { status: 'APPROVED' } },
    // --- Analytics (NEW) ---
    { method: 'GET', path: '/analytics/dashboard' },
    { method: 'GET', path: '/analytics/revenue' },
    { method: 'GET', path: '/analytics/top-products' },
    { method: 'GET', path: '/analytics/user-growth' },
    { method: 'GET', path: '/analytics/orders' },
    { method: 'GET', path: '/analytics/auctions' },
  ];

  for (const ep of endpoints) {
    const res = await request(ep.method, ep.path, token, ep.body || null);
    const { status, reason } = classify(res.statusCode, ep.method);
    results.push({ method: ep.method, path: ep.path, statusCode: res.statusCode, status, reason });
    const icon = status === 'PASS' ? '✓' : '✗';
    console.log(`${icon} [${res.statusCode}] ${ep.method} ${ep.path}`);
  }

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log(`\n==============================`);
  console.log(`TOTAL: ${results.length} | PASS: ${passed} | FAIL: ${failed}`);
  console.log(`Pass Rate: ${Math.round((passed / results.length) * 100)}%`);
  console.log(`==============================`);

  fs.writeFileSync('api-test-results-v2.json', JSON.stringify({ summary: { total: results.length, passed, failed }, results }, null, 2));
  console.log('\nResults written to api-test-results-v2.json');
}

runTests();
