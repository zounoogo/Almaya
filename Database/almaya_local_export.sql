-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 27, 2026 at 03:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `almaya`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartitems`
--

CREATE TABLE `cartitems` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cartitems`
--

INSERT INTO `cartitems` (`id`, `user_id`, `offer_id`, `quantity`) VALUES
(1426, 1, 9, 2),
(1427, 1, 3, 1),
(1428, 1, 1, 4),
(1429, 1, 16, 4),
(1430, 1, 15, 1),
(1431, 1, 8, 1),
(1432, 1, 10, 2),
(1433, 1, 2, 1),
(1434, 1, 11, 5),
(2677, 3, 9, 4),
(2678, 3, 44, 3),
(2679, 3, 47, 1),
(2680, 3, 49, 1),
(2681, 3, 77, 2),
(2910, 2, 11, 3),
(2911, 2, 1, 2),
(2912, 2, 8, 2),
(2968, 5, 38, 1),
(2969, 5, 40, 1),
(2970, 5, 47, 1),
(2996, 6, 46, 2),
(2997, 6, 47, 1),
(2998, 6, 48, 3);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`) VALUES
(1, 'Guide Touristique', 'guide-touristique', 'Professional guided tours in key Moroccan cities.', 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763386286/WhatsApp_Image_2025-10-13_%C3%A0_19.27.43_e6ddc733_nv1ttz.jpg'),
(2, 'Activités', 'activites', 'Leisure, adventure, and cultural experiences.', NULL),
(6, 'Hebergement', 'hebergement', 'bla bla', '');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `region` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `slug`, `region`, `image`) VALUES
(1, 'Marrakech', 'marrakech', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(2, 'Tanger', 'tanger', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(3, 'Casablanca', 'casablanca', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988098/WhatsApp_Image_2025-10-13_at_19.20.22_hun0zb.jpg'),
(4, 'Rabat', 'rabat', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(5, 'Agadir', 'agadir', 'Maroc', ''),
(6, 'Merzouga', 'merzouga', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(7, 'Ouarzazate', 'ouarzazate', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(8, 'Ifrane', 'ifrane', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(9, 'Fes', 'fes', NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg'),
(12, 'Tetouan', 'tetouan', 'Maroc', '');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `infos_price` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `service_type_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `title`, `description`, `price`, `infos_price`, `image`, `duration`, `service_type_id`, `location_id`) VALUES
(1, 'Guide Marrakech (Day)', 'Explore the historical heart of Marrakech with a professional guide.', 50.00, 'per group (up to 4)', NULL, 'Full Day', 1, 1),
(2, 'Guide Tanger (Half-Day)', 'A comprehensive tour of Tanger’s historic sites and markets.', 35.00, 'per person', NULL, 'Half Day', 1, 2),
(3, 'Guide Casablanca', 'Discover Casablanca’s modern architecture and cultural spots.', 60.00, 'per group', NULL, 'Full Day', 1, 3),
(4, 'Quad & Chameau Combo', 'Adventure combo: quad biking and camel ride near the palm grove.', 75.00, 'per person', NULL, '3 hours', 2, 1),
(5, 'Mosquée Hassan II Visit', 'Guided tour of the magnificent Hassan II Mosque.', 12.00, 'per person', NULL, '1 hour', 2, 3),
(6, 'Vallée des Oudayas Tour', 'Stroll and discover the picturesque Kasbah of the Oudayas.', NULL, 'Guide only', NULL, '2 hours', 2, 4),
(7, 'Guide Marrakech', 'Service de guide touristique pour la ville de Marrakech.', NULL, NULL, NULL, 'Full Day', 1, 1),
(8, 'Guide Tanger', 'Service de guide touristique pour la ville de Tanger.', NULL, NULL, NULL, 'Full Day', 1, 2),
(9, 'Guide Casablanca', 'Service de guide touristique pour la ville de Casablanca.', NULL, NULL, NULL, 'Full Day', 1, 3),
(10, 'Guide Rabat', 'Service de guide touristique pour la ville de Rabat.', NULL, NULL, NULL, 'Full Day', 1, 4),
(11, 'Guide Agadir', 'Service de guide touristique pour la ville de Agadir.', NULL, NULL, NULL, 'Full Day', 1, 5),
(12, 'Guide Merzouga', 'Service de guide touristique pour la région de Merzouga.', NULL, NULL, NULL, 'Full Day', 1, 6),
(13, 'Guide Ouarzazate', 'Service de guide touristique pour la ville de Ouarzazate.', NULL, NULL, NULL, 'Full Day', 1, 7),
(14, 'Quad & Chameau', NULL, NULL, NULL, NULL, 'Half Day', 2, 1),
(15, 'Visite de l’Ourika', NULL, NULL, NULL, NULL, 'Full Day', 2, 1),
(16, 'Musée de l’Eau', NULL, NULL, NULL, NULL, '2 hours', 2, 1),
(17, 'Musée Yves Saint Laurent', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988076/Capture_d_%C3%A9cran_2025-11-22_085153_qwtvnl.png', '2 hours', 2, 1),
(18, 'Jardin Majorelle', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988075/Capture_d_%C3%A9cran_2025-11-22_085315_eftrfe.png', '1.5 hours', 2, 1),
(19, 'Cuisine avec des chefs marocains', 'Atelier de cuisine marocaine.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988076/where-to-learn-moroccan-cooking-techniques-in-marrakech-workshops-and-renowned-chefs_yb1jjy.jpg', 'Half Day', 2, 1),
(20, 'Poterie en famille', 'Atelier de poterie pour la famille.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988077/1_8ebbb428-cfc1-4b17-a316-84b4b96fe9c1_ze0aop.webp', '2 hours', 2, 1),
(21, 'Journée à Agafay', 'Excursion au désert d\'Agafay.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988170/ombres-de-chameaux-dans-le-desert-du-sahara-merzouga_mkifvu.jpg', 'Full Day', 2, 1),
(22, 'Menara Mall', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988078/Capture_d_%C3%A9cran_2025-11-22_090055_lzptvc.png', NULL, 2, 1),
(23, 'Bowling Marrakech', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/bowling1_rd8qzv.jpg', NULL, 2, 1),
(24, 'Shopping Carré Eden', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988064/carre_eden_xcodgq.jpg', NULL, 2, 1),
(25, 'Visite de la Place Jemaa el-Fna', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988065/jeema_el_fna_cv8qvk.jpg', NULL, 2, 1),
(26, 'Henné pour madame', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988067/t%C3%A9l%C3%A9chargement_bx9zpd.jpg', NULL, 2, 1),
(27, 'Palais Bahia', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988067/images_ocp19c.jpg', '1.5 hours', 2, 1),
(28, 'Tombeaux Saadiens', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988068/tombeaux-saadiens-marrakech_z18af8.jpg', '1 hour', 2, 1),
(29, 'Michoui chez Haj Moustapha', 'Expérience culinaire traditionnelle.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/t%C3%A9l%C3%A9chargement_ah9xdb.jpg', NULL, 2, 1),
(30, 'Balade en calèche', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/t%C3%A9l%C3%A9chargement_1_dn7j2h.jpg', '1 hour', 2, 1),
(31, 'Visite à La Mamounia', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988069/t%C3%A9l%C3%A9chargement_anj8ql.jpg', NULL, 2, 1),
(32, 'Mosquée de la Koutoubia', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988071/t%C3%A9l%C3%A9chargement_1_bmgebl.jpg', NULL, 2, 1),
(33, 'Parapente', 'Activité de parapente.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988072/t%C3%A9l%C3%A9chargement_ucntq5.jpg', '2 hours', 2, 1),
(34, 'Montgolfière', 'Vol en montgolfière au lever du soleil.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988075/t%C3%A9l%C3%A9chargement_1_ecrodj.jpg', '3 hours', 2, 1),
(35, 'Fantasia chez Ali', 'Spectacle Fantasia traditionnel avec dîner.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988074/t%C3%A9l%C3%A9chargement_nr2lv7.jpg', 'Evening', 2, 1),
(36, 'Tour de la ville Marrakech', 'Circuit touristique complet de la ville.', NULL, NULL, NULL, 'Half Day', 2, 1),
(37, 'Villa des Arts', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988080/WhatsApp_Image_2025-10-13_at_19.31.46_vmthjh.jpg', '2 hours', 2, 3),
(38, 'Cinéma Pathé', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988093/WhatsApp_Image_2025-10-13_at_19.36.05_ri8rt0.jpg', NULL, 2, 3),
(39, 'Morocco Mall', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988094/WhatsApp_Image_2025-10-13_at_19.21.51_xde2jj.jpg', NULL, 2, 3),
(40, 'La Corniche à Ain Diab', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988097/WhatsApp_Image_2025-10-13_at_19.24.07_qchalk.jpg', NULL, 2, 3),
(41, 'Casa Finance City', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988102/WhatsApp_Image_2025-10-13_at_19.26.15_lqqbk0.jpg', NULL, 2, 3),
(42, 'Marché Sénégalais', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988104/WhatsApp_Image_2025-10-13_at_19.26.43_w4xyhm.jpg', NULL, 2, 3),
(43, 'Plage Casablanca', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988108/WhatsApp_Image_2025-10-13_at_19.41.14_ez8cgh.jpg', NULL, 2, 3),
(44, 'Marché Habous', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988109/WhatsApp_Image_2025-10-13_at_19.39.05_xw9ywn.jpg', '2 hours', 2, 3),
(45, 'Aqua Parc Casablanca', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988081/WhatsApp_Image_2025-10-13_at_19.27.26_1_oj8uwr.jpg', 'Full Day', 2, 3),
(46, 'Patinoire sur glace', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988087/WhatsApp_Image_2025-10-13_at_19.30.16_2_mjqvit.jpg', NULL, 2, 3),
(47, 'Parc d’attraction Sindibad', NULL, NULL, NULL, NULL, 'Full Day', 2, 3),
(48, 'Pique-nique au Jardin de la Ligue Arabe', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988090/WhatsApp_Image_2025-10-13_at_19.33.53_1_xjvqq5.jpg', NULL, 2, 3),
(49, 'Tour de la ville Casablanca', 'Circuit touristique complet de la ville.', NULL, NULL, NULL, 'Half Day', 2, 3),
(50, 'Tour Hassan', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988111/WhatsApp_Image_2025-10-13_at_20.27.42_2_urbbvt.jpg', '1 hour', 2, 4),
(51, 'Place du 16 novembre', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988127/WhatsApp_Image_2025-10-13_at_20.41.01_pneohi.jpg', NULL, 2, 4),
(52, 'Mausolée du Roi', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988132/WhatsApp_Image_2025-10-13_at_20.28.31_mhazfn.jpg', '1 hour', 2, 4),
(53, 'Kasbah des Oudayas', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988132/WhatsApp_Image_2025-10-13_at_20.29.40_adprkw.jpg', '2 hours', 2, 4),
(54, 'Marina Bouregreg', NULL, NULL, NULL, NULL, NULL, 2, 4),
(55, 'Plage Rabat', NULL, NULL, NULL, NULL, NULL, 2, 4),
(56, 'Kayak Rabat', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988134/WhatsApp_Image_2025-10-13_at_20.23.45_angxrz.jpg', '2 hours', 2, 4),
(57, 'Jet Ski Rabat', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988137/WhatsApp_Image_2025-10-13_at_20.18.10_pm1edt.jpg', '1 hour', 2, 4),
(58, 'Tour en bateau Rabat', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988140/WhatsApp_Image_2025-10-13_at_20.38.09_rdzjfz.jpg', '1 hour', 2, 4),
(59, 'Balade en pirogue', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988114/WhatsApp_Image_2025-10-13_at_20.24.43_3_ujcltz.jpg', '1 hour', 2, 4),
(60, 'Balade à Hay Riad', NULL, NULL, NULL, NULL, NULL, 2, 4),
(61, 'Arribat Center', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988116/WhatsApp_Image_2025-10-13_at_20.26.12_1_qwe0iy.jpg', NULL, 2, 4),
(62, 'Marché Sahel', NULL, NULL, NULL, NULL, NULL, 2, 4),
(63, 'Mega Mall Rabat', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988120/WhatsApp_Image_2025-10-13_at_20.26.41_pke8iq.jpg', NULL, 2, 4),
(64, 'Musée Mohammed VI (MMVI)', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988125/WhatsApp_Image_2025-10-13_at_20.39.18_2_zxz7ou.jpg', '2 hours', 2, 4),
(65, 'Tour de la ville Rabat', 'Circuit touristique complet de la ville.', NULL, NULL, NULL, 'Half Day', 2, 4),
(66, 'Parc Perdicaris', NULL, NULL, NULL, NULL, '2 hours', 2, 2),
(67, 'Grotte d’Hercule', NULL, NULL, NULL, NULL, '1 hour', 2, 2),
(68, 'Balade La Marina Smir', NULL, NULL, NULL, NULL, NULL, 2, 2),
(69, 'Jet Ski Marina Smir', NULL, NULL, NULL, NULL, '1 hour', 2, 2),
(70, 'Plongée sous-marine', 'Séance de plongée sous-marine.', NULL, NULL, NULL, 'Half Day', 2, 2),
(71, 'Visite de la Ville Bleue (Chefchaouen)', 'Excursion à Chefchaouen.', NULL, NULL, NULL, 'Full Day', 2, 2),
(72, 'Ancienne Cathédrale', NULL, NULL, NULL, NULL, NULL, 2, 2),
(73, 'Souk Tanger', NULL, NULL, NULL, NULL, NULL, 2, 2),
(74, 'Cascade Akchour', 'Randonnée aux cascades d\'Akchour.', NULL, NULL, NULL, 'Full Day', 2, 2),
(75, 'Tour de la ville Tanger', 'Circuit touristique complet de la ville.', NULL, NULL, NULL, 'Half Day', 2, 2),
(76, 'Safari Chameau Agadir', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988141/WhatsApp_Image_2025-10-15_at_00.27.32_1_vinfr4.jpg', '2 hours', 2, 5),
(77, 'Balade à cheval Agadir', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988149/WhatsApp_Image_2025-10-15_at_00.29.23_vgvtqj.jpg', '1 hour', 2, 5),
(78, 'Quad and Buggy Agadir', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988151/WhatsApp_Image_2025-10-15_at_00.28.17_gyrqyd.jpg', '2 hours', 2, 5),
(79, 'Jet Ski Agadir', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988153/WhatsApp_Image_2025-10-15_at_00.27.55_ionyvb.jpg', '1 hour', 2, 5),
(80, 'Parc des Crocodiles (Crocoparc)', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988154/WhatsApp_Image_2025-10-15_at_00.31.25_1_soaufj.jpg', '2 hours', 2, 5),
(81, 'Tour de la ville Agadir', 'Circuit touristique complet de la ville.', NULL, NULL, NULL, 'Half Day', 2, 5),
(82, 'Souk El Had', NULL, NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988155/t%C3%A9l%C3%A9chargement_rtf32e.jpg', NULL, 2, 5),
(83, 'Massage Hammam Agadir', 'Séance de massage et hammam traditionnel.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988155/t%C3%A9l%C3%A9chargement_rtf32e.jpg', '1.5 hours', 2, 5),
(84, 'Taghazout 1/2 Journée', 'Excursion d\'une demi-journée à Taghazout (surf spot).', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988157/taghazout_city-5990-1024x683_wkzkrq.jpg', 'Half Day', 2, 5),
(85, 'Timlaine Sand Surf', 'Activité de sandboarding/sand surfing.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988142/t%C3%A9l%C3%A9chargement_1_hrqbep.jpg', '2 hours', 2, 5),
(86, 'Vallée du Paradis (une journée)', 'Excursion d\'une journée à la Vallée du Paradis.', NULL, NULL, 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763988145/WhatsApp_Image_2025-10-15_at_00.31.00_3_gec35m.jpg', 'Full Day', 2, 5),
(94, 'test', 't', NULL, '', '', '', 6, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cart_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cart_data`)),
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'customer',
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `verificationToken` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `cart_data`, `password`, `role`, `isVerified`, `verificationToken`, `created_at`) VALUES
(1, 'yo', 'ee@gmail.com', NULL, '$2b$10$XJWAK510G8U39geDy5wd6emGH8j7ZldHWmYdF4CmbOAP34I3lRJwS', 'customer', 0, NULL, '2025-10-17 19:57:04'),
(2, 'Mawo', 'kouritazounoogo442@gmail.com', NULL, '$2b$10$FPdQkgrM/UZGYmR5UJOdW.USC0nNJcaed3l2vvZhf.NSWMok6ZTwG', 'admin', 1, NULL, '2025-10-19 23:40:27'),
(3, 'a', 'a@gmail.com', NULL, '$2b$10$TFlG9IqASgx41PI1/HWY.uF/dJ.5TauE9UdSyTO.L3qn/lKyjswQG', 'customer', 0, 'f19d2ab87288aece0abe41a33fafe8df189c243b73c3cf6acd6d256250f21c83', '2025-11-18 13:48:09'),
(5, 'Zou', 'kouritamawo442@gmail.com', NULL, '$2b$10$86f.qsCJfGIGnSI/7t7LheN4FyP.n4gP23eklZ/pWGHj79k.8N3rO', 'customer', 1, NULL, '2025-11-24 15:13:31'),
(6, 'souley', 'dambina.souley@gmail.com', NULL, '$2b$10$5RnAlg0klWa5ScARV.d5petpfPW0.eDdxvGixaq1OAmMW4y6o/Bwu', 'customer', 1, NULL, '2025-11-30 19:29:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cartitems`
--
ALTER TABLE `cartitems`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_offer` (`user_id`,`offer_id`),
  ADD KEY `offer_id` (`offer_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category` (`service_type_id`),
  ADD KEY `fk_location` (`location_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `verificationToken` (`verificationToken`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cartitems`
--
ALTER TABLE `cartitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3000;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cartitems`
--
ALTER TABLE `cartitems`
  ADD CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`service_type_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `fk_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
