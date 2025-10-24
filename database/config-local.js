// Configuration de base de données locale pour le développement
const mysql = require('mysql2/promise');

const config = {
  development: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: '224suite_dev',
    charset: 'utf8mb4',
    timezone: '+00:00'
  },
  production: {
    host: 'strategie.o2switch.net',
    port: 3306,
    user: 'camo7935_224suite',
    password: '224Suite@',
    database: 'camo7935_224suite',
    charset: 'utf8mb4',
    timezone: '+00:00'
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
