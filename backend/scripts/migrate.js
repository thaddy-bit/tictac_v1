const db = require('../config/database');

async function migrate() {
  try {
    // Add user_id to pharmacies
    try {
      await db.query('ALTER TABLE pharmacies ADD COLUMN user_id INT NULL');
      console.log('Added user_id to pharmacies');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('user_id already exists in pharmacies');
      else throw e;
    }

    // Create payouts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS payouts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pharmacy_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        period VARCHAR(50),
        reference VARCHAR(100),
        status ENUM('pending','completed','failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id)
      )
    `);
    console.log('payouts table ready');

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

migrate();
