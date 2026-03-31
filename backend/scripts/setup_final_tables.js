const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tictac_db'
};

async function setup() {
  const connection = await mysql.createConnection(dbConfig);
  console.log('🚀 Démarrage de la mise à jour finale de la base de données...');

  try {
    // 1. Table Support Tickets
    await connection.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'open', 'resolved', 'closed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table support_tickets créée');

    // 2. Table Payouts (Versements aux pharmacies)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payouts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pharmacy_id INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        period VARCHAR(50),
        reference VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (pharmacy_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table payouts créée');

    // 3. Table Notifications
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table notifications créée');

    // 4. Données de test (Support)
    const [users] = await connection.query('SELECT id FROM users LIMIT 3');
    if (users.length > 0) {
        await connection.query(`
            INSERT INTO support_tickets (user_id, subject, message, status) VALUES
            (?, 'Problème de recharge MoMo', 'Mon compte n\\\'a pas été crédité après le paiement.', 'new'),
            (?, 'Pharmacie introuvable', 'La pharmacie centrale n\\\'apparaît pas sur la carte.', 'open')
        `, [users[0].id, users[0].id]);
        console.log('✅ Données de test support_tickets insérées');
    }

    // 5. Données de test (Payouts)
    const [pharmacies] = await connection.query('SELECT id FROM users WHERE role = "pharmacy" LIMIT 2');
    if (pharmacies.length > 0) {
        await connection.query(`
            INSERT INTO payouts (pharmacy_id, amount, status, period, reference) VALUES
            (?, 450000.00, 'completed', 'Février 2026', 'PAY-FEV-001'),
            (?, 125000.00, 'pending', 'Mars 2026', 'PAY-MAR-002')
        `, [pharmacies[0].id, pharmacies[0].id]);
        console.log('✅ Données de test payouts insérées');
    }

    console.log('🏁 Mise à jour de la base de données terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await connection.end();
  }
}

setup();
