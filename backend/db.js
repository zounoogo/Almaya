// db.js - Updated for Railway deployment
const mysql = require('mysql2/promise');
require('dotenv').config();

// Function to parse DATABASE_URL
function parseDatabaseUrl(url) {
    if (!url) return null;

    try {
        const parsedUrl = new URL(url);
        return {
            host: parsedUrl.hostname,
            user: parsedUrl.username,
            password: parsedUrl.password,
            database: parsedUrl.pathname.substring(1), // Remove leading slash
            port: parseInt(parsedUrl.port) || 3306
        };
    } catch (error) {
        console.error('Error parsing DATABASE_URL:', error.message);
        return null;
    }
}

// Get database config from Railway DATABASE_URL or individual variables
const dbConfig = process.env.DATABASE_URL
    ? parseDatabaseUrl(process.env.DATABASE_URL)
    : {
        host: process.env.MYSQLHOST || process.env.DB_HOST,
        user: process.env.MYSQLUSER || process.env.DB_USER,
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
        database: process.env.MYSQLDATABASE || process.env.DB_NAME,
        port: process.env.MYSQLPORT || 3306,
    };

if (!dbConfig) {
    console.error('❌ No database configuration found. Check DATABASE_URL or individual DB variables.');
    process.exit(1);
}

const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Railway requires SSL for production
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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