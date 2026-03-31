const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function inspect() {
  const envPath = path.join(__dirname, '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });

  const config = {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'tictac_db'
  };

  const connection = await mysql.createConnection(config);
  try {
    const [rows] = await connection.query(`SHOW CREATE TABLE search_sessions`);
    console.log(rows[0]['Create Table']);
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

inspect();
