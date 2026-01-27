-- ALMAYA Tourism Platform - Production Database
-- Optimized and cleaned version
-- Date: January 27, 2026

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Database Creation
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `railway` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `railway`;

-- --------------------------------------------------------
-- Table: categories
-- --------------------------------------------------------

DROP TABLE IF EXISTS `categories`;
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

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`) VALUES
(1, 'Guide Touristique', 'guide-touristique', 'Professional guided tours in key Moroccan cities.', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763386286/WhatsApp_Image_2025-10-13_%C3%A0_19.27.43_e6ddc733_nv1ttz.jpg'),
(2, 'Activités', 'activites', 'Leisure, adventure, and cultural experiences across Morocco.', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(6, 'Hebergement', 'hebergement', 'Accommodation options in major tourist destinations.', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg');

-- --------------------------------------------------------
-- Table: locations
-- --------------------------------------------------------

DROP TABLE IF EXISTS `locations`;
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

INSERT INTO `locations` (`id`, `name`, `slug`, `region`, `image`) VALUES
(1, 'Marrakech', 'marrakech', 'Marrakech-Safi', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(2, 'Tanger', 'tanger', 'Tanger-Tétouan-Al Hoceïma', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(3, 'Casablanca', 'casablanca', 'Casablanca-Settat', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg'),
(4, 'Rabat', 'rabat', 'Rabat-Salé-Kénitra', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(5, 'Agadir', 'agadir', 'Souss-Massa', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988141/WhatsApp_Image_2025-10-15_at_00.27.32_1_vinfr4.jpg'),
(6, 'Merzouga', 'merzouga', 'Drâa-Tafilalet', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(7, 'Ouarzazate', 'ouarzazate', 'Drâa-Tafilalet', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(8, 'Ifrane', 'ifrane', 'Fès-Meknès', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(9, 'Fes', 'fes', 'Fès-Meknès', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(12, 'Tetouan', 'tetouan', 'Tanger-Tétouan-Al Hoceïma', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg');

-- --------------------------------------------------------
-- Table: offers
-- --------------------------------------------------------

DROP TABLE IF EXISTS `offers`;
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

INSERT INTO `offers` (`id`, `title`, `description`, `price`, `infos_price`, `image`, `duration`, `service_type_id`, `location_id`) VALUES
(1, 'Guide Marrakech (Day)', 'Explore the historical heart of Marrakech with a professional guide.', 50.00, 'per group (up to 4)', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 1, 1),
(2, 'Guide Tanger (Half-Day)', 'A comprehensive tour of Tanger\'s historic sites and markets.', 35.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Half Day', 1, 2),
(3, 'Guide Casablanca', 'Discover Casablanca\'s modern architecture and cultural spots.', 60.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg', 'Full Day', 1, 3),
(4, 'Quad & Chameau Combo', 'Adventure combo: quad biking and camel ride near the palm grove.', 75.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988077/1_8ebbb428-cfc1-4b17-a316-84b4b96fe9c1_ze0aop.webp', '3 hours', 2, 1),
(5, 'Mosquée Hassan II Visit', 'Guided tour of the magnificent Hassan II Mosque.', 12.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg', '1 hour', 2, 3),
(6, 'Vallée des Oudayas Tour', 'Stroll and discover the picturesque Kasbah of the Oudayas.', 25.00, 'Guide included', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988132/WhatsApp_Image_2025-10-13_at_20.29.40_adprkw.jpg', '2 hours', 2, 4),
(7, 'Guide Marrakech', 'Service de guide touristique professionnel pour la ville de Marrakech.', 50.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 1, 1),
(8, 'Guide Tanger', 'Service de guide touristique pour la ville de Tanger.', 45.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 1, 2),
(9, 'Guide Casablanca', 'Service de guide touristique pour la ville de Casablanca.', 60.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg', 'Full Day', 1, 3),
(10, 'Guide Rabat', 'Service de guide touristique pour la ville de Rabat.', 50.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', 'Full Day', 1, 4),
(11, 'Guide Agadir', 'Service de guide touristique pour la ville de Agadir.', 45.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988141/WhatsApp_Image_2025-10-15_at_00.27.32_1_vinfr4.jpg', 'Full Day', 1, 5),
(12, 'Guide Merzouga', 'Service de guide touristique pour la région de Merzouga et le désert.', 70.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 1, 6),
(13, 'Guide Ouarzazate', 'Service de guide touristique pour la ville de Ouarzazate.', 55.00, 'per group', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 1, 7),
(14, 'Quad & Chameau', 'Aventure combinée : balade en quad et à dos de chameau.', 75.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988077/1_8ebbb428-cfc1-4b17-a316-84b4b96fe9c1_ze0aop.webp', 'Half Day', 2, 1),
(15, 'Visite de l\'Ourika', 'Excursion dans la vallée de l\'Ourika avec cascades.', 80.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 2, 1),
(16, 'Musée de l\'Eau', 'Visite du Musée Mohammed VI pour l\'Eau et la Civilisation.', 15.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', '2 hours', 2, 1),
(17, 'Musée Yves Saint Laurent', 'Découvrez l\'univers du célèbre couturier.', 20.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988076/Capture_d_%C3%A9cran_2025-11-22_085153_qwtvnl.png', '2 hours', 2, 1),
(18, 'Jardin Majorelle', 'Promenade dans le magnifique jardin botanique.', 15.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988075/Capture_d_%C3%A9cran_2025-11-22_085315_eftrfe.png', '1.5 hours', 2, 1),
(19, 'Cuisine avec des chefs marocains', 'Atelier de cuisine marocaine traditionnelle.', 90.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988076/where-to-learn-moroccan-cooking-techniques-in-marrakech-workshops-and-renowned-chefs_yb1jjy.jpg', 'Half Day', 2, 1),
(20, 'Poterie en famille', 'Atelier de poterie pour la famille.', 40.00, 'per family', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988077/1_8ebbb428-cfc1-4b17-a316-84b4b96fe9c1_ze0aop.webp', '2 hours', 2, 1),
(21, 'Journée à Agafay', 'Excursion au désert d\'Agafay avec déjeuner.', 120.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 2, 1),
(22, 'Menara Mall', 'Shopping et loisirs au Menara Mall.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988078/Capture_d_%C3%A9cran_2025-11-22_090055_lzptvc.png', 'Flexible', 2, 1),
(23, 'Bowling Marrakech', 'Partie de bowling en famille ou entre amis.', 25.00, 'per hour', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/bowling1_rd8qzv.jpg', '1-2 hours', 2, 1),
(24, 'Shopping Carré Eden', 'Centre commercial Carré Eden.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988064/carre_eden_xcodgq.jpg', 'Flexible', 2, 1),
(25, 'Visite de la Place Jemaa el-Fna', 'Découverte de la célèbre place et ses animations.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988065/jeema_el_fna_cv8qvk.jpg', 'Flexible', 2, 1),
(26, 'Henné pour madame', 'Séance de tatouage au henné traditionnel.', 10.00, 'per design', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988067/t%C3%A9l%C3%A9chargement_bx9zpd.jpg', '30 min', 2, 1),
(27, 'Palais Bahia', 'Visite du somptueux Palais Bahia.', 10.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988067/images_ocp19c.jpg', '1.5 hours', 2, 1),
(28, 'Tombeaux Saadiens', 'Découverte des tombeaux de la dynastie Saadienne.', 10.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988068/tombeaux-saadiens-marrakech_z18af8.jpg', '1 hour', 2, 1),
(29, 'Michoui chez Haj Moustapha', 'Expérience culinaire traditionnelle - agneau méchoui.', 50.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/t%C3%A9l%C3%A9chargement_ah9xdb.jpg', '2 hours', 2, 1),
(30, 'Balade en calèche', 'Promenade romantique en calèche dans Marrakech.', 35.00, 'per carriage', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/t%C3%A9l%C3%A9chargement_1_dn7j2h.jpg', '1 hour', 2, 1),
(31, 'Visite à La Mamounia', 'Tour et thé à l\'hôtel mythique La Mamounia.', 40.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/t%C3%A9l%C3%A9chargement_anj8ql.jpg', '2 hours', 2, 1),
(32, 'Mosquée de la Koutoubia', 'Visite extérieure de la Koutoubia (non-musulmans).', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988071/t%C3%A9l%C3%A9chargement_1_bmgebl.jpg', '30 min', 2, 1),
(33, 'Parapente', 'Vol en parapente au-dessus de Marrakech.', 150.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988072/t%C3%A9l%C3%A9chargement_ucntq5.jpg', '2 hours', 2, 1),
(34, 'Montgolfière', 'Vol en montgolfière au lever du soleil.', 200.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988075/t%C3%A9l%C3%A9chargement_1_ecrodj.jpg', '3 hours', 2, 1),
(35, 'Fantasia chez Ali', 'Spectacle Fantasia traditionnel avec dîner.', 70.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988074/t%C3%A9l%C3%A9chargement_nr2lv7.jpg', 'Evening', 2, 1),
(36, 'Tour de la ville Marrakech', 'Circuit touristique complet de la ville.', 40.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Half Day', 2, 1),
(37, 'Villa des Arts', 'Visite de la galerie Villa des Arts.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988080/WhatsApp_Image_2025-10-13_at_19.31.46_vmthjh.jpg', '2 hours', 2, 3),
(38, 'Cinéma Pathé', 'Séance de cinéma au Pathé Morocco Mall.', 15.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988093/WhatsApp_Image_2025-10-13_at_19.36.05_ri8rt0.jpg', '2-3 hours', 2, 3),
(39, 'Morocco Mall', 'Shopping au plus grand centre commercial d\'Afrique.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988094/WhatsApp_Image_2025-10-13_at_19.21.51_xde2jj.jpg', 'Flexible', 2, 3),
(40, 'La Corniche à Ain Diab', 'Promenade sur la corniche d\'Ain Diab.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988097/WhatsApp_Image_2025-10-13_at_19.24.07_qchalk.jpg', 'Flexible', 2, 3),
(41, 'Casa Finance City', 'Découverte du quartier d\'affaires moderne.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988102/WhatsApp_Image_2025-10-13_at_19.26.15_lqqbk0.jpg', '1 hour', 2, 3),
(42, 'Marché Sénégalais', 'Visite du marché Sénégalais et ses produits artisanaux.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988104/WhatsApp_Image_2025-10-13_at_19.26.43_w4xyhm.jpg', '1-2 hours', 2, 3),
(43, 'Plage Casablanca', 'Détente à la plage d\'Ain Diab.', 0.00, 'Free access', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988108/WhatsApp_Image_2025-10-13_at_19.41.14_ez8cgh.jpg', 'Flexible', 2, 3),
(44, 'Marché Habous', 'Balade dans le quartier Habous et son marché traditionnel.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988109/WhatsApp_Image_2025-10-13_at_19.39.05_xw9ywn.jpg', '2 hours', 2, 3),
(45, 'Aqua Parc Casablanca', 'Journée au parc aquatique.', 80.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988081/WhatsApp_Image_2025-10-13_at_19.27.26_1_oj8uwr.jpg', 'Full Day', 2, 3),
(46, 'Patinoire sur glace', 'Séance de patinage sur glace.', 30.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988087/WhatsApp_Image_2025-10-13_at_19.30.16_2_mjqvit.jpg', '1-2 hours', 2, 3),
(47, 'Parc d\'attraction Sindibad', 'Manèges et attractions pour toute la famille.', 60.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg', 'Full Day', 2, 3),
(48, 'Pique-nique au Jardin de la Ligue Arabe', 'Pique-nique familial dans le parc.', 0.00, 'Free access', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988090/WhatsApp_Image_2025-10-13_at_19.33.53_1_xjvqq5.jpg', 'Flexible', 2, 3),
(49, 'Tour de la ville Casablanca', 'Circuit touristique complet de la ville économique.', 45.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg', 'Half Day', 2, 3),
(50, 'Tour Hassan', 'Visite de la Tour Hassan et du mausolée.', 10.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', '1 hour', 2, 4),
(51, 'Place du 16 novembre', 'Découverte de la place principale de Rabat.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988127/WhatsApp_Image_2025-10-13_at_20.41.01_pneohi.jpg', '30 min', 2, 4),
(52, 'Mausolée Mohammed V', 'Visite du mausolée royal.', 10.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988132/WhatsApp_Image_2025-10-13_at_20.28.31_mhazfn.jpg', '1 hour', 2, 4),
(53, 'Kasbah des Oudayas', 'Balade dans la Kasbah des Oudayas.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988132/WhatsApp_Image_2025-10-13_at_20.29.40_adprkw.jpg', '2 hours', 2, 4),
(54, 'Marina Bouregreg', 'Promenade le long de la marina moderne.', 0.00, 'Free access', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', 'Flexible', 2, 4),
(55, 'Plage Rabat', 'Plage de Rabat pour détente et baignade.', 0.00, 'Free access', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', 'Flexible', 2, 4),
(56, 'Kayak Rabat', 'Location de kayak sur le Bouregreg.', 40.00, 'per hour', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988134/WhatsApp_Image_2025-10-13_at_20.23.45_angxrz.jpg', '2 hours', 2, 4),
(57, 'Jet Ski Rabat', 'Session de jet ski sur le Bouregreg.', 80.00, 'per 30 min', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988137/WhatsApp_Image_2025-10-13_at_20.18.10_pm1edt.jpg', '1 hour', 2, 4),
(58, 'Tour en bateau Rabat', 'Promenade en bateau sur le fleuve.', 30.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988140/WhatsApp_Image_2025-10-13_at_20.38.09_rdzjfz.jpg', '1 hour', 2, 4),
(59, 'Balade en pirogue', 'Balade traditionnelle en pirogue.', 25.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988114/WhatsApp_Image_2025-10-13_at_20.24.43_3_ujcltz.jpg', '1 hour', 2, 4),
(60, 'Balade à Hay Riad', 'Quartier résidentiel et commercial moderne.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', 'Flexible', 2, 4),
(61, 'Arribat Center', 'Shopping au centre Arribat.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988116/WhatsApp_Image_2025-10-13_at_20.26.12_1_qwe0iy.jpg', 'Flexible', 2, 4),
(62, 'Marché Sahel', 'Marché local traditionnel.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', '1-2 hours', 2, 4),
(63, 'Mega Mall Rabat', 'Grand centre commercial de Rabat.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988120/WhatsApp_Image_2025-10-13_at_20.26.41_pke8iq.jpg', 'Flexible', 2, 4),
(64, 'Musée Mohammed VI (MMVI)', 'Visite du musée d\'art moderne et contemporain.', 20.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988125/WhatsApp_Image_2025-10-13_at_20.39.18_2_zxz7ou.jpg', '2 hours', 2, 4),
(65, 'Tour de la ville Rabat', 'Circuit touristique complet de la capitale.', 40.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', 'Half Day', 2, 4),
(66, 'Parc Perdicaris', 'Promenade dans le parc forestier.', 0.00, 'Free access', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', '2 hours', 2, 2),
(67, 'Grotte d\'Hercule', 'Visite de la célèbre grotte mythologique.', 10.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', '1 hour', 2, 2),
(68, 'Balade La Marina Smir', 'Promenade à la marina de Smir.', 0.00, 'Free access', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Flexible', 2, 2),
(69, 'Jet Ski Marina Smir', 'Session de jet ski à Marina Smir.', 70.00, 'per 30 min', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', '1 hour', 2, 2),
(70, 'Plongée sous-marine', 'Séance de plongée sous-marine.', 100.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Half Day', 2, 2),
(71, 'Visite de la Ville Bleue (Chefchaouen)', 'Excursion à Chefchaouen depuis Tanger.', 150.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 2, 2),
(72, 'Ancienne Cathédrale', 'Visite de l\'ancienne cathédrale de Tanger.', 5.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', '30 min', 2, 2),
(73, 'Souk Tanger', 'Découverte du souk traditionnel de Tanger.', 0.00, 'Free visit', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', '1-2 hours', 2, 2),
(74, 'Cascade Akchour', 'Randonnée aux cascades d\'Akchour.', 80.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 2, 2),
(75, 'Tour de la ville Tanger', 'Circuit touristique complet de la ville.', 40.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Half Day', 2, 2),
(76, 'Safari Chameau Agadir', 'Balade à dos de chameau sur la plage.', 35.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988141/WhatsApp_Image_2025-10-15_at_00.27.32_1_vinfr4.jpg', '2 hours', 2, 5),
(77, 'Balade à cheval Agadir', 'Promenade à cheval le long de la plage.', 50.00, 'per hour', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988149/WhatsApp_Image_2025-10-15_at_00.29.23_vgvtqj.jpg', '1 hour', 2, 5),
(78, 'Quad and Buggy Agadir', 'Aventure en quad et buggy dans les dunes.', 90.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988151/WhatsApp_Image_2025-10-15_at_00.28.17_gyrqyd.jpg', '2 hours', 2, 5),
(79, 'Jet Ski Agadir', 'Session de jet ski sur l\'océan.', 75.00, 'per 30 min', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988153/WhatsApp_Image_2025-10-15_at_00.27.55_ionyvb.jpg', '1 hour', 2, 5),
(80, 'Parc des Crocodiles (Crocoparc)', 'Visite du parc aux crocodiles.', 25.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988154/WhatsApp_Image_2025-10-15_at_00.31.25_1_soaufj.jpg', '2 hours', 2, 5),
(81, 'Tour de la ville Agadir', 'Circuit touristique complet de la ville balnéaire.', 35.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988141/WhatsApp_Image_2025-10-15_at_00.27.32_1_vinfr4.jpg', 'Half Day', 2, 5),
(82, 'Souk El Had', 'Visite du plus grand souk d\'Agadir.', 0.00, 'Free entry', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988155/t%C3%A9l%C3%A9chargement_rtf32e.jpg', '1-2 hours', 2, 5),
(83, 'Massage Hammam Agadir', 'Séance de massage et hammam traditionnel.', 60.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988155/t%C3%A9l%C3%A9chargement_rtf32e.jpg', '1.5 hours', 2, 5),
(84, 'Taghazout 1/2 Journée', 'Excursion d\'une demi-journée à Taghazout (surf spot).', 50.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988157/taghazout_city-5990-1024x683_wkzkrq.jpg', 'Half Day', 2, 5),
(85, 'Timlaine Sand Surf', 'Activité de sandboarding dans les dunes.', 45.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988142/t%C3%A9l%C3%A9chargement_1_hrqbep.jpg', '2 hours', 2, 5),
(86, 'Vallée du Paradis (une journée)', 'Excursion d\'une journée à la Vallée du Paradis.', 100.00, 'per person', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988145/WhatsApp_Image_2025-10-15_at_00.31.00_3_gec35m.jpg', 'Full Day', 2, 5);

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'customer',
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `verificationToken` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `verificationToken` (`verificationToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin user (password: Admin@123)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `isVerified`, `verificationToken`, `created_at`) VALUES
(1, 'admin', 'admin@almaya.ma', '$2b$10$XJWAK510G8U39geDy5wd6emGH8j7ZldHWmYdF4CmbOAP34I3lRJwS', 'admin', 1, NULL, '2025-01-27 00:00:00');

-- --------------------------------------------------------
-- Table: cartitems
-- --------------------------------------------------------

DROP TABLE IF EXISTS `cartitems`;
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

-- --------------------------------------------------------
-- Indexes and Performance Optimization
-- --------------------------------------------------------

-- Add indexes for better query performance
ALTER TABLE `offers` ADD INDEX `idx_service_type` (`service_type_id`);
ALTER TABLE `offers` ADD INDEX `idx_location` (`location_id`);
ALTER TABLE `offers` ADD INDEX `idx_price` (`price`);
ALTER TABLE `users` ADD INDEX `idx_email` (`email`);
ALTER TABLE `users` ADD INDEX `idx_role` (`role`);
ALTER TABLE `cartitems` ADD INDEX `idx_user` (`user_id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
