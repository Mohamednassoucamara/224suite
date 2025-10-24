# 224Suite - Architecture Frontend + MySQL

## 🏗️ Architecture Simplifiée

Ce projet utilise maintenant une architecture simplifiée avec :
- **Frontend React** : Interface utilisateur
- **Base de données MySQL** : Stockage des données
- **Services API intégrés** : Communication directe avec MySQL

## 📋 Prérequis

- Node.js (version 18+)
- MySQL (version 8.0+)
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd 224suite
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de la base de données

#### Option A : MySQL local
1. Installer MySQL sur votre machine
2. Créer une base de données :
```sql
CREATE DATABASE 224suite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Option B : MySQL en ligne (PlanetScale, Railway, etc.)
1. Créer une base de données MySQL en ligne
2. Récupérer les informations de connexion

### 4. Configuration des variables d'environnement
Copier le fichier d'exemple et le configurer :
```bash
cp env.mysql.example .env
```

Éditer le fichier `.env` :
```env
# Configuration de la base de données MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=224suite
DB_SSL=false

# Configuration de l'application
NODE_ENV=development
PORT=3000
```

### 5. Configuration de la base de données
```bash
# Créer les tables et insérer les données de test
npm run db:setup
npm run db:seed
```

### 6. Démarrer l'application
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## 📊 Structure de la Base de Données

### Tables principales :
- **users** : Utilisateurs (clients, agents, admins)
- **properties** : Propriétés immobilières
- **property_images** : Images des propriétés
- **favorites** : Favoris des utilisateurs
- **messages** : Messages de contact
- **appointments** : Rendez-vous
- **subscriptions** : Abonnements
- **saved_searches** : Recherches sauvegardées

### Données de test incluses :
- 3 utilisateurs (admin, agent, utilisateur)
- 5 propriétés d'exemple
- Images d'exemple
- Messages de test

**Comptes de test :**
- Email : `admin@224suite.com` / Mot de passe : `password123`
- Email : `agent@224suite.com` / Mot de passe : `password123`
- Email : `user@224suite.com` / Mot de passe : `password123`

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Démarrer en mode développement
npm run build        # Construire pour la production
npm start           # Démarrer en mode production

# Base de données
npm run db:setup    # Créer les tables
npm run db:seed     # Insérer les données de test

# Tests
npm test           # Exécuter les tests
```

## 📁 Structure du Projet

```
224suite/
├── database/                 # Configuration MySQL
│   ├── config.js            # Configuration de connexion
│   ├── setup.js             # Script de création des tables
│   ├── seed.js              # Script de données de test
│   └── schema.sql           # Schéma de la base de données
├── src/
│   ├── components/          # Composants React
│   ├── pages/              # Pages de l'application
│   ├── services/           # Services API
│   │   ├── api.js          # Service API principal
│   │   └── database.js     # Service de base de données
│   └── ...
├── package.json            # Dépendances et scripts
└── README-MYSQL.md         # Ce fichier
```

## 🔌 Services API

Le projet utilise des services API intégrés qui communiquent directement avec MySQL :

### Authentification
- `login(email, password)` : Connexion utilisateur
- `register(userData)` : Inscription utilisateur
- `getUserProfile(userId)` : Récupérer le profil
- `updateUserProfile(userId, userData)` : Mettre à jour le profil

### Propriétés
- `getProperties(filters)` : Lister les propriétés
- `getPropertyById(id)` : Détails d'une propriété
- `createProperty(propertyData)` : Créer une propriété
- `updateProperty(id, propertyData)` : Modifier une propriété
- `deleteProperty(id)` : Supprimer une propriété

### Favoris
- `getFavorites(userId)` : Favoris d'un utilisateur
- `addFavorite(userId, propertyId)` : Ajouter aux favoris
- `removeFavorite(userId, propertyId)` : Retirer des favoris

### Messages et Rendez-vous
- `sendMessage(messageData)` : Envoyer un message
- `createAppointment(appointmentData)` : Créer un rendez-vous

## 🚀 Déploiement

### Option 1 : Vercel + PlanetScale
1. Connecter le repo à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Option 2 : Netlify + Railway
1. Déployer le frontend sur Netlify
2. Créer une base MySQL sur Railway
3. Configurer les variables d'environnement

### Option 3 : Serveur VPS
1. Installer Node.js et MySQL sur le serveur
2. Cloner le projet
3. Configurer la base de données
4. Démarrer l'application

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Validation des données d'entrée
- Protection contre les injections SQL
- Gestion des erreurs sécurisée

## 📈 Performance

- Connexions MySQL optimisées
- Requêtes indexées
- Cache des requêtes fréquentes
- Images optimisées

## 🐛 Dépannage

### Erreur de connexion MySQL
```bash
# Vérifier que MySQL est démarré
# Vérifier les variables d'environnement
# Tester la connexion
```

### Erreur de dépendances
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Base de données corrompue
```bash
# Réinitialiser la base de données
npm run db:setup
npm run db:seed
```

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs de l'application
2. Consulter la documentation MySQL
3. Vérifier la configuration des variables d'environnement

## 🎯 Prochaines Étapes

- [ ] Ajouter la pagination
- [ ] Implémenter la recherche avancée
- [ ] Ajouter les notifications
- [ ] Optimiser les performances
- [ ] Ajouter les tests unitaires
