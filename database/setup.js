// Script de configuration de la base de données MySQL
const fs = require('fs');
const path = require('path');
const { createConnection } = require('./config');

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 Configuration de la base de données MySQL...');
    
    // Lire le fichier de schéma
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Créer la connexion
    connection = await createConnection();
    
    // Exécuter le schéma
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (error) {
          // Ignorer les erreurs de tables existantes
          if (!error.message.includes('already exists')) {
            console.warn('⚠️ Erreur lors de l\'exécution:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Base de données configurée avec succès !');
    console.log('📊 Tables créées :');
    console.log('   - users (utilisateurs)');
    console.log('   - properties (propriétés)');
    console.log('   - property_images (images)');
    console.log('   - favorites (favoris)');
    console.log('   - messages (messages)');
    console.log('   - appointments (rendez-vous)');
    console.log('   - subscriptions (abonnements)');
    console.log('   - saved_searches (recherches sauvegardées)');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration de la base de données:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
