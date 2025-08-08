# 🏠 224Suite - Plateforme Immobilière à Conakry

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.5.0-green.svg)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.2.0-38B2AC.svg)](https://tailwindcss.com/)

## 📋 Description

**224Suite** est une plateforme web moderne de mise en relation dans le domaine immobilier à Conakry, Guinée. Elle facilite, sécurise et modernise la recherche, la publication et la gestion d'offres immobilières à travers une interface intuitive et accessible.

## 🎯 Objectifs

- **Faciliter** la recherche et la publication d'annonces immobilières
- **Sécuriser** les transactions entre propriétaires et locataires/acheteurs
- **Moderniser** l'expérience immobilière à Conakry
- **Centraliser** les offres immobilières sur une plateforme unique

## 👥 Public Cible

- **Propriétaires** : Publication et gestion de leurs biens
- **Agences immobilières** : Vitrine professionnelle et gestion d'annonces
- **Chercheurs de logements** : Recherche filtrée et géolocalisée

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Gestion de Compte
- Création de compte (propriétaire, agence, chercheur)
- Connexion sécurisée avec JWT
- Gestion de profil utilisateur
- Vérification email et réinitialisation de mot de passe

### 🏠 Gestion des Propriétés
- Publication d'annonces avec photos et détails
- Système de favoris
- Gestion des statuts (active, vendue, louée)
- Upload d'images avec Cloudinary

### 🔍 Recherche Avancée
- Filtres multiples (prix, quartier, type, surface)
- Recherche géolocalisée
- Tri et pagination des résultats
- Suggestions de quartiers

### 💬 Communication
- Système de messagerie interne
- Prise de rendez-vous pour visites
- Notifications en temps réel
- Historique des conversations

### 💳 Abonnements Premium
- **Basic** : Gratuit (3 propriétés max)
- **Premium** : 20,000 GNF/mois (10 propriétés)
- **Agency** : 100,000 GNF/mois (50 propriétés)
- **Enterprise** : 300,000 GNF/mois (illimité)

### 📊 Tableau de Bord
- Statistiques personnalisées
- Gestion des propriétés
- Suivi des messages et rendez-vous
- Analytics de performance

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** : Interface utilisateur moderne
- **TypeScript** : Typage statique pour la robustesse
- **Tailwind CSS** : Framework CSS utilitaire
- **Framer Motion** : Animations fluides
- **Lucide React** : Icônes modernes
- **React Hook Form** : Gestion des formulaires
- **React Query** : Gestion d'état serveur

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM pour MongoDB
- **JWT** : Authentification sécurisée
- **bcryptjs** : Hashage des mots de passe
- **Multer** : Gestion des uploads
- **Cloudinary** : Stockage d'images
- **Stripe** : Paiements en ligne
- **Nodemailer** : Envoi d'emails

### Infrastructure
- **Vercel** : Hébergement frontend
- **Railway** : Hébergement backend
- **MongoDB Atlas** : Base de données cloud
- **Cloudinary** : CDN pour images

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- MongoDB (locale ou Atlas)
- Compte Cloudinary
- Compte Stripe (optionnel)

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/224suite.git
cd 224suite
```

2. **Installation des dépendances frontend**
```bash
npm install
```

3. **Installation des dépendances backend**
```bash
cd backend
npm install
cd ..
```

4. **Configuration des variables d'environnement**

Frontend (`.env`) :
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=votre_cloud_name
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Backend (`backend/.env`) :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/224suite
JWT_SECRET=votre_jwt_secret_tres_securise
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
FRONTEND_URL=http://localhost:3000
```

5. **Démarrage du développement**

Terminal 1 (Frontend) :
```bash
npm start
```

Terminal 2 (Backend) :
```bash
cd backend
npm run dev
```

6. **Accès à l'application**
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

## 📁 Structure du Projet

```
224suite/
├── public/                 # Fichiers publics
├── src/                    # Code source frontend
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── hooks/             # Hooks personnalisés
│   └── App.tsx            # Composant principal
├── backend/               # Code source backend
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── middleware/        # Middleware Express
│   ├── utils/             # Utilitaires
│   └── server.js          # Serveur principal
├── docs/                  # Documentation
└── README.md              # Ce fichier
```

## 🔧 Scripts Disponibles

### Frontend
```bash
npm start          # Démarrage en mode développement
npm run build      # Build de production
npm test           # Lancement des tests
npm run eject      # Éjection de Create React App
```

### Backend
```bash
npm run dev        # Démarrage en mode développement
npm start          # Démarrage en production
npm test           # Lancement des tests
```

## 🌐 Déploiement

### Option 1 : Vercel + Railway (Recommandée)
```bash
# Frontend sur Vercel
npm install -g vercel
vercel --prod

# Backend sur Railway
npm install -g @railway/cli
railway login
railway up
```

### Option 2 : O2switch VPS
Voir le guide complet dans `DEPLOIEMENT-O2SWITCH.md`

## 📊 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `GET /api/auth/profile` - Profil utilisateur

### Propriétés
- `GET /api/properties` - Liste des propriétés
- `POST /api/properties` - Créer une propriété
- `GET /api/properties/:id` - Détails d'une propriété
- `PUT /api/properties/:id` - Modifier une propriété
- `DELETE /api/properties/:id` - Supprimer une propriété

### Messages
- `GET /api/messages` - Messages de l'utilisateur
- `POST /api/messages` - Envoyer un message
- `PUT /api/messages/:id/read` - Marquer comme lu

### Rendez-vous
- `GET /api/appointments` - Rendez-vous de l'utilisateur
- `POST /api/appointments` - Créer un rendez-vous
- `PUT /api/appointments/:id/confirm` - Confirmer un rendez-vous

## 🔒 Sécurité

- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe
- **Helmet** pour les en-têtes de sécurité
- **Rate limiting** pour prévenir les abus
- **Validation** des données avec express-validator
- **CORS** configuré pour la sécurité

## 📈 Performance

- **Lazy loading** des images
- **Code splitting** automatique
- **Cache** des assets statiques
- **Compression** Gzip
- **CDN** pour les images
- **Indexation** MongoDB optimisée

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email** : support@224suite.gn
- **Téléphone** : +224 XXX XXX XXX
- **Documentation** : [docs.224suite.gn](https://docs.224suite.gn)

## 🙏 Remerciements

- **React Team** pour le framework frontend
- **Express.js** pour le framework backend
- **MongoDB** pour la base de données
- **Tailwind CSS** pour le design system
- **Vercel** et **Railway** pour l'hébergement

---

**Développé avec ❤️ pour Conakry, Guinée**

[![224Suite](https://img.shields.io/badge/224Suite-Immobilier-orange.svg)](https://224suite.gn) 