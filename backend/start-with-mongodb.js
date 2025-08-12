const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());
app.use(compression());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Variable globale pour la connexion MongoDB
let mongoClient = null;
let db = null;

// Connexion à MongoDB
async function connectToMongoDB() {
  let uri;
  
  // Essayer d'abord MONGODB_URI complète
  if (process.env.MONGODB_URI) {
    uri = process.env.MONGODB_URI;
  } 
  // Sinon, construire l'URI à partir des variables séparées
  else if (process.env.MONGODB_HOST && process.env.MONGODB_USER && process.env.MONGODB_PASS) {
    uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/224suite?retryWrites=true&w=majority&appName=224suite-cluster`;
  } 
  // Fallback local
  else {
    uri = 'mongodb://localhost:27017/224suite';
  }
  
  console.log('🔍 Tentative de connexion MongoDB...');
  console.log('📡 URI:', uri.replace(process.env.MONGODB_PASS || '', '***'));
  
  try {
    mongoClient = new MongoClient(uri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    await mongoClient.connect();
    db = mongoClient.db('224suite');
    
    console.log('✅ Connexion MongoDB établie');
    console.log('🗄️  Base de données:', db.databaseName);
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.log('⚠️  L\'application continue sans base de données');
    console.log('💡 Vérifiez les variables MONGODB_HOST, MONGODB_USER, MONGODB_PASS');
  }
}

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '224Suite API avec MongoDB',
    timestamp: new Date().toISOString(),
    mongodb: db ? 'Connected' : 'Not Connected'
  });
});

// Route de test MongoDB
app.get('/api/test-mongodb', async (req, res) => {
  if (!db) {
    return res.status(503).json({ 
      error: 'MongoDB non connecté',
      message: 'Configurez MONGODB_URI pour tester la base de données'
    });
  }
  
  try {
    // Créer une collection de test
    const collection = db.collection('test');
    
    // Insérer un document de test
    const result = await collection.insertOne({
      message: 'Test MongoDB',
      timestamp: new Date(),
      test: true
    });
    
    // Récupérer le document
    const doc = await collection.findOne({ _id: result.insertedId });
    
    res.json({
      message: 'Test MongoDB réussi',
      inserted: result.insertedId,
      retrieved: doc,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Erreur lors du test MongoDB',
      message: error.message
    });
  }
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API 224Suite avec MongoDB',
    version: '1.0.0',
    mongodb: db ? 'Connected' : 'Not Connected',
    endpoints: [
      '/api/health',
      '/api/test-mongodb'
    ]
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
async function startServer() {
  // Connecter à MongoDB d'abord
  await connectToMongoDB();
  
  // Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`🚀 Serveur 224Suite démarré sur le port ${PORT}`);
    console.log(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🗄️  MongoDB: ${db ? 'Connecté' : 'Non connecté'}`);
  });
}

startServer();

module.exports = app;
