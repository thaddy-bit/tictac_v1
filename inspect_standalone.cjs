const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
  const envPath = path.join(__dirname, 'backend', '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) {
      env[parts[0].trim()] = parts[1].trim();
    }
  });
  return env;
}

async function inspect() {
  const env = loadEnv();
  const config = {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'tictac_db'
  };

  const connection = await mysql.createConnection(config);
  try {
    const tables = ['search_sessions', 'transactions'];
    for (const table of tables) {
      const [rows] = await connection.query(`SHOW CREATE TABLE ${table}`);
      console.log(`--- ${table} ---`);
      console.log(rows[0]['Create Table']);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

inspect();
