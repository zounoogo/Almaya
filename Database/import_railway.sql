-- Simple import for Railway
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `cartitems`;
DROP TABLE IF EXISTS `offers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `locations`;
DROP TABLE IF EXISTS `categories`;

SET FOREIGN_KEY_CHECKS = 1;

-- Categories
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` VALUES 
(1, 'Guide Touristique', 'guide-touristique', 'Professional guided tours in key Moroccan cities.', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763386286/WhatsApp_Image_2025-10-13_%C3%A0_19.27.43_e6ddc733_nv1ttz.jpg', NOW()),
(2, 'Activités', 'activites', 'Leisure, adventure, and cultural experiences across Morocco.', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', NOW()),
(6, 'Hebergement', 'hebergement', 'Accommodation options in major tourist destinations.', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg', NOW());

-- Locations
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `region` varchar(255) DEFAULT 'Morocco',
  `image` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `locations` VALUES
(1, 'Marrakech', 'marrakech', 'Marrakech-Safi', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', NOW()),
(2, 'Tanger', 'tanger', 'Tanger-Tétouan-Al Hoceïma', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', NOW()),
(3, 'Casablanca', 'casablanca', 'Casablanca-Settat', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg', NOW()),
(4, 'Rabat', 'rabat', 'Rabat-Salé-Kénitra', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', NOW()),
(5, 'Agadir', 'agadir', 'Souss-Massa', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988141/WhatsApp_Image_2025-10-15_at_00.27.32_1_vinfr4.jpg', NOW());

-- Users
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'customer',
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `verificationToken` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` VALUES (1, 'admin', 'admin@almaya.ma', '$2b$10$XJWAK510G8U39geDy5wd6emGH8j7ZldHWmYdF4CmbOAP34I3lRJwS', 'admin', 1, NULL, NOW());

-- Offers (sample - add more as needed)
CREATE TABLE `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT 'Discover this amazing experience in Morocco.',
  `price` decimal(10,2) DEFAULT 0.00,
  `infos_price` varchar(255) DEFAULT 'Price on request',
  `image` varchar(512) DEFAULT NULL,
  `duration` varchar(50) DEFAULT 'Flexible',
  `service_type_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_category` (`service_type_id`),
  KEY `fk_location` (`location_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`service_type_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `offers` VALUES
(1, 'Guide Marrakech', 'Explore Marrakech with a professional guide', 50.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 1, 1, NOW()),
(2, 'Quad & Chameau', 'Adventure combo in Marrakech', 75.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988077/1_8ebbb428-cfc1-4b17-a316-84b4b96fe9c1_ze0aop.webp', 'Half Day', 2, 1, NOW()),
(3, 'Jardin Majorelle', 'Visit the famous garden', 15.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988075/Capture_d_%C3%A9cran_2025-11-22_085315_eftrfe.png', '2 hours', 2, 1, NOW());

-- Cart Items
CREATE TABLE `cartitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_offer` (`user_id`,`offer_id`),
  KEY `offer_id` (`offer_id`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
