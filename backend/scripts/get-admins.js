const db = require('../config/database');
(async () => {
  const rows = await db.query("SELECT id, phone, email, first_name, last_name, role, password_hash FROM users WHERE role = 'admin'");
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
})();
