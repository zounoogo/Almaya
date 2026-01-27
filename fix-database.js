// Script pour corriger le schéma de la table locations sur Railway
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const DATABASE_URL = 'mysql://root:WtXunqjQcEUSHwKvjbbPjJGbGHiQdvHE@switchback.proxy.rlwy.net:34237/railway';

const LOCATIONS = [
    {id: 1, name: 'Marrakech', slug: 'marrakech', region: 'Marrakech-Safi', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737028990/almaya/marrakech_fpqg04.jpg'},
    {id: 2, name: 'Casablanca', slug: 'casablanca', region: 'Casablanca-Settat', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029027/almaya/casablanca_skcnsy.jpg'},
    {id: 4, name: 'Rabat', slug: 'rabat', region: 'Rabat-Salé-Kénitra', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029092/almaya/Rabat_nlqwhe.jpg'},
    {id: 5, name: 'Tanger', slug: 'tanger', region: 'Tanger-Tétouan-Al Hoceïma', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029202/almaya/tanger_qqnttm.jpg'},
    {id: 6, name: 'Ifrane', slug: 'ifrane', region: 'Fès-Meknès', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029167/almaya/ifrane_vzmdjf.jpg'},
    {id: 7, name: 'Fes', slug: 'fes', region: 'Fès-Meknès', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029128/almaya/fes_mfn64e.jpg'},
    {id: 8, name: 'Merzouga', slug: 'merzouga', region: 'Drâa-Tafilalet', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029264/almaya/merzouga_ugqrxv.jpg'},
    {id: 9, name: 'Agadir', slug: 'agadir', region: 'Souss-Massa', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/agadir_zwujnr.jpg'},
    {id: 12, name: 'Essaouira', slug: 'essaouira', region: 'Marrakech-Safi', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029355/almaya/essaouira_tvfqzv.jpg'},
    {id: 13, name: 'Chefchaouen', slug: 'chefchaouen', region: 'Tanger-Tétouan-Al Hoceïma', image: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029401/almaya/chefchaouen_ddojwx.jpg'}
];

const OFFERS = [
    {id: 1, category_id: 1, location_id: 1, title: "Visite guidée du Jardin Majorelle", description: "Découverte du célèbre jardin créé par Yves Saint Laurent", regular_price: 150.00, member_price: 120.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029128/almaya/jardin_majorelle.jpg"},
    {id: 2, category_id: 1, location_id: 1, title: "Tour de la Médina de Marrakech", description: "Exploration des souks traditionnels et monuments historiques", regular_price: 200.00, member_price: 160.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737028990/almaya/marrakech_fpqg04.jpg"},
    {id: 3, category_id: 2, location_id: 1, title: "Quad dans le désert d'Agafay", description: "Aventure en quad au coucher du soleil", regular_price: 500.00, member_price: 400.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/quad_desert.jpg"},
    {id: 4, category_id: 2, location_id: 1, title: "Balade en montgolfière", description: "Vol panoramique au-dessus de Marrakech et sa palmeraie", regular_price: 2500.00, member_price: 2000.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/montgolfiere.jpg"},
    {id: 5, category_id: 1, location_id: 2, title: "Visite de la Mosquée Hassan II", description: "Découverte du joyau architectural de Casablanca", regular_price: 120.00, member_price: 100.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029027/almaya/casablanca_skcnsy.jpg"},
    {id: 6, category_id: 2, location_id: 2, title: "Morocco Mall et Cinéma", description: "Shopping et divertissement au plus grand centre commercial d'Afrique", regular_price: 300.00, member_price: 250.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029027/almaya/morocco_mall.jpg"},
    {id: 7, category_id: 1, location_id: 8, title: "Excursion désert de Merzouga", description: "Nuit dans le désert du Sahara avec balade à dos de chameau", regular_price: 800.00, member_price: 650.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029264/almaya/merzouga_ugqrxv.jpg"},
    {id: 8, category_id: 1, location_id: 7, title: "Visite de la Médina de Fès", description: "Exploration de la plus ancienne médina impériale du Maroc", regular_price: 180.00, member_price: 150.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029128/almaya/fes_mfn64e.jpg"},
    {id: 9, category_id: 2, location_id: 9, title: "Surf et plage à Agadir", description: "Cours de surf et détente sur les plages dorées", regular_price: 350.00, member_price: 300.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/agadir_zwujnr.jpg"},
    {id: 10, category_id: 1, location_id: 13, title: "Découverte de Chefchaouen", description: "Visite guidée de la perle bleue du Maroc", regular_price: 250.00, member_price: 200.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029401/almaya/chefchaouen_ddojwx.jpg"}
];

async function fixDatabase() {
    let conn;
    try {
        console.log('🔌 Connexion à Railway...');
        conn = await mysql.createConnection(DATABASE_URL);
        console.log('✅ Connecté!\n');

        // 1. Recréer la table locations avec le bon schéma
        console.log('🔧 Correction du schéma locations...');
        await conn.query('DROP TABLE IF EXISTS cartitems');
        await conn.query('DROP TABLE IF EXISTS offers');
        await conn.query('DROP TABLE IF EXISTS locations');
        await conn.query(`
            CREATE TABLE locations (
                id INT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                region VARCHAR(255),
                image VARCHAR(255)
            )
        `);
        console.log('✅ Table locations recréée\n');

        // 2. Réimporter les locations
        console.log('📍 Importation des destinations...');
        for (const loc of LOCATIONS) {
            await conn.query(
                'INSERT INTO locations (id, name, slug, region, image) VALUES (?, ?, ?, ?, ?)',
                [loc.id, loc.name, loc.slug, loc.region, loc.image]
            );
            console.log(`  ✓ ${loc.name}`);
        }
        console.log(`✅ ${LOCATIONS.length} destinations\n`);

        // 3. Recréer la table offers
        console.log('🎁 Création table offers...');
        await conn.query(`
            CREATE TABLE offers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                location_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                regular_price DECIMAL(10,2) NOT NULL,
                member_price DECIMAL(10,2) NOT NULL,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
                FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
            )
        `);
        
        // 4. Importer les offres
        for (const offer of OFFERS) {
            await conn.query(
                'INSERT INTO offers (id, category_id, location_id, title, description, regular_price, member_price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [offer.id, offer.category_id, offer.location_id, offer.title, offer.description, offer.regular_price, offer.member_price, offer.image_url]
            );
            console.log(`  ✓ ${offer.title}`);
        }
        console.log(`✅ ${OFFERS.length} offres\n`);

        // 5. Recréer cartitems
        console.log('🛒 Création table cartitems...');
        await conn.query(`
            CREATE TABLE cartitems (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                offer_id INT NOT NULL,
                quantity INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Table cartitems créée\n');

        // 6. Créer admin
        console.log('👤 Création compte admin...');
        try {
            const hash = await bcrypt.hash('Admin2024!', 10);
            await conn.query(
                'INSERT INTO users (username, email, password, firstname, lastname, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                ['admin', 'admin@almaya.ma', hash, 'Admin', 'ALMAYA', 'admin', true]
            );
            console.log('✅ Admin: admin@almaya.ma / Admin2024!\n');
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log('⚠️  Admin existe déjà\n');
            } else throw err;
        }

        console.log('🎉 BASE DE DONNÉES CONFIGURÉE!\n');
        console.log('📊 Résumé:');
        console.log(`  - 3 catégories`);
        console.log(`  - ${LOCATIONS.length} destinations`);
        console.log(`  - ${OFFERS.length} offres`);
        console.log(`  - 1 compte admin\n`);
        console.log('🌐 Votre site: https://almaya-frontend.vercel.app');
        console.log('🔐 Admin: admin@almaya.ma / Admin2024!');

    } catch (error) {
        console.error('❌ ERREUR:', error.message);
        process.exit(1);
    } finally {
        if (conn) await conn.end();
    }
}

fixDatabase();
