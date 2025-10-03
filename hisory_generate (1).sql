-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 03 oct. 2025 à 15:34
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
-- Base de données : `qr_generate_bd`
--

-- --------------------------------------------------------

--
-- Structure de la table `hisory_generate`
--

CREATE TABLE `hisory_generate` (
  `id` int(11) NOT NULL,
  `name_activite` varchar(255) NOT NULL,
  `form_url` varchar(255) NOT NULL,
  `message_qr` varchar(255) NOT NULL,
  `ref_unique` varchar(120) NOT NULL,
  `date_inscrit` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `hisory_generate`
--

INSERT INTO `hisory_generate` (`id`, `name_activite`, `form_url`, `message_qr`, `ref_unique`, `date_inscrit`) VALUES
(1, 'renforcement des capacités', 'https://forms.gle/m9QLkdHdyTaHBsE89', 'facultatif ', 'REF-cfbb84cb74', '2025-09-30 10:43:11.145363'),
(2, 'Ange Landry Bile', 'https://web.facebook.com/profile.php?id=100061089645654', 'Ma profil facebook', 'REF-2e8b0ded6d', '2025-09-30 10:43:11.145363'),
(3, 'Agence Emploi Jeune', 'https://agenceemploijeunes.ci/site/', 'facultatif ', 'REF-183adb5f15', '2025-09-30 14:54:22.485297'),
(4, 'Pretest Formation en Ligne', 'https://forms.gle/m9QLkdHdyTaHBsE89hgfdsk', '', 'REF-0e8e05ea03', '2025-10-01 17:30:53.547304'),
(5, 'renforcement des capacités', 'https://docs.google.com/forms/d/e/1FAIpQLSe9eMm-Qzi8I0YwdIOI4qUkNc9k2g_MgkbU5TqfaMygrIYdJg/viewform?usp=header', '', 'REF-255ecb0d96', '2025-10-01 18:49:19.442049');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `hisory_generate`
--
ALTER TABLE `hisory_generate`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `hisory_generate`
--
ALTER TABLE `hisory_generate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
