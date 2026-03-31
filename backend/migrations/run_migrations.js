const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tictac_db',
    charset: 'utf8mb4',
    multipleStatements: true
};

async function runMigration(sqlFile, description) {
    let connection;
    
    try {
        console.log(`\n🔄 ${description}...`);
        
        // Lire le fichier SQL
        const sqlContent = await fs.readFile(path.join(__dirname, sqlFile), 'utf8');
        
        // Connexion à la base de données
        connection = await mysql.createConnection(dbConfig);
        
        // Exécuter la migration
        await connection.execute(sqlContent);
        
        console.log(`✅ ${description} terminée avec succès!`);
        
    } catch (error) {
        console.error(`❌ Erreur lors de ${description}:`, error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function runAllMigrations() {
    try {
        console.log('🚀 Démarrage des migrations pour compléter la base de données Tictac...\n');
        
        // 1. Compléter les profils utilisateurs
        await runMigration('complete_user_profiles.sql', 'Complétion des profils utilisateurs');
        
        // 2. Activer les search sessions
        await runMigration('activate_search_sessions.sql', 'Activation des sessions de recherche');
        
        // 3. Créer les tables suggérées
        await runMigration('create_suggested_tables.sql', 'Création des tables suggérées');
        
        console.log('\n🎉 Toutes les migrations ont été exécutées avec succès!');
        
        // Vérification finale
        await verifyResults();
        
    } catch (error) {
        console.error('\n💥 Erreur lors des migrations:', error.message);
        process.exit(1);
    }
}

async function verifyResults() {
    let connection;
    
    try {
        console.log('\n🔍 Vérification des résultats après migrations...');
        
        connection = await mysql.createConnection(dbConfig);
        
        // Vérifier les profils utilisateurs
        const [userStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as users_with_email,
                COUNT(CASE WHEN first_name IS NOT NULL AND first_name != '' THEN 1 END) as users_with_firstname,
                COUNT(CASE WHEN last_name IS NOT NULL AND last_name != '' THEN 1 END) as users_with_lastname,
                COUNT(CASE WHEN city IS NOT NULL AND city != '' THEN 1 END) as users_with_city,
                COUNT(DISTINCT city) as unique_cities
            FROM users
        `);
        
        console.log('\n👥 Utilisateurs après migration:');
        console.log(`   Total: ${userStats[0].total_users}`);
        console.log(`   Avec email: ${userStats[0].users_with_email} (${((userStats[0].users_with_email / userStats[0].total_users) * 100).toFixed(1)}%)`);
        console.log(`   Avec nom complet: ${userStats[0].users_with_firstname} (${((userStats[0].users_with_firstname / userStats[0].total_users) * 100).toFixed(1)}%)`);
        console.log(`   Avec ville: ${userStats[0].users_with_city} (${((userStats[0].users_with_city / userStats[0].total_users) * 100).toFixed(1)}%)`);
        console.log(`   Villes uniques: ${userStats[0].unique_cities}`);
        
        // Vérifier les search sessions
        const [sessionStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_sessions,
                COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_sessions,
                COUNT(DISTINCT search_query) as unique_queries,
                AVG(results_count) as avg_results,
                MAX(created_at) as last_search
            FROM search_sessions
        `);
        
        console.log('\n🔍 Sessions de recherche après migration:');
        console.log(`   Total: ${sessionStats[0].total_sessions}`);
        console.log(`   Actives: ${sessionStats[0].active_sessions}`);
        console.log(`   Requêtes uniques: ${sessionStats[0].unique_queries}`);
        console.log(`   Résultats moyens: ${sessionStats[0].avg_results ? sessionStats[0].avg_results.toFixed(1) : 'N/A'}`);
        
        // Top des recherches
        const [topSearches] = await connection.execute(`
            SELECT search_query, COUNT(*) as count
            FROM search_sessions
            GROUP BY search_query
            ORDER BY count DESC
            LIMIT 5
        `);
        
        console.log('\n🏆 Top recherches:');
        topSearches.forEach(search => {
            console.log(`   ${search.search_query}: ${search.count} fois`);
        });
        
        // Vérifier les nouvelles tables
        const [newTables] = await connection.execute(`
            SELECT 
                'system_logs' as table_name, COUNT(*) as count FROM system_logs
            UNION ALL
            SELECT 'notifications' as table_name, COUNT(*) as count FROM notifications
            UNION ALL
            SELECT 'user_favorites' as table_name, COUNT(*) as count FROM user_favorites
            UNION ALL
            SELECT 'price_history' as table_name, COUNT(*) as count FROM price_history
            UNION ALL
            SELECT 'user_subscriptions' as table_name, COUNT(*) as count FROM user_subscriptions
            UNION ALL
            SELECT 'pharmacy_reviews' as table_name, COUNT(*) as count FROM pharmacy_reviews
            UNION ALL
            SELECT 'stock_alerts' as table_name, COUNT(*) as count FROM stock_alerts
            UNION ALL
            SELECT 'usage_reports' as table_name, COUNT(*) as count FROM usage_reports
        `);
        
        console.log('\n📊 Nouvelles tables créées:');
        newTables.forEach(table => {
            console.log(`   ${table.table_name}: ${table.count} enregistrements`);
        });
        
        // Vérifier les transactions
        const [transactionStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_transactions,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
                SUM(amount) as total_amount
            FROM transactions
        `);
        
        console.log('\n💳 Transactions après migration:');
        console.log(`   Total: ${transactionStats[0].total_transactions}`);
        console.log(`   Complétées: ${transactionStats[0].completed}`);
        console.log(`   En attente: ${transactionStats[0].pending}`);
        console.log(`   Échouées: ${transactionStats[0].failed}`);
        console.log(`   Montant total: ${transactionStats[0].total_amount || 0} XAF`);
        
        console.log('\n✅ Vérification terminée - Base de données maintenant complète!');
        
    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Exécuter toutes les migrations
runAllMigrations();
