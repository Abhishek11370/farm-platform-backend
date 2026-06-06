const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '@Bhishek1137',
    port: 5432,
  });
  
  try {
    await client.connect();
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'farm_platform'");
    if (res.rowCount === 0) {
      console.log('Database does not exist. Creating...');
      await client.query('CREATE DATABASE farm_platform');
      console.log('Database created.');
    } else {
      console.log('Database already exists.');
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDb();
