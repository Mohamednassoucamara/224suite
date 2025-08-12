# 🚀 Guide de Déploiement 224Suite sur Railway

## 📋 Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [Git](https://git-scm.com/) installé
- Compte [Railway](https://railway.app/) créé
- [Railway CLI](https://docs.railway.app/develop/cli) installé

## 🔧 Installation de Railway CLI

```bash
npm install -g @railway/cli
```

## 🔐 Connexion à Railway

```bash
railway login
```

## 🏗️ Structure du Projet

```
224suite/
├── frontend/          # Application React
│   ├── package.json
│   └── src/
├── backend/           # API Node.js
│   ├── package.json
│   ├── server.js
│   └── routes/
├── railway.json       # Configuration Railway (backend)
├── railway-frontend.json # Configuration Railway (frontend)
└── deploy-railway.ps1 # Script de déploiement
```

## 🚀 Déploiement Automatique

### Option 1: Script PowerShell (Windows)

```powershell
.\deploy-railway.ps1
```

### Option 2: Déploiement Manuel

#### Étape 1: Préparation du Backend

```bash
cd backend
npm install
railway init
```

#### Étape 2: Configuration des Variables d'Environnement

Dans le dashboard Railway, configurez ces variables :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/224suite
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-frontend-domain.railway.app
```

#### Étape 3: Déploiement du Backend

```bash
cd backend
railway up
```

#### Étape 4: Préparation du Frontend

```bash
cd ..
npm install
npm run build
```

#### Étape 5: Déploiement du Frontend

```bash
railway up
```

## 🔍 Vérification du Déploiement

### Backend
- Healthcheck: `https://your-backend-domain.railway.app/api/health`
- Statut: Doit retourner `{"status":"OK"}`

### Frontend
- URL: `https://your-frontend-domain.railway.app`
- Vérifiez que l'application se charge correctement

## 🛠️ Résolution des Problèmes

### Erreur de Build
```bash
# Nettoyer les modules
rm -rf node_modules package-lock.json
npm install
```

### Erreur de Connexion MongoDB
- Vérifiez l'URI MongoDB dans les variables d'environnement
- Assurez-vous que l'IP est autorisée

### Erreur CORS
- Vérifiez `FRONTEND_URL` dans les variables d'environnement
- Assurez-vous que l'URL correspond exactement

### Erreur de Port
- Railway gère automatiquement le port via `process.env.PORT`
- Vérifiez que votre code utilise `process.env.PORT || 5000`

## 📱 Configuration des Domaines

### Backend
```bash
railway domain
```

### Frontend
```bash
railway domain
```

## 🔄 Mise à Jour

Pour mettre à jour l'application :

1. Poussez vos changements sur Git
2. Exécutez le script de déploiement
3. Railway redéploiera automatiquement

## 📊 Monitoring

- **Logs**: `railway logs`
- **Statut**: `railway status`
- **Variables**: `railway variables`

## 🆘 Support

- [Documentation Railway](https://docs.railway.app/)
- [Discord Railway](https://discord.gg/railway)
- [Issues GitHub](https://github.com/Mohamednassoucamara/224suite/issues)

---

**Auteur**: Mohamed Nassou Camara  
**Date**: 2024  
**Version**: 1.0
