const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'env.development') });

// Vérifier les variables d'environnement requises
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingVars.join(', '));
  console.log('📝 Créez un fichier .env ou copiez env.development');
  process.exit(1);
}

console.log('✅ Configuration d\'environnement chargée');
console.log('🚀 Démarrage du serveur de développement...');

// Démarrer le serveur
require('./server.js');
