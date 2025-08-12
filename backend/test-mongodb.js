const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configuration de la connexion MongoDB
const connectDB = async () => {
  try {
    console.log('🔌 Tentative de connexion à MongoDB...');
    console.log('🔍 URI MongoDB:', process.env.MONGODB_URI ? 'Présente' : 'Manquante');
    console.log('📁 Répertoire courant:', __dirname);
    console.log('🔧 Variables d\'environnement:', Object.keys(process.env).filter(key => key.includes('MONGODB')));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/224suite', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB connecté avec succès !`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`🔗 URI: ${conn.connection.client.s.url}`);
    
    // Test de création d'une collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Test de connexion MongoDB Atlas'
    });
    console.log('✅ Test d\'écriture réussi !');
    
    // Test de lecture
    const result = await testCollection.findOne({ test: true });
    console.log('✅ Test de lecture réussi !');
    
    // Nettoyage
    await testCollection.deleteOne({ test: true });
    console.log('✅ Test de suppression réussi !');
    
    console.log('\n🎉 Tous les tests MongoDB sont passés avec succès !');
    
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée.');
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.log('\n🔧 Vérifiez :');
    console.log('1. Votre fichier .env contient MONGODB_URI');
    console.log('2. L\'URI de connexion est correcte');
    console.log('3. L\'utilisateur et mot de passe sont valides');
    console.log('4. L\'IP est autorisée dans Network Access');
    console.log('5. Le cluster MongoDB Atlas est actif');
    
    process.exit(1);
  }
};

// Exécuter le test
connectDB();
