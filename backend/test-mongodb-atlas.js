const { MongoClient, ServerApiVersion } = require('mongodb');

// Configuration MongoDB Atlas exacte
const uri = "mongodb+srv://224suite_user:224suiteguine@224suite-cluster.tfb6emk.mongodb.net/?retryWrites=true&w=majority&appName=224suite-cluster";

console.log('🔍 Test de connexion MongoDB Atlas...');
console.log('📡 URI:', uri.replace('224suiteguinee', '***'));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log('✅ Connexion MongoDB Atlas réussie !');
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("🎯 Pinged your deployment. You successfully connected to MongoDB!");
    
    // Tester la base de données 224suite
    const db = client.db("224suite");
    console.log('🗄️  Base de données:', db.databaseName);
    
    // Lister les collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections disponibles:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB Atlas:', error.message);
    console.error('🔍 Détails de l\'erreur:', error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('🔌 Connexion fermée');
  }
}

run().catch(console.dir);
