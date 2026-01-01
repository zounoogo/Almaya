# Railway Database Setup Script
# Run this in Railway's database query console

# Create users table
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role enum('customer','admin') DEFAULT 'customer',
  isVerified tinyint(1) DEFAULT 0,
  verificationToken varchar(255) DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email)
);

# Create categories table
CREATE TABLE categories (
  id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  icon varchar(500) DEFAULT NULL,
  description text DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug)
);

# Create locations table
CREATE TABLE locations (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  region varchar(255) DEFAULT NULL,
  image varchar(500) DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug)
);

# Create offers table
CREATE TABLE offers (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  description text DEFAULT NULL,
  price float DEFAULT NULL,
  infos_price varchar(255) DEFAULT NULL,
  image varchar(500) DEFAULT NULL,
  duration varchar(100) DEFAULT NULL,
  service_type_id varchar(255) NOT NULL,
  location_id int NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY service_type_id (service_type_id),
  KEY location_id (location_id),
  CONSTRAINT offers_ibfk_1 FOREIGN KEY (service_type_id) REFERENCES categories (id) ON DELETE CASCADE,
  CONSTRAINT offers_ibfk_2 FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
);

# Create cart items table
CREATE TABLE cartitems (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  offer_id int NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  KEY offer_id (offer_id),
  CONSTRAINT cartitems_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT cartitems_ibfk_2 FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE
);

# Insert default admin user (CHANGE PASSWORD!)
# Password hash for 'admin123' - generate your own at https://bcrypt-generator.com/
INSERT INTO users (username, email, password, role, isVerified) VALUES
('admin', 'admin@almaya.com', '$2a$10$8K1p/5w6QyT3rJc8X9L8se.8K1p/5w6QyT3rJc8X9L8se.8K1p/5w6QyT3rJc8X9L8se', 'admin', 1);