-- =====================================================
-- 📋 MIGRATION: COMPLÉTER LES PROFILS UTILISATEURS
-- =====================================================

-- 1. Mettre à jour les utilisateurs existants avec des données de test
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
WHERE first_name IS NULL OR last_name IS NULL;

-- 2. Insérer des utilisateurs de test supplémentaires pour avoir plus de données
INSERT INTO users (phone, email, first_name, last_name, city, password_hash)
VALUES
('+242061234001', 'contact@pharmacie-centre.cg', 'Paul', 'Massamba', 'Brazzaville', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('+242061234002', 'info@pharmacie-mairie.cg', 'Cécile', 'Bouka', 'Brazzaville', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('+242061234003', 'contact@pharmacie-pointenoire.cg', 'André', 'Mouamba', 'Pointe-Noire', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('+242061234004', 'sante@dolisie.cg', 'Marcel', 'Loundou', 'Dolisie', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('+242061234005', 'pharma@owando.cg', 'Lucie', 'Mampouya', 'Owando', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    city = VALUES(city);

-- 3. Vérifier les résultats
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as users_with_email,
    COUNT(CASE WHEN first_name IS NOT NULL AND first_name != '' THEN 1 END) as users_with_firstname,
    COUNT(CASE WHEN last_name IS NOT NULL AND last_name != '' THEN 1 END) as users_with_lastname,
    COUNT(CASE WHEN city IS NOT NULL AND city != '' THEN 1 END) as users_with_city,
    COUNT(DISTINCT city) as unique_cities
FROM users;
