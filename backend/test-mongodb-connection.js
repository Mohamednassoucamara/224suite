const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/224suite';
  
  console.log('🔍 Test de connexion MongoDB...');
  console.log('📡 URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Connexion MongoDB réussie !');
    
    // Lister les bases de données
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('🗄️  Bases de données disponibles:', dbs.databases.map(db => db.name));
    
    await client.close();
    console.log('🔌 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.log('💡 Vérifiez que MONGODB_URI est configuré correctement');
  }
}

testMongoDBConnection();
