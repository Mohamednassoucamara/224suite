# 🚀 Guide de Déploiement Backend 224Suite

## 📋 Prérequis

- Node.js 16+ installé
- Compte MongoDB Atlas
- Compte Railway/Render/Heroku
- Compte Cloudinary (optionnel)
- Compte Stripe (optionnel)

## 🔧 Configuration Locale

### 1. Variables d'Environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/224suite

# JWT Secret
JWT_SECRET=votre_jwt_secret_tres_securise
JWT_EXPIRE=30d

# Cloudinary (optionnel)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Stripe (optionnel)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# URL du frontend
FRONTEND_URL=http://localhost:3000
```

### 2. Installation et Test Local

```bash
cd backend
npm install
npm run dev
```

## 🌐 Déploiement sur Railway

### 1. Créer un compte Railway
- Allez sur [railway.app](https://railway.app)
- Connectez-vous avec GitHub

### 2. Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez "Deploy from GitHub repo"
- Choisissez votre repository `224suite`

### 3. Configurer les variables d'environnement
Dans Railway, allez dans "Variables" et ajoutez :

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/224suite
JWT_SECRET=votre_jwt_secret_production
FRONTEND_URL=https://224suite-itgbootbk-mohamednassoucamaras-projects.vercel.app
```

### 4. Déployer
- Railway détectera automatiquement le dossier `backend/`
- Le déploiement se fera automatiquement

## 🌐 Déploiement sur Render

### 1. Créer un compte Render
- Allez sur [render.com](https://render.com)
- Connectez-vous avec GitHub

### 2. Créer un nouveau Web Service
- Cliquez sur "New +" → "Web Service"
- Connectez votre repository GitHub
- Sélectionnez le repository `224suite`

### 3. Configuration
- **Name**: `224suite-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Variables d'environnement
Ajoutez les mêmes variables que pour Railway.

## 🗄️ Configuration MongoDB Atlas

### 1. Créer un cluster
- Allez sur [mongodb.com/atlas](https://mongodb.com/atlas)
- Créez un compte gratuit
- Créez un nouveau cluster (gratuit)

### 2. Configuration réseau
- Dans "Network Access", ajoutez `0.0.0.0/0` pour permettre l'accès depuis n'importe où

### 3. Créer un utilisateur
- Dans "Database Access", créez un utilisateur avec mot de passe

### 4. Obtenir l'URI de connexion
- Cliquez sur "Connect"
- Choisissez "Connect your application"
- Copiez l'URI de connexion

## 🔗 Intégration avec le Frontend

### 1. Mettre à jour l'URL de l'API
Dans votre frontend, mettez à jour l'URL de l'API :

```javascript
// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 2. Variables d'environnement Frontend
Créez un fichier `.env` dans le dossier racine :

```env
REACT_APP_API_URL=https://votre-backend-url.railway.app/api
```

## 🧪 Tests

### Tests locaux
```bash
cd backend
npm test
```

### Tests de déploiement
Après le déploiement, testez l'endpoint de santé :
```
GET https://votre-backend-url.railway.app/api/health
```

## 📊 Monitoring

### Logs Railway
- Allez dans votre projet Railway
- Cliquez sur "Deployments"
- Vérifiez les logs pour détecter les erreurs

### Logs Render
- Dans votre service Render
- Allez dans "Logs" pour voir les logs en temps réel

## 🔒 Sécurité

### Variables sensibles
- Ne jamais commiter les fichiers `.env`
- Utiliser les variables d'environnement des plateformes
- Changer les secrets en production

### CORS
Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:3000` (développement)
- `https://224suite-itgbootbk-mohamednassoucamaras-projects.vercel.app` (production)

## 🚨 Dépannage

### Erreurs communes
1. **MongoDB Connection Error** : Vérifiez l'URI et les permissions
2. **CORS Error** : Vérifiez la configuration CORS
3. **JWT Error** : Vérifiez le JWT_SECRET
4. **Port Error** : Vérifiez que le port est disponible

### Support
- Vérifiez les logs de déploiement
- Testez localement d'abord
- Vérifiez la configuration des variables d'environnement
