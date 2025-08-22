# Déploiement Railway pour PostgreSQL

## 🚀 Vue d'ensemble

Ce guide explique comment déployer le backend 224Suite sur Railway avec une base de données PostgreSQL.

## 📋 Prérequis

1. **Compte Railway** : Créez un compte sur [railway.app](https://railway.app)
2. **Railway CLI** : Installez l'outil en ligne de commande
3. **Base de données PostgreSQL** : Créez une base PostgreSQL sur Railway

## 🔧 Installation de Railway CLI

```bash
npm install -g @railway/cli
```

## 📁 Structure du projet

```
backend/
├── railway.postgresql.json      # Configuration Railway
├── railway.postgresql.env       # Variables d'environnement
├── deploy-railway-postgresql.ps1 # Script de déploiement
└── ...
```

## 🗄️ Création de la base PostgreSQL

1. **Connectez-vous à Railway** :
   ```bash
   railway login
   ```

2. **Créez un nouveau projet** :
   ```bash
   railway init
   ```

3. **Ajoutez une base PostgreSQL** :
   - Dans l'interface Railway, cliquez sur "New Service"
   - Sélectionnez "Database" → "PostgreSQL"
   - Notez les informations de connexion

## ⚙️ Configuration des variables d'environnement

Dans l'interface Railway, configurez ces variables :

```env
# Base de données PostgreSQL
DB_USER=postgres
DB_PASSWORD=<votre_mot_de_passe>
DB_NAME=<nom_de_votre_base>
DB_HOST=<host_railway_postgresql>
DB_PORT=5432

# Serveur
NODE_ENV=production
PORT=5000

# CORS
FRONTEND_URL=https://224suite.vercel.app

# JWT
JWT_SECRET=<votre_secret_jwt_32_caracteres>

# Sécurité
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Déploiement

### Option 1 : Script PowerShell (Windows)

```powershell
cd backend
.\deploy-railway-postgresql.ps1
```

### Option 2 : Commandes manuelles

```bash
cd backend
railway login
railway init
railway up
```

## 🔍 Vérification du déploiement

1. **Vérifiez le statut** :
   ```bash
   railway status
   ```

2. **Testez l'API** :
   ```bash
   # Remplacez par votre URL Railway
   curl https://votre-projet.railway.app/api/health
   ```

3. **Vérifiez les logs** :
   ```bash
   railway logs
   ```

## 🌐 Configuration du frontend

Une fois déployé, mettez à jour le frontend Vercel :

1. **Dans Vercel, ajoutez cette variable d'environnement** :
   ```
   REACT_APP_API_URL=https://votre-projet.railway.app/api
   ```

2. **Redéployez le frontend** :
   ```bash
   vercel --prod
   ```

## 🔧 Résolution des problèmes

### Erreur de connexion PostgreSQL
- Vérifiez que la base PostgreSQL est active
- Confirmez les variables DB_* dans Railway
- Vérifiez que le port 5432 est accessible

### Erreur CORS
- Assurez-vous que `FRONTEND_URL` est correct
- Vérifiez que l'URL du frontend est dans la liste des origines autorisées

### Erreur de build
- Vérifiez que `package.json` contient le script `start`
- Assurez-vous que toutes les dépendances sont installées

## 📊 Monitoring

- **Logs** : `railway logs`
- **Statut** : `railway status`
- **Métriques** : Interface web Railway
- **Health Check** : `/api/health`

## 🔄 Mise à jour

Pour mettre à jour le déploiement :

```bash
cd backend
git add .
git commit -m "Update backend"
railway up
```

## 📝 Notes importantes

- **Sécurité** : Utilisez des secrets forts pour JWT_SECRET
- **Performance** : Monitorer l'utilisation des ressources
- **Backup** : Configurez des sauvegardes automatiques de PostgreSQL
- **Scaling** : Ajustez le nombre de répliques selon les besoins

## 🆘 Support

- **Documentation Railway** : [docs.railway.app](https://docs.railway.app)
- **Community** : [Railway Discord](https://discord.gg/railway)
- **Issues** : Créez une issue sur le repository GitHub
