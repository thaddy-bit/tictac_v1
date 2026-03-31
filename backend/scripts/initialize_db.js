const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tictac_db'
};

async function init() {
  let connection;
  try {
    // 1. Connexion initiale pour s'assurer que la DB existe
    const tempConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConn.end();

    connection = await mysql.createConnection(dbConfig);
    console.log('🚀 Démarrage de l\'initialisation de la base de données...');

    // 2. Table users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(100),
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        city VARCHAR(50),
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'pharmacy', 'admin') DEFAULT 'user',
        wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table users prête');

    // 3. Table medicaments
    await connection.query(`
      CREATE TABLE IF NOT EXISTS medicaments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        generic_name VARCHAR(255),
        category VARCHAR(100),
        description TEXT,
        price_range VARCHAR(100),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table medicaments prête');

    // 4. Table pharmacies
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pharmacies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(50),
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        phone VARCHAR(20),
        opening_hours TEXT,
        status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Table pharmacies prête');

    // 5. Table pharmacy_stocks
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pharmacy_stocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pharmacy_id INT NOT NULL,
        medicament_id INT NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        quantity INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
        FOREIGN KEY (medicament_id) REFERENCES medicaments(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table pharmacy_stocks prête');

    // 6. Table search_history
    await connection.query(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        query TEXT NOT NULL,
        results_count INT DEFAULT 0,
        is_unlocked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table search_history prête');

    // 7. Table payments
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        type ENUM('wallet_topup', 'search_unlock') NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
        transaction_id VARCHAR(100) UNIQUE,
        external_reference VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table payments prête');

    console.log('🏁 Initialisation terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

init();
