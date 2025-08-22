const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import des modèles Sequelize
const db = require('./backend/models');

// Import des routes
const authRoutes = require('./backend/routes/auth');
const userRoutes = require('./backend/routes/users');
const propertyRoutes = require('./backend/routes/properties');
const searchRoutes = require('./backend/routes/search');
const contactRoutes = require('./backend/routes/contact');
const paymentRoutes = require('./backend/routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://192.168.1.233:3000',
      'http://192.168.1.233:3001'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS bloqué pour:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes de base
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur 224Suite opérationnel',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL avec Sequelize'
  });
});

app.get('/api/test-postgresql', async (req, res) => {
  try {
    // Test de connexion à PostgreSQL
    await db.sequelize.authenticate();
    res.json({
      status: 'OK',
      message: 'Connexion à PostgreSQL établie avec succès',
      database: process.env.DB_NAME || '224suite_dev',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432
    });
  } catch (error) {
    console.error('Erreur de connexion PostgreSQL:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Erreur de connexion à PostgreSQL',
      error: error.message
    });
  }
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: error.message
  });
});

// Fonction de démarrage du serveur
async function startServer() {
  try {
    // Synchroniser la base de données (créer les tables si elles n'existent pas)
    await db.sequelize.sync({ alter: true });
    console.log('✅ Base de données PostgreSQL synchronisée');
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur 224Suite démarré sur le port ${PORT}`);
      console.log(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`✅ Connexion à PostgreSQL établie`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt gracieux du serveur...');
  try {
    await db.sequelize.close();
    console.log('✅ Connexion PostgreSQL fermée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture:', error);
    process.exit(1);
  }
});

// Démarrer le serveur
startServer();
