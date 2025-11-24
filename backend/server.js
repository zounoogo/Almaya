// server.js (ou app.js)

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const db = require('./db'); // Assurez-vous que ce fichier gère la connexion à votre DB
require('dotenv').config();

const app = express();
const port = 3001; 

// ==========================================================
//          CONFIGURATIONS SÉCURITÉ ET MIDDLEWARES
// ==========================================================

// --- 1. CORS & Cookies
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));
app.use(express.json());
app.use(cookieParser()); 

const JWT_SECRET = process.env.JWT_SECRET || 'UTILISEZ_UNE_CLE_SECRETE_FORTE_EN_PROD'; 

// --- 2. Rate Limiting (Anti-Brute Force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Trop de tentatives. Veuillez réessayer après 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// ==========================================================
//          FONCTIONS DE VÉRIFICATION EMAIL
// ==========================================================

/**
 * Génère un jeton cryptographiquement sécurisé.
 */
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envoie l'email de vérification à l'utilisateur.
 */
const sendVerificationEmail = async (userEmail, token) => {
    // Le lien doit pointer vers la route de vérification de CETTE API
    const verificationLink = `http://localhost:3001/api/verify-email?token=${token}`; 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Veuillez vérifier votre compte ALMAYA SERVICES',
        html: `
            <h2>Activation de votre compte</h2>
            <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail et activer votre compte :</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
        `
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
         console.warn("ATTENTION: Les identifiants d'email ne sont pas définis.");
         throw new Error("Identifiants de messagerie manquants ou non configurés.");
    }

    await transporter.sendMail(mailOptions);
};


// ==========================================================
//          MIDDLEWARE D'AUTHENTIFICATION & AUTORISATION
// ==========================================================

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 
    
    if (token == null) return res.status(401).send({ message: 'Accès non autorisé : Token manquant.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.clearCookie('token'); 
            return res.status(403).send({ message: 'Session expirée ou Token invalide.' });
        }
        req.user = user; 
        next();
    });
};

/**
 * Vérifie si l'utilisateur authentifié a le rôle requis.
 * @param {string[]} allowedRoles - Tableau de rôles autorisés (ex: ['admin', 'manager'])
 */
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // L'utilisateur (req.user) doit avoir été défini par authenticateToken avant
        if (!req.user || !req.user.role) {
            return res.status(401).send({ message: 'Erreur d\'authentification : Rôle non trouvé.' });
        }
        
        const userRole = req.user.role;
        
        if (allowedRoles.includes(userRole)) {
            next(); // L'utilisateur est autorisé
        } else {
            // Statut 403 Forbidden : L'utilisateur est connu mais n'a pas les droits.
            return res.status(403).send({ message: 'Accès refusé : Vous n\'avez pas les permissions nécessaires.' });
        }
    };
};


// ==========================================================
//          ROUTES D'AUTHENTIFICATION & VÉRIFICATION
// ==========================================================

// --- 1. Endpoint d'inscription (Création du compte non vérifié)
app.post('/api/register', authLimiter, async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        // Correction DÉFINITIVE: Requête sur une seule ligne
        const sql = 'INSERT INTO users (username, email, password, role, isVerified, verificationToken) VALUES (?, ?, ?, "customer", FALSE, ?)';

        await db.query(sql, [username, email, hashedPassword, verificationToken]);

        try {
            await sendVerificationEmail(email, verificationToken);
            res.status(201).send({ 
                message: 'Inscription réussie ! Veuillez vérifier votre boîte de réception pour activer votre compte.' 
            });
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
            res.status(202).send({ 
                message: 'Inscription réussie, mais échec de l\'envoi de l\'e-mail. Veuillez contacter le support.' 
            });
        }

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: 'Le nom d\'utilisateur ou l\'e-mail existe déjà.' });
        }
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).send({ message: 'Erreur lors de l\'inscription.' });
    }
});

// --- 2. Endpoint de Vérification (Activation du compte)
app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Jeton de vérification manquant.');
    }

    try {
        const sql = 'SELECT id FROM users WHERE verificationToken = ? AND isVerified = FALSE';
        const [rows] = await db.query(sql, [token]);

        if (rows.length === 0) {
            // Redirection vers la page de login avec un message d'erreur si le token est invalide/expiré
            return res.redirect('http://localhost:3000/login?error=invalid_token'); 
        }

        const userId = rows[0].id;
        
        // Met à jour le statut et efface le jeton
        const updateSql = 'UPDATE users SET isVerified = TRUE, verificationToken = NULL WHERE id = ?';
        await db.query(updateSql, [userId]);

        // Redirige l'utilisateur vers la page de succès du frontend
        res.redirect('http://localhost:3000/verification-success'); 

    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email:', error);
        res.status(500).send('Erreur interne du serveur lors de la vérification.');
    }
});


// --- 3. Endpoint de Connexion (Bloque les comptes non vérifiés)
app.post('/api/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT id, username, email, password, role, isVerified FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect.' });
        }
        const user = rows[0];

        // VÉRIFICATION DU STATUT: BLOQUAGE SI NON VÉRIFIÉ
        if (!user.isVerified) {
            return res.status(403).send({ 
                message: 'Votre compte n\'est pas activé. Veuillez vérifier votre boîte de réception.' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect.' });
        }

        // Création du Token et envoi du cookie
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict', // Sécurité maximale
            maxAge: 3600000 
        });
        
        res.status(200).send({ message: 'Connexion réussie !', user: { id: user.id, username: user.username, email: user.email, role: user.role } });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).send({ message: 'Erreur lors de la connexion.' });
    }
});

// --- 4. Endpoint pour renvoyer l'email de vérification
app.post('/api/resend-verification', authLimiter, async (req, res) => {
    const { email } = req.body;
    
    try {
        const [rows] = await db.query('SELECT id, isVerified FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0 || rows[0].isVerified) {
            // Sécurité: message vague pour ne pas confirmer l'existence du compte
            return res.status(200).send({ message: 'Si un compte non vérifié est associé à cet e-mail, un nouveau lien a été envoyé.' });
        }
        
        const user = rows[0];
        const newVerificationToken = generateVerificationToken();

        const updateSql = 'UPDATE users SET verificationToken = ? WHERE id = ?';
        await db.query(updateSql, [newVerificationToken, user.id]);

        await sendVerificationEmail(email, newVerificationToken);
        res.status(200).send({ message: 'Un nouvel email de vérification a été envoyé à votre adresse.' });

    } catch (error) {
        console.error('Erreur lors de la demande de renvoi:', error);
        res.status(500).send({ message: 'Erreur lors de l\'envoi de l\'e-mail. Veuillez réessayer plus tard.' });
    }
});

// --- Endpoint de déconnexion
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: 'Déconnexion réussie.' });
});

// --- Endpoint de profil protégé (Session check)
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, role, isVerified FROM users WHERE id = ? AND isVerified = TRUE', [req.user.id]);
        
        if (rows.length === 0) {
            res.clearCookie('token');
            return res.status(403).send({ message: 'Accès refusé. Compte non vérifié ou non trouvé.' }); 
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération du profil.' });
    }
});

// ==========================================================
//          ROUTES D'ADMINISTRATION (Rôle Admin Requis)
// ==========================================================

// --- 1. Endpoint: Récupérer tous les utilisateurs (Admin)
app.get('/api/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        // Sélectionne les informations essentielles (ne pas exposer les hachages de mots de passe)
        const [rows] = await db.query('SELECT id, username, email, role, isVerified FROM users');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste des utilisateurs:', error);
        res.status(500).send({ message: 'Erreur serveur lors de la récupération des utilisateurs.' });
    }
});

// --- 2. Endpoint: CRUD Offres (Admin) ---

// POST /api/admin/offers: Créer une nouvelle offre
app.post('/api/admin/offers', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { 
        title, description, price, infos_price, image, duration, service_type_id, location_id 
    } = req.body;
    
    if (!service_type_id || !location_id || !title || !description) {
        return res.status(400).send({ message: 'Données obligatoires manquantes.' });
    }

    try {
        const sqlInsert = `
            INSERT INTO offers (title, description, price, infos_price, image, duration, service_type_id, location_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(sqlInsert, [
            title, description, price, infos_price, image, duration, service_type_id, location_id
        ]);
        
        res.status(201).send({ message: 'Offre créée avec succès.' });
        
    } catch (error) {
        console.error('Erreur lors de la création de l\'offre:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).send({ message: 'Catégorie ou Destination invalide.' });
        }
        res.status(500).send({ message: 'Erreur serveur lors de la création de l\'offre.' });
    }
});

// PUT /api/admin/offers/:id: Modifier une offre existante 🔑 NOUVELLE ROUTE
app.put('/api/admin/offers/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const offerId = req.params.id;
    const { 
        title, description, price, infos_price, image, duration, service_type_id, location_id 
    } = req.body;

    if (!offerId || !service_type_id || !location_id || !title || !description) {
        return res.status(400).send({ message: 'Données obligatoires manquantes.' });
    }

    try {
        const sqlUpdate = `
            UPDATE offers 
            SET title = ?, description = ?, price = ?, infos_price = ?, image = ?, duration = ?, service_type_id = ?, location_id = ? 
            WHERE id = ?
        `;
        const [result] = await db.query(sqlUpdate, [
            title, description, price, infos_price, image, duration, service_type_id, location_id, offerId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Offre non trouvée ou aucune modification effectuée.' });
        }
        
        res.status(200).send({ message: 'Offre mise à jour avec succès.' });
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'offre:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).send({ message: 'Catégorie ou Destination invalide.' });
        }
        res.status(500).send({ message: 'Erreur serveur lors de la mise à jour de l\'offre.' });
    }
});

// DELETE /api/admin/offers/:id: Supprimer une offre par ID (Admin)
app.delete('/api/admin/offers/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const offerId = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM offers WHERE id = ?', [offerId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Offre non trouvée.' });
        }
        res.status(200).send({ message: `Offre ${offerId} supprimée avec succès.` });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'offre:', error);
        res.status(500).send({ message: 'Erreur serveur lors de la suppression.' });
    }
});

// --- 3. CRUD Destinations (Admin) ---

// POST /api/admin/locations: Créer une nouvelle destination
app.post('/api/admin/locations', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { name, slug, region, image } = req.body;
    try {
        const sqlInsert = 'INSERT INTO locations (name, slug, region, image) VALUES (?, ?, ?, ?)';
        await db.query(sqlInsert, [name, slug, region, image]);
        res.status(201).send({ message: 'Destination créée avec succès.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).send({ message: 'Ce slug existe déjà pour une autre destination.' });
        }
        console.error('Erreur lors de la création de la destination:', error);
        res.status(500).send({ message: 'Erreur serveur lors de la création de la destination.' });
    }
});

// PUT /api/admin/locations/:slug: Modifier une destination existante
app.put('/api/admin/locations/:slug', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { name, region, image, new_slug } = req.body;
    const oldSlug = req.params.slug;
    try {
        const updateSlug = new_slug || oldSlug; 
        const sqlUpdate = 'UPDATE locations SET name = ?, slug = ?, region = ?, image = ? WHERE slug = ?';
        const [result] = await db.query(sqlUpdate, [name, updateSlug, region, image, oldSlug]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Destination non trouvée.' });
        }
        res.status(200).send({ message: 'Destination mise à jour avec succès.', newSlug: updateSlug });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).send({ message: 'Le nouveau slug existe déjà.' });
        }
        console.error('Erreur lors de la mise à jour de la destination:', error);
        res.status(500).send({ message: 'Erreur serveur lors de la mise à jour de la destination.' });
    }
});

// DELETE /api/admin/locations/:slug: Supprimer une destination
app.delete('/api/admin/locations/:slug', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const locationSlug = req.params.slug;
    try {
        const [result] = await db.query('DELETE FROM locations WHERE slug = ?', [locationSlug]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Destination non trouvée.' });
        }
        res.status(200).send({ message: `Destination ${locationSlug} supprimée avec succès.` });
    } catch (error) {
        console.error('Erreur lors de la suppression de la destination:', error);
        res.status(500).send({ message: 'Erreur serveur lors de la suppression de la destination.' });
    }
});

// ==========================================================
//          ROUTES DU PANIER PROTÉGÉES (Authenticated & Verified)
// ==========================================================

// --- GET /api/cart: Récupérer le panier de l'utilisateur
app.get('/api/cart', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        // Correction: Requête sur une seule ligne
        const sqlQuery = `SELECT ci.offer_id AS id, ci.quantity, o.title, o.price, o.infos_price FROM cartitems ci JOIN offers o ON ci.offer_id = o.id WHERE ci.user_id = ? ORDER BY o.title`;

        const [cartItems] = await db.query(sqlQuery, [userId]);
        res.status(200).json({ cart: cartItems });
    } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération du panier.' });
    }
});

// --- PUT /api/cart: Synchroniser (mettre à jour) le panier complet
app.put('/api/cart', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { cart } = req.body; 
    
    if (!Array.isArray(cart)) {
        return res.status(400).send({ message: 'Format de panier invalide.' });
    }

    try {
        // 1. Suppression des anciens articles 
        await db.query('DELETE FROM cartitems WHERE user_id = ?', [userId]);

        // 2. Insertion des nouveaux articles
        if (cart.length > 0) {
            const values = cart.map(item => [userId, item.id, item.quantity]);
            
            // Correction: Requête sur une seule ligne
            const sqlInsert = 'INSERT INTO cartitems (user_id, offer_id, quantity) VALUES ?';
            
            await db.query(sqlInsert, [values]); 
        }
        
        res.status(200).send({ message: 'Panier synchronisé avec succès.' });

    } catch (error) {
        console.error('Erreur lors de la synchronisation du panier:', error);
        res.status(500).send({ message: 'Erreur lors de la synchronisation du panier.' });
    }
});


// ==========================================================
//          ROUTES DE SERVICES (NON PROTÉGÉES)
// ==========================================================

// --- Endpoint pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    const mailOptions = {
        from: email,
        to: process.env.RECIPIENT_EMAIL || 'votre.email.reception@votreagence.com', 
        subject: `Nouveau message de contact de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
             console.warn("ATTENTION: Les identifiants d'email ne sont pas définis.");
             throw new Error("Identifiants de messagerie manquants ou non configurés.");
        }
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Message envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        res.status(500).send({ message: 'Erreur lors de l\'envoi du message.' });
    }
});


// --- Endpoint pour récupérer toutes les catégories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, slug, icon, description FROM categories');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ message: "Erreur interne lors de la récupération des catégories", error });
    }
});

// --- Endpoint pour récupérer une catégorie spécifique (par slug)
app.get('/api/categories/:category_id', async (req, res) => {
    const categorySlug = req.params.category_id.toLowerCase();
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

// --- Endpoint pour récupérer les détails d'une seule offre par ID 🔑 NOUVELLE ROUTE
app.get('/api/offers/:id', async (req, res) => {
    const offerId = req.params.id;
    // jointure pour obtenir le nom et le slug de la destination
    const sqlQuery = `
        SELECT 
            o.*, 
            l.name AS location_name, 
            l.slug AS location_slug
        FROM offers o
        JOIN locations l ON o.location_id = l.id
        WHERE o.id = ?
    `;

    try {
        const [rows] = await db.query(sqlQuery, [offerId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Offre non trouvée." });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'offre:', error);
        res.status(500).json({ message: "Erreur interne du serveur lors de la récupération de l'offre.", dbError: error.message });
    }
});


// --- Endpoint pour récupérer les offres d'une catégorie spécifique (par slug)
app.get('/api/categories/:category_id/offers', async (req, res) => {
    const categorySlug = req.params.category_id.toLowerCase();
    // Correction: Requête sur une seule ligne
    const sqlQuery = `SELECT o.id, o.title, o.description, o.price, o.infos_price, o.image, o.duration, l.name AS location_name FROM offers o JOIN categories st ON o.service_type_id = st.id JOIN locations l ON o.location_id = l.id WHERE st.slug = ?`;

    try {
        const [offers] = await db.query(sqlQuery, [categorySlug]);
        res.status(200).json(offers); 
    } catch (error) {
        console.error('Erreur FATALE lors de la récupération des offres (Erreur DB):', error);
        res.status(500).json({ 
            message: "Erreur interne du serveur lors de la récupération des offres.", 
            dbError: error.message 
        });
    }
});

// --- Endpoint pour récupérer toutes les destinations
app.get('/api/locations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, slug, region FROM locations ORDER BY name ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des destinations:', error);
        res.status(500).json({ message: "Erreur interne lors de la récupération des destinations", error });
    }
});

// --- Endpoint pour récupérer une destination spécifique (par slug)
app.get('/api/locations/:location_slug', async (req, res) => {
    const locationSlug = req.params.location_slug.toLowerCase();
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

// --- Endpoint pour récupérer les offres d'une destination spécifique
app.get('/api/locations/:location_slug/offers', async (req, res) => {
    const locationSlug = req.params.location_slug.toLowerCase();
    // Correction: Requête sur une seule ligne
    const sqlQuery = `SELECT o.id, o.title, o.description, o.price, o.infos_price, o.image, o.duration, c.name AS category_name, c.slug AS category_slug FROM offers o JOIN locations l ON o.location_id = l.id JOIN categories c ON o.service_type_id = c.id WHERE l.slug = ?`;

    try {
        const [offers] = await db.query(sqlQuery, [locationSlug]);
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
//          DÉMARRAGE DU SERVEUR
// ==========================================================

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    if (process.env.NODE_ENV === 'production') {
        console.warn("ATTENTION: En production, utilisez un proxy inverse (Nginx/Apache) pour le HTTPS!");
    }
});