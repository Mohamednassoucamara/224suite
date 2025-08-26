// Test de l'inscription utilisateur via l'API modifiée
const https = require('https');

async function testRegistration() {
  console.log('🧪 Test de l\'inscription utilisateur via l\'API...\n');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    phone: '+33123456789',
    password: 'testpassword123',
    role: 'user'
  };
  
  console.log('📝 Données de test:', testUser);
  
  try {
    const response = await makeRequest('http://localhost:5000/api/auth/register', {
      method: 'POST',
      data: testUser
    });
    
    console.log('📊 Réponse de l\'API:');
    console.log('Status:', response.status);
    console.log('Données:', response.data);
    
    if (response.status === 201) {
      console.log('✅ Inscription réussie !');
      console.log('🎉 L\'utilisateur a été créé via Supabase !');
    } else {
      console.log('❌ Erreur lors de l\'inscription');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 30000
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    if (options.data) {
      req.write(JSON.stringify(options.data));
    }
    
    req.end();
  });
}

// Exécuter le test
testRegistration();
