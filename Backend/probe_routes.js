const axios = require('axios');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhcm1lcjFAZXhhbXBsZS5jb20iLCJzdWIiOiJjbXJuZ3picWswMDAweGN0Y3FuOGV6N3F0Iiwicm9sZSI6IkZBUk1FUiIsImlhdCI6MTc4NDI4OTk1MCwiZXhwIjoxNzg0MjkzNTUwfQ.2ab_xZ9h3UtFOUwX1MYrgU1znLHDG71V9zgQtWrnIJc';
const h = { Authorization: 'Bearer ' + TOKEN };
const BASE = 'http://localhost:5003';

const routes = [
  '/orders', '/orders/all', '/orders/my',
  '/payments', '/payments/all', '/payments/my',
  '/reviews', '/reviews/all', '/review',
  '/coupons', '/coupons/all',
];

async function probe() {
  for (const u of routes) {
    try {
      const r = await axios.get(BASE + u, { headers: h });
      const d = r.data?.data;
      const n = Array.isArray(d) ? d.length : (d?.total || typeof d === 'object' ? 'object' : '?');
      console.log(`${u}: ${r.status} → items=${n}`);
    } catch (e) {
      console.log(`${u}: ${e.response?.status} – ${e.response?.data?.message}`);
    }
  }
}
probe();
