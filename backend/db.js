// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de connexion : Crucial pour vérifier si le serveur DOIT planter.
pool.getConnection()
    .then(connection => {
        console.log('✅ Connexion à la base de données MySQL réussie ! Le serveur peut démarrer.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erreur FATALE lors de la connexion à la base de données (Vérifiez le .env et MySQL) :', err.message);
        // Quitter l'application si la connexion échoue
        process.exit(1); 
    });

module.exports = pool;