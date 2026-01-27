// ==========================================================
// SCRIPT D'IMPORTATION DES DONNÉES VERS RAILWAY
// ==========================================================
// À exécuter UNE SEULE FOIS pour remplir la base de production

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration Railway (depuis variables d'environnement ou .env)
const DATABASE_URL = process.env.DATABASE_URL || 
    'mysql://root:WtXunqjQcEUSHwKvjbbPjJGbGHiQdvHE@switchback.proxy.rlwy.net:34237/railway';

// Données à importer (extraites de la base locale)
const CATEGORIES = [
    { id: 1, name: 'Guide Touristique', slug: 'guide-touristique', description: 'Professional guided tours in key Moroccan cities.', icon: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1763386286/WhatsApp_Image_2025-10-13_%C3%A0_19.27.43_e6ddc733_nv1ttz.jpg' },
    { id: 2, name: 'Activités', slug: 'activites', description: 'Leisure, adventure, and cultural experiences.', icon: null },
    { id: 6, name: 'Hebergement', slug: 'hebergement', description: 'bla bla', icon: '' }
];

const LOCATIONS = [
    { id: 1, name: 'Marrakech', slug: 'marrakech', description: 'The Red City - vibrant markets, historic palaces, and desert gateway.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737028990/almaya/marrakech_fpqg04.jpg' },
    { id: 2, name: 'Casablanca', slug: 'casablanca', description: 'Modern metropolis with stunning Hassan II Mosque and Atlantic coast.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029027/almaya/casablanca_skcnsy.jpg' },
    { id: 4, name: 'Rabat', slug: 'rabat', description: 'Capital city blending historic medina with modern administration.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029092/almaya/Rabat_nlqwhe.jpg' },
    { id: 5, name: 'Tanger', slug: 'tanger', description: 'Gateway between Africa and Europe, where Mediterranean meets Atlantic.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029202/almaya/tanger_qqnttm.jpg' },
    { id: 6, name: 'Ifrane', slug: 'ifrane', description: 'Moroccan Switzerland - alpine architecture in the Atlas Mountains.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029167/almaya/ifrane_vzmdjf.jpg' },
    { id: 7, name: 'Fes', slug: 'fes', description: 'Ancient imperial city with world\'s largest car-free medina.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029128/almaya/fes_mfn64e.jpg' },
    { id: 8, name: 'Merzouga', slug: 'merzouga', description: 'Sahara Desert gateway - iconic dunes and camel treks.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029264/almaya/merzouga_ugqrxv.jpg' },
    { id: 9, name: 'Agadir', slug: 'agadir', description: 'Beach resort city with year-round sunshine and water sports.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/agadir_zwujnr.jpg' },
    { id: 12, name: 'Essaouira', slug: 'essaouira', description: 'Coastal gem with Portuguese ramparts and windswept beaches.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029355/almaya/essaouira_tvfqzv.jpg' },
    { id: 13, name: 'Chefchaouen', slug: 'chefchaouen', description: 'Blue Pearl of Morocco nestled in Rif Mountains.', image_url: 'https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029401/almaya/chefchaouen_ddojwx.jpg' }
];

async function importData() {
    let connection;
    
    try {
        console.log('🔌 Connexion à Railway MySQL...');
        connection = await mysql.createConnection(DATABASE_URL);
        console.log('✅ Connecté à Railway!\n');

        // 1. Importer les catégories
        console.log('📦 Importation des catégories...');
        for (const cat of CATEGORIES) {
            await connection.query(
                'INSERT INTO categories (id, name, slug, description, icon) VALUES (?, ?, ?, ?, ?)',
                [cat.id, cat.name, cat.slug, cat.description, cat.icon]
            );
            console.log(`  ✓ ${cat.name}`);
        }
        console.log(`✅ ${CATEGORIES.length} catégories importées\n`);

        // 2. Importer les locations
        console.log('📍 Importation des destinations...');
        for (const loc of LOCATIONS) {
            await connection.query(
                'INSERT INTO locations (id, name, slug, description, image_url) VALUES (?, ?, ?, ?, ?)',
                [loc.id, loc.name, loc.slug, loc.description, loc.image_url]
            );
            console.log(`  ✓ ${loc.name}`);
        }
        console.log(`✅ ${LOCATIONS.length} destinations importées\n`);

        // 3. Lire et importer les offres depuis le fichier SQL
        console.log('🎁 Importation des offres...');
        const sqlFile = fs.readFileSync(path.join(__dirname, 'Database', 'almaya_local_export.sql'), 'utf8');
        
        // Extraire les INSERT INTO offers
        const offersMatch = sqlFile.match(/INSERT INTO `offers`[^;]+;/s);
        if (offersMatch) {
            // Parser les valeurs
            const valuesRegex = /\((\d+),\s*(\d+),\s*(\d+),\s*'([^']+)',\s*'([^']*)',\s*([0-9.]+),\s*([0-9.]+),\s*'([^']*)'/g;
            let match;
            let count = 0;
            
            while ((match = valuesRegex.exec(offersMatch[0])) !== null) {
                const [_, id, category_id, location_id, title, description, regular_price, member_price, image_url] = match;
                await connection.query(
                    'INSERT INTO offers (id, category_id, location_id, title, description, regular_price, member_price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [id, category_id, location_id, title, description, regular_price, member_price, image_url]
                );
                count++;
                if (count % 10 === 0) console.log(`  → ${count} offres importées...`);
            }
            console.log(`✅ ${count} offres importées\n`);
        }

        // 4. Créer un utilisateur admin
        console.log('👤 Création compte admin...');
        const bcrypt = require('bcrypt');
        const adminPassword = await bcrypt.hash('Admin123!', 10);
        
        await connection.query(
            'INSERT INTO users (username, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            ['admin', 'admin@almaya.com', adminPassword, 'admin', true]
        );
        console.log('✅ Admin créé: admin@almaya.com / Admin123!\n');

        console.log('🎉 IMPORTATION TERMINÉE AVEC SUCCÈS!');
        console.log('\n📊 Résumé:');
        console.log(`  - ${CATEGORIES.length} catégories`);
        console.log(`  - ${LOCATIONS.length} destinations`);
        console.log(`  - Offres importées`);
        console.log(`  - 1 compte admin\n`);
        console.log('🌐 Testez: https://almaya-frontend.vercel.app');
        console.log('🔐 Login admin: admin@almaya.com / Admin123!');

    } catch (error) {
        console.error('❌ ERREUR:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('\n⚠️ Données déjà importées. Pour réimporter, supprimez d\'abord les données existantes.');
        }
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Connexion fermée.');
        }
    }
}

// Exécution
console.log('═══════════════════════════════════════════════════════');
console.log('   IMPORTATION DES DONNÉES ALMAYA VERS RAILWAY');
console.log('═══════════════════════════════════════════════════════\n');

importData();
