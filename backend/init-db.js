// Script temporaire pour initialiser la base de données Railway
const db = require('./db');

const initSQL = `
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS cartitems;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS categories;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE categories (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  description text DEFAULT NULL,
  icon varchar(512) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY name (name),
  UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE locations (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  region varchar(255) DEFAULT 'Morocco',
  image varchar(512) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY name (name),
  UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'customer',
  isVerified tinyint(1) NOT NULL DEFAULT 0,
  verificationToken varchar(255) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE offers (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  description text DEFAULT 'Discover this amazing experience in Morocco.',
  price decimal(10,2) DEFAULT 0.00,
  infos_price varchar(255) DEFAULT 'Price on request',
  image varchar(512) DEFAULT NULL,
  duration varchar(50) DEFAULT 'Flexible',
  service_type_id int(11) NOT NULL,
  location_id int(11) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY fk_category (service_type_id),
  KEY fk_location (location_id),
  CONSTRAINT fk_category FOREIGN KEY (service_type_id) REFERENCES categories (id) ON DELETE CASCADE,
  CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cartitems (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  offer_id int(11) NOT NULL,
  quantity int(11) NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_user_offer (user_id,offer_id),
  KEY offer_id (offer_id),
  CONSTRAINT cartitems_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT cartitems_ibfk_2 FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function initDatabase() {
    try {
        console.log('🚀 Initialisation de la base de données...');
        
        // Exécuter chaque commande séparément
        const statements = initSQL.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await db.query(statement);
                console.log('✅ Exécuté:', statement.substring(0, 50) + '...');
            }
        }
        
        console.log('✅ Base de données initialisée avec succès!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

initDatabase();
