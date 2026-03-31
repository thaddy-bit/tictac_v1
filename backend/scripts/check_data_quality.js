const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tictac_db',
  charset: 'utf8mb4'
};

async function checkDataQuality() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('=== Analyse de la qualité des données ===');
    
    // Vérifier les données manquantes importantes
    const [missingEmail] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE email IS NULL OR email = ""');
    console.log('Utilisateurs sans email:', missingEmail[0].count);
    
    const [missingNames] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE first_name IS NULL OR first_name = "" OR last_name IS NULL OR last_name = ""');
    console.log('Utilisateurs sans nom complet:', missingNames[0].count);
    
    const [missingPhone] = await connection.execute('SELECT COUNT(*) as count FROM pharmacies WHERE phone IS NULL OR phone = ""');
    console.log('Pharmacies sans téléphone:', missingPhone[0].count);
    
    const [missingAddress] = await connection.execute('SELECT COUNT(*) as count FROM pharmacies WHERE address IS NULL OR address = ""');
    console.log('Pharmacies sans adresse:', missingAddress[0].count);
    
    const [missingMedicamentNames] = await connection.execute('SELECT COUNT(*) as count FROM medicaments WHERE name IS NULL OR name = ""');
    console.log('Médicaments sans nom:', missingMedicamentNames[0].count);
    
    const [zeroStock] = await connection.execute('SELECT COUNT(*) as count FROM stocks WHERE quantity = 0');
    console.log('Stocks à zéro:', zeroStock[0].count);
    
    const [negativePrice] = await connection.execute('SELECT COUNT(*) as count FROM stocks WHERE price <= 0');
    console.log('Prix négatifs ou nuls:', negativePrice[0].count);
    
    console.log('\n=== Fonctionnalités avancées ===');
    
    // Vérifier l'utilisation des fonctionnalités avancées
    const [reviews] = await connection.execute('SELECT COUNT(*) as count FROM pharmacy_reviews');
    console.log('Avis pharmacies:', reviews[0].count);
    
    const [favorites] = await connection.execute('SELECT COUNT(*) as count FROM user_favorites');
    console.log('Favoris utilisateurs:', favorites[0].count);
    
    const [subscriptions] = await connection.execute('SELECT COUNT(*) as count FROM pharmacy_subscriptions');
    console.log('Abonnements pharmacies:', subscriptions[0].count);
    
    const [notifications] = await connection.execute('SELECT COUNT(*) as count FROM notifications');
    console.log('Notifications:', notifications[0].count);
    
    console.log('\n=== Distribution des données ===');
    
    // Distribution géographique
    const [cities] = await connection.execute('SELECT city, COUNT(*) as count FROM pharmacies GROUP BY city ORDER BY count DESC');
    console.log('Distribution par ville:');
    cities.forEach(city => {
      console.log('  ' + city.city + ': ' + city.count + ' pharmacies');
    });
    
    // Distribution des médicaments
    const [categories] = await connection.execute('SELECT category, COUNT(*) as count FROM medicaments GROUP BY category ORDER BY count DESC');
    console.log('\nDistribution des médicaments par catégorie:');
    categories.forEach(cat => {
      console.log('  ' + (cat.category || 'Non catégorisé') + ': ' + cat.count + ' médicaments');
    });
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

checkDataQuality();
