-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 30 mars 2026 à 16:53
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tictac_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `medicaments`
--

CREATE TABLE `medicaments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `generic_name` varchar(100) DEFAULT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `dosage` text DEFAULT NULL,
  `side_effects` text DEFAULT NULL,
  `interactions` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `medicaments`
--

INSERT INTO `medicaments` (`id`, `name`, `description`, `generic_name`, `manufacturer`, `category`, `dosage`, `side_effects`, `interactions`, `image_url`, `created_at`, `updated_at`) VALUES
(3421, 'Paracétamol 500mg', 'Médicament courant', 'Paracétamol', 'Générique', 'Antalgique', NULL, NULL, NULL, NULL, '2026-03-26 12:14:41', '2026-03-26 12:14:41'),
(3422, 'Ibuprofène 400mg', 'Médicament courant', 'Ibuprofène', 'Générique', 'Antalgique', NULL, NULL, NULL, NULL, '2026-03-26 12:14:41', '2026-03-26 12:14:41'),
(3423, 'Amoxicilline 500mg', 'Médicament courant', 'Amoxicilline', 'Générique', 'Antalgique', NULL, NULL, NULL, NULL, '2026-03-26 12:14:41', '2026-03-26 12:14:41'),
(3424, 'Vitamine C 500mg', 'Médicament courant', 'Vitamine', 'Générique', 'Antalgique', NULL, NULL, NULL, NULL, '2026-03-26 12:14:41', '2026-03-26 12:14:41'),
(3425, 'Aspirine 100mg', 'Médicament courant', 'Aspirine', 'Générique', 'Antalgique', NULL, NULL, NULL, NULL, '2026-03-26 12:14:41', '2026-03-26 12:14:41'),
(4131, 'Chloroquine 250mg', 'Médicament Congo NEM 2016', 'Chloroquine', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4132, 'Quinine 500mg', 'Médicament Congo NEM 2016', 'Quinine', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4133, 'Doxycycline 100mg', 'Médicament Congo NEM 2016', 'Doxycycline', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4134, 'Azithromycine 500mg', 'Médicament Congo NEM 2016', 'Azithromycine', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4135, 'Ciprofloxacine 500mg', 'Médicament Congo NEM 2016', 'Ciprofloxacine', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4136, 'Métronidazole 500mg', 'Médicament Congo NEM 2016', 'Métronidazole', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4137, 'Salbutamol 100µg', 'Médicament Congo NEM 2016', 'Salbutamol', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4138, 'Prednisone 5mg', 'Médicament Congo NEM 2016', 'Prednisone', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4139, 'Omeprazole 20mg', 'Médicament Congo NEM 2016', 'Omeprazole', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4140, 'Hydrochlorothiazide 25mg', 'Médicament Congo NEM 2016', 'Hydrochlorothiazide', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15'),
(4141, 'Amlodipine 5mg', 'Médicament Congo NEM 2016', 'Amlodipine', 'Congo NEM 2016', 'Médicament essentiel', NULL, NULL, NULL, NULL, '2026-03-26 12:21:15', '2026-03-26 12:21:15');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('payment','search','system','promotion') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `is_read`, `data`, `expires_at`, `created_at`) VALUES
(2, 2, 'system', 'Nouvelles fonctionnalités', 'Découvrez nos nouvelles fonctionnalités de recherche avancée et de notifications.', 1, '\"{\\\"new_features\\\": true}\"', NULL, '2026-03-26 13:22:41'),
(3, 3, 'system', 'Mise à jour du système', 'Le système a été mis à jour avec de nouvelles améliorations de performance.', 0, '\"{\\\"system_update\\\": true}\"', NULL, '2026-03-26 13:22:41'),
(5, 2, 'search', 'Nouveaux résultats', '16 médicaments trouvés pour votre recherche \"amoxicilline\".', 0, '\"{\\\"search_query\\\": \\\"amoxicilline\\\", \\\"results\\\": 16}\"', NULL, '2026-03-26 13:22:41'),
(6, 3, 'search', 'Stock disponible', 'Le médicament que vous cherchez est disponible dans 5 pharmacies.', 0, '\"{\\\"available\\\": true, \\\"pharmacies\\\": 5}\"', NULL, '2026-03-26 13:22:41'),
(8, 2, 'payment', 'Reçu de paiement', 'Votre reçu de paiement est disponible dans votre historique.', 0, '\"{\\\"receipt_id\\\": \\\"TICTAC_001\\\"}\"', NULL, '2026-03-26 13:22:41'),
(9, 3, 'payment', 'Offre spéciale', '10% de réduction sur votre prochaine recherche de médicaments.', 0, '\"{\\\"discount\\\": 10, \\\"code\\\": \\\"SAVE10\\\"}\"', NULL, '2026-03-26 13:22:41'),
(10, 4, 'promotion', 'Offre du mois', 'Profitez de -20% sur tous les abonnements premium ce mois-ci!', 0, '\"{\\\"promo\\\": \\\"MARCH20\\\", \\\"discount\\\": 20}\"', NULL, '2026-03-26 13:22:41'),
(11, 5, 'promotion', 'Parrainage', 'Invitez un ami et recevez 500 XAF de crédit!', 0, '\"{\\\"referral\\\": true, \\\"bonus\\\": 500}\"', NULL, '2026-03-26 13:22:41');

-- --------------------------------------------------------

--
-- Structure de la table `payouts`
--

CREATE TABLE `payouts` (
  `id` int(11) NOT NULL,
  `pharmacy_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `period` varchar(50) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pharmacies`
--

CREATE TABLE `pharmacies` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `schedule` varchar(50) DEFAULT NULL,
  `neighborhood` varchar(100) DEFAULT NULL,
  `arrondissement` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 4.50,
  `estimated_delivery_time` varchar(50) DEFAULT '30-45 min',
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` enum('jour','nuit','mixte','garde') DEFAULT 'jour',
  `is_on_garde` tinyint(1) DEFAULT 0,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pharmacies`
--

INSERT INTO `pharmacies` (`id`, `name`, `address`, `schedule`, `neighborhood`, `arrondissement`, `department`, `phone`, `email`, `latitude`, `longitude`, `city`, `rating`, `estimated_delivery_time`, `image_url`, `is_active`, `created_at`, `updated_at`, `type`, `is_on_garde`, `user_id`) VALUES
(695, '5 ème Galaxie', '29 ,rue Bankoua', 'Jour', 'Moukondo', '', 'Brazzaville', '+242061234567', '5.me.galaxie@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-27 15:39:22', 'garde', 1, NULL),
(696, '7-7 De Dany', '7-7 Dedany Tie- Tie Fond', 'Mixte', 'Tié-Tié', '', 'Pointe-Noire', '+242055123456', '77.de.dany@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-27 15:39:22', 'mixte', 0, NULL),
(697, 'Adele', 'Avenue des 3 Martyrs', 'Jour', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'adele@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-27 15:39:22', 'mixte', 0, NULL),
(698, 'Adonia Ilama', '130 Av De La Base', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'adonia.ilama@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(699, 'Affi', '69 Avenue MFOUTA BZ/ville', 'Jour', 'Madibou', '', 'Brazzaville', '+242061234567', 'affi@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(700, 'Afia', '69 Avenue Mafouta Bz/ville', 'Jour', 'Madibou', 'Madibou', 'Brazzaville', '+242061234567', 'afia@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(701, 'AGAPAO', 'Quartier De L\'hôpital', 'Jour', 'Owando', '', 'Cuvette', '+242061234567', 'agapao@pharma.cg', -0.49580000, 15.90480000, 'Owando', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(702, 'Agape', 'Maison D\'Arrêt Mpita', 'Mixte', 'Arr. 1 Quartier', '', 'Pointe-Noire', '+242055123456', 'agape@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(703, 'Alex', 'Av De France', 'Nuit', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'alex@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(704, 'Alma', 'Secteur École Primaire', 'Mixte', 'Makayabou Quartier', '', 'Pointe-Noire', '+242055123456', 'alma@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(705, 'Antony', '', 'Jour', 'Djiri', '', 'Brazzaville', '+242061234567', 'antony@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(706, 'Aureole', '43, Av Maya Maya', 'Jour', 'Moungali', '', 'Brazzaville', '+242061234567', 'aureole@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(707, 'Avenue De La Base', 'Quartier Base Aérienne', 'Mixte', 'Arr. 1 Quartier', '', 'Pointe-Noire', '+242055123456', 'avenue.de.la.base@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(708, 'Avenue de la Paix', '85, Rue France Ville', 'Jour', 'Moungali', '', 'Brazzaville', '+242061234567', 'avenue.de.la.paix@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(709, 'Banque De Vie', '60 Avenue De La Liberté', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'banque.de.vie@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(710, 'Bass', 'Derriere CNRTV', 'Jour', 'Djiri', '', 'Brazzaville', '+242061234567', 'bass@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(711, 'Bay', '42 Av Marien Ngouabi BP 4808', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'bay@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(712, 'Bayonne', 'BP 1331', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'bayonne@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(713, 'Béatitude', '125 rue Tsaba', 'Jour', 'Ouenzé', 'Ouenzé', 'Brazzaville', '+242061234567', 'batitude@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:41', '2026-03-26 12:14:41', 'jour', 0, NULL),
(714, 'Beni', '340 Av Des 3 Martyrs', 'Jour', 'Ouenze', 'Moungali', 'Brazzaville', '+242061234567', 'beni@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(715, 'Bénie PNR', 'Loandjili Faubourg', 'Mixte', 'Loandjili', 'Loandjili', 'Pointe-Noire', '+242055123456', 'bnie.pnr@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(716, 'Bet\' Leem', '1640, Avenue Des 3 Martyrs, Plateau des 150 ans (arret Papa Gaz)', 'Jour', 'Moungali', '', 'Brazzaville', '+242061234567', 'bet.leem@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(717, 'Bethesda', 'Rond Point Mouhoumi (01 AV Ngamaba)', 'Nuit', 'Mfilou', '', 'Brazzaville', '+242061234567', 'bethesda@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(718, 'Bienfaisance', 'Avenue Vindoulou Arrêt Sapin', 'Mixte', 'Quartier', 'Mvindoulou', 'Pointe-Noire', '+242055123456', 'bienfaisance@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(719, 'Bienvenue', '1761 AV. de l\'Oua Rdpt Bifouiti', 'Jour', 'Makélékélé', 'MAKélékélé', 'Brazzaville', '+242061234567', 'bienvenue@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(720, 'Bikoumou', 'AV lyautey, Face Stade D\'ornano OCH', 'Nuit', 'Moungali', '', 'Brazzaville', '+242061234567', 'bikoumou@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(721, 'Biomed', 'Av. Alexandre Honoré Paka N°123', 'Mixte', 'Paka', '', 'Pointe-Noire', '+242055123456', 'biomed@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(722, 'Blanche Gomez', 'Rue Nkouka Bateke', 'Jour', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'blanche.gomez@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(723, 'Bonick', 'AV. De L\'oua BZ/ville', 'Jour', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'bonick@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(724, 'Boueta Mbongo', 'Croisement Itoubi', 'Nuit', 'Boueta Mbongo', 'Moungali', 'Brazzaville', '+242061234567', 'boueta.mbongo@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(725, 'Boueta Mbongo', '75 Bouzala Av', 'Nuit', 'Boueta Mbongo', 'Ouenze', 'Brazzaville', '+242061234567', 'boueta.mbongo@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(726, 'BOUKOULOU MAKOSSO Sylvain Arnaud', 'Avenue Delphin POATY Mpaka', 'Jour', '', 'Ngoyo', 'Pointe-Noire', '+242055123456', 'boukoulou.makosso.sylvain.arnaud@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(727, 'Brant Gynes', 'Avenue Paul Doumer (marche P V)', 'Jour', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'brant.gynes@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(728, 'Brant-gynes', 'Gare P.v Avenue Paul Doumer', 'Jour', 'Marché P.v Poto Poto', 'Poto-poto', 'Brazzaville', '+242061234567', 'brantgynes@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(729, 'Brant-Jynes', 'Blv Denis Sassou NGEUSSO (Marché De La PV)', 'Jour', 'Centre Ville', 'Poto poto', 'Brazzaville', '+242061234567', 'brantjynes@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(730, 'Camp 31 Juillet', 'Avenue Jean Jacques Opangault', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'camp.31.juillet@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(731, 'Carrefour', 'Rue Mbochi', 'Jour', 'POTO POTO', 'Poto poto', 'Brazzaville', '+242061234567', 'carrefour@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(732, 'Case Du Parti', 'Case Du Parti', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'case.du.parti@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(733, 'Celmars', '5 Avenue De L\'Indépendance', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'celmars@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(734, 'Celmesterica Et Jenny', 'Rond Point Moungali 66 Av des 3 Maryrs', 'Nuit', 'Moungali', '', 'Brazzaville', '+242061234567', 'celmesterica.et.jenny@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(735, 'Centre', '131 Blv Yautey Face Chu', 'Jour', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'centre@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(736, 'Centre Chu', '131, Blv Lyautey Face Chu', 'Jour', 'Poto Poto', 'Poto-poto', 'Brazzaville', '+242061234567', 'centre.chu@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(737, 'Centre Sportif', 'AV de L\'oua', 'Jour', 'Makélékélé', '', 'Brazzaville', '+242061234567', 'centre.sportif@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(738, 'Centre Ville Dolisie', '', 'Jour', 'Quartier', '', 'Bouenza', '+242061234567', 'centre.ville.dolisie@pharma.cg', -4.19890000, 12.67030000, 'Dolisie', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(739, 'Centre Ville PNR', '74 Av. De L\'Indépendance BP 1714', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'centre.ville.pnr@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(740, 'Chrislag', 'Marché Mpaka', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'chrislag@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(741, 'Christ Roi', 'Marché Total', 'Jour', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'christ.roi@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(742, 'City Pharma', 'Quartier Vindoulou', 'Mixte', 'Arrondissement Quartier', '', 'Pointe-Noire', '+242055123456', 'city.pharma@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:42', '2026-03-26 12:14:42', 'jour', 0, NULL),
(743, 'Clairon (camp Clairon)', 'P 38/2 Av 2ème Division', 'Jour', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'clairon.camp.clairon@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(744, 'Cleme', '01 Rue Bouanga', 'Jour', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'cleme@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(745, 'Commission', 'Arret Marché Commission', 'Nuit', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'commission@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(746, 'Commune De Bacongo', '38 AV Des 3 Francs', 'Jour', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'commune.de.bacongo@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(747, 'Continentale', '104 Avenue De France', 'Jour', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'continentale@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(748, 'Coronella', 'Croisement Rue Mbochi/ Av Miadeka', 'Nuit', 'Ouenze', '', 'Brazzaville', '+242061234567', 'coronella@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(749, 'Cote Mateve', 'Face Marché Côté Matève', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'cote.mateve@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(750, 'Cristale', '129 rue De Reims centre ville', 'Jour', 'POTO POTO', 'Poto-poto', 'Brazzaville', '+242061234567', 'cristale@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(751, 'Croix Sainte', '135 RUE Ndolo', 'Nuit', 'Talangai', '', 'Brazzaville', '+242061234567', 'croix.sainte@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(752, 'Cœur Joyeux', 'Grand Marché PNR BP 532', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'cur.joyeux@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(753, 'Daffe', '111 Av Des 3 Martyrs', 'Jour', 'Moungali', 'Moungali', 'Brazzaville', '+242061234567', 'daffe@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(754, 'Daphne', '150 RUE MBOCHI', 'Jour', 'Ouenze', 'Ouenzé', 'Brazzaville', '+242061234567', 'daphne@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(755, 'Darque', '119 Avenue De L\'Indépendance', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'darque@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(756, 'Deekams', 'P3 Case 122 Soprogie Moukondo', 'Jour', 'Moungalie', 'Moungali', 'Brazzaville', '+242061234567', 'deekams@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(757, 'Del Grace (DRTV Moungali III)', 'Case J434 Moungali 3', 'Jour', 'Brazzaville', 'Moungali', 'Brazzaville', '+242061234567', 'del.grace.drtv.moungali.iii@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(758, 'Délivrance', '72 Rue Massoukou', 'Nuit', 'Moungali', '', 'Brazzaville', '+242061234567', 'dlivrance@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(759, 'Denise', 'Talangai', 'Jour', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'denise@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(760, 'Desir', 'Croisement 3 Martyrs/boueta Mbongo', 'Nuit', 'Ouenze', '', 'Brazzaville', '+242061234567', 'desir@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(761, 'Dieuveille', '99 Avenue De La Liberté', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'dieuveille@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(762, 'Dioschara', 'Face CSI Ngoyo', 'Mixte', 'Quartier', 'Ngoyo', 'Pointe-Noire', '+242055123456', 'dioschara@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(763, 'Divina', '67 Rue Mboko', 'Jour', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'divina@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(764, 'DJO M', 'RN1 Vers Lombo Terminus Mbota', 'Mixte', 'Quartier', 'Talangai', 'Pointe-Noire', '+242055123456', 'djo.m@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(765, 'DR. Jesus (ex: Saint Michel)', 'Gare Routière Marché Total', 'Jour', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'dr.jesus.ex.saint.michel@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(766, 'Du Domaine', 'Departement Talangai', 'Jour', 'Djiri', '', 'Brazzaville', '+242061234567', 'du.domaine@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(767, 'Duo', '04 Rue Mbochi', 'Jour', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'duo@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(768, 'Ebina', 'Rond Point Ebina', 'Nuit', 'Ouenze', '', 'Brazzaville', '+242061234567', 'ebina@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(769, 'Eckodis', 'Bar Louami', 'Nuit', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'eckodis@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:43', '2026-03-26 12:14:43', 'jour', 0, NULL),
(770, 'Ecodus', '01 Rue Ndaki', 'Jour', 'Makabandilou Djiri', '', 'Brazzaville', '+242061234567', 'ecodus@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(771, 'Edden', '2 Rue Ma Ngounga', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'edden@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(772, 'El Rodriguo', 'PK Mfilou 9, Rue M KINSOUNDI', 'Nuit', 'Mfilou', '', 'Brazzaville', '+242061234567', 'el.rodriguo@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(773, 'El Shaddai', 'Quartier Songolo Av', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'el.shaddai@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(774, 'Emmanueli', 'N°01 Rue Djoueli , Av de la Cité des 17 rond point Mazala', 'Jour', 'Moukondo', 'Moungali', 'Brazzaville', '+242061234567', 'emmanueli@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(775, 'Espérance', 'Marché moukondo', 'Jour', 'Moungali', '', 'Brazzaville', '+242061234567', 'esprance@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(776, 'Esplanade', '16 ,rue EKeyi Cnrtv', 'Nuit', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'esplanade@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(777, 'Essengo', 'Fond Tié-Tié', 'Mixte', 'Tié Tié', '', 'Pointe-Noire', '+242055123456', 'essengo@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(778, 'Esther', 'Tie Tie BP 897', 'Mixte', 'Quartier', 'Tié-Tié', 'Pointe-Noire', '+242055123456', 'esther@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(779, 'Ex Reich Biopharma', 'Croisement AV M Afouta Et Route Kombé L\'OUA(COG)', 'Jour', 'Madibou', '', 'Brazzaville', '+242061234567', 'ex.reich.biopharma@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(780, 'Exaucé', 'Croisement Avenue Maya Maya Mbochis', 'Nuit', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'exauc@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(781, 'Exauce', 'Croisement Av Maya Maya / Mbochis', 'Nuit', 'Arret Metro Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'exauce@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(782, 'Exode', 'Case B77 H-Bis Cité Shelter', 'Nuit', 'Mfilou', 'Nfilou', 'Brazzaville', '+242061234567', 'exode@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(783, 'Faraja Honoris', 'Croisement Av Mafouta et Route Kombé LOUA (COG)', 'Jour', 'Mdibou', '', 'Brazzaville', '+242061234567', 'faraja.honoris@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(784, 'Faubourg', 'Loandjili Faubourg BP 2211', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'faubourg@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(785, 'Fil', 'Rond De Poto Poto (eglise Sainte anne)', 'Jour', 'Poto poto', 'Poto poto', 'Brazzaville', '+242061234567', 'fil@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(786, 'Foch', 'Rond Point ex bcc', 'Jour', 'Poto poto', 'Poto poto', 'Brazzaville', '+242061234567', 'foch@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(787, 'Franck', '45 Bis yakomas', 'Jour', 'Poto poto', 'Poto poto', 'Brazzaville', '+242061234567', 'franck@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(788, 'Galien', '72 , Rue', 'Jour', 'Makélékélé', 'MAKélékélé', 'Brazzaville', '+242061234567', 'galien@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(789, 'Horeb', '22 Avenue IBALICO', 'Jour', 'Djiri', '', 'Brazzaville', '+242061234567', 'horeb@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(790, 'Jeannelle', '85,rue France Ville', 'Jour', 'Moungali', 'Moungli', 'Brazzaville', '+242061234567', 'jeannelle@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(791, 'Kisito', 'Face De L\'Eglise KISITO', 'Nuit', '32 AV De L\'oua', 'Makélékélé', 'Brazzaville', '+242061234567', 'kisito@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(792, 'Konix', '03 AVENUE MPIAKA Diata R2', 'Jour', 'Mfilou', '', 'Brazzaville', '+242061234567', 'konix@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(793, 'La Patience', 'Av Jacques Opangault Songolo', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'la.patience@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(794, 'La Renaissance', '7 Rue De La Mare', 'Nuit', 'Moungali', '', 'Brazzaville', '+242061234567', 'la.renaissance@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(795, 'Les Plateaux', '12 Av Charles De Gaulle Parc 04', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'les.plateaux@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(796, 'Lumière Blanche', 'Mpaka 120', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'lumire.blanche@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(797, 'Metro Nuit Exode', '877 H Bis Cie Schelter Afrique', 'Nuit', 'Mfilou', 'Mfilou', 'Brazzaville', '+242061234567', 'metro.nuit.exode@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(798, 'Mvoumvou', 'BP 483', '', '', '', '', '+242061234567', 'mvoumvou@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(799, 'Olivier', '29 AV Kimbangou', 'Jour', 'Makélékéle', 'Makélékélé', 'Brazzaville', '+242061234567', 'olivier@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(800, 'Père Jacques', 'Av marien Ngouabi', 'Jour', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'pre.jacques@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:44', '2026-03-26 12:14:44', 'jour', 0, NULL),
(801, 'Pharmacie De L\'Och', 'BP 8138 Av De L\'Indépendance – BP 957', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'pharmacie.de.loch@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(802, 'Pharmacie de Mayanga', 'MAYANGA Après B52', 'Jour', 'Madibou', '', 'Brazzaville', '+242061234567', 'pharmacie.de.mayanga@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(803, 'Pharmapolis Santé', '57, Rue Mbanzas', 'Jour', 'Moungali', 'Moungali', 'Brazzaville', '+242061234567', 'pharmapolis.sant@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(804, 'Pont', 'Pont Du Centenaire', 'Jour', 'Moungali', '', 'Brazzaville', '+242061234567', 'pont@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(805, 'Poto-Poto', 'Croisement Av De La Paix 25 Rue Bayas', 'Nuit', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'potopoto@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(806, 'Prosper', 'Orriso.AV matsoua Et Rue Mbiemo', 'Nuit', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'prosper@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(807, 'Relys', '154 RUE ABOLO', 'Jour', 'OUENZE', 'Ouenze', 'Brazzaville', '+242061234567', 'relys@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(808, 'Renande Et Maat', 'En Face De L\'hotel Saphir', 'Jour', 'Centre Ville Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'renande.et.maat@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(809, 'Rhina', '120. Rue Banziris', 'Jour', 'Point Hollandaise OUENZE', 'Ouenzé', 'Brazzaville', '+242061234567', 'rhina@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(810, 'Rond Point Makélékéke', 'Face Commune De Makélékéle', 'Nuit', 'Makélékélé', 'Makélékélé', 'Brazzaville', '+242061234567', 'rond.point.maklkke@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(811, 'Rond Point Moungali', 'Rond Point Moungali (coté Impot)', 'Jour', 'Moungali', '', 'Brazzaville', '+242061234567', 'rond.point.moungali@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(812, 'Saint Luc', 'T Marché Soprogie', 'Jour', 'DJIRI', '', 'Brazzaville', '+242061234567', 'saint.luc@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(813, 'Saint Nicolas', 'Espace Kimpelé RN1', 'Mixte', 'Vindoulou', 'Quartier', 'Pointe-Noire', '+242055123456', 'saint.nicolas@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(814, 'Saint Pierre', 'BP 5808', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'saint.pierre@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(815, 'Sainte Andréa', 'KINTELE, 01 rue en face de', 'Jour', '1000 logements djiri', 'Djiri', 'Brazzaville', '+242061234567', 'sainte.andra@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(816, 'Sainte Rita', '114 , Rue Moulenda', 'Jour', 'Plateau de 15 Ans', '', 'Brazzaville', '+242061234567', 'sainte.rita@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(817, 'SALA Servais Simplice', 'N°1701 Avenue De L\'OUA', 'Jour', 'XXXXXXXX', 'Makélékélé', 'Brazzaville', '+242061234567', 'sala.servais.simplice@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(818, 'Sandza', '135 AV. 3 francs', 'Nuit', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'sandza@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(819, 'Santé pour tous', '67 Avenue NGAMABA', 'Jour', 'Mfilou', '', 'Brazzaville', '+242061234567', 'sant.pour.tous@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(820, 'Siracide', 'Av Des 3 Martyrs En Face De L\'hôpital', 'Jour', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'siracide@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(821, 'Sophiana', 'Croisement Av De La Tsiémé/95', 'Nuit', 'Saint Anne', 'Ouenze', 'Brazzaville', '+242061234567', 'sophiana@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(822, 'Tahiti', '52, AV Matsoua', 'Jour', 'Bacongo', 'Bacongo', 'Brazzaville', '+242061234567', 'tahiti@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(823, 'Terminus Mikalou', 'En face du marché Mikalou, Av. Marien Ngouabi', 'Jour', 'Talangai', '', 'Brazzaville', '+242061234567', 'terminus.mikalou@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(824, 'Teven', '15 AVENUE NGAMABA N 15', 'Jour', 'Mfilou', '', 'Brazzaville', '+242061234567', 'teven@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(825, 'Texaco', '01, Rue Mfouati (texaco La Tsiémé)', 'Jour', 'OUENZE', 'Ouenzé', 'Brazzaville', '+242061234567', 'texaco@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(826, 'TONA LOUKOUIKILA', 'Vienne Sou Ellen N°45 Bis, Rue Yakomas', 'Jour', 'Potopoto', 'Poto-poto', 'Brazzaville', '+242061234567', 'tona.loukouikila@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(827, 'Trésor', 'Arret Bongo Nouara', 'Jour', 'Djiri', '', 'Brazzaville', '+242061234567', 'trsor@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(828, 'Tsiémé', 'Arret Tsiémé', 'Nuit', 'Ouenze', 'Ouenze', 'Brazzaville', '+242061234567', 'tsim@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(829, 'TSIOMO Odilon Aubin', '01, Rue Bwalonga Mayanga zone B52', 'Nuit', '', 'Madibou', 'Brazzaville', '+242061234567', 'tsiomo.odilon.aubin@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(830, 'Vader Veecken', 'Avenue De La Paix', 'Jour', 'Poto Poto', 'Poto poto', 'Brazzaville', '+242061234567', 'vader.veecken@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(831, 'Valencia', '281 Rue De La Frontière', 'Mixte', 'Quartier', '', 'Pointe-Noire', '+242055123456', 'valencia@pharma.cg', -4.77670000, 11.86180000, 'Pointe-Noire', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(832, 'Van Derveecken', 'Avenue De La Paix', 'Jour', 'Poto- Poto', 'Centre ville', 'Brazzaville', '+242061234567', 'van.derveecken@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(833, 'Vert d\'Ô', '27 rue Ndolo', 'Jour', 'coisement rue Ndolo, Av. Marien Ngouabi', 'Talangai', 'Brazzaville', '+242061234567', 'vert.d@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(834, 'Victorieuse', 'Quartier Madibou', 'Nuit', 'Madibou', '', 'Brazzaville', '+242061234567', 'victorieuse@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(835, 'Yves', '40 Rue , Massa', 'Jour', 'Talangai', 'Talangai', 'Brazzaville', '+242061234567', 'yves@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:45', '2026-03-26 12:14:45', 'jour', 0, NULL),
(836, 'Zoo', 'En Face de Nganga Edouard', 'Jour', 'Moungali', '', 'Brazzaville', '+242061234567', 'zoo@pharma.cg', -4.26340000, 15.24290000, 'Brazzaville', 4.50, '30-45 min', NULL, 1, '2026-03-26 12:14:46', '2026-03-26 12:14:46', 'jour', 0, NULL),
(837, 'Pharmacie Centrale de Test', 'Avenue de la Paix, Brazzaville', NULL, NULL, NULL, NULL, '+242065555555', NULL, -4.26340000, 15.28320000, NULL, 4.50, '30-45 min', NULL, 1, '2026-03-30 02:59:01', '2026-03-30 02:59:01', 'mixte', 0, 26);

-- --------------------------------------------------------

--
-- Structure de la table `pharmacy_reviews`
--

CREATE TABLE `pharmacy_reviews` (
  `id` int(11) NOT NULL,
  `pharmacy_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `title` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `helpful_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pharmacy_subscriptions`
--

CREATE TABLE `pharmacy_subscriptions` (
  `id` int(11) NOT NULL,
  `pharmacy_id` int(11) NOT NULL,
  `plan_type` enum('basic','premium') DEFAULT 'basic',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `search_sessions`
--

CREATE TABLE `search_sessions` (
  `id` varchar(16) NOT NULL,
  `transaction_id` varchar(16) NOT NULL,
  `search_query` varchar(255) NOT NULL,
  `results_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT (current_timestamp() + interval 1 hour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `search_sessions`
--

INSERT INTO `search_sessions` (`id`, `transaction_id`, `search_query`, `results_count`, `created_at`, `expires_at`) VALUES
('1', '3', 'paracetamol', 16, '2026-03-26 13:17:59', '2026-03-26 14:17:59'),
('10', '7', 'doliprane', 16, '2026-03-26 05:18:14', '2026-03-26 06:18:14'),
('11', '16', 'paracetamol', 0, '2026-03-26 14:43:29', '2026-03-26 15:43:29'),
('12', '1', 'paracetamol', 0, '2026-03-26 14:44:30', '2026-03-26 15:44:30'),
('13', '13', 'paracetamol', 0, '2026-03-26 14:44:30', '2026-03-26 15:44:30'),
('14', '14', 'paracetamol', 0, '2026-03-26 14:44:30', '2026-03-26 15:44:30'),
('15', '15', 'paracetamol', 0, '2026-03-26 14:44:30', '2026-03-26 15:44:30'),
('16', '17', 'paracetamol', 31, '2026-03-26 15:11:13', '2026-03-26 16:11:13'),
('17', '18', 'paracetamol', 31, '2026-03-26 15:42:21', '2026-03-26 16:42:21'),
('18', '19', 'paracetamol', 31, '2026-03-26 16:50:41', '2026-03-26 17:50:41'),
('19', '20', 'paracetamol', 0, '2026-03-26 16:56:21', '2026-03-26 17:56:21'),
('2', '4', 'amoxicilline', 16, '2026-03-26 11:17:59', '2026-03-26 12:17:59'),
('20', '21', 'Paracétamol 500mg', 31, '2026-03-27 09:34:55', '2026-03-27 10:34:55'),
('21', '22', 'Paracétamol 500mg', 31, '2026-03-27 14:36:16', '2026-03-27 15:36:16'),
('22', '23', 'Paracétamol 500mg', 0, '2026-03-27 15:10:48', '2026-03-27 16:10:48'),
('23', '24', 'Chloroquine 250mg, Quinine 500mg, Paracétamol 500mg', 8, '2026-03-27 16:45:47', '2026-03-27 17:45:47'),
('24', '25', 'Paracétamol 500mg, Quinine 500mg', 0, '2026-03-27 16:48:37', '2026-03-27 17:48:37'),
('25', '26', 'Amlodipine 5mg, Aspirine 100mg', 0, '2026-03-29 13:38:19', '2026-03-29 14:38:19'),
('26', '27', 'Amlodipine 5mg, Aspirine 100mg', 0, '2026-03-29 13:43:02', '2026-03-29 14:43:02'),
('27', '29', '[3421,4131,4140]', 0, '2026-03-29 15:00:05', '2026-03-29 16:00:05'),
('28', '30', '[3421]', 0, '2026-03-29 15:04:27', '2026-03-29 16:04:27'),
('29', '32', '[3421,4131]', 0, '2026-03-29 17:45:55', '2026-03-29 18:45:55'),
('3', '5', 'ibuprofene', 16, '2026-03-26 09:17:59', '2026-03-26 10:17:59'),
('30', '33', '[3421]', 0, '2026-03-29 17:50:00', '2026-03-29 18:50:00'),
('31', '34', '[3421]', 0, '2026-03-29 17:56:02', '2026-03-29 18:56:02'),
('32', '35', '[3421]', 0, '2026-03-29 17:59:32', '2026-03-29 18:59:32'),
('33', '36', '[3421]', 0, '2026-03-29 18:14:34', '2026-03-29 19:14:34'),
('34', '37', '[3421,4131]', 0, '2026-03-29 18:35:05', '2026-03-29 19:35:05'),
('35', '38', '[3421]', 0, '2026-03-29 18:38:12', '2026-03-29 19:38:12'),
('36', '39', '[3421,3423]', 0, '2026-03-29 19:14:52', '2026-03-29 20:14:52'),
('37', '40', '[3421,3423]', 0, '2026-03-29 19:23:20', '2026-03-29 20:23:20'),
('38', '41', '[3421]', 0, '2026-03-29 19:29:31', '2026-03-29 20:29:31'),
('39', '42', '[4131]', 0, '2026-03-29 19:31:08', '2026-03-29 20:31:08'),
('4', '6', 'vitamine', 16, '2026-03-26 07:17:59', '2026-03-26 08:17:59'),
('40', '43', '[3421]', 0, '2026-03-29 19:34:47', '2026-03-29 20:34:47'),
('41', '44', '[3421,3423]', 0, '2026-03-29 19:42:29', '2026-03-29 20:42:29'),
('42', '46', '[3421]', 0, '2026-03-29 19:49:27', '2026-03-29 20:49:27'),
('4GQ25H5UAEB4', '1QMWK6WNW982', '[3421,3423]', 0, '2026-03-30 02:05:17', '2026-03-30 03:05:17'),
('5', '7', 'doliprane', 16, '2026-03-26 05:17:59', '2026-03-26 06:17:59'),
('6', '3', 'paracetamol', 16, '2026-03-26 13:18:14', '2026-03-26 14:18:14'),
('7', '4', 'amoxicilline', 16, '2026-03-26 11:18:14', '2026-03-26 12:18:14'),
('8', '5', 'ibuprofene', 16, '2026-03-26 09:18:14', '2026-03-26 10:18:14'),
('87LTVITLJAXR', '0GYR5RARGKW1', '[3421]', 0, '2026-03-30 14:03:27', '2026-03-30 15:03:27'),
('9', '6', 'vitamine', 16, '2026-03-26 07:18:14', '2026-03-26 08:18:14'),
('DVKM9KV1IS0Z', 'VCNEDKW6AU2A', '[3423,4137,3421,4131,4140]', 0, '2026-03-30 01:58:33', '2026-03-30 02:58:33'),
('JPKANCK3F33C', '8OC3MJ31Y59D', '[3423]', 0, '2026-03-30 00:09:44', '2026-03-30 01:09:44'),
('SET83LYDMUP4', 'UC8LMD8L4VH4', '[3421,3423]', 0, '2026-03-30 00:19:26', '2026-03-30 01:19:26'),
('U4WMYFIBQHFY', 'LBV3THPLKCET', '[3421,3423]', 0, '2026-03-30 01:13:25', '2026-03-30 02:13:25');

-- --------------------------------------------------------

--
-- Structure de la table `stocks`
--

CREATE TABLE `stocks` (
  `id` int(11) NOT NULL,
  `pharmacy_id` int(11) NOT NULL,
  `medicament_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stocks`
--

INSERT INTO `stocks` (`id`, `pharmacy_id`, `medicament_id`, `quantity`, `price`, `last_updated`) VALUES
(4136, 695, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4137, 695, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4138, 695, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4139, 695, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4140, 696, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4141, 696, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4142, 696, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4143, 696, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4144, 696, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4145, 697, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4146, 697, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4147, 697, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4148, 698, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4149, 698, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4150, 698, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4151, 699, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4152, 699, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4153, 699, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4154, 699, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4155, 700, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4156, 700, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4157, 700, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4158, 700, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4159, 701, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4160, 701, 4135, 12, 2000.00, '2026-03-26 12:28:11'),
(4161, 701, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4162, 701, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4163, 701, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4164, 702, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4165, 702, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4166, 702, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4167, 702, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4168, 702, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4169, 703, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4170, 703, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4171, 703, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4172, 703, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4173, 704, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4174, 704, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4175, 704, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4176, 705, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4177, 705, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4178, 705, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4179, 705, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4180, 706, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4181, 706, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4182, 706, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4183, 706, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4184, 706, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4185, 707, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4186, 707, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4187, 707, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4188, 707, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4189, 707, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4190, 708, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4191, 708, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4192, 708, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4193, 709, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4194, 709, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4195, 709, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4196, 709, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4197, 710, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4198, 710, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4199, 710, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4200, 710, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4201, 710, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4202, 711, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4203, 711, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4204, 711, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4205, 711, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4206, 711, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4207, 712, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4208, 712, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4209, 712, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4210, 713, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4211, 713, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4212, 713, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4213, 714, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4214, 714, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4215, 714, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4216, 714, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4217, 715, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4218, 715, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4219, 715, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4220, 715, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4221, 716, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4222, 716, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4223, 716, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4224, 717, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4225, 717, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4226, 717, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4227, 718, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4228, 718, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4229, 718, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4230, 719, 4135, 12, 2000.00, '2026-03-26 12:28:11'),
(4231, 719, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4232, 719, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4233, 720, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4234, 720, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4235, 720, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4236, 720, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4237, 721, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4238, 721, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4239, 721, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4240, 721, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4241, 721, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4242, 722, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4243, 722, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4244, 722, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4245, 722, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4246, 723, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4247, 723, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4248, 723, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4249, 723, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4250, 723, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4251, 724, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4252, 724, 4135, 12, 2000.00, '2026-03-26 12:28:11'),
(4253, 724, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4254, 724, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4255, 725, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4256, 725, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4257, 725, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4258, 726, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4259, 726, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4260, 726, 4135, 12, 2000.00, '2026-03-26 12:28:11'),
(4261, 726, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4262, 726, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4263, 727, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4264, 727, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4265, 727, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4266, 727, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4267, 727, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4268, 728, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4269, 728, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4270, 728, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4271, 728, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4272, 729, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4273, 729, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4274, 729, 4135, 12, 2000.00, '2026-03-26 12:28:11'),
(4275, 729, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4276, 729, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4277, 730, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4278, 730, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4279, 730, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4280, 730, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4281, 731, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4282, 731, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4283, 731, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4284, 731, 4137, 8, 2800.00, '2026-03-26 12:28:11'),
(4285, 731, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4286, 732, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4287, 732, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4288, 732, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4289, 732, 4137, 8, 2800.00, '2026-03-26 12:28:11'),
(4290, 732, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4291, 733, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4292, 733, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4293, 733, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4294, 734, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4295, 734, 4137, 8, 2800.00, '2026-03-26 12:28:11'),
(4296, 734, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4297, 735, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4298, 735, 3422, 30, 750.00, '2026-03-26 12:28:11'),
(4299, 735, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4300, 735, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4301, 736, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4302, 736, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4303, 736, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4304, 736, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4305, 737, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4306, 737, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4307, 737, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4308, 737, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4309, 737, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4310, 738, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4311, 738, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4312, 738, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4313, 738, 4137, 8, 2800.00, '2026-03-26 12:28:11'),
(4314, 738, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4315, 739, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4316, 739, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4317, 739, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4318, 739, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4319, 739, 3423, 20, 1200.00, '2026-03-26 12:28:11'),
(4320, 740, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4321, 740, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4322, 740, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4323, 741, 4137, 8, 2800.00, '2026-03-26 12:28:11'),
(4324, 741, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4325, 741, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4326, 742, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4327, 742, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4328, 742, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4329, 742, 3421, 50, 500.00, '2026-03-26 12:28:11'),
(4330, 743, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4331, 743, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4332, 743, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4333, 743, 4137, 8, 2800.00, '2026-03-26 12:28:11'),
(4334, 744, 4138, 20, 900.00, '2026-03-26 12:28:11'),
(4335, 744, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4336, 744, 3424, 100, 300.00, '2026-03-26 12:28:11'),
(4337, 745, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4338, 745, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4339, 745, 4134, 10, 3500.00, '2026-03-26 12:28:11'),
(4340, 746, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4341, 746, 4135, 12, 2000.00, '2026-03-26 12:28:11'),
(4342, 746, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4343, 747, 4141, 15, 2500.00, '2026-03-26 12:28:11'),
(4344, 747, 4140, 35, 600.00, '2026-03-26 12:28:11'),
(4345, 747, 4136, 22, 1800.00, '2026-03-26 12:28:11'),
(4346, 747, 4132, 15, 1100.00, '2026-03-26 12:28:11'),
(4347, 747, 4139, 28, 1300.00, '2026-03-26 12:28:11'),
(4348, 748, 4133, 18, 1500.00, '2026-03-26 12:28:11'),
(4349, 748, 4137, 8, 2800.00, '2026-03-26 12:28:11'),
(4350, 748, 4131, 25, 800.00, '2026-03-26 12:28:11'),
(4351, 748, 4135, 12, 2000.00, '2026-03-26 12:28:11'),
(4352, 748, 3425, 40, 400.00, '2026-03-26 12:28:11'),
(4353, 749, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4354, 749, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4355, 749, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4356, 750, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4357, 750, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4358, 750, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4359, 750, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4360, 751, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4361, 751, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4362, 751, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4363, 751, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4364, 752, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4365, 752, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4366, 752, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4367, 753, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4368, 753, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4369, 753, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4370, 754, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4371, 754, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4372, 754, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4373, 754, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4374, 755, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4375, 755, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4376, 755, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4377, 755, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4378, 755, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4379, 756, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4380, 756, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4381, 756, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4382, 756, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4383, 757, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4384, 757, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4385, 757, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4386, 757, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4387, 757, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4388, 758, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4389, 758, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4390, 758, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4391, 759, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4392, 759, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4393, 759, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4394, 759, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4395, 760, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4396, 760, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4397, 760, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4398, 760, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4399, 761, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4400, 761, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4401, 761, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4402, 761, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4403, 761, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4404, 762, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4405, 762, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4406, 762, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4407, 762, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4408, 763, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4409, 763, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4410, 763, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4411, 763, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4412, 763, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4413, 764, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4414, 764, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4415, 764, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4416, 764, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4417, 764, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4418, 765, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4419, 765, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4420, 765, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4421, 765, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4422, 765, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4423, 766, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4424, 766, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4425, 766, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4426, 767, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4427, 767, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4428, 767, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4429, 767, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4430, 768, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4431, 768, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4432, 768, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4433, 768, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4434, 768, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4435, 769, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4436, 769, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4437, 769, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4438, 769, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4439, 769, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4440, 770, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4441, 770, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4442, 770, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4443, 771, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4444, 771, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4445, 771, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4446, 771, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4447, 771, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4448, 772, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4449, 772, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4450, 772, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4451, 772, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4452, 772, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4453, 773, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4454, 773, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4455, 773, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4456, 774, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4457, 774, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4458, 774, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4459, 774, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4460, 775, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4461, 775, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4462, 775, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4463, 775, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4464, 775, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4465, 776, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4466, 776, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4467, 776, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4468, 777, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4469, 777, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4470, 777, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4471, 777, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4472, 777, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4473, 778, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4474, 778, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4475, 778, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4476, 778, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4477, 779, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4478, 779, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4479, 779, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4480, 779, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4481, 779, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4482, 780, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4483, 780, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4484, 780, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4485, 781, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4486, 781, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4487, 781, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4488, 782, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4489, 782, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4490, 782, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4491, 782, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4492, 783, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4493, 783, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4494, 783, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4495, 783, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4496, 783, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4497, 784, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4498, 784, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4499, 784, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4500, 785, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4501, 785, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4502, 785, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4503, 785, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4504, 786, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4505, 786, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4506, 786, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4507, 786, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4508, 787, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4509, 787, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4510, 787, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4511, 787, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4512, 787, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4513, 788, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4514, 788, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4515, 788, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4516, 788, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4517, 788, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4518, 789, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4519, 789, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4520, 789, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4521, 790, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4522, 790, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4523, 790, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4524, 791, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4525, 791, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4526, 791, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4527, 792, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4528, 792, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4529, 792, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4530, 793, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4531, 793, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4532, 793, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4533, 793, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4534, 793, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4535, 794, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4536, 794, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4537, 794, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4538, 795, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4539, 795, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4540, 795, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4541, 796, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4542, 796, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4543, 796, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4544, 797, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4545, 797, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4546, 797, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4547, 797, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4548, 798, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4549, 798, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4550, 798, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4551, 799, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4552, 799, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4553, 799, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4554, 800, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4555, 800, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4556, 800, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4557, 800, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4558, 800, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4559, 801, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4560, 801, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4561, 801, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4562, 801, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4563, 801, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4564, 802, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4565, 802, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4566, 802, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4567, 802, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4568, 803, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4569, 803, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4570, 803, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4571, 803, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4572, 803, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4573, 804, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4574, 804, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4575, 804, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4576, 804, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4577, 805, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4578, 805, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4579, 805, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4580, 805, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4581, 806, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4582, 806, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4583, 806, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4584, 806, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4585, 806, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4586, 807, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4587, 807, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4588, 807, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4589, 807, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4590, 807, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4591, 808, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4592, 808, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4593, 808, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4594, 808, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4595, 809, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4596, 809, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4597, 809, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4598, 809, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4599, 809, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4600, 810, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4601, 810, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4602, 810, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4603, 810, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4604, 810, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4605, 811, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4606, 811, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4607, 811, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4608, 811, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4609, 812, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4610, 812, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4611, 812, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4612, 812, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4613, 813, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4614, 813, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4615, 813, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4616, 814, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4617, 814, 3421, 50, 500.00, '2026-03-26 12:28:12'),
(4618, 814, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4619, 815, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4620, 815, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4621, 815, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4622, 816, 3424, 100, 300.00, '2026-03-26 12:28:12'),
(4623, 816, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4624, 816, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4625, 816, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4626, 817, 4135, 12, 2000.00, '2026-03-26 12:28:12'),
(4627, 817, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4628, 817, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4629, 818, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4630, 818, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4631, 818, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4632, 819, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4633, 819, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4634, 819, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4635, 820, 4136, 22, 1800.00, '2026-03-26 12:28:12'),
(4636, 820, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4637, 820, 4138, 20, 900.00, '2026-03-26 12:28:12'),
(4638, 820, 3422, 30, 750.00, '2026-03-26 12:28:12'),
(4639, 821, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4640, 821, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4641, 821, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4642, 821, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4643, 821, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4644, 822, 4132, 15, 1100.00, '2026-03-26 12:28:12'),
(4645, 822, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4646, 822, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4647, 823, 4139, 28, 1300.00, '2026-03-26 12:28:12'),
(4648, 823, 4140, 35, 600.00, '2026-03-26 12:28:12'),
(4649, 823, 4133, 18, 1500.00, '2026-03-26 12:28:12'),
(4650, 823, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4651, 824, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4652, 824, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4653, 824, 4134, 10, 3500.00, '2026-03-26 12:28:12'),
(4654, 825, 4137, 8, 2800.00, '2026-03-26 12:28:12'),
(4655, 825, 4141, 15, 2500.00, '2026-03-26 12:28:12'),
(4656, 825, 3423, 20, 1200.00, '2026-03-26 12:28:12'),
(4657, 825, 3425, 40, 400.00, '2026-03-26 12:28:12'),
(4658, 826, 4131, 25, 800.00, '2026-03-26 12:28:12'),
(4659, 826, 4132, 15, 1100.00, '2026-03-26 12:28:13'),
(4660, 826, 3422, 30, 750.00, '2026-03-26 12:28:13'),
(4661, 826, 3421, 50, 500.00, '2026-03-26 12:28:13'),
(4662, 827, 4135, 12, 2000.00, '2026-03-26 12:28:13'),
(4663, 827, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4664, 827, 3424, 100, 300.00, '2026-03-26 12:28:13'),
(4665, 827, 4131, 25, 800.00, '2026-03-26 12:28:13'),
(4666, 827, 4136, 22, 1800.00, '2026-03-26 12:28:13'),
(4667, 828, 4133, 18, 1500.00, '2026-03-26 12:28:13'),
(4668, 828, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4669, 828, 3423, 20, 1200.00, '2026-03-26 12:28:13'),
(4670, 828, 3425, 40, 400.00, '2026-03-26 12:28:13'),
(4671, 829, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4672, 829, 4133, 18, 1500.00, '2026-03-26 12:28:13'),
(4673, 829, 3421, 50, 500.00, '2026-03-26 12:28:13'),
(4674, 829, 4134, 10, 3500.00, '2026-03-26 12:28:13'),
(4675, 830, 3421, 50, 500.00, '2026-03-26 12:28:13'),
(4676, 830, 3424, 100, 300.00, '2026-03-26 12:28:13'),
(4677, 830, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4678, 830, 4133, 18, 1500.00, '2026-03-26 12:28:13'),
(4679, 831, 4139, 28, 1300.00, '2026-03-26 12:28:13'),
(4680, 831, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4681, 831, 3423, 20, 1200.00, '2026-03-26 12:28:13'),
(4682, 832, 4137, 8, 2800.00, '2026-03-26 12:28:13'),
(4683, 832, 3424, 100, 300.00, '2026-03-26 12:28:13'),
(4684, 832, 4140, 35, 600.00, '2026-03-26 12:28:13'),
(4685, 833, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4686, 833, 3423, 20, 1200.00, '2026-03-26 12:28:13'),
(4687, 833, 4137, 8, 2800.00, '2026-03-26 12:28:13'),
(4688, 834, 4140, 35, 600.00, '2026-03-26 12:28:13'),
(4689, 834, 4133, 18, 1500.00, '2026-03-26 12:28:13'),
(4690, 834, 4134, 10, 3500.00, '2026-03-26 12:28:13'),
(4691, 834, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4692, 834, 4131, 25, 800.00, '2026-03-26 12:28:13'),
(4693, 835, 3424, 100, 300.00, '2026-03-26 12:28:13'),
(4694, 835, 4139, 28, 1300.00, '2026-03-26 12:28:13'),
(4695, 835, 4141, 15, 2500.00, '2026-03-26 12:28:13'),
(4696, 835, 4136, 22, 1800.00, '2026-03-26 12:28:13'),
(4697, 835, 4140, 35, 600.00, '2026-03-26 12:28:13'),
(4698, 836, 4133, 18, 1500.00, '2026-03-26 12:28:13'),
(4699, 836, 3423, 20, 1200.00, '2026-03-26 12:28:13'),
(4700, 836, 4131, 25, 800.00, '2026-03-26 12:28:13'),
(4701, 836, 4140, 35, 600.00, '2026-03-26 12:28:13');

-- --------------------------------------------------------

--
-- Structure de la table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `user_id`, `subject`, `message`, `status`, `priority`, `created_at`, `updated_at`) VALUES
(1, 2, 'Problème de recharge', 'J\'ai rechargé 5000 FCFA mais mon solde n\'a pas bougé.', 'open', 'high', '2026-03-29 13:18:53', '2026-03-29 13:18:53'),
(2, 2, 'Pharmacie non trouvée', 'La pharmacie \"5ème Galaxie\" est fermée alors qu\'elle est notée ouverte.', 'resolved', 'medium', '2026-03-29 13:18:53', '2026-03-29 13:18:53');

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

CREATE TABLE `transactions` (
  `id` varchar(16) NOT NULL,
  `user_id` int(11) NOT NULL,
  `medicament_search` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('topup','payment','refund') DEFAULT 'payment',
  `payment_method` enum('wallet','mtn','airtel','card') DEFAULT 'mtn',
  `mobile_money_ref` varchar(100) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `medicament_search`, `amount`, `type`, `payment_method`, `mobile_money_ref`, `reference`, `status`, `created_at`, `completed_at`) VALUES
('', 2, 'Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 20:37:29', '2026-03-29 20:37:29'),
('0GYR5RARGKW1', 2, 'Paracétamol 500mg', 300.00, 'payment', 'mtn', 'TICTAC_1774879399463_6P34GL', NULL, 'completed', '2026-03-30 14:03:19', '2026-03-30 14:03:25'),
('1', 7, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774530554942_03KHQW', NULL, 'completed', '2026-03-26 13:09:14', '2026-03-26 14:44:30'),
('13', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774532076829_KLWAYQ', NULL, 'completed', '2026-03-26 13:34:36', '2026-03-26 14:44:30'),
('14', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774534392960_7XWBTA', NULL, 'completed', '2026-03-26 14:13:12', '2026-03-26 14:17:11'),
('15', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774534721120_47V6BV', NULL, 'completed', '2026-03-26 14:23:13', '2026-03-26 14:44:30'),
('16', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774535605657_BLSYT5', NULL, 'completed', '2026-03-26 14:33:25', '2026-03-26 14:43:29'),
('17', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774537843413_LDSRMN', NULL, 'completed', '2026-03-26 15:10:43', '2026-03-26 15:11:13'),
('18', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774539735473_7XDEV6', NULL, 'completed', '2026-03-26 15:42:15', '2026-03-26 15:42:21'),
('19', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774543835166_ZF5H22', NULL, 'completed', '2026-03-26 16:50:35', '2026-03-26 16:50:41'),
('1QMWK6WNW982', 2, 'Paracétamol 500mg, Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-30 02:05:15', '2026-03-30 02:05:15'),
('20', 2, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_1774544173785_C0TAOQ', NULL, 'completed', '2026-03-26 16:56:13', '2026-03-26 16:56:21'),
('21', 2, 'Paracétamol 500mg', 500.00, 'payment', 'mtn', 'TICTAC_1774604089909_4431N2', NULL, 'completed', '2026-03-27 09:34:49', '2026-03-27 09:34:55'),
('22', 2, 'Paracétamol 500mg', 500.00, 'payment', 'mtn', 'TICTAC_1774622169960_AMNN3S', NULL, 'completed', '2026-03-27 14:36:09', '2026-03-27 14:36:16'),
('23', 2, 'Paracétamol 500mg', 500.00, 'payment', 'mtn', 'TICTAC_1774624241749_O18NBG', NULL, 'completed', '2026-03-27 15:10:41', '2026-03-27 15:10:48'),
('24', 2, 'Chloroquine 250mg, Quinine 500mg, Paracétamol 500mg', 500.00, 'payment', 'mtn', 'TICTAC_1774629941121_OMABDU', NULL, 'completed', '2026-03-27 16:45:41', '2026-03-27 16:45:47'),
('25', 2, 'Paracétamol 500mg, Quinine 500mg', 500.00, 'payment', 'mtn', 'TICTAC_1774630111196_GLXRZ1', NULL, 'completed', '2026-03-27 16:48:31', '2026-03-27 16:48:37'),
('26', 25, 'Amlodipine 5mg, Aspirine 100mg', 500.00, 'payment', 'mtn', 'TICTAC_1774791493180_4P0PK2', NULL, 'completed', '2026-03-29 13:38:13', '2026-03-29 13:38:19'),
('27', 25, 'Amlodipine 5mg, Aspirine 100mg', 500.00, 'payment', 'mtn', 'TICTAC_1774791776018_SD8IY9', NULL, 'completed', '2026-03-29 13:42:55', '2026-03-29 13:43:02'),
('28', 25, 'pour les test', 3000.00, 'topup', '', NULL, NULL, 'completed', '2026-03-29 14:58:42', NULL),
('29', 25, 'Paracétamol 500mg, Chloroquine 250mg, Hydrochlorothiazide 25mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 15:00:01', '2026-03-29 15:00:01'),
('3', 8, 'paracetamol', 500.00, 'payment', 'mtn', 'TICTAC_TEST_001', NULL, 'completed', '2026-03-26 11:47:59', '2026-03-26 12:25:59'),
('30', 25, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 15:04:26', '2026-03-29 15:04:26'),
('31', 2, 'test', 4000.00, 'topup', '', NULL, NULL, 'completed', '2026-03-29 17:44:21', NULL),
('32', 2, 'Paracétamol 500mg, Chloroquine 250mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 17:45:51', '2026-03-29 17:45:51'),
('33', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 17:49:47', '2026-03-29 17:49:47'),
('34', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 17:55:45', '2026-03-29 17:55:45'),
('35', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 17:58:53', '2026-03-29 17:58:53'),
('36', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 18:14:12', '2026-03-29 18:14:12'),
('37', 2, 'Paracétamol 500mg, Chloroquine 250mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 18:35:04', '2026-03-29 18:35:04'),
('38', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 18:37:54', '2026-03-29 18:37:54'),
('39', 2, 'Paracétamol 500mg, Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 19:14:50', '2026-03-29 19:14:50'),
('4', 9, 'amoxicilline', 500.00, 'payment', 'mtn', 'TICTAC_TEST_002', NULL, 'completed', '2026-03-26 13:17:59', '2026-03-26 12:01:59'),
('40', 2, 'Paracétamol 500mg, Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 19:22:14', '2026-03-29 19:22:14'),
('41', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 19:29:28', '2026-03-29 19:29:29'),
('42', 2, 'Chloroquine 250mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 19:31:06', '2026-03-29 19:31:06'),
('43', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 19:34:33', '2026-03-29 19:34:33'),
('44', 2, 'Paracétamol 500mg, Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-29 19:42:28', '2026-03-29 19:42:28'),
('45', 2, 'Paracétamol 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'failed', '2026-03-29 19:48:34', NULL),
('46', 2, 'Paracétamol 500mg', 300.00, 'payment', 'mtn', 'TICTAC_1774813756200_S5JDP1', NULL, 'completed', '2026-03-29 19:49:16', '2026-03-29 19:49:23'),
('47', 2, 'Crédit admin', 4000.00, 'topup', '', NULL, NULL, 'completed', '2026-03-29 20:19:09', NULL),
('5', 10, 'ibuprofene', 500.00, 'payment', 'mtn', 'TICTAC_TEST_003', NULL, 'completed', '2026-03-26 12:43:59', '2026-03-26 12:23:59'),
('6', 11, 'vitamine', 500.00, 'payment', 'mtn', 'TICTAC_TEST_004', NULL, 'completed', '2026-03-26 12:20:59', '2026-03-26 11:26:59'),
('7', 12, 'antibiotique', 500.00, 'payment', 'mtn', 'TICTAC_TEST_005', NULL, 'completed', '2026-03-26 12:27:59', '2026-03-26 12:54:59'),
('8OC3MJ31Y59D', 2, 'Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-30 00:09:37', '2026-03-30 00:09:37'),
('LBV3THPLKCET', 2, 'Paracétamol 500mg, Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-30 01:13:24', '2026-03-30 01:13:24'),
('UC8LMD8L4VH4', 2, 'Paracétamol 500mg, Amoxicilline 500mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-30 00:19:25', '2026-03-30 00:19:25'),
('VCNEDKW6AU2A', 2, 'Amoxicilline 500mg, Salbutamol 100µg, Paracétamol 500mg, Chloroquine 250mg, Hydrochlorothiazide 25mg', 300.00, 'payment', 'wallet', NULL, NULL, 'completed', '2026-03-30 01:58:32', '2026-03-30 01:58:32');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL COMMENT 'Ville de l''utilisateur',
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('user','pharmacy','admin') DEFAULT 'user',
  `wallet_balance` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `phone`, `email`, `first_name`, `last_name`, `city`, `password_hash`, `role`, `wallet_balance`, `created_at`, `updated_at`) VALUES
(2, '+242068373874', 'pkimpalou@gmail.com', 'Client', 'Test', NULL, '$2a$10$3pMeI7ZBGqHS1vxRpG7t9OyiGbZfySkZ9Lgc4AmNxWcNSZK84yMje', 'user', 2300.00, '2026-03-26 12:53:33', '2026-03-30 02:33:30'),
(3, '+242123456789', NULL, 'Test', 'User', NULL, '$2a$10$LqGQwpyBRjEC.GtgFkcN3e4lMHm3IAmFhMCoGqU.PSA871kadz.A.', 'user', 0.00, '2026-03-26 13:06:45', '2026-03-26 13:06:45'),
(4, '+242123456780', NULL, 'Test', 'User', NULL, '$2a$10$w67JErpvb1CChItJfn4OaeWtQEvsSocdsjMDgeGvmD2hKik7ORAdG', 'user', 0.00, '2026-03-26 13:08:12', '2026-03-26 13:08:12'),
(5, '+242123456781', NULL, 'Test', 'User', NULL, '$2a$10$mSGgExaBDhKr4YDT9eTVNebTeX9PVqX0ATZtCy0eDW2Vj18520V5i', 'user', 0.00, '2026-03-26 13:08:39', '2026-03-26 13:08:39'),
(6, '+242123456782', NULL, 'Test', 'User', NULL, '$2a$10$RyFsDjm2d/Q5M9dsTW2F1uxQPc2QQ4U/kd.K75op3JLzg0rkEKn.i', 'user', 0.00, '2026-03-26 13:08:51', '2026-03-26 13:08:51'),
(7, '+242123456783', NULL, 'Test', 'User', NULL, '$2a$10$bVHOMd040FdiQzNpTCIIbutCCvOP40Sng9j/BRtraszj6miGzgd1.', 'user', 0.00, '2026-03-26 13:09:14', '2026-03-26 13:09:14'),
(8, '+242061234001', 'contact@pharmacie-centre.cg', 'Paul', 'Admin', 'Brazzaville', '$2a$10$3pMeI7ZBGqHS1vxRpG7t9OyiGbZfySkZ9Lgc4AmNxWcNSZK84yMje', 'admin', 0.00, '2026-03-26 13:17:30', '2026-03-30 02:33:30'),
(9, '+242061234002', 'info@pharmacie-mairie.cg', 'Cécile', 'Bouka', 'Brazzaville', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 0.00, '2026-03-26 13:17:30', '2026-03-26 13:17:30'),
(10, '+242061234003', 'contact@pharmacie-pointenoire.cg', 'André', 'Mouamba', 'Pointe-Noire', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 0.00, '2026-03-26 13:17:30', '2026-03-26 13:17:30'),
(11, '+242061234004', 'sante@dolisie.cg', 'Marcel', 'Loundou', 'Dolisie', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 0.00, '2026-03-26 13:17:30', '2026-03-26 13:17:30'),
(12, '+242061234005', 'pharma@owando.cg', 'Lucie', 'Mampouya', 'Owando', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 0.00, '2026-03-26 13:17:30', '2026-03-26 13:17:30'),
(23, '+242061234567', NULL, 'ytttytt', 'hyyy', NULL, '$2a$10$rasDGmIyGxoc9dUTIRDPBeLsAbdj.MsPGdtXuLi76NNfAvjgpxPKq', 'user', 0.00, '2026-03-27 12:10:06', '2026-03-27 12:10:06'),
(24, '+242000000000', 'admin@tictac.cg', 'Admin', 'Platform', NULL, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 0.00, '2026-03-27 15:19:20', '2026-03-27 15:19:20'),
(25, '+242000111111', NULL, 'qqq', 'qqq', NULL, '$2a$10$NhB2f4hahchABT8oa04pKe8prMOR1OqbECVZkgWSnqMZiYfYalJly', 'user', 2400.00, '2026-03-29 13:36:41', '2026-03-29 15:04:26'),
(26, '+242065555555', NULL, 'Pharmacie', 'Centrale', NULL, '$2a$10$3pMeI7ZBGqHS1vxRpG7t9OyiGbZfySkZ9Lgc4AmNxWcNSZK84yMje', 'pharmacy', 0.00, '2026-03-30 02:33:30', '2026-03-30 02:33:30'),
(27, '+242066180563', 'dorcaskoualou@gmail.com', 'Dorcas', 'Koualou', NULL, '$2a$10$kkv24pkodoDNLZBVPMzyye0Af9hqMprASivLIZ4jBj4l6HEPR4Uje', 'user', 0.00, '2026-03-30 04:23:49', '2026-03-30 04:23:49');

-- --------------------------------------------------------

--
-- Structure de la table `user_favorites`
--

CREATE TABLE `user_favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `medicament_id` int(11) NOT NULL,
  `pharmacy_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_locations`
--

CREATE TABLE `user_locations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_tokens`
--

CREATE TABLE `user_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_type` enum('fcm','apns') NOT NULL DEFAULT 'fcm',
  `token_value` varchar(255) NOT NULL,
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`device_info`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `medicaments`
--
ALTER TABLE `medicaments`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `medicaments` ADD FULLTEXT KEY `idx_search` (`name`,`description`,`generic_name`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_unread` (`user_id`,`is_read`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `payouts`
--
ALTER TABLE `payouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pharmacy_id` (`pharmacy_id`);

--
-- Index pour la table `pharmacies`
--
ALTER TABLE `pharmacies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_active` (`is_active`);

--
-- Index pour la table `pharmacy_reviews`
--
ALTER TABLE `pharmacy_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_pharmacy` (`user_id`,`pharmacy_id`),
  ADD KEY `idx_pharmacy_rating` (`pharmacy_id`,`rating`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `pharmacy_subscriptions`
--
ALTER TABLE `pharmacy_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pharmacy` (`pharmacy_id`),
  ADD KEY `idx_status` (`status`);

--
-- Index pour la table `search_sessions`
--
ALTER TABLE `search_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transaction` (`transaction_id`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Index pour la table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pharmacy_medicament` (`pharmacy_id`,`medicament_id`),
  ADD KEY `idx_medicament` (`medicament_id`),
  ADD KEY `idx_quantity` (`quantity`);

--
-- Index pour la table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_support_user` (`user_id`);

--
-- Index pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile_money_ref` (`mobile_money_ref`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_mobile_ref` (`mobile_money_ref`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_phone` (`phone`),
  ADD KEY `idx_users_city` (`city`);

--
-- Index pour la table `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_medicament_pharmacy` (`user_id`,`medicament_id`,`pharmacy_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_medicament` (`medicament_id`),
  ADD KEY `pharmacy_id` (`pharmacy_id`);

--
-- Index pour la table `user_locations`
--
ALTER TABLE `user_locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_location` (`user_id`),
  ADD KEY `idx_coordinates` (`latitude`,`longitude`),
  ADD KEY `idx_updated_at` (`updated_at`);

--
-- Index pour la table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_token` (`token_value`),
  ADD KEY `idx_user_active` (`user_id`,`is_active`),
  ADD KEY `idx_token_type` (`token_type`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `medicaments`
--
ALTER TABLE `medicaments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4142;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `payouts`
--
ALTER TABLE `payouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pharmacies`
--
ALTER TABLE `pharmacies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=838;

--
-- AUTO_INCREMENT pour la table `pharmacy_reviews`
--
ALTER TABLE `pharmacy_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `pharmacy_subscriptions`
--
ALTER TABLE `pharmacy_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4702;

--
-- AUTO_INCREMENT pour la table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `user_favorites`
--
ALTER TABLE `user_favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `user_locations`
--
ALTER TABLE `user_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_tokens`
--
ALTER TABLE `user_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `payouts`
--
ALTER TABLE `payouts`
  ADD CONSTRAINT `payouts_ibfk_1` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`);

--
-- Contraintes pour la table `pharmacy_reviews`
--
ALTER TABLE `pharmacy_reviews`
  ADD CONSTRAINT `pharmacy_reviews_ibfk_1` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pharmacy_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `pharmacy_subscriptions`
--
ALTER TABLE `pharmacy_subscriptions`
  ADD CONSTRAINT `pharmacy_subscriptions_ibfk_1` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`);

--
-- Contraintes pour la table `search_sessions`
--
ALTER TABLE `search_sessions`
  ADD CONSTRAINT `search_sessions_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`);

--
-- Contraintes pour la table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `stocks_ibfk_1` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stocks_ibfk_2` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `fk_support_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_favorites_ibfk_2` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_favorites_ibfk_3` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `user_locations`
--
ALTER TABLE `user_locations`
  ADD CONSTRAINT `user_locations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
