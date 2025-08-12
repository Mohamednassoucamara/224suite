# 🚀 Déploiement Rapide 224Suite sur Railway

## ⚡ Déploiement en 3 étapes

### 1. 🔐 Connexion Railway
```bash
railway login
```

### 2. 🧪 Test de la configuration
```powershell
.\test-deployment.ps1
```

### 3. 🚀 Déploiement automatique
```powershell
.\deploy-railway.ps1
```

## 📋 Prérequis

- ✅ Node.js 16+ installé
- ✅ Railway CLI installé (`npm install -g @railway/cli`)
- ✅ Compte Railway créé
- ✅ Projet cloné et dépendances installées

## 🔧 Configuration automatique

Le script de déploiement :
- ✅ Déploie le backend en premier
- ✅ Récupère l'URL du backend
- ✅ Configure automatiquement `FRONTEND_URL`
- ✅ Déploie le frontend
- ✅ Configure les variables d'environnement

## 🌐 URLs après déploiement

- **Backend**: `https://your-backend.railway.app`
- **Frontend**: `https://your-frontend.railway.app`
- **API Health**: `https://your-backend.railway.app/api/health`

## ⚙️ Variables d'environnement requises

Configurez dans Railway Dashboard :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/224suite
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
```

## 🆘 En cas de problème

1. **Vérifiez les logs**: `railway logs`
2. **Redémarrez**: `railway service restart`
3. **Consultez**: `TROUBLESHOOTING.md`

## 📱 Support

- **Auteur**: Mohamed Nassou Camara
- **GitHub**: [@Mohamednassoucamara](https://github.com/Mohamednassoucamara)
- **Documentation**: `DEPLOYMENT.md`

---

**Dernière mise à jour**: 2024  
**Version**: 1.0
