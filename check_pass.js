const { Client } = require('pg');

const passwords = ['postgres', 'root', 'password', 'admin', '1234', '123456', ''];

async function testPassword(password) {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: password,
    port: 5432,
  });
  try {
    await client.connect();
    console.log(`SUCCESS: password is '${password}'`);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.log(`FAILED: ${password} - Error: ${err.message}`);
  }
}

async function main() {
  for (const p of passwords) {
    await testPassword(p);
  }
}
main();
