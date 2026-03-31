const mysql = require('mysql2/promise');
const fs = require('fs');

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tictac_db',
    charset: 'utf8mb4'
};

async function checkDatabaseStructure() {
    let connection;
    
    try {
        console.log('🔍 Vérification complète de la base de données Tictac...\n');
        
        // Connexion à la base de données
        connection = await mysql.createConnection(dbConfig);
        
        // 1. Lister toutes les tables
        console.log('📋 Tables existantes:');
        const [tables] = await connection.execute('SHOW TABLES');
        const existingTables = tables.map(row => Object.values(row)[0]);
        existingTables.forEach(table => console.log(`   ✅ ${table}`));
        
        // 2. Tables attendues selon le schéma
        const expectedTables = [
            'users',
            'pharmacies', 
            'medicaments',
            'stocks',
            'transactions',
            'search_sessions',
            'pharmacy_subscriptions'
        ];
        
        console.log('\n📊 Tables manquantes:');
        const missingTables = expectedTables.filter(table => !existingTables.includes(table));
        if (missingTables.length === 0) {
            console.log('   ✅ Aucune table manquante');
        } else {
            missingTables.forEach(table => console.log(`   ❌ ${table}`));
        }
        
        // 3. Vérification détaillée de chaque table
        console.log('\n🔍 Analyse détaillée des tables:');
        
        for (const table of existingTables) {
            console.log(`\n📋 Table: ${table}`);
            
            // Structure de la table
            const [structure] = await connection.execute(`DESCRIBE ${table}`);
            structure.forEach(col => {
                console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'} ${col.Key ? `[${col.Key}]` : ''}`);
            });
            
            // Nombre d'enregistrements
            const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`   📊 Enregistrements: ${count[0].count}`);
            
            // Vérification des index
            const [indexes] = await connection.execute(`SHOW INDEX FROM ${table}`);
            const uniqueIndexes = [...new Set(indexes.map(idx => idx.Key_name))];
            if (uniqueIndexes.length > 0) {
                console.log(`   🔑 Index: ${uniqueIndexes.join(', ')}`);
            }
        }
        
        // 4. Vérification des contraintes étrangères
        console.log('\n🔗 Contraintes étrangères:');
        const [constraints] = await connection.execute(`
            SELECT 
                TABLE_NAME,
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME,
                CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        
        if (constraints.length === 0) {
            console.log('   ⚠️  Aucune contrainte étrangère trouvée');
        } else {
            constraints.forEach(constraint => {
                console.log(`   🔗 ${constraint.TABLE_NAME}.${constraint.COLUMN_NAME} → ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`);
            });
        }
        
        // 5. Vérification des données par table
        console.log('\n📈 Analyse des données:');
        
        // Users
        if (existingTables.includes('users')) {
            const [userStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as users_with_email,
                    COUNT(CASE WHEN first_name IS NOT NULL AND first_name != '' THEN 1 END) as users_with_firstname,
                    COUNT(CASE WHEN last_name IS NOT NULL AND last_name != '' THEN 1 END) as users_with_lastname,
                    COUNT(CASE WHEN city IS NOT NULL AND city != '' THEN 1 END) as users_with_city
                FROM users
            `);
            console.log(`   👥 Users: ${userStats[0].total_users} total, ${userStats[0].users_with_email} avec email`);
        }
        
        // Pharmacies
        if (existingTables.includes('pharmacies')) {
            const [pharmacyStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_pharmacies,
                    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_pharmacies,
                    COUNT(CASE WHEN city IS NOT NULL AND city != '' THEN 1 END) as with_city,
                    COUNT(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 END) as with_coordinates,
                    COUNT(DISTINCT city) as unique_cities
                FROM pharmacies
            `);
            console.log(`   🏥 Pharmacies: ${pharmacyStats[0].total_pharmacies} total, ${pharmacyStats[0].active_pharmacies} actives`);
            console.log(`   🏙️ Villes: ${pharmacyStats[0].unique_cities} uniques`);
        }
        
        // Médicaments
        if (existingTables.includes('medicaments')) {
            const [medicamentStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_medicaments,
                    COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as with_description,
                    COUNT(CASE WHEN generic_name IS NOT NULL AND generic_name != '' THEN 1 END) as with_generic_name,
                    COUNT(CASE WHEN manufacturer IS NOT NULL AND manufacturer != '' THEN 1 END) as with_manufacturer,
                    COUNT(CASE WHEN category IS NOT NULL AND category != '' THEN 1 END) as with_category,
                    COUNT(DISTINCT category) as unique_categories
                FROM medicaments
            `);
            console.log(`   💊 Médicaments: ${medicamentStats[0].total_medicaments} total, ${medicamentStats[0].unique_categories} catégories`);
        }
        
        // Stocks
        if (existingTables.includes('stocks')) {
            const [stockStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_stocks,
                    COUNT(CASE WHEN quantity > 0 THEN 1 END) as in_stock,
                    COUNT(CASE WHEN quantity = 0 THEN 1 END) as out_of_stock,
                    COUNT(CASE WHEN quantity > 0 AND quantity < 5 THEN 1 END) as low_stock,
                    AVG(price) as avg_price,
                    SUM(quantity) as total_quantity
                FROM stocks
            `);
            console.log(`   📦 Stocks: ${stockStats[0].total_stocks} total, ${stockStats[0].in_stock} en stock`);
            console.log(`   💰 Prix moyen: ${stockStats[0].avg_price ? parseFloat(stockStats[0].avg_price).toFixed(2) : 'N/A'} XAF`);
        }
        
        // Transactions
        if (existingTables.includes('transactions')) {
            const [transactionStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_transactions,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
                    COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded,
                    SUM(amount) as total_amount,
                    AVG(amount) as avg_amount
                FROM transactions
            `);
            console.log(`   💳 Transactions: ${transactionStats[0].total_transactions} total, ${transactionStats[0].completed} complétées`);
            console.log(`   💰 Montant total: ${transactionStats[0].total_amount || 0} XAF`);
        }
        
        // Search sessions
        if (existingTables.includes('search_sessions')) {
            const [sessionStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_sessions,
                    COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_sessions,
                    AVG(results_count) as avg_results,
                    COUNT(DISTINCT search_query) as unique_queries
                FROM search_sessions
            `);
            console.log(`   🔍 Sessions: ${sessionStats[0].total_sessions} total, ${sessionStats[0].active_sessions} actives`);
        }
        
        // Pharmacy subscriptions
        if (existingTables.includes('pharmacy_subscriptions')) {
            const [subscriptionStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_subscriptions,
                    COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
                    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
                    COUNT(CASE WHEN plan_type = 'basic' THEN 1 END) as basic,
                    COUNT(CASE WHEN plan_type = 'premium' THEN 1 END) as premium
                FROM pharmacy_subscriptions
            `);
            console.log(`   📋 Abonnements: ${subscriptionStats[0].total_subscriptions} total, ${subscriptionStats[0].active} actifs`);
        }
        
        // 6. Vérification de l'intégrité des données
        console.log('\n🔍 Intégrité des données:');
        
        // Vérifier les stocks sans médicament
        if (existingTables.includes('stocks') && existingTables.includes('medicaments')) {
            const [orphanStocks] = await connection.execute(`
                SELECT COUNT(*) as count
                FROM stocks s
                LEFT JOIN medicaments m ON s.medicament_id = m.id
                WHERE m.id IS NULL
            `);
            if (orphanStocks[0].count > 0) {
                console.log(`   ⚠️  Stocks orphelins (sans médicament): ${orphanStocks[0].count}`);
            }
        }
        
        // Vérifier les stocks sans pharmacie
        if (existingTables.includes('stocks') && existingTables.includes('pharmacies')) {
            const [orphanStocks] = await connection.execute(`
                SELECT COUNT(*) as count
                FROM stocks s
                LEFT JOIN pharmacies p ON s.pharmacy_id = p.id
                WHERE p.id IS NULL
            `);
            if (orphanStocks[0].count > 0) {
                console.log(`   ⚠️  Stocks orphelins (sans pharmacie): ${orphanStocks[0].count}`);
            }
        }
        
        // 7. Suggestions d'amélioration
        console.log('\n💡 Suggestions d\'amélioration:');
        
        if (missingTables.length > 0) {
            console.log('   🔧 Créer les tables manquantes');
        }
        
        if (existingTables.includes('stocks') && existingTables.includes('medicaments')) {
            const [duplicateStocks] = await connection.execute(`
                SELECT medicament_id, pharmacy_id, COUNT(*) as count
                FROM stocks
                GROUP BY medicament_id, pharmacy_id
                HAVING COUNT(*) > 1
            `);
            if (duplicateStocks.length > 0) {
                console.log('   🔧 Nettoyer les stocks en double');
            }
        }
        
        if (!existingTables.includes('logs') || !existingTables.includes('audit_logs')) {
            console.log('   🔧 Ajouter des tables de logs/audit');
        }
        
        console.log('\n✅ Vérification terminée!');
        
    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Exécuter la vérification
checkDatabaseStructure();
