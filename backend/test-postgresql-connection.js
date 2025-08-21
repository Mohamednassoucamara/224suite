require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testPostgreSQLConnection() {
  console.log('🔍 Test de connexion PostgreSQL...');
  
  const config = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || '224suite_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  };

  console.log('📋 Configuration:');
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.username}`);
  console.log(`   Password: ${config.password ? '***' : 'non défini'}`);

  const sequelize = new Sequelize(config);

  try {
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès !');
    
    // Test de synchronisation des modèles
    console.log('🔄 Test de synchronisation des modèles...');
    await sequelize.sync({ force: false });
    console.log('✅ Modèles synchronisés avec succès !');
    
    // Fermer la connexion
    await sequelize.close();
    console.log('🔒 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solutions possibles:');
      console.log('   1. Vérifiez que PostgreSQL est démarré');
      console.log('   2. Vérifiez le port (défaut: 5432)');
      console.log('   3. Vérifiez que le service est actif');
    } else if (error.code === '28P01') {
      console.log('\n💡 Erreur d\'authentification:');
      console.log('   1. Vérifiez le nom d\'utilisateur et mot de passe');
      console.log('   2. Vérifiez les permissions de l\'utilisateur');
    } else if (error.code === '3D000') {
      console.log('\n💡 Base de données introuvable:');
      console.log('   1. Créez la base de données: CREATE DATABASE 224suite_dev;');
      console.log('   2. Vérifiez le nom de la base de données');
    }
    
    process.exit(1);
  }
}

// Exécuter le test
testPostgreSQLConnection();
