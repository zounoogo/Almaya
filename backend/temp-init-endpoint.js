// ==========================================================
//          ENDPOINT TEMPORAIRE: INITIALISATION DB
// ==========================================================
// ⚠️ CODE À AJOUTER DANS server.js AVANT app.listen()
// Puis SUPPRIMER APRÈS UTILISATION!

// Ligne à ajouter vers ligne 643 dans server.js:

app.get('/api/init-database/:token', async (req, res) => {
    const INIT_TOKEN = process.env.INIT_DB_TOKEN || 'temp-init-2024';
    
    if (req.params.token !== INIT_TOKEN) {
        return res.status(403).json({ error: 'Token invalide' });
    }

    const initSQL = `
    DROP TABLE IF EXISTS cartitems;
    DROP TABLE IF EXISTS offers;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS locations;
    DROP TABLE IF EXISTS categories;

    CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        role ENUM('user', 'admin') DEFAULT 'user',
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

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
    );

    CREATE TABLE cartitems (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        offer_id INT NOT NULL,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
    );
    `;

    const statements = initSQL.split(';').filter(s => s.trim().length > 0);
    
    try {
        for (let i = 0; i < statements.length; i++) {
            await db.query(statements[i]);
        }
        res.json({ 
            success: true, 
            message: `✅ Base de données initialisée! ${statements.length} commandes exécutées.`,
            tables: ['categories', 'locations', 'users', 'offers', 'cartitems'],
            note: '⚠️ SUPPRIMEZ CET ENDPOINT MAINTENANT VIA GITHUB!'
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message
        });
    }
});

// INSTRUCTIONS:
// 1. Ouvrir backend/server.js sur GitHub
// 2. Chercher la ligne "app.listen(port" (ligne ~649)
// 3. Ajouter ce code JUSTE AVANT cette ligne
// 4. Commit: "Add temporary database initialization endpoint"
// 5. Attendre le redéploiement Railway (2-3 min)
// 6. Visiter: https://backend-production-94c8.up.railway.app/api/init-database/temp-init-2024
// 7. Vérifier le message "Base de données initialisée"
// 8. SUPPRIMER l'endpoint immédiatement après!
