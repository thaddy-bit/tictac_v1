-- =====================================================
-- 📋 MIGRATION: ACTIVER LES SEARCH SESSIONS
-- =====================================================

-- 1. Créer des sessions de recherche de test basées sur les médicaments existants
INSERT INTO search_sessions (transaction_id, search_query, results_count, created_at, expires_at)
SELECT 
    1 as transaction_id,
    m.name as search_query,
    COUNT(s.id) as results_count,
    NOW() as created_at,
    DATE_ADD(NOW(), INTERVAL 1 HOUR) as expires_at
FROM medicaments m
JOIN stocks s ON m.id = s.medicament_id
WHERE s.quantity > 0
GROUP BY m.id
ORDER BY RAND()
LIMIT 10;

-- 2. Simuler des recherches populaires
INSERT INTO search_sessions (transaction_id, search_query, results_count, created_at, expires_at)
VALUES
(1, 'paracetamol', 16, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)),
(1, 'amoxicilline', 16, DATE_SUB(NOW(), INTERVAL 30 MINUTE), DATE_ADD(DATE_SUB(NOW(), INTERVAL 30 MINUTE), INTERVAL 1 HOUR)),
(1, 'ibuprofene', 16, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 HOUR), INTERVAL 1 HOUR)),
(1, 'vitamine', 16, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 HOUR), INTERVAL 1 HOUR)),
(1, 'doliprane', 16, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 HOUR), INTERVAL 1 HOUR)),
(1, 'aspirine', 16, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 HOUR), INTERVAL 1 HOUR)),
(1, 'antibiotique', 16, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 HOUR), INTERVAL 1 HOUR)),
(1, 'anti-inflammatoire', 16, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 6 HOUR), INTERVAL 1 HOUR)),
(1, 'médicament contre la douleur', 16, DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 12 HOUR), INTERVAL 1 HOUR)),
(1, 'traitement fièvre', 16, DATE_SUB(NOW(), INTERVAL 18 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 18 HOUR), INTERVAL 1 HOUR)),
(1, 'médicament toux', 16, DATE_SUB(NOW(), INTERVAL 24 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 24 HOUR), INTERVAL 1 HOUR)),
(1, 'comprimé', 16, DATE_SUB(NOW(), INTERVAL 36 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 36 HOUR), INTERVAL 1 HOUR)),
(1, 'sirop', 16, DATE_SUB(NOW(), INTERVAL 48 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 48 HOUR), INTERVAL 1 HOUR)),
(1, 'gélule', 16, DATE_SUB(NOW(), INTERVAL 60 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 60 HOUR), INTERVAL 1 HOUR)),
(1, 'crème', 16, DATE_SUB(NOW(), INTERVAL 72 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 72 HOUR), INTERVAL 1 HOUR));

-- 3. Créer des transactions complétées pour les sessions de recherche
INSERT IGNORE INTO transactions (user_id, medicament_search, amount, status, mobile_money_ref, created_at, completed_at)
VALUES
(1, 'paracetamol', 500.00, 'completed', 'TICTAC_TEST_001', DATE_SUB(NOW(), INTERVAL 30 MINUTE), DATE_SUB(NOW(), INTERVAL 25 MINUTE)),
(2, 'amoxicilline', 500.00, 'completed', 'TICTAC_TEST_002', DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 55 MINUTE)),
(3, 'ibuprofene', 500.00, 'completed', 'TICTAC_TEST_003', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR 55 MINUTE)),
(4, 'vitamine', 500.00, 'completed', 'TICTAC_TEST_004', DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR 55 MINUTE)),
(5, 'antibiotique', 500.00, 'completed', 'TICTAC_TEST_005', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR 55 MINUTE));

-- 4. Mettre à jour les sessions avec les nouvelles transactions
UPDATE search_sessions 
SET transaction_id = CASE 
    WHEN search_query = 'paracetamol' THEN 2
    WHEN search_query = 'amoxicilline' THEN 3
    WHEN search_query = 'ibuprofene' THEN 4
    WHEN search_query = 'vitamine' THEN 5
    WHEN search_query = 'antibiotique' THEN 6
    ELSE 1
END
WHERE search_query IN ('paracetamol', 'amoxicilline', 'ibuprofene', 'vitamine', 'antibiotique');

-- 5. Vérifier les résultats
SELECT 
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_sessions,
    COUNT(DISTINCT search_query) as unique_queries,
    AVG(results_count) as avg_results,
    MAX(created_at) as last_search,
    MIN(created_at) as first_search
FROM search_sessions;

-- 6. Top des recherches
SELECT 
    search_query,
    COUNT(*) as search_count,
    AVG(results_count) as avg_results,
    MAX(created_at) as last_searched
FROM search_sessions
GROUP BY search_query
ORDER BY search_count DESC
LIMIT 10;
