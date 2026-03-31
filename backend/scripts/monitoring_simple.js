const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Route pour tous les KPIs (utilisée par le frontend)
router.get('/kpi/all', async (req, res) => {
    try {
        const kpis = {
            pharmacies: {
                total: 0,
                active: 0,
                inactive: 0,
                updated_24h: 0,
                by_city: []
            },
            medicaments: {
                total: 0,
                out_of_stock: 0,
                low_stock: 0,
                in_stock: 0,
                avg_price: 0,
                total_stock: 0,
                by_category: [],
                top_expensive: []
            },
            transactions: {
                total: 0,
                completed: 0,
                pending: 0,
                failed: 0,
                refunded: 0,
                total_amount: 0,
                avg_amount: 0,
                last_24h: 0,
                last_1h: 0,
                hourly: [],
                completion_rate: '0%'
            },
            searches: {
                total: 0,
                avg_results: 0,
                successful: 0,
                success_rate: '0%',
                last_24h: 0,
                active_sessions: 0,
                top_queries: []
            },
            subscriptions: {
                total: 0,
                basic: 0,
                premium: 0,
                active: 0,
                expired: 0,
                cancelled: 0,
                expiring_soon: 0
            },
            system: {
                server_time: new Date().toISOString(),
                mysql_version: 'MySQL/MariaDB',
                hostname: require('os').hostname(),
                uptime: Math.floor(process.uptime()),
                cpu_load: require('os').loadavg()[0].toFixed(2),
                memory_usage: ((1 - require('os').freemem() / require('os').totalmem()) * 100).toFixed(1),
                mysql_threads: 0,
                mysql_slow_queries: 0
            }
        };

        // Récupérer le statut MySQL
        try {
            const mysqlStatus = await db.query("SHOW STATUS WHERE Variable_name IN ('Threads_connected', 'Slow_queries')");
            mysqlStatus.forEach(row => {
                if (row.Variable_name === 'Threads_connected') kpis.system.mysql_threads = parseInt(row.Value);
                if (row.Variable_name === 'Slow_queries') kpis.system.mysql_slow_queries = parseInt(row.Value);
            });
        } catch (e) {
            console.error('Erreur Statut MySQL:', e.message);
        }

        // Récupérer les pharmacies
        try {
            const rows = await db.query('SELECT COUNT(*) as total FROM pharmacies');
            if (rows && rows.length > 0) {
                kpis.pharmacies.total = rows[0].total;
                kpis.pharmacies.active = rows[0].total; // Par défaut toutes actives si pas de status
            }

            const cities = await db.query(`
                SELECT city, COUNT(*) as count_by_city 
                FROM pharmacies 
                WHERE city IS NOT NULL 
                GROUP BY city
                LIMIT 10
            `);
            if (cities) {
                kpis.pharmacies.by_city = cities;
            }
        } catch (error) {
            console.error('Erreur pharmacies:', error.message);
        }

        // Récupérer les médicaments et stocks
        try {
            const rows = await db.query(`
                SELECT 
                    (SELECT COUNT(*) FROM medicaments) as total,
                    SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END) as out_of_stock,
                    SUM(CASE WHEN quantity > 0 AND quantity <= 10 THEN 1 ELSE 0 END) as low_stock,
                    SUM(CASE WHEN quantity > 10 THEN 1 ELSE 0 END) as in_stock,
                    AVG(price) as avg_price,
                    SUM(quantity) as total_stock
                FROM stocks
            `);
            if (rows && rows.length > 0) {
                const medStats = rows[0];
                kpis.medicaments.total = medStats.total || 0;
                kpis.medicaments.out_of_stock = medStats.out_of_stock || 0;
                kpis.medicaments.low_stock = medStats.low_stock || 0;
                kpis.medicaments.in_stock = medStats.in_stock || 0;
                kpis.medicaments.avg_price = parseFloat(medStats.avg_price || 0);
                kpis.medicaments.total_stock = medStats.total_stock || 0;
            }

            const categories = await db.query(`
                SELECT category, COUNT(*) as count_by_category 
                FROM medicaments 
                WHERE category IS NOT NULL 
                GROUP BY category 
                LIMIT 8
            `);
            kpis.medicaments.by_category = categories;

            const expensive = await db.query(`
                SELECT m.name, s.price, p.name as pharmacy_name 
                FROM medicaments m
                JOIN stocks s ON m.id = s.medicament_id
                JOIN pharmacies p ON s.pharmacy_id = p.id
                ORDER BY s.price DESC 
                LIMIT 10
            `);
            kpis.medicaments.top_expensive = expensive;
        } catch (error) {
            console.error('Erreur médicaments:', error.message);
        }

        // Récupérer les transactions
        try {
            const rows = await db.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
                    SUM(amount) as total_amount
                FROM transactions
            `);
            
            if (rows && rows.length > 0) {
                const stats = rows[0];
                kpis.transactions.total = stats.total || 0;
                kpis.transactions.completed = stats.completed || 0;
                kpis.transactions.pending = stats.pending || 0;
                kpis.transactions.failed = stats.failed || 0;
                kpis.transactions.total_amount = parseFloat(stats.total_amount || 0);
                kpis.transactions.avg_amount = stats.total > 0 ? parseFloat(stats.total_amount || 0) / stats.total : 0;
                
                const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0';
                kpis.transactions.completion_rate = completionRate;
            }

            const hourly = await db.query(`
                SELECT HOUR(created_at) as hour, COUNT(*) as count, SUM(amount) as amount
                FROM transactions
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                GROUP BY HOUR(created_at)
                ORDER BY hour
            `);
            kpis.transactions.hourly = hourly;
        } catch (error) {
            console.error('Erreur transactions:', error.message);
        }

        // Récupérer les recherches
        try {
            const searchStats = await db.query(`
                SELECT 
                    COUNT(*) as total,
                    AVG(results_count) as avg_results,
                    SUM(CASE WHEN results_count > 0 THEN 1 ELSE 0 END) as successful
                FROM search_sessions
            `);
            if (searchStats && searchStats[0]) {
                const s = searchStats[0];
                kpis.searches.total = s.total || 0;
                kpis.searches.avg_results = parseFloat(s.avg_results || 0);
                kpis.searches.successful = s.successful || 0;
                kpis.searches.success_rate = s.total > 0 ? ((s.successful / s.total) * 100).toFixed(1) : '0';
            }

            const topQueries = await db.query(`
                SELECT search_query, COUNT(*) as count, AVG(results_count) as avg_results
                FROM search_sessions
                GROUP BY search_query
                ORDER BY count DESC
                LIMIT 10
            `);
            kpis.searches.top_queries = topQueries;
        } catch (error) {
            console.error('Erreur recherches:', error.message);
        }

        // Récupérer les abonnements
        try {
            const subStats = await db.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN plan_type = 'basic' THEN 1 ELSE 0 END) as basic,
                    SUM(CASE WHEN plan_type = 'premium' THEN 1 ELSE 0 END) as premium,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                    SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
                    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
                FROM pharmacy_subscriptions
            `);
            if (subStats && subStats[0]) {
                Object.assign(kpis.subscriptions, subStats[0]);
            }
        } catch (error) {
            console.error('Erreur abonnements:', error.message);
        }

        res.json({
            success: true,
            data: kpis
        });
    } catch (error) {
        console.error('Erreur KPI all:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Route de santé pour le monitoring
router.get('/health', async (req, res) => {
    try {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router;
