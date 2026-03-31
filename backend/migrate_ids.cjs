const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
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
    console.log('Starting migration...');
    
    // 1. Drop foreign key
    console.log('Dropping foreign key search_sessions_ibfk_1...');
    await connection.query(`ALTER TABLE search_sessions DROP FOREIGN KEY search_sessions_ibfk_1`);
    
    // 2. Modify transactions.id (remove auto_increment by changing type)
    console.log('Modifying transactions.id to VARCHAR(16)...');
    await connection.query(`ALTER TABLE transactions MODIFY id VARCHAR(16) NOT NULL`);
    
    // 3. Modify search_sessions.transaction_id to VARCHAR(16)
    console.log('Modifying search_sessions.transaction_id to VARCHAR(16)...');
    await connection.query(`ALTER TABLE search_sessions MODIFY transaction_id VARCHAR(16) NOT NULL`);
    
    // 4. Modify search_sessions.id to VARCHAR(16)
    console.log('Modifying search_sessions.id to VARCHAR(16)...');
    await connection.query(`ALTER TABLE search_sessions MODIFY id VARCHAR(16) NOT NULL`);
    
    // 5. Restore foreign key
    console.log('Restoring foreign key search_sessions_ibfk_1...');
    await connection.query(`ALTER TABLE search_sessions ADD CONSTRAINT search_sessions_ibfk_1 FOREIGN KEY (transaction_id) REFERENCES transactions (id)`);
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
