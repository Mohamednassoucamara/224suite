# 🔗 Guide d'Intégration Frontend-Backend - 224Suite

## 📋 Vue d'Ensemble

Ce guide explique comment intégrer le frontend React avec le backend Node.js/Express pour la plateforme immobilière 224Suite.

## 🏗️ Architecture

```
Frontend (React) ←→ API Service ←→ Backend (Node.js/Express) ←→ MongoDB Atlas
```

## 📁 Structure des Fichiers

### Frontend (`src/`)
- `services/api.js` - Service API principal
- `hooks/useAuth.js` - Hook d'authentification
- `components/ApiTest.tsx` - Composant de test API
- `pages/LoginPage.tsx` - Page de connexion mise à jour

### Backend (`backend/`)
- `server.js` - Serveur principal
- `routes/` - Routes API
- `models/` - Modèles MongoDB
- `middleware/` - Middleware d'authentification

## 🔧 Configuration

### 1. Variables d'Environnement

#### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

#### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://224suite_user:224suiteguinee@224suite-cluster.tfb6emk.mongodb.net/224suite?retryWrites=true&w=majority&appName=224suite-cluster
JWT_SECRET=224suite_jwt_secret_dev_2024
```

### 2. Service API (`src/services/api.js`)

Le service API gère toutes les communications avec le backend :

```javascript
// Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Méthodes disponibles
- register(userData) - Inscription
- login(credentials) - Connexion
- getProperties(filters) - Liste des propriétés
- createProperty(propertyData) - Créer une propriété
- searchProperties(searchParams) - Recherche
- healthCheck() - Test de santé API
```

### 3. Hook d'Authentification (`src/hooks/useAuth.js`)

Gère l'état d'authentification global :

```javascript
// Fonctionnalités
- login(credentials) - Connexion utilisateur
- register(userData) - Inscription utilisateur
- logout() - Déconnexion
- isAuthenticated() - Vérifier si connecté
- isOwner() / isAgency() / isSeeker() - Types d'utilisateurs
```

## 🚀 Démarrage

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
npm install
npm start
```

### 3. Vérification
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000
- Test API: Section "Test d'Intégration API" sur la page d'accueil

## 🧪 Tests d'Intégration

### 1. Test de Santé API
```bash
curl http://localhost:5000/api/health
```

### 2. Test via Interface
- Aller sur http://localhost:3000
- Descendre jusqu'à la section "Test d'Intégration API"
- Cliquer sur "Tester la connexion API"

### 3. Test d'Authentification
- Aller sur la page de connexion
- Tenter une connexion avec des identifiants
- Vérifier les erreurs et succès

## 📡 Endpoints API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/users/profile` - Profil utilisateur

### Propriétés
- `GET /api/properties` - Liste des propriétés
- `POST /api/properties` - Créer une propriété
- `GET /api/properties/:id` - Détails d'une propriété
- `PUT /api/properties/:id` - Modifier une propriété
- `DELETE /api/properties/:id` - Supprimer une propriété

### Recherche
- `GET /api/search` - Recherche de propriétés

### Contact
- `POST /api/contact` - Envoyer un message

### Santé
- `GET /api/health` - Statut de l'API

## 🔐 Authentification

### JWT Token
- Stocké dans `localStorage` sous la clé `224suite_token`
- Inclus automatiquement dans les headers des requêtes authentifiées
- Format: `Bearer <token>`

### Gestion des Erreurs
- Tokens expirés automatiquement nettoyés
- Redirection vers la page de connexion si nécessaire
- Messages d'erreur affichés à l'utilisateur

## 🌐 Déploiement

### Variables d'Environnement de Production

#### Frontend (Vercel)
```env
REACT_APP_API_URL=https://votre-backend.railway.app/api
REACT_APP_ENVIRONMENT=production
```

#### Backend (Railway/Render)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret_production
FRONTEND_URL=https://votre-frontend.vercel.app
```

### Étapes de Déploiement
1. Déployer le backend sur Railway/Render
2. Mettre à jour `REACT_APP_API_URL` dans Vercel
3. Redéployer le frontend
4. Tester l'intégration en production

## 🐛 Dépannage

### Erreurs Courantes

#### 1. CORS Errors
```javascript
// Backend - Vérifier la configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

#### 2. API URL Incorrecte
```javascript
// Vérifier la variable d'environnement
console.log('API URL:', process.env.REACT_APP_API_URL);
```

#### 3. Token Manquant
```javascript
// Vérifier le localStorage
console.log('Token:', localStorage.getItem('224suite_token'));
```

#### 4. MongoDB Connection
```bash
# Tester la connexion MongoDB
cd backend
npm run test:mongodb
```

### Logs de Débogage
```javascript
// Activer les logs détaillés
console.log('API Request:', { url, method, headers });
console.log('API Response:', response);
```

## 📚 Ressources

- [Documentation API Backend](./backend/README.md)
- [Guide de Déploiement](./backend/DEPLOIEMENT.md)
- [Configuration MongoDB](./backend/MONGODB-SETUP.md)

## 🎯 Prochaines Étapes

1. ✅ Intégration API de base
2. 🔄 Tests complets d'authentification
3. 🔄 Intégration des propriétés
4. 🔄 Système de recherche
5. 🔄 Messagerie interne
6. 🔄 Gestion des rendez-vous
7. 🔄 Système de paiements
8. 🔄 Notifications email

---

**224Suite** - Plateforme immobilière de Conakry, Guinée 🏠✨
