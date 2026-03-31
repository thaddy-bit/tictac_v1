const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Adding columns to pharmacies table...');
    await connection.query("ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS type ENUM('jour', 'nuit', 'mixte', 'garde') DEFAULT 'jour'");
    await connection.query("ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS is_on_garde BOOLEAN DEFAULT FALSE");
    
    console.log('Updating some test data...');
    // Mettre quelques pharmacies en 'mixte' (24/7) pour les tests
    await connection.query("UPDATE pharmacies SET type = 'mixte' LIMIT 3");
    // Mettre une pharmacie en 'garde'
    await connection.query("UPDATE pharmacies SET type = 'garde', is_on_garde = TRUE LIMIT 1");
    
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
