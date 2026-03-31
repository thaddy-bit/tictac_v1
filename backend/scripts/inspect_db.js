const mysql = require('mysql2/promise');
require('dotenv').config();

async function inspectTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Inspecting pharmacies table...');
    const [rows] = await connection.query("DESCRIBE pharmacies");
    console.table(rows);
  } catch (error) {
    console.error('Inspection failed:', error);
  } finally {
    await connection.end();
  }
}

inspectTable();
