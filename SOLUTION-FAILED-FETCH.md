# 🚨 Solution à l'erreur "Failed to fetch"

## 🔍 Diagnostic du problème

L'erreur "Failed to fetch" lors de l'inscription utilisateur est causée par :

**Le frontend Vercel essaie de se connecter à `localhost:5000` qui n'est pas accessible depuis l'internet.**

## ✅ Solution complète

### 1️⃣ Déployer le backend sur Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter à Railway
railway login

# Aller dans le dossier backend
cd backend

# Initialiser et déployer
railway init
railway up
```

### 2️⃣ Configurer PostgreSQL sur Railway

1. **Créer une base PostgreSQL** :
   - Interface Railway → "New Service" → "Database" → "PostgreSQL"
   - Noter les informations de connexion

2. **Configurer les variables d'environnement** :
   ```env
   DB_USER=postgres
   DB_PASSWORD=<votre_mot_de_passe>
   DB_NAME=<nom_de_votre_base>
   DB_HOST=<host_railway_postgresql>
   DB_PORT=5432
   NODE_ENV=production
   JWT_SECRET=<secret_32_caracteres>
   FRONTEND_URL=https://224suite.vercel.app
   ```

### 3️⃣ Mettre à jour le frontend Vercel

1. **Dans Vercel, ajouter la variable d'environnement** :
   ```
   REACT_APP_API_URL=https://votre-projet-railway.railway.app/api
   ```

2. **Redéployer le frontend** :
   ```bash
   vercel --prod
   ```

## 🧪 Test de la solution

Utilisez le script de test :

```powershell
# Remplacer par votre URL Railway
.\test-vercel-railway.ps1 -RailwayUrl "https://votre-projet.railway.app"
```

## 🔧 Vérification locale

Si vous voulez tester localement avant le déploiement :

1. **Modifier temporairement `src/services/api.js`** :
   ```javascript
   BASE_URL: 'https://votre-projet-railway.railway.app/api'
   ```

2. **Redémarrer le frontend** :
   ```bash
   npm start
   ```

## 📋 Checklist de résolution

- [ ] Backend déployé sur Railway
- [ ] Base PostgreSQL créée et configurée
- [ ] Variables d'environnement configurées
- [ ] Frontend Vercel mis à jour avec `REACT_APP_API_URL`
- [ ] Tests de connectivité réussis
- [ ] Inscription utilisateur fonctionnelle

## 🆘 En cas de problème

1. **Vérifiez les logs Railway** : `railway logs`
2. **Testez l'API directement** : `curl https://votre-projet.railway.app/api/health`
3. **Vérifiez CORS** : Assurez-vous que `FRONTEND_URL` est correct
4. **Vérifiez la base de données** : `railway connect` pour accéder à PostgreSQL

## 🌐 URLs importantes

- **Frontend Vercel** : https://224suite.vercel.app
- **Backend Railway** : https://votre-projet-railway.railway.app
- **Documentation Railway** : https://docs.railway.app
- **Interface Vercel** : https://vercel.com/dashboard
