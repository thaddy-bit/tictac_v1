-- Migration: Support des rôles et administrateur par défaut
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user';

-- Création d'un admin par défaut (Password: admin123)
-- Hash pour 'admin123' généré avec bcrypt
INSERT IGNORE INTO users (phone, email, first_name, last_name, role, password_hash)
VALUES ('+242000000000', 'admin@tictac.cg', 'Admin', 'Platform', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
