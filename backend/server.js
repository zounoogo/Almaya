// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Importation de bcrypt
const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken
const db = require('./db');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Clé secrète pour les tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_securisee';

// Middleware de protection des routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send({ message: 'Accès non autorisé' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Token invalide' });
        req.user = user;
        next();
    });
};

// ==========================================================
//           ROUTES D'AUTHENTIFICATION ET DE PROFIL
// ==========================================================

// --- Endpoint d'inscription ---
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
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

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: 'Connexion réussie !', token });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).send({ message: 'Erreur lors de la connexion.' });
    }
});

// --- Endpoint de profil protégé ---
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [req.user.id]);
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
//          ROUTES DE SERVICES (CONTACT, CATÉGORIES, OFFRES)
// ==========================================================

// --- Endpoint pour le formulaire de contact ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'votre.email@gmail.com',
            pass: 'votre_mot_de_passe'
        }
    });
    const mailOptions = {
        from: email,
        to: 'votre.email@votreagence.com',
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
        const [rows] = await db.query('SELECT * FROM categories');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des catégories", error });
    }
});

// --- Endpoint pour récupérer le nom d'une catégorie ---
app.get('/api/categories/:category_id', async (req, res) => {
    const { category_id } = req.params;
    try {
        const [rows] = await db.query('SELECT name FROM categories WHERE id = ?', [category_id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la catégorie", error });
    }
});

// --- Endpoint pour récupérer les offres d'une catégorie spécifique ---
app.get('/api/categories/:category_id/offers', async (req, res) => {
    const { category_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM offers WHERE category_id = ?', [category_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des offres", error });
    }
});

// ==========================================================
//                  DÉMARRAGE DU SERVEUR
// ==========================================================

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});