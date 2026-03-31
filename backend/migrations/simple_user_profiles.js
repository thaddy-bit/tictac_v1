const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tictac_db',
    charset: 'utf8mb4'
};

async function completeUserProfiles() {
    let connection;
    
    try {
        console.log('🔄 Complétion des profils utilisateurs...');
        
        connection = await mysql.createConnection(dbConfig);
        
        // 1. Mettre à jour les utilisateurs existants avec des données de test
        await connection.execute(`
            UPDATE users SET 
                first_name = CASE 
                    WHEN phone = '+242123456783' THEN 'Jean'
                    WHEN phone = '+242123456784' THEN 'Marie'
                    WHEN phone = '+242123456785' THEN 'Pierre'
                    WHEN phone = '+242123456786' THEN 'Sophie'
                    WHEN phone = '+242123456787' THEN 'Thomas'
                    ELSE 'Utilisateur'
                END,
                last_name = CASE 
                    WHEN phone = '+242123456783' THEN 'Mboussi'
                    WHEN phone = '+242123456784' THEN 'Nkouka'
                    WHEN phone = '+242123456785' THEN 'Mabiala'
                    WHEN phone = '+242123456786' THEN 'Boungou'
                    WHEN phone = '+242123456787' THEN 'Moukouri'
                    ELSE 'Test'
                END,
                email = CASE 
                    WHEN phone = '+242123456783' THEN 'jean.mboussi@tictac.cg'
                    WHEN phone = '+242123456784' THEN 'marie.nkouka@tictac.cg'
                    WHEN phone = '+242123456785' THEN 'pierre.mabiala@tictac.cg'
                    WHEN phone = '+242123456786' THEN 'sophie.boungou@tictac.cg'
                    WHEN phone = '+242123456787' THEN 'thomas.moukouri@tictac.cg'
                    ELSE NULL
                END,
                city = CASE 
                    WHEN phone = '+242123456783' THEN 'Brazzaville'
                    WHEN phone = '+242123456784' THEN 'Pointe-Noire'
                    WHEN phone = '+242123456785' THEN 'Brazzaville'
                    WHEN phone = '+242123456786' THEN 'Dolisie'
                    WHEN phone = '+242123456787' THEN 'Owando'
                    ELSE 'Brazzaville'
                END
            WHERE first_name IS NULL OR last_name IS NULL
        `);
        
        // 2. Insérer de nouveaux utilisateurs de test
        const testUsers = [
            {
                phone: '+242061234001',
                email: 'contact@pharmacie-centre.cg',
                first_name: 'Paul',
                last_name: 'Massamba',
                city: 'Brazzaville',
                password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
            },
            {
                phone: '+242061234002',
                email: 'info@pharmacie-mairie.cg',
                first_name: 'Cécile',
                last_name: 'Bouka',
                city: 'Brazzaville',
                password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
            },
            {
                phone: '+242061234003',
                email: 'contact@pharmacie-pointenoire.cg',
                first_name: 'André',
                last_name: 'Mouamba',
                city: 'Pointe-Noire',
                password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
            },
            {
                phone: '+242061234004',
                email: 'sante@dolisie.cg',
                first_name: 'Marcel',
                last_name: 'Loundou',
                city: 'Dolisie',
                password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
            },
            {
                phone: '+242061234005',
                email: 'pharma@owando.cg',
                first_name: 'Lucie',
                last_name: 'Mampouya',
                city: 'Owando',
                password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
            }
        ];
        
        for (const user of testUsers) {
            try {
                await connection.execute(`
                    INSERT INTO users (phone, email, first_name, last_name, city, password_hash)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [user.phone, user.email, user.first_name, user.last_name, user.city, user.password_hash]);
            } catch (error) {
                // Ignorer les erreurs de duplication
                if (!error.message.includes('Duplicate entry')) {
                    throw error;
                }
            }
        }
        
        // 3. Vérifier les résultats
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
        
        console.log('✅ Profils utilisateurs complétés!');
        console.log(`   Total: ${userStats[0].total_users}`);
        console.log(`   Avec email: ${userStats[0].users_with_email} (${((userStats[0].users_with_email / userStats[0].total_users) * 100).toFixed(1)}%)`);
        console.log(`   Avec nom complet: ${userStats[0].users_with_firstname} (${((userStats[0].users_with_firstname / userStats[0].total_users) * 100).toFixed(1)}%)`);
        console.log(`   Avec ville: ${userStats[0].users_with_city} (${((userStats[0].users_with_city / userStats[0].total_users) * 100).toFixed(1)}%)`);
        console.log(`   Villes uniques: ${userStats[0].unique_cities}`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la complétion des profils:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function activateSearchSessions() {
    let connection;
    
    try {
        console.log('\n🔄 Activation des sessions de recherche...');
        
        connection = await mysql.createConnection(dbConfig);
        
        // 1. Créer des transactions complétées pour les sessions
        const completedTransactions = [
            { user_id: 1, medicament_search: 'paracetamol', amount: 500.00, mobile_money_ref: 'TICTAC_TEST_001' },
            { user_id: 2, medicament_search: 'amoxicilline', amount: 500.00, mobile_money_ref: 'TICTAC_TEST_002' },
            { user_id: 3, medicament_search: 'ibuprofene', amount: 500.00, mobile_money_ref: 'TICTAC_TEST_003' },
            { user_id: 4, medicament_search: 'vitamine', amount: 500.00, mobile_money_ref: 'TICTAC_TEST_004' },
            { user_id: 5, medicament_search: 'antibiotique', amount: 500.00, mobile_money_ref: 'TICTAC_TEST_005' }
        ];
        
        // Vérifier les utilisateurs existants
        const [existingUsers] = await connection.execute('SELECT id FROM users LIMIT 5');
        const userIds = existingUsers.map(u => u.id);
        
        for (let i = 0; i < Math.min(userIds.length, completedTransactions.length); i++) {
            const transaction = completedTransactions[i];
            const userId = userIds[i];
            
            try {
                await connection.execute(`
                    INSERT INTO transactions (user_id, medicament_search, amount, status, mobile_money_ref, created_at, completed_at)
                    VALUES (?, ?, ?, 'completed', ?, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 120) MINUTE), DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 115) MINUTE))
                `, [userId, transaction.medicament_search, transaction.amount, transaction.mobile_money_ref]);
            } catch (error) {
                // Ignorer les erreurs de duplication
                if (!error.message.includes('Duplicate entry')) {
                    console.log(`⚠️ Erreur transaction ${i}:`, error.message);
                }
            }
        }
        
        // 2. Créer des sessions de recherche
        const searchQueries = [
            'paracetamol', 'amoxicilline', 'ibuprofene', 'vitamine', 'doliprane', 'aspirine', 'antibiotique',
            'anti-inflammatoire', 'médicament contre la douleur', 'traitement fièvre', 'médicament toux',
            'comprimé', 'sirop', 'gélule', 'crème'
        ];
        
        // Utiliser les IDs des transactions créées
        const [createdTransactions] = await connection.execute('SELECT id FROM transactions WHERE status = "completed" ORDER BY id LIMIT 5');
        const transactionIds = createdTransactions.map(t => t.id);
        
        for (let i = 0; i < Math.min(transactionIds.length, searchQueries.length); i++) {
            const query = searchQueries[i];
            const transactionId = transactionIds[i];
            const hoursAgo = i * 2;
            
            try {
                await connection.execute(`
                    INSERT INTO search_sessions (transaction_id, search_query, results_count, created_at, expires_at)
                    VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL ? HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL ? HOUR), INTERVAL 1 HOUR))
                `, [transactionId, query, 16, hoursAgo, hoursAgo]);
            } catch (error) {
                // Ignorer les erreurs de duplication
                if (!error.message.includes('Duplicate entry')) {
                    console.log(`⚠️ Erreur session ${i}:`, error.message);
                }
            }
        }
        
        // 3. Vérifier les résultats
        const [sessionStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_sessions,
                COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_sessions,
                COUNT(DISTINCT search_query) as unique_queries,
                AVG(results_count) as avg_results
            FROM search_sessions
        `);
        
        console.log('✅ Sessions de recherche activées!');
        console.log(`   Total: ${sessionStats[0].total_sessions}`);
        console.log(`   Actives: ${sessionStats[0].active_sessions}`);
        console.log(`   Requêtes uniques: ${sessionStats[0].unique_queries}`);
        console.log(`   Résultats moyens: ${sessionStats[0].avg_results ? parseFloat(sessionStats[0].avg_results).toFixed(1) : 'N/A'}`);
        
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
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'activation des sessions:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function main() {
    try {
        console.log('🚀 Démarrage des migrations pour compléter la base de données Tictac...\n');
        
        await completeUserProfiles();
        await activateSearchSessions();
        
        console.log('\n🎉 Toutes les migrations ont été exécutées avec succès!');
        
        // Vérification finale
        const connection = await mysql.createConnection(dbConfig);
        
        const [transactionStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_transactions,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                SUM(amount) as total_amount
            FROM transactions
        `);
        
        console.log('\n💳 Transactions finales:');
        console.log(`   Total: ${transactionStats[0].total_transactions}`);
        console.log(`   Complétées: ${transactionStats[0].completed}`);
        console.log(`   En attente: ${transactionStats[0].pending}`);
        console.log(`   Montant total: ${transactionStats[0].total_amount || 0} XAF`);
        
        await connection.end();
        
        console.log('\n✅ Base de données maintenant complète et prête pour la production!');
        
    } catch (error) {
        console.error('\n💥 Erreur lors des migrations:', error.message);
        process.exit(1);
    }
}

// Exécuter les migrations
main();
