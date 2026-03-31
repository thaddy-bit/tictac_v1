const db = require('./config/database');
const fs = require('fs');

async function setupUsersTable() {
  try {
    console.log('🔍 Vérification de la table users...');
    
    // Vérifier si la table existe
    const tables = await db.query('SHOW TABLES LIKE "users"');
    
    if (tables.length === 0) {
      console.log('📝 Création de la table users...');
      
      // Lire le fichier SQL
      const sql = fs.readFileSync('./create_users_table.sql', 'utf8');
      
      // Exécuter la création
      await db.query(sql);
      
      console.log('✅ Table users créée avec succès!');
    } else {
      console.log('✅ Table users existe déjà');
    }
    
    // Vérifier la structure
    const structure = await db.query('DESCRIBE users');
    console.log('📋 Structure de la table users:');
    structure.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  }
}

setupUsersTable();
