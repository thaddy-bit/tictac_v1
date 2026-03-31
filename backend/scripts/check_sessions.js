const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tictac_db',
  charset: 'utf8mb4'
};

async function checkSessions() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    const [sessions] = await connection.execute('SELECT * FROM search_sessions ORDER BY created_at DESC LIMIT 5');
    console.log('=== Sessions de recherche actives ===');
    sessions.forEach(session => {
      const now = new Date();
      const expires = new Date(session.expires_at);
      const remaining = expires - now;
      const minutes = Math.floor(remaining / 60000);
      
      console.log(`Session ${session.id}: ${session.search_query}`);
      console.log(`Expires: ${session.expires_at} (dans ${minutes} minutes)`);
      console.log('---');
    });
    
    const [users] = await connection.execute('SELECT id, phone, first_name, last_name FROM users LIMIT 5');
    console.log('\n=== Utilisateurs disponibles ===');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Phone: ${user.phone}, Name: ${user.first_name} ${user.last_name}`);
    });
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

checkSessions();
