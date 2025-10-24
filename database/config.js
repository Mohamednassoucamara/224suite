// Configuration de la base de données MySQL pour 224Suite
const mysql = require('mysql2/promise');

const config = {
  development: {
    host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
    port: process.env.DB_PORT || 11311,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'BPlZtcXgcrhlcSVGInePcSDffgMHZzmw',
    database: process.env.DB_NAME || '224suite',
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    ssl: false
  },
  production: {
    host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
    port: process.env.DB_PORT || 11311,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'BPlZtcXgcrhlcSVGInePcSDffgMHZzmw',
    database: process.env.DB_NAME || '224suite',
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    ssl: false
  }
};

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Créer une connexion à la base de données
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion MySQL établie avec succès');
    return connection;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    throw error;
  }
};

// Créer un pool de connexions
const createPool = () => {
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

module.exports = {
  config: dbConfig,
  createConnection,
  createPool
};
