const mysql = require('mysql2/promise');
require('dotenv').config();

async function initAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Adding role column...');
    await connection.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user'");
    
    console.log('Inserting admin user...');
    const [result] = await connection.query(`
      INSERT IGNORE INTO users (phone, email, first_name, last_name, role, password_hash)
      VALUES ('+242000000000', 'admin@tictac.cg', 'Admin', 'Platform', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
    `);
    
    console.log('Migration complete!', result);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

initAdmin();
