// Script de configuration automatique de la base de données
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function autoSetup() {
  console.log('🚀 Configuration automatique de la base de données 224Suite...\n');
  
  // Essayer d'abord la base de données en ligne
  console.log('1️⃣ Tentative de connexion à la base de données en ligne...');
  const onlineConfig = {
    host: 'strategie.o2switch.net',
    port: 3306,
    user: 'camo7935_224suite',
    password: '224Suite@',
    database: 'camo7935_224suite',
    charset: 'utf8mb4',
    connectTimeout: 10000
  };
  
  try {
    const connection = await mysql.createConnection(onlineConfig);
    console.log('✅ Connexion en ligne réussie !');
    
    // Vérifier si les tables existent
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Tables existantes: ${tables.length}`);
    
    if (tables.length === 0) {
      console.log('📝 Création des tables...');
      await setupTables(connection);
      console.log('✅ Tables créées avec succès !');
    } else {
      console.log('✅ Tables déjà existantes');
    }
    
    await connection.end();
    console.log('🎉 Configuration en ligne terminée !');
    return;
    
  } catch (error) {
    console.log('❌ Connexion en ligne échouée:', error.message);
  }
  
  // Essayer la base de données locale
  console.log('\n2️⃣ Tentative de connexion à la base de données locale...');
  const localConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: '224suite_dev',
    charset: 'utf8mb4',
    connectTimeout: 5000
  };
  
  try {
    const connection = await mysql.createConnection(localConfig);
    console.log('✅ Connexion locale réussie !');
    
    // Vérifier si les tables existent
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Tables existantes: ${tables.length}`);
    
    if (tables.length === 0) {
      console.log('📝 Création des tables...');
      await setupTables(connection);
      console.log('✅ Tables créées avec succès !');
    } else {
      console.log('✅ Tables déjà existantes');
    }
    
    await connection.end();
    console.log('🎉 Configuration locale terminée !');
    return;
    
  } catch (error) {
    console.log('❌ Connexion locale échouée:', error.message);
  }
  
  // Aucune connexion n'a fonctionné
  console.log('\n❌ Aucune connexion de base de données n\'a pu être établie.');
  console.log('\n🔧 Solutions recommandées:');
  console.log('1. Installer MySQL localement');
  console.log('2. Vérifier les paramètres de connexion en ligne');
  console.log('3. Utiliser une base de données alternative (PlanetScale, Railway, etc.)');
  console.log('\n📖 Consultez SETUP-DATABASE.md pour plus d\'informations.');
}

async function setupTables(connection) {
  // Lire le schéma SQL
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Exécuter les instructions SQL
  const statements = schema.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await connection.execute(statement);
      } catch (error) {
        // Ignorer les erreurs de tables existantes
        if (!error.message.includes('already exists')) {
          console.warn('⚠️ Erreur lors de l\'exécution:', error.message);
        }
      }
    }
  }
}

// Exécuter le script
autoSetup().catch(console.error);
