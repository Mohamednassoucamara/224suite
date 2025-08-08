const request = require('supertest');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Créer une app Express simple pour les tests
const app = express();

// Middleware de base
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '224Suite API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API 224Suite',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

describe('Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message', '224Suite API is running');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('GET / should return welcome message', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Bienvenue sur l\'API 224Suite');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });
});
