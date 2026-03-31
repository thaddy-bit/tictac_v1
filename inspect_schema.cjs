const db = require('./backend/config/database');
require('dotenv').config({ path: './backend/.env' });

async function inspectSchema() {
  try {
    const tables = ['search_sessions', 'transactions'];
    for (const table of tables) {
      const result = await db.query(`SHOW CREATE TABLE ${table}`);
      console.log(`Schema for ${table}:`);
      console.log(result[0]['Create Table']);
      console.log('---');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

inspectSchema();
