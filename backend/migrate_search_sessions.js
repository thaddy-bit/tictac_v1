const db = require('./config/database');
require('dotenv').config();

async function migrate() {
  try {
    console.log('--- RECONSTRUCTING search_sessions ---');
    await db.query('DROP TABLE IF EXISTS search_sessions');
    await db.query(`
      CREATE TABLE search_sessions (
        id VARCHAR(36) PRIMARY KEY,
        user_id INT NOT NULL,
        transaction_id INT,
        query_data TEXT NOT NULL,
        results_count INT DEFAULT 0,
        status ENUM('pending', 'completed', 'expired') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR)
      )
    `);
    console.log('✅ search_sessions table reconstructed successfully!');
    
    // Check if we need to add FKs (optional if user doesn't have strict mode, but better)
    try {
        await db.query('ALTER TABLE search_sessions ADD CONSTRAINT fk_user_sessions FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    } catch(e) { console.log('Notice: FK user_id might already exist or failed'); }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrate();
