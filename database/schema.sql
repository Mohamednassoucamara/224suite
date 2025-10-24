-- Schéma de base de données MySQL pour 224Suite
-- Base de données immobilière pour Conakry, Guinée

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS `224suite` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `224suite`;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user', 'agent', 'admin') DEFAULT 'user',
  `is_active` boolean DEFAULT true,
  `email_verified` boolean DEFAULT false,
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des propriétés
CREATE TABLE IF NOT EXISTS `properties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `type` enum('apartment', 'house', 'villa', 'land', 'commercial', 'office') NOT NULL,
  `status` enum('for-sale', 'for-rent', 'sold', 'rented') NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `area` decimal(10,2) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `floors` int(11) DEFAULT NULL,
  `year_built` int(11) DEFAULT NULL,
  `address` varchar(500) NOT NULL,
  `city` varchar(100) DEFAULT 'Conakry',
  `district` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `features` json DEFAULT NULL,
  `amenities` json DEFAULT NULL,
  `is_featured` boolean DEFAULT false,
  `is_active` boolean DEFAULT true,
  `views_count` int(11) DEFAULT 0,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_type` (`type`),
  INDEX `idx_status` (`status`),
  INDEX `idx_price` (`price`),
  INDEX `idx_city` (`city`),
  INDEX `idx_district` (`district`),
  INDEX `idx_is_featured` (`is_featured`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_user_id` (`user_id`),
  FULLTEXT INDEX `idx_search` (`title`, `description`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des images de propriétés
CREATE TABLE IF NOT EXISTS `property_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `is_primary` boolean DEFAULT false,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE,
  INDEX `idx_property_id` (`property_id`),
  INDEX `idx_is_primary` (`is_primary`),
  INDEX `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des favoris
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_property` (`user_id`, `property_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_property_id` (`property_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des messages/contacts
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_read` boolean DEFAULT false,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_property_id` (`property_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `appointment_date` datetime NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_property_id` (`property_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_appointment_date` (`appointment_date`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des abonnements
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` varchar(50) NOT NULL,
  `status` enum('active', 'cancelled', 'expired') DEFAULT 'active',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `payment_method` varchar(50) DEFAULT NULL,
  `stripe_subscription_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_plan_id` (`plan_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_end_date` (`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des recherches sauvegardées
CREATE TABLE IF NOT EXISTS `saved_searches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `search_criteria` json NOT NULL,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer des données de test
INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `phone`, `role`, `email_verified`) VALUES
('admin@224suite.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', '224Suite', '+224123456789', 'admin', true),
('agent@224suite.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Agent', 'Immobilier', '+224123456790', 'agent', true),
('user@224suite.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Utilisateur', 'Test', '+224123456791', 'user', true);

-- Insérer des propriétés de test
INSERT INTO `properties` (`title`, `description`, `type`, `status`, `price`, `area`, `bedrooms`, `bathrooms`, `address`, `district`, `latitude`, `longitude`, `user_id`) VALUES
('Villa moderne à Kaloum', 'Magnifique villa moderne avec jardin, 3 chambres, salon spacieux, cuisine équipée. Située dans le quartier résidentiel de Kaloum.', 'villa', 'for-sale', 150000.00, 200.00, 3, 2, 'Kaloum, Conakry', 'Kaloum', 9.5370, -13.6785, 2),
('Appartement 2 chambres à Dixinn', 'Bel appartement au 3ème étage avec vue sur mer. 2 chambres, salon, cuisine, salle de bain. Proche de l\'université.', 'apartment', 'for-rent', 500.00, 80.00, 2, 1, 'Dixinn, Conakry', 'Dixinn', 9.6000, -13.6000, 2),
('Terrain constructible à Ratoma', 'Terrain de 500m² constructible, viabilisé, proche des commodités. Idéal pour construction de villa ou immeuble.', 'land', 'for-sale', 25000.00, 500.00, NULL, NULL, 'Ratoma, Conakry', 'Ratoma', 9.7000, -13.5000, 2);
