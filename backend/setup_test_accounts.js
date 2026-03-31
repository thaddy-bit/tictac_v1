const db = require('./config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupAccounts() {
  const password = '123456';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const testUsers = [
    { phone: '+242068373874', role: 'user', first_name: 'Client', last_name: 'Test' },
    { phone: '+242065555555', role: 'pharmacy', first_name: 'Pharmacie', last_name: 'Centrale' },
    { phone: '+242061234001', role: 'admin', first_name: 'Paul', last_name: 'Admin' }
  ];

  try {
    for (const u of testUsers) {
      // Check if exists
      const existing = await db.query('SELECT id FROM users WHERE phone = ?', [u.phone]);
      if (existing.length > 0) {
        // Update password and role
        await db.query(
          'UPDATE users SET password_hash = ?, role = ?, first_name = ?, last_name = ? WHERE phone = ?',
          [hash, u.role, u.first_name, u.last_name, u.phone]
        );
        console.log(`Updated: ${u.role} (${u.phone})`);
      } else {
        // Create new
        await db.query(
          'INSERT INTO users (phone, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
          [u.phone, hash, u.role, u.first_name, u.last_name]
        );
        console.log(`Created: ${u.role} (${u.phone})`);
      }
    }
    console.log('\nSetup complete. Password for all: 123456');
  } catch (err) {
    console.error('Setup failed:', err);
  } finally {
    process.exit();
  }
}

setupAccounts();
