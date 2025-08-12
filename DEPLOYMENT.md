# 🚀 Guide de Déploiement 224Suite sur Railway

## Prérequis

- Compte Railway (https://railway.app)
- Node.js 18+ installé
- Git configuré

## Déploiement Automatique

### 1. Installation de Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Connexion à Railway
```bash
railway login
```

### 3. Déploiement
```bash
# Dans le répertoire backend
railway init
railway up
```

## Configuration des Variables d'Environnement

Dans le dashboard Railway, configurez les variables suivantes :

### Base de Données
```
MONGODB_URI=mongodb+srv://224suite_user:224suiteguinee@224suite-cluster.tfb6emk.mongodb.net/224suite?retryWrites=true&w=majority&appName=224suite-cluster
```

### JWT
```
JWT_SECRET=224suite_jwt_secret_prod_2024
JWT_EXPIRE=7d
```

### Frontend
```
FRONTEND_URL=https://votre-frontend-url.railway.app
```

### Email (Optionnel pour les tests)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-app-password
```

## Déploiement Manuel

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/224suite.git
cd 224suite/backend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
# Créer le fichier .env avec les variables ci-dessus
```

### 4. Déployer
```bash
railway up
```

## Vérification du Déploiement

### Test de santé
```bash
curl https://votre-app.railway.app/api/health
```

### Test d'inscription
```bash
curl -X POST https://votre-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+224123456789",
    "password": "password123",
    "userType": "seeker"
  }'
```

## Monitoring

- **Logs** : `railway logs`
- **Status** : `railway status`
- **Variables** : `railway variables`

## Troubleshooting

### Erreur de connexion MongoDB
- Vérifier l'URI MongoDB
- S'assurer que l'IP est autorisée

### Erreur JWT
- Vérifier JWT_SECRET et JWT_EXPIRE
- Redémarrer l'application après modification

### Erreur de port
- Railway assigne automatiquement le port
- Utiliser `process.env.PORT` dans le code

## Support

Pour toute question, consulter :
- [Documentation Railway](https://docs.railway.app)
- [Issues GitHub](https://github.com/votre-username/224suite/issues)
