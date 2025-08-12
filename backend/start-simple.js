const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Route de test simple
app.get('/', (req, res) => {
  res.json({ 
    message: '224Suite API - Test de démarrage',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API de test fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur de test démarré sur le port ${PORT}`);
  console.log(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

module.exports = app;
