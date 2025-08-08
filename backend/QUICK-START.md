# ⚡ Démarrage Rapide - MongoDB Atlas

## 🚀 Configuration Express (5 minutes)

### 1. Créer un compte MongoDB Atlas
- Allez sur [mongodb.com/atlas](https://mongodb.com/atlas)
- Cliquez "Try Free"
- Créez votre compte

### 2. Créer un cluster
- Choisissez "FREE" (M0)
- Sélectionnez AWS + Europe
- Nom : `224suite-cluster`
- Cliquez "Create"

### 3. Configurer la sécurité
- **Database Access** → "Add New Database User"
  - Username: `224suite_user`
  - Password: `[mot de passe sécurisé]`
  - Privileges: `Atlas admin`

- **Network Access** → "Add IP Address"
  - Cliquez "Allow Access from Anywhere" (0.0.0.0/0)

### 4. Obtenir l'URI de connexion
- **Database** → "Connect" → "Connect your application"
- Sélectionnez "Node.js"
- Copiez l'URI

### 5. Créer le fichier .env
```bash
cd backend
```

Créez un fichier `.env` :
```env
MONGODB_URI=mongodb+srv://224suite_user:<password>@cluster0.xxxxx.mongodb.net/224suite?retryWrites=true&w=majority
JWT_SECRET=224suite_jwt_secret_dev_2024
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 6. Tester la connexion
```bash
npm run test:mongodb
```

Vous devriez voir :
```
✅ MongoDB connecté avec succès !
🎉 Tous les tests MongoDB sont passés avec succès !
```

### 7. Démarrer le serveur
```bash
npm run dev
```

## 🎯 Résultat Attendu

- ✅ MongoDB Atlas configuré
- ✅ Base de données connectée
- ✅ API 224Suite fonctionnelle
- ✅ Endpoint de santé : `http://localhost:5000/api/health`

## 🚨 Problèmes Courants

### Erreur de connexion
```bash
# Vérifiez votre .env
cat .env

# Testez la connexion
npm run test:mongodb
```

### Erreur d'authentification
- Vérifiez le nom d'utilisateur et mot de passe
- Assurez-vous que l'utilisateur a les permissions "Atlas admin"

### Erreur de réseau
- Vérifiez que 0.0.0.0/0 est dans Network Access
- Attendez quelques minutes après la création du cluster

## 📞 Aide

- **Documentation complète** : `MONGODB-SETUP.md`
- **Support MongoDB** : [cloud.mongodb.com/support](https://cloud.mongodb.com/support)
- **Tests** : `npm test`
- **Test MongoDB** : `npm run test:mongodb`
