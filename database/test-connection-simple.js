// Script de test de connexion MySQL simplifié
const mysql = require('mysql2/promise');

async function testConnectionSimple() {
  let connection;
  
  try {
    console.log('🔍 Test de connexion MySQL simplifié...');
    
    // Configuration minimale
    const config = {
      host: 'strategie.o2switch.net',
      port: 3306,
      user: 'camo7935_224suite',
      password: '224Suite@',
      database: 'camo7935_224suite',
      charset: 'utf8mb4',
      connectTimeout: 10000,
      acquireTimeout: 10000,
      timeout: 10000,
      reconnect: false,
      ssl: false
    };
    
    console.log('⏳ Tentative de connexion avec configuration minimale...');
    connection = await mysql.createConnection(config);
    
    console.log('✅ Connexion établie !');
    
    // Test simple
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Test réussi:', rows[0]);
    
    // Vérifier les tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Nombre de tables: ${tables.length}`);
    
    if (tables.length > 0) {
      console.log('📝 Tables existantes:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    // Essayer avec une configuration encore plus simple
    try {
      console.log('\n🔄 Tentative avec configuration ultra-simple...');
      const simpleConfig = {
        host: 'strategie.o2switch.net',
        port: 3306,
        user: 'camo7935_224suite',
        password: '224Suite@',
        database: 'camo7935_224suite'
      };
      
      const simpleConnection = await mysql.createConnection(simpleConfig);
      console.log('✅ Connexion simple réussie !');
      
      const [rows] = await simpleConnection.execute('SELECT 1 as test');
      console.log('✅ Test simple réussi:', rows[0]);
      
      await simpleConnection.end();
      
    } catch (simpleError) {
      console.error('❌ Erreur même avec configuration simple:', simpleError.message);
      
      // Vérifier si c'est un problème de réseau
      console.log('\n🌐 Diagnostic réseau:');
      console.log('   - Vérifiez votre connexion internet');
      console.log('   - Vérifiez que le serveur MySQL est accessible');
      console.log('   - Vérifiez les paramètres de firewall');
      console.log('   - Essayez de vous connecter via un client MySQL (phpMyAdmin, MySQL Workbench, etc.)');
    }
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

testConnectionSimple();
