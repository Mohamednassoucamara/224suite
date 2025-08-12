# 🛠️ Guide de Résolution des Problèmes - Déploiement 224Suite

## 🚨 Problèmes Courants et Solutions

### 1. ❌ Erreur de Build

#### Symptômes
- Build échoue avec des erreurs de compilation
- Erreurs de dépendances manquantes
- Erreurs TypeScript/ESLint

#### Solutions
```bash
# Nettoyer les modules
rm -rf node_modules package-lock.json
npm install

# Vérifier les versions Node.js
node --version  # Doit être >= 16
npm --version   # Doit être >= 8

# Installer les dépendances globales
npm install -g @railway/cli
```

### 2. ❌ Erreur de Connexion MongoDB

#### Symptômes
- `MongoNetworkError: connect ECONNREFUSED`
- `MongoServerSelectionError: getaddrinfo ENOTFOUND`
- Timeout de connexion

#### Solutions
```bash
# Vérifier l'URI MongoDB
echo $MONGODB_URI

# Tester la connexion
cd backend
node test-mongodb.js

# Vérifier les variables d'environnement Railway
railway variables
```

#### Configuration MongoDB Atlas
1. Créer un cluster MongoDB Atlas
2. Ajouter l'IP `0.0.0.0/0` (toutes les IPs)
3. Créer un utilisateur avec mot de passe
4. Copier l'URI de connexion

### 3. ❌ Erreur CORS

#### Symptômes
- `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- Erreurs de requêtes cross-origin

#### Solutions
```javascript
// Dans backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

```bash
# Vérifier FRONTEND_URL dans Railway
railway variables
```

### 4. ❌ Erreur de Port

#### Symptômes
- `EADDRINUSE: address already in use :::5000`
- Serveur ne démarre pas

#### Solutions
```javascript
// Dans backend/server.js
const PORT = process.env.PORT || 5000;
```

```bash
# Vérifier le port utilisé
netstat -ano | findstr :5000

# Tuer le processus
taskkill /PID <PID> /F
```

### 5. ❌ Erreur JWT

#### Symptômes
- `JsonWebTokenError: invalid signature`
- `JsonWebTokenError: jwt malformed`

#### Solutions
```bash
# Vérifier JWT_SECRET
echo $JWT_SECRET

# Régénérer un secret sécurisé
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Mettre à jour dans Railway
railway variables set JWT_SECRET=<nouveau_secret>
```

### 6. ❌ Erreur de Variables d'Environnement

#### Symptômes
- Variables non définies
- `process.env.VARIABLE is undefined`

#### Solutions
```bash
# Lister toutes les variables
railway variables

# Définir une variable
railway variables set VARIABLE=valeur

# Supprimer une variable
railway variables unset VARIABLE
```

### 7. ❌ Erreur de Déploiement Railway

#### Symptômes
- Déploiement échoue
- Healthcheck échoue
- Application ne démarre pas

#### Solutions
```bash
# Vérifier le statut
railway status

# Voir les logs
railway logs

# Redémarrer le service
railway service restart

# Vérifier la configuration
railway service
```

### 8. ❌ Erreur de Build Frontend

#### Symptômes
- Build React échoue
- Erreurs de dépendances
- Erreurs de compilation

#### Solutions
```bash
# Nettoyer le cache
npm run build -- --reset-cache

# Vérifier les dépendances
npm audit fix

# Installer serve globalement
npm install -g serve

# Tester le build localement
npm run build
serve -s build -l 3000
```

## 🔍 Diagnostic

### Commandes de Diagnostic
```bash
# Vérifier l'état du projet
railway status

# Voir les logs en temps réel
railway logs --follow

# Vérifier les variables d'environnement
railway variables

# Tester la connexion
railway service

# Vérifier la santé de l'API
curl https://your-app.railway.app/api/health
```

### Fichiers de Logs
```bash
# Logs Railway
railway logs

# Logs locaux (si disponible)
tail -f backend/logs/app.log
```

## 🚀 Redémarrage et Récupération

### Redémarrage Complet
```bash
# Redémarrer le service
railway service restart

# Redéployer
railway up

# Vérifier le statut
railway status
```

### Récupération d'Urgence
```bash
# Rollback vers la version précédente
railway rollback

# Redéployer la dernière version stable
git checkout main
git pull origin main
railway up
```

## 📞 Support

### Ressources Officielles
- [Documentation Railway](https://docs.railway.app/)
- [Discord Railway](https://discord.gg/railway)
- [GitHub Issues](https://github.com/Mohamednassoucamara/224suite/issues)

### Contact
- **Auteur**: Mohamed Nassou Camara
- **Email**: [Votre email]
- **GitHub**: [@Mohamednassoucamara](https://github.com/Mohamednassoucamara)

---

**Dernière mise à jour**: 2024  
**Version**: 1.0
