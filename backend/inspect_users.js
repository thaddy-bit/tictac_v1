const db = require('./config/database');
require('dotenv').config();

async function inspectUsers() {
  try {
    const users = await db.query('SELECT id, phone, first_name, last_name, role FROM users');
    console.log('--- USERS TABLE ---');
    console.table(users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

inspectUsers();
