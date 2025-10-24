// Script de test de connexion MySQL
const mysql = require('mysql2/promise');

async function testConnection() {
  let connection;
  
  try {
    console.log('🔍 Test de connexion à la base de données MySQL Railway...');
    console.log('📡 Host:', 'gondola.proxy.rlwy.net');
    console.log('🔌 Port:', 11311);
    console.log('👤 User:', 'root');
    console.log('🗄️ Database:', '224suite');
    
    // Configuration de connexion Railway
    const config = {
      host: 'gondola.proxy.rlwy.net',
      port: 11311,
      user: 'root',
      password: 'BPlZtcXgcrhlcSVGInePcSDffgMHZzmw',
      database: '224suite',
      charset: 'utf8mb4',
      connectTimeout: 30000,
      acquireTimeout: 30000,
      timeout: 30000
    };
    
    console.log('⏳ Tentative de connexion...');
    connection = await mysql.createConnection(config);
    
    console.log('✅ Connexion établie avec succès !');
    
    // Tester une requête simple
    console.log('🧪 Test de requête...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Requête testée avec succès:', rows[0]);
    
    // Vérifier les tables existantes
    console.log('📋 Vérification des tables existantes...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Tables trouvées:', tables.length);
    
    if (tables.length > 0) {
      console.log('📝 Tables existantes:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    } else {
      console.log('⚠️  Aucune table trouvée. La base de données est vide.');
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('🔍 Code d\'erreur:', error.code);
    console.error('📋 Stack trace:', error.stack);
    
    // Suggestions de dépannage
    console.log('\n🔧 Suggestions de dépannage:');
    console.log('1. Vérifiez que le serveur MySQL est accessible');
    console.log('2. Vérifiez les informations de connexion');
    console.log('3. Vérifiez que le port 3306 n\'est pas bloqué par un firewall');
    console.log('4. Vérifiez que l\'utilisateur a les permissions nécessaires');
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le test
testConnection();
