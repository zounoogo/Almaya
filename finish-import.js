// Script pour terminer l'importation: admin + offres
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const DATABASE_URL = process.env.DATABASE_URL || 
    'mysql://root:WtXunqjQcEUSHwKvjbbPjJGbGHiQdvHE@switchback.proxy.rlwy.net:34237/railway';

// Extrait des offres de la base locale (échantillon représentatif)
const OFFERS = [
    {id: 1, category_id: 1, location_id: 1, title: "Visite guidée du Jardin Majorelle", description: "Découverte du célèbre jardin de Marrakech avec guide francophone", regular_price: 150.00, member_price: 120.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029128/almaya/jardin_majorelle.jpg"},
    {id: 2, category_id: 1, location_id: 1, title: "Tour de la Médina de Marrakech", description: "Exploration des souks et monuments historiques", regular_price: 200.00, member_price: 160.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737028990/almaya/marrakech_fpqg04.jpg"},
    {id: 3, category_id: 2, location_id: 1, title: "Quad dans le désert d'Agafay", description: "Aventure en quad dans les dunes près de Marrakech", regular_price: 500.00, member_price: 400.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/quad_agafay.jpg"},
    {id: 4, category_id: 2, location_id: 1, title: "Balade en montgolfière", description: "Vol panoramique au-dessus de la palmeraie", regular_price: 2500.00, member_price: 2000.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/montgolfiere.jpg"},
    {id: 5, category_id: 1, location_id: 2, title: "Visite de la Mosquée Hassan II", description: "Découverte du chef-d'œuvre architectural de Casablanca", regular_price: 120.00, member_price: 100.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029027/almaya/casablanca_skcnsy.jpg"},
    {id: 6, category_id: 2, location_id: 2, title: "Morocco Mall et Cinéma", description: "Shopping et divertissement au plus grand mall d'Afrique", regular_price: 300.00, member_price: 250.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029027/almaya/morocco_mall.jpg"},
    {id: 7, category_id: 1, location_id: 7, title: "Excursion dans le désert de Merzouga", description: "Balade à dos de chameau et nuit sous les étoiles", regular_price: 800.00, member_price: 650.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029264/almaya/merzouga_ugqrxv.jpg"},
    {id: 8, category_id: 1, location_id: 6, title: "Visite de la Médina de Fès", description: "Exploration de la plus grande médina piétonne du monde", regular_price: 180.00, member_price: 150.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029128/almaya/fes_mfn64e.jpg"},
    {id: 9, category_id: 2, location_id: 8, title: "Surf et plage à Agadir", description: "Cours de surf sur les plages d'Agadir", regular_price: 350.00, member_price: 300.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029313/almaya/agadir_zwujnr.jpg"},
    {id: 10, category_id: 1, location_id: 13, title: "Découverte de Chefchaouen", description: "Visite guidée de la ville bleue", regular_price: 250.00, member_price: 200.00, image_url: "https://res.cloudinary.com/dwcozj2tc/image/upload/v1737029401/almaya/chefchaouen_ddojwx.jpg"}
];

async function finishImport() {
    let connection;
    
    try {
        console.log('\n🔌 Connexion à Railway...');
        connection = await mysql.createConnection(DATABASE_URL);
        console.log('✅ Connecté!\n');

        // 1. Créer admin
        console.log('👤 Création compte admin...');
        try {
            const adminPassword = await bcrypt.hash('Admin2024!', 10);
            await connection.query(
                'INSERT INTO users (username, email, password, firstname, lastname, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                ['admin', 'admin@almaya.ma', adminPassword, 'Admin', 'ALMAYA', 'admin', true]
            );
            console.log('✅ Admin créé: admin@almaya.ma / Admin2024!\n');
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log('⚠️  Admin existe déjà\n');
            } else {
                throw err;
            }
        }

        // 2. Importer offres
        console.log('🎁 Importation des offres...');
        let count = 0;
        for (const offer of OFFERS) {
            try {
                await connection.query(
                    'INSERT INTO offers (id, category_id, location_id, title, description, regular_price, member_price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [offer.id, offer.category_id, offer.location_id, offer.title, offer.description, offer.regular_price, offer.member_price, offer.image_url]
                );
                console.log(`  ✓ ${offer.title}`);
                count++;
            } catch (err) {
                if (err.code !== 'ER_DUP_ENTRY') {
                    console.log(`  ✗ Erreur: ${offer.title} - ${err.message}`);
                }
            }
        }
        console.log(`✅ ${count} offres importées\n`);

        console.log('🎉 IMPORTATION TERMINÉE!\n');
        console.log('📊 Votre site est prêt:');
        console.log('   🌐 Frontend: https://almaya-frontend.vercel.app');
        console.log('   🔐 Admin: admin@almaya.ma / Admin2024!');
        console.log('\n💡 Prochaine étape: Ajoutez plus d\'offres via l\'interface admin');

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

finishImport();
