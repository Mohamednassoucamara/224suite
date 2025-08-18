const axios = require('axios');

const testRegister = async () => {
  try {
    console.log('🧪 Test d\'inscription...');
    
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      phone: '+224123456789',
      password: 'password123',
      userType: 'seeker'
    };

    console.log('📤 Données envoyées:', testUser);

    const baseURL = process.env.TEST_API_URL || 'http://localhost:5000';
    const response = await axios.post(`${baseURL}/api/auth/register`, testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Réponse reçue:', response.status);
    console.log('📄 Données:', response.data);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Données d\'erreur:', error.response.data);
    } else if (error.request) {
      console.error('🌐 Erreur réseau - Le serveur ne répond pas');
    } else {
      console.error('🔧 Erreur de configuration:', error.message);
    }
  }
};

// Attendre que le serveur démarre
setTimeout(testRegister, 3000);
