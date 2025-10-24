// Script de configuration spécifique pour Railway MySQL
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupRailway() {
  let connection;
  
  try {
    console.log('🚀 Configuration de la base de données Railway MySQL...');
    
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
    
    // Lire le schéma SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Création des tables...');
    
    // Diviser le schéma en instructions individuelles
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let tablesCreated = 0;
    
    for (const statement of statements) {
      try {
        console.log(`⏳ Exécution: ${statement.substring(0, 50)}...`);
        await connection.query(statement);
        tablesCreated++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('⚠️ Table déjà existante, ignorée');
        } else {
          console.error('❌ Erreur:', error.message);
          console.error('📝 Statement:', statement);
        }
      }
    }
    
    console.log(`✅ ${tablesCreated} instructions exécutées avec succès !`);
    
    // Vérifier les tables créées
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📊 Tables créées: ${tables.length}`);
    
    if (tables.length > 0) {
      console.log('📝 Tables disponibles:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }
    
    console.log('🎉 Configuration Railway terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le script
setupRailway();
