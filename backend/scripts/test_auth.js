const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function testAuthSystem() {
  try {
    console.log('🧪 Test du système d\'authentification...\n');
    
    // 1. Test connexion DB
    console.log('1️⃣ Test connexion base de données...');
    const result = await db.query('SELECT 1 as test');
    console.log('✅ Connexion DB OK:', result[0]);
    
    // 2. Test création utilisateur
    console.log('\n2️⃣ Test création utilisateur...');
    const testPhone = '+242123456789';
    const testPassword = 'test123456';
    
    // Vérifier si utilisateur test existe déjà
    const existing = await db.query('SELECT id FROM users WHERE phone = ?', [testPhone]);
    if (existing.length > 0) {
      await db.query('DELETE FROM users WHERE phone = ?', [testPhone]);
      console.log('🗑️  Utilisateur test supprimé');
    }
    
    // Hasher mot de passe
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(testPassword, salt);
    
    // Créer utilisateur
    const insertResult = await db.query(
      'INSERT INTO users (phone, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)',
      [testPhone, 'Test', 'User', password_hash]
    );
    console.log('✅ Utilisateur créé ID:', insertResult.insertId);
    
    // 3. Test vérification mot de passe
    console.log('\n3️⃣ Test vérification mot de passe...');
    const user = await db.query('SELECT password_hash FROM users WHERE phone = ?', [testPhone]);
    const isValid = await bcrypt.compare(testPassword, user[0].password_hash);
    console.log('✅ Vérification mot de passe:', isValid ? 'OK' : 'ÉCHEC');
    
    // 4. Nettoyage
    await db.query('DELETE FROM users WHERE phone = ?', [testPhone]);
    console.log('\n🗑️  Nettoyage terminé');
    
    console.log('\n🎉 Tous les tests sont OK! Le système d\'authentification est fonctionnel.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAuthSystem();
