const db = require('./config/database');
require('dotenv').config();

async function findRoles() {
  try {
    const roles = ['user', 'pharmacy', 'admin'];
    for (const role of roles) {
      const users = await db.query('SELECT phone, role FROM users WHERE role = ? LIMIT 1', [role]);
      if (users.length > 0) {
        console.log(`Role: ${role} | Phone: ${users[0].phone}`);
      } else {
        console.log(`Role: ${role} | No user found`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
findRoles();
