// Cleaned bootstrap – only server setup and Prisma routes
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./src/routes'); // routes exported via module.exports

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
// Log parsed request body for debugging
app.use((req, res, next) => {
  if (Object.keys(req.body).length) {
    console.log('Parsed BODY:', req.body);
  }
  next();
});

// Health endpoint – simple JSON response
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Mount all Prisma‑driven routes (auth, products, orders, etc.)
app.use('/', routes());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Farm Platform API running: http://127.0.0.1:${PORT}`);
});