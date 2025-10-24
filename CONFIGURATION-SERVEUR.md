# 🚀 Configuration des Variables d'Environnement - 224Suite

## 📋 **Vue d'ensemble**

Ce guide vous explique comment configurer les variables d'environnement pour déployer votre application 224Suite sur différents serveurs de production.

## 🔧 **Variables d'Environnement Requises**

### **Base de Données MySQL**
```bash
# Configuration Railway MySQL (Recommandée)
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=11311
DB_USER=root
DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
DB_NAME=224suite

# Configuration O2Switch MySQL (Alternative)
DB_HOST=strategie.o2switch.net
DB_PORT=3306
DB_USER=camo7935_224suite
DB_PASSWORD=224Suite@
DB_NAME=camo7935_224suite
```

### **Application**
```bash
NODE_ENV=production
PORT=3000
REACT_APP_API_URL=https://votre-domaine.com/api
```

## 🌐 **Configuration par Plateforme**

### **1. Railway (Recommandé)**

#### **Via Dashboard Railway :**
1. Connectez-vous à [Railway.app](https://railway.app)
2. Sélectionnez votre projet
3. Allez dans **Variables**
4. Ajoutez les variables suivantes :

```bash
NODE_ENV=production
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=11311
DB_USER=root
DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
DB_NAME=224suite
REACT_APP_API_URL=https://votre-app.railway.app
```

#### **Via CLI Railway :**
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Configurer les variables
railway variables set NODE_ENV=production
railway variables set DB_HOST=gondola.proxy.rlwy.net
railway variables set DB_PORT=11311
railway variables set DB_USER=root
railway variables set DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
railway variables set DB_NAME=224suite
railway variables set REACT_APP_API_URL=https://votre-app.railway.app
```

### **2. Vercel**

#### **Via Dashboard Vercel :**
1. Connectez-vous à [Vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez les variables pour **Production** :

```bash
NODE_ENV=production
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=11311
DB_USER=root
DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
DB_NAME=224suite
REACT_APP_API_URL=https://votre-app.vercel.app
```

#### **Via CLI Vercel :**
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Configurer les variables
vercel env add NODE_ENV production
vercel env add DB_HOST gondola.proxy.rlwy.net
vercel env add DB_PORT 11311
vercel env add DB_USER root
vercel env add DB_PASSWORD BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
vercel env add DB_NAME 224suite
vercel env add REACT_APP_API_URL https://votre-app.vercel.app
```

### **3. Netlify**

#### **Via Dashboard Netlify :**
1. Connectez-vous à [Netlify.com](https://netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings** > **Environment variables**
4. Ajoutez les variables :

```bash
NODE_ENV=production
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=11311
DB_USER=root
DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
DB_NAME=224suite
REACT_APP_API_URL=https://votre-site.netlify.app
```

### **4. Serveur VPS/Dédié**

#### **Via fichier .env :**
```bash
# Créer le fichier .env
nano .env

# Ajouter le contenu suivant :
NODE_ENV=production
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=11311
DB_USER=root
DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
DB_NAME=224suite
REACT_APP_API_URL=https://votre-domaine.com
```

#### **Via variables système :**
```bash
# Ubuntu/Debian
export NODE_ENV=production
export DB_HOST=gondola.proxy.rlwy.net
export DB_PORT=11311
export DB_USER=root
export DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
export DB_NAME=224suite
export REACT_APP_API_URL=https://votre-domaine.com

# Ajouter au fichier ~/.bashrc pour la persistance
echo 'export NODE_ENV=production' >> ~/.bashrc
echo 'export DB_HOST=gondola.proxy.rlwy.net' >> ~/.bashrc
echo 'export DB_PORT=11311' >> ~/.bashrc
echo 'export DB_USER=root' >> ~/.bashrc
echo 'export DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw' >> ~/.bashrc
echo 'export DB_NAME=224suite' >> ~/.bashrc
echo 'export REACT_APP_API_URL=https://votre-domaine.com' >> ~/.bashrc
```

## 🔐 **Sécurité des Variables**

### **Bonnes Pratiques :**
1. **Ne jamais commiter** les fichiers `.env` avec des mots de passe
2. **Utiliser des mots de passe forts** et les changer régulièrement
3. **Limiter l'accès** aux variables sensibles
4. **Utiliser des secrets** sur les plateformes cloud
5. **Chiffrer** les connexions de base de données

### **Fichiers à ignorer :**
```gitignore
# Fichiers d'environnement
.env
.env.local
.env.production
.env.staging
*.env

# Logs
*.log
logs/

# Dossiers sensibles
config/secrets/
```

## 🧪 **Test de Configuration**

### **Script de test :**
```bash
# Tester la configuration
npm run db:test

# Vérifier les variables
node -e "console.log('NODE_ENV:', process.env.NODE_ENV); console.log('DB_HOST:', process.env.DB_HOST);"
```

### **Vérification manuelle :**
1. **Connexion base de données** : Vérifier que la connexion MySQL fonctionne
2. **Variables chargées** : S'assurer que toutes les variables sont correctement chargées
3. **API fonctionnelle** : Tester les endpoints de l'API
4. **Interface utilisateur** : Vérifier que l'application se charge correctement

## 🚨 **Dépannage**

### **Erreurs courantes :**

#### **"Database connection failed"**
```bash
# Vérifier les variables
echo $DB_HOST
echo $DB_USER
echo $DB_PASSWORD

# Tester la connexion
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME
```

#### **"Environment variable not found"**
```bash
# Vérifier que le fichier .env est chargé
node -e "require('dotenv').config(); console.log(process.env.DB_HOST);"
```

#### **"Port already in use"**
```bash
# Changer le port
export PORT=3001
# ou
PORT=3001 npm start
```

## 📞 **Support**

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** de votre plateforme de déploiement
2. **Testez localement** avec les mêmes variables
3. **Consultez la documentation** de votre plateforme
4. **Contactez le support** de votre hébergeur

---

## ✅ **Checklist de Déploiement**

- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] Application compilée sans erreurs
- [ ] Tests de connexion réussis
- [ ] URL de production configurée
- [ ] Sécurité des variables vérifiée
- [ ] Logs de déploiement vérifiés

**Votre application 224Suite est maintenant prête pour la production !** 🎉
