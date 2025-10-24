// Script pour vérifier les tables dans la base de données Railway
const mysql = require('mysql2/promise');

async function checkTables() {
  let connection;
  
  try {
    console.log('🔍 Vérification des tables dans Railway MySQL...');
    
    // Configuration Railway
    const config = {
      host: 'gondola.proxy.rlwy.net',
      port: 11311,
      user: 'root',
      password: 'BPlZtcXgcrhlcSVGInePcSDffgMHZzmw',
      database: 'railway',
      charset: 'utf8mb4'
    };
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connexion établie avec succès !');
    
    // Vérifier la base de données actuelle
    const [currentDb] = await connection.query('SELECT DATABASE() as current_db');
    console.log('🗄️ Base de données actuelle:', currentDb[0].current_db);
    
    // Lister toutes les bases de données
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('📊 Bases de données disponibles:');
    databases.forEach(db => {
      console.log(`   - ${Object.values(db)[0]}`);
    });
    
    // Vérifier les tables dans la base de données actuelle
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📋 Tables dans la base de données actuelle: ${tables.length}`);
    
    if (tables.length > 0) {
      console.log('📝 Tables disponibles:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    } else {
      console.log('⚠️  Aucune table trouvée dans la base de données actuelle');
    }
    
    // Essayer de créer une table de test
    console.log('\n🧪 Test de création de table...');
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS test_table (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100)
        )
      `);
      console.log('✅ Table de test créée avec succès !');
      
      // Supprimer la table de test
      await connection.query('DROP TABLE test_table');
      console.log('🗑️ Table de test supprimée');
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de table:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

checkTables();
