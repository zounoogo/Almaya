const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Connexion DB
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Clé secrète pour les tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_securisee_par_defaut';

// ==========================================================
//          MIDDLEWARE D'AUTHENTIFICATION
// ==========================================================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send({ message: 'Accès non autorisé' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Token invalide' });
        // req.user contient maintenant l'ID de l'utilisateur
        req.user = user; 
        next();
    });
};

// ==========================================================
//          ROUTES D'AUTHENTIFICATION ET DE PROFIL
// ==========================================================

// --- Endpoint d'inscription ---
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "customer")', [username, email, hashedPassword]);
        res.status(201).send({ message: 'Utilisateur enregistré avec succès.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: 'Le nom d\'utilisateur ou l\'e-mail existe déjà.' });
        }
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).send({ message: 'Erreur lors de l\'inscription.' });
    }
});

// --- Endpoint de connexion ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect.' });
        }
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect.' });
        }

        // Le token contient l'ID de l'utilisateur, essentiel pour le panier
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: 'Connexion réussie !', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).send({ message: 'Erreur lors de la connexion.' });
    }
});

// --- Endpoint de profil protégé ---
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, role FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).send({ message: 'Utilisateur non trouvé.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération du profil.' });
    }
});


// ==========================================================
//          ROUTES DU PANIER (NOUVELLES ROUTES)
// ==========================================================

// --- GET /api/cart: Récupérer le panier de l'utilisateur ---
app.get('/api/cart', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        // Jointure entre CartItems et Offers pour récupérer tous les détails
        const sqlQuery = `
            SELECT 
                ci.offer_id AS id, 
                ci.quantity, 
                o.title, 
                o.price,
                o.infos_price
            FROM cartitems ci
            JOIN offers o ON ci.offer_id = o.id
            WHERE ci.user_id = ?
            ORDER BY o.title
        `;
        const [cartItems] = await db.query(sqlQuery, [userId]);
        
        // Nous renvoyons un tableau d'objets structuré comme l'état React l'attend.
        res.status(200).json({ cart: cartItems });
    } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération du panier.' });
    }
});

// --- PUT /api/cart: Synchroniser (mettre à jour) le panier complet ---
app.put('/api/cart', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { cart } = req.body; // 'cart' est le tableau d'articles reçu du frontend
    
    // Vérification de base
    if (!Array.isArray(cart)) {
        return res.status(400).send({ message: 'Format de panier invalide.' });
    }

    try {
        // 1. Démarrer une transaction (si votre DB le supporte) ou effectuer les opérations séquentiellement

        // 2. Supprimer tous les anciens articles du panier de cet utilisateur
        await db.query('DELETE FROM cartitems WHERE user_id = ?', [userId]);

        // 3. Insérer les nouveaux articles envoyés par le frontend
        if (cart.length > 0) {
            const values = cart.map(item => [userId, item.id, item.quantity]);
            
            // NOTE: Assurez-vous que item.id dans React correspond à offer_id dans la DB
            const sqlInsert = `
                INSERT INTO cartitems (user_id, offer_id, quantity) 
                VALUES ?
            `;
            await db.query(sqlInsert, [values]);
        }
        
        // 4. Succès
        res.status(200).send({ message: 'Panier synchronisé avec succès.' });

    } catch (error) {
        console.error('Erreur lors de la synchronisation du panier:', error);
        res.status(500).send({ message: 'Erreur lors de la synchronisation du panier.' });
    }
});


// ==========================================================
//          ROUTES DE SERVICES (CONTACT, CATÉGORIES, OFFRES, LOCATIONS)
// ==========================================================
// ... (Les autres routes restent inchangées) ...

// --- Endpoint pour le formulaire de contact ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    // NOTE: Remplacer les valeurs d'auth par vos propres informations ou variables d'environnement
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'votre.email@gmail.com', // Remplacer
            pass: 'votre_mot_de_passe' // Remplacer
        }
    });
    const mailOptions = {
        from: email,
        to: 'votre.email@votreagence.com', // Remplacer par l'email de réception
        subject: `Nouveau message de contact de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Message envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        res.status(500).send({ message: 'Erreur lors de l\'envoi du message.' });
    }
});

// --- Endpoint pour récupérer toutes les catégories ---
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, slug, icon, description FROM categories');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ message: "Erreur interne lors de la récupération des catégories", error });
    }
});

// --- Endpoint pour récupérer le nom d'une catégorie (par slug) ---
app.get('/api/categories/:category_id', async (req, res) => {
    const categorySlug = req.params.category_id;
    try {
        const [rows] = await db.query('SELECT id, name, slug FROM categories WHERE slug = ?', [categorySlug]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du nom de la catégorie:', error);
        res.status(500).json({ message: "Erreur interne lors de la récupération de la catégorie", error });
    }
});

// --- Endpoint pour récupérer les offres d'une catégorie spécifique (par slug) ---
app.get('/api/categories/:category_id/offers', async (req, res) => {
    const categorySlug = req.params.category_id;
    
    const sqlQuery = `
        SELECT
            o.id, 
            o.title, 
            o.description, 
            o.price, 
            o.infos_price, 
            o.image, 
            o.duration,
            l.name AS location_name 
        FROM offers o
        JOIN categories st ON o.service_type_id = st.id  
        JOIN locations l ON o.location_id = l.id           
        WHERE st.slug = ?
    `;

    try {
        const [offers] = await db.query(sqlQuery, [categorySlug]);

        if (offers.length === 0) {
            const [categoryRows] = await db.query('SELECT id FROM categories WHERE slug = ?', [categorySlug]);
            
            if (categoryRows.length === 0) {
                return res.status(404).json({ message: "La catégorie spécifiée n'existe pas." });
            }
        }

        res.status(200).json(offers); 
    } catch (error) {
        console.error('Erreur FATALE lors de la récupération des offres (Erreur DB):', error);
        res.status(500).json({ 
            message: "Erreur interne du serveur lors de la récupération des offres. Vérifiez votre requête SQL et le nom des tables.", 
            dbError: error.message 
        });
    }
});

// --- NOUVEAU: Endpoint pour récupérer toutes les destinations ---
app.get('/api/locations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, slug, region FROM locations ORDER BY name ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des destinations:', error);
        res.status(500).json({ message: "Erreur interne lors de la récupération des destinations", error });
    }
});

// --- NOUVEAU: Endpoint pour récupérer une destination spécifique (par slug) ---
app.get('/api/locations/:location_slug', async (req, res) => {
    const locationSlug = req.params.location_slug;
    try {
        const [rows] = await db.query('SELECT id, name, slug, region FROM locations WHERE slug = ?', [locationSlug]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Destination non trouvée" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du nom de la destination:', error);
        res.status(500).json({ message: "Erreur interne lors de la récupération de la destination", error });
    }
});

// --- NOUVEAU: Endpoint pour récupérer les offres d'une destination spécifique ---
app.get('/api/locations/:location_slug/offers', async (req, res) => {
    const locationSlug = req.params.location_slug;
    
    const sqlQuery = `
        SELECT
            o.id, 
            o.title, 
            o.description, 
            o.price, 
            o.infos_price, 
            o.image, 
            o.duration,
            c.name AS category_name, 
            c.slug AS category_slug
        FROM offers o
        JOIN locations l ON o.location_id = l.id
        JOIN categories c ON o.service_type_id = c.id           
        WHERE l.slug = ?
    `;

    try {
        const [offers] = await db.query(sqlQuery, [locationSlug]);

        if (offers.length === 0) {
            const [locationRows] = await db.query('SELECT id FROM locations WHERE slug = ?', [locationSlug]);
            
            if (locationRows.length === 0) {
                return res.status(404).json({ message: "La destination spécifiée n'existe pas." });
            }
        }

        res.status(200).json(offers); 
    } catch (error) {
        console.error('Erreur FATALE lors de la récupération des offres par destination (Erreur DB):', error);
        res.status(500).json({ 
            message: "Erreur interne du serveur lors de la récupération des offres par destination.", 
            dbError: error.message 
        });
    }
});


// ==========================================================
//          DÉMARRAGE DU SERVEUR
// ==========================================================

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});