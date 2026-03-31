const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tictac_db',
  charset: 'utf8mb4'
};

async function checkTransactions() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    const [rows] = await connection.execute('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5');
    console.log('=== Transactions récentes ===');
    rows.forEach(row => {
      console.log(`ID: ${row.id}`);
      console.log(`Status: ${row.status}`);
      console.log(`Created: ${row.created_at}`);
      console.log(`Reference: ${row.mobile_money_ref}`);
      console.log(`User ID: ${row.user_id}`);
      console.log(`Amount: ${row.amount}`);
      console.log(`Search: ${row.medicament_search}`);
      console.log('---');
    });
    
    // Vérifier les transactions en attente
    const [pendingRows] = await connection.execute('SELECT * FROM transactions WHERE status = "pending" ORDER BY created_at DESC');
    console.log(`\n=== Transactions en attente: ${pendingRows.length} ===`);
    pendingRows.forEach(row => {
      const createdTime = new Date(row.created_at).getTime();
      const currentTime = Date.now();
      const timeDiff = (currentTime - createdTime) / 1000;
      
      console.log(`ID: ${row.id} - En attente depuis ${timeDiff}s`);
      console.log(`Reference: ${row.mobile_money_ref}`);
      console.log(`Created: ${row.created_at}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

checkTransactions();
