-- =====================================================
-- 📋 MIGRATION: CRÉER LES TABLES SUGGÉRÉES
-- =====================================================

-- 1. Table des logs système
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('info', 'warning', 'error', 'debug') NOT NULL,
    message TEXT NOT NULL,
    context JSON,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_created (created_at),
    INDEX idx_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. Table des logs d'audit
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    user_id INT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_user_date (user_id, created_at),
    INDEX idx_action (action),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('payment', 'search', 'system', 'promotion') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSON,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_type (type),
    INDEX idx_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Table des favoris utilisateurs
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    medicament_id INT NOT NULL,
    pharmacy_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_medicament_pharmacy (user_id, medicament_id, pharmacy_id),
    INDEX idx_user (user_id),
    INDEX idx_medicament (medicament_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (medicament_id) REFERENCES medicaments(id) ON DELETE CASCADE,
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE SET NULL
);

-- 5. Table de l'historique des prix
CREATE TABLE IF NOT EXISTS price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT NOT NULL,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    price_change DECIMAL(10,2) GENERATED ALWAYS AS (new_price - old_price) STORED,
    percentage_change DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN old_price > 0 THEN ((new_price - old_price) / old_price) * 100 ELSE 0 END) STORED,
    changed_by INT NULL,
    reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_stock_date (stock_id, created_at),
    INDEX idx_date (created_at),
    INDEX idx_percentage_change (percentage_change),
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Table des abonnements utilisateurs (pour futures fonctionnalités)
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_type ENUM('free', 'basic', 'premium') NOT NULL DEFAULT 'free',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
    auto_renew BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(50) NULL,
    last_payment_at TIMESTAMP NULL,
    next_billing_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_status (user_id, status),
    INDEX idx_end_date (end_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Table des avis sur les pharmacies
CREATE TABLE IF NOT EXISTS pharmacy_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NULL,
    comment TEXT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_pharmacy (user_id, pharmacy_id),
    INDEX idx_pharmacy_rating (pharmacy_id, rating),
    INDEX idx_created (created_at),
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Table des alertes de stock
CREATE TABLE IF NOT EXISTS stock_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_id INT NOT NULL,
    medicament_id INT NOT NULL,
    alert_type ENUM('low_stock', 'out_of_stock', 'price_change', 'new_product') NOT NULL,
    threshold_value INT NULL,
    current_value INT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pharmacy_medicament (pharmacy_id, medicament_id),
    INDEX idx_type_active (alert_type, is_active),
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
    FOREIGN KEY (medicament_id) REFERENCES medicaments(id) ON DELETE CASCADE
);

-- 9. Table des rapports d'utilisation
CREATE TABLE IF NOT EXISTS usage_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_date DATE NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value BIGINT NOT NULL,
    additional_data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date_metric (report_date, metric_name),
    INDEX idx_date (report_date),
    INDEX idx_metric (metric_name)
);

-- 10. Insérer des données de test pour les nouvelles tables

-- Notifications de test
INSERT IGNORE INTO notifications (user_id, type, title, message, data) VALUES
(1, 'system', 'Bienvenue sur Tictac', 'Merci de vous inscrire sur Tictac Platform!', '{"welcome": true}'),
(1, 'search', 'Recherche populaire', 'Le paracétamol est le médicament le plus recherché', '{"medicament": "paracetamol"}'),
(2, 'payment', 'Paiement confirmé', 'Votre paiement de 500 XAF a été confirmé', '{"amount": 500, "status": "completed"}'),
(3, 'promotion', 'Offre spéciale', '10% de réduction sur votre prochaine recherche', '{"discount": 10}');

-- Favoris de test
INSERT IGNORE INTO user_favorites (user_id, medicament_id, pharmacy_id) VALUES
(1, 1, 1), -- Paracétamol à Pharmacie du Centre
(1, 2, 2), -- Amoxicilline à Pharmacie de la Mairie
(2, 1, 1), -- Paracétamol à Pharmacie du Centre
(2, 3, 3), -- Ibuprofène à Pharmacie Pointe-Noire
(3, 4, 1); -- Doxycycline à Pharmacie du Centre

-- Historique de prix de test
INSERT IGNORE INTO price_history (stock_id, old_price, new_price, reason) VALUES
(1, 500.00, 450.00, 'Promotion spéciale'),
(2, 2500.00, 2600.00, 'Ajustement inflation'),
(3, 800.00, 750.00, 'Offre concurrentielle'),
(4, 1500.00, 1550.00, 'Augmentation de coût'),
(5, 300.00, 320.00, 'Nouveau tarif');

-- Abonnements utilisateurs de test
INSERT IGNORE INTO user_subscriptions (user_id, plan_type, start_date, end_date, status) VALUES
(1, 'basic', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'active'),
(2, 'free', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'active'),
(3, 'premium', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'active');

-- Avis sur pharmacies de test
INSERT IGNORE INTO pharmacy_reviews (pharmacy_id, user_id, rating, title, comment) VALUES
(1, 1, 5, 'Excellent service', 'Pharmacie très professionnelle avec des médicaments toujours disponibles.'),
(2, 2, 4, 'Bon service', 'Personnel compétent et horaires respectés.'),
(3, 3, 5, 'Recommandée', 'Très satisfaite de leurs services.'),
(1, 2, 3, 'Correct', 'Service correct mais parfois des ruptures de stock.');

-- Alertes de stock de test
INSERT IGNORE INTO stock_alerts (pharmacy_id, medicament_id, alert_type, threshold_value, current_value, message) VALUES
(1, 1, 'low_stock', 10, 8, 'Stock faible de Paracétamol'),
(2, 2, 'price_change', NULL, NULL, 'Changement de prix détecté pour Amoxicilline'),
(3, 3, 'new_product', NULL, NULL, 'Nouveau médicament disponible');

-- Logs système de test
INSERT IGNORE INTO system_logs (level, message, context, user_id) VALUES
('info', 'Utilisateur connecté', '{"action": "login", "ip": "127.0.0.1"}', 1),
('warning', 'Tentative de connexion échouée', '{"action": "login_failed", "phone": "+24200000000"}', NULL),
('error', 'Erreur de paiement', '{"error": "token_invalid", "transaction_id": 123}', 2),
('info', 'Nouvelle recherche effectuée', '{"query": "paracetamol", "results": 16}', 1);

-- Logs d'audit de test
INSERT IGNORE INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id) VALUES
('users', 1, 'UPDATE', '{"email": null}', '{"email": "jean.mboussi@tictac.cg"}', 1),
('stocks', 1, 'UPDATE', '{"price": 500.00}', '{"price": 450.00}', 1),
('pharmacies', 1, 'UPDATE', '{"phone": "+24200000000"}', '{"phone": "+242061234567"}', 1);

-- Rapports d'utilisation de test
INSERT IGNORE INTO usage_reports (report_date, metric_name, metric_value, additional_data) VALUES
(CURDATE(), 'daily_searches', 25, '{"unique_users": 5}'),
(CURDATE(), 'daily_transactions', 3, '{"total_amount": 1500}'),
(CURDATE(), 'active_users', 6, '{"new_users": 2}'),
(CURDATE(), 'pharmacy_views', 45, '{"top_pharmacy": 1}');

-- Vérification des nouvelles tables
SELECT 
    'system_logs' as table_name, COUNT(*) as record_count FROM system_logs
UNION ALL
SELECT 
    'audit_logs' as table_name, COUNT(*) as record_count FROM audit_logs
UNION ALL
SELECT 
    'notifications' as table_name, COUNT(*) as record_count FROM notifications
UNION ALL
SELECT 
    'user_favorites' as table_name, COUNT(*) as record_count FROM user_favorites
UNION ALL
SELECT 
    'price_history' as table_name, COUNT(*) as record_count FROM price_history
UNION ALL
SELECT 
    'user_subscriptions' as table_name, COUNT(*) as record_count FROM user_subscriptions
UNION ALL
SELECT 
    'pharmacy_reviews' as table_name, COUNT(*) as record_count FROM pharmacy_reviews
UNION ALL
SELECT 
    'stock_alerts' as table_name, COUNT(*) as record_count FROM stock_alerts
UNION ALL
SELECT 
    'usage_reports' as table_name, COUNT(*) as record_count FROM usage_reports;
