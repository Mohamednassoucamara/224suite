# 🗄️ Configuration MongoDB Atlas pour 224Suite

## 📋 Prérequis

- Compte MongoDB Atlas (gratuit)
- Accès à votre projet 224Suite

## 🚀 Étape 1 : Créer un Compte MongoDB Atlas

1. **Allez sur** : [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Cliquez sur "Try Free"**
3. **Remplissez le formulaire** :
   - Email
   - Mot de passe sécurisé
   - Nom d'utilisateur
   - Acceptez les conditions

## 🏗️ Étape 2 : Créer un Cluster

1. **Choisissez le plan gratuit** :
   - Sélectionnez "FREE" (M0)
   - Cliquez sur "Create"

2. **Configuration du cluster** :
   - **Cloud Provider** : AWS (recommandé)
   - **Region** : Europe - Ireland (ou plus proche)
   - **Cluster Name** : `224suite-cluster`
   - Cliquez sur "Create Cluster"

## 🔐 Étape 3 : Configuration de la Sécurité

### A. Créer un Utilisateur de Base de Données

1. Menu gauche → **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. Remplissez :
   ```
   Username: 224suite_user
   Password: [Générez un mot de passe sécurisé]
   Database User Privileges: Atlas admin
   ```
4. Cliquez sur **"Add User"**

### B. Configurer l'Accès Réseau

1. Menu gauche → **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Ajoutez :
   - **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Ou votre IP spécifique pour plus de sécurité
4. Cliquez sur **"Confirm"**

## 🔗 Étape 4 : Obtenir l'URI de Connexion

1. Menu → **"Database"**
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. Sélectionnez **"Node.js"** comme driver
5. **Copiez l'URI** qui ressemble à :
   ```
   mongodb+srv://224suite_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 🗃️ Étape 5 : Créer la Base de Données

1. Interface Atlas → **"Browse Collections"**
2. Cliquez sur **"Create Database"**
3. Remplissez :
   - **Database Name** : `224suite`
   - **Collection Name** : `users`
4. Cliquez sur **"Create"**

## ⚙️ Étape 6 : Configuration des Variables d'Environnement

### Créer le fichier `.env` dans le dossier `backend/`

```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données MongoDB Atlas
# Remplacez <username>, <password> et <cluster-url> par vos vraies valeurs
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/224suite?retryWrites=true&w=majority

# Exemple avec des valeurs fictives :
# MONGODB_URI=mongodb+srv://224suite_user:MonMotDePasse123@cluster0.abc123.mongodb.net/224suite?retryWrites=true&w=majority

# JWT Secret (à changer en production)
JWT_SECRET=224suite_jwt_secret_dev_2024
JWT_EXPIRE=30d

# Cloudinary (optionnel - pour les images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email (optionnel - pour les notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Stripe (optionnel - pour les paiements)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# URL du frontend
FRONTEND_URL=http://localhost:3000
```

## 🧪 Étape 7 : Tester la Connexion

1. **Installez les dépendances** :
   ```bash
   cd backend
   npm install
   ```

2. **Testez la connexion** :
   ```bash
   npm run dev
   ```

3. **Vérifiez les logs** :
   - Vous devriez voir : `MongoDB connecté: [votre-cluster]`

## 🚨 Dépannage

### Erreur de connexion
- Vérifiez que l'IP est autorisée dans Network Access
- Vérifiez les identifiants utilisateur
- Vérifiez l'URI de connexion

### Erreur d'authentification
- Vérifiez le nom d'utilisateur et mot de passe
- Assurez-vous que l'utilisateur a les bonnes permissions

### Erreur de réseau
- Vérifiez que 0.0.0.0/0 est dans Network Access
- Vérifiez votre connexion internet

## 🔒 Sécurité

### Variables d'environnement
- Ne jamais commiter le fichier `.env`
- Utilisez des mots de passe forts
- Changez les secrets en production

### Accès réseau
- Pour la production, limitez les IPs autorisées
- Utilisez des VPC si possible

## 📊 Monitoring

### MongoDB Atlas Dashboard
- Surveillez l'utilisation de votre cluster
- Vérifiez les performances
- Surveillez les erreurs de connexion

### Logs de l'application
- Surveillez les logs de connexion
- Vérifiez les erreurs de requêtes

## 🎯 Prochaines Étapes

1. **Tester la connexion** localement
2. **Configurer les variables** pour la production
3. **Déployer sur Railway/Render**
4. **Configurer les sauvegardes** automatiques
5. **Mettre en place le monitoring**

## 📞 Support

- **Documentation MongoDB** : [docs.mongodb.com](https://docs.mongodb.com)
- **Support Atlas** : [cloud.mongodb.com/support](https://cloud.mongodb.com/support)
- **Communauté** : [community.mongodb.com](https://community.mongodb.com)
