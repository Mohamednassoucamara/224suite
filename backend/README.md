# 224Suite Backend API

Backend complet pour la plateforme immobilière 224Suite, développé avec Node.js, Express et MongoDB.

## 🚀 Fonctionnalités

### 🔐 Authentification & Utilisateurs
- **Inscription/Connexion** avec JWT
- **Vérification d'email** automatique
- **Réinitialisation de mot de passe**
- **Gestion des profils** (propriétaire, agence, chercheur)
- **Système de favoris**

### 🏠 Gestion des Propriétés
- **CRUD complet** des biens immobiliers
- **Upload d'images** avec Cloudinary
- **Filtres avancés** (prix, surface, chambres, etc.)
- **Recherche géolocalisée**
- **Statistiques** et analytics

### 💳 Système de Paiements
- **Intégration Stripe** pour les abonnements premium
- **Plans mensuels/annuels**
- **Webhooks** pour la gestion automatique
- **Gestion des abonnements**

### 📧 Communication
- **Système d'emails** avec Nodemailer
- **Notifications** automatiques
- **Contact** et demandes de rendez-vous
- **Templates HTML** personnalisés

### 🔍 Recherche Avancée
- **Recherche textuelle** intelligente
- **Filtres multiples** combinables
- **Suggestions** automatiques
- **Recherche géospatiale**

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- MongoDB (local ou Atlas)
- Compte Cloudinary (pour les images)
- Compte Stripe (pour les paiements)
- Compte email SMTP

## 🛠️ Installation

1. **Cloner le projet**
```bash
cd backend
npm install
```

2. **Configuration des variables d'environnement**
```bash
cp env.example .env
```

3. **Remplir le fichier .env**
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/224suite

# JWT Secret
JWT_SECRET=votre_jwt_secret_tres_securise
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Démarrer le serveur**
```bash
# Développement
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### 🔐 Authentification
```
POST /api/auth/register          # Inscription
POST /api/auth/login             # Connexion
POST /api/auth/verify-email      # Vérification email
POST /api/auth/forgot-password   # Mot de passe oublié
POST /api/auth/reset-password    # Réinitialisation
GET  /api/auth/me                # Profil utilisateur
POST /api/auth/logout            # Déconnexion
```

### 🏠 Propriétés
```
GET    /api/properties           # Liste des propriétés
GET    /api/properties/:id       # Détails d'une propriété
POST   /api/properties           # Créer une propriété
PUT    /api/properties/:id       # Modifier une propriété
DELETE /api/properties/:id       # Supprimer une propriété
POST   /api/properties/:id/favorite  # Ajouter aux favoris
POST   /api/properties/:id/images    # Upload d'images
GET    /api/properties/featured      # Propriétés en vedette
GET    /api/properties/user/my-properties  # Mes propriétés
```

### 👥 Utilisateurs
```
GET  /api/users/profile          # Profil utilisateur
PUT  /api/users/profile          # Modifier le profil
PUT  /api/users/password         # Changer le mot de passe
GET  /api/users/favorites        # Propriétés favorites
PUT  /api/users/notifications    # Préférences notifications
PUT  /api/users/agency           # Infos agence (agences uniquement)
GET  /api/users/:id              # Profil public d'un utilisateur
GET  /api/users/stats/dashboard  # Statistiques dashboard
```

### 🔍 Recherche
```
GET /api/search                  # Recherche avancée
GET /api/search/suggestions      # Suggestions de recherche
GET /api/search/nearby           # Recherche géospatiale
GET /api/search/stats            # Statistiques de recherche
```

### 💳 Paiements
```
POST /api/payments/create-payment-intent  # Créer paiement
POST /api/payments/confirm               # Confirmer paiement
GET  /api/payments/subscription-status   # Statut abonnement
POST /api/payments/cancel-subscription   # Annuler abonnement
GET  /api/payments/plans                 # Plans disponibles
POST /api/payments/webhook               # Webhook Stripe
```

### 📧 Contact
```
POST /api/contact                # Message de contact
POST /api/contact/property-inquiry  # Demande info propriété
POST /api/contact/appointment    # Demande rendez-vous
```

## 🗄️ Structure de la Base de Données

### Modèle User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  password: String (hashé),
  userType: ['owner', 'agency', 'seeker'],
  isVerified: Boolean,
  isPremium: Boolean,
  premiumExpiresAt: Date,
  favorites: [Property],
  address: {
    street: String,
    city: String,
    neighborhood: String
  },
  agency: {
    name: String,
    license: String,
    description: String,
    website: String
  }
}
```

### Modèle Property
```javascript
{
  title: String,
  description: String,
  type: ['appartement', 'maison', 'villa', 'studio'],
  transactionType: ['vente', 'location'],
  price: Number,
  currency: ['GNF', 'USD', 'EUR'],
  location: {
    address: String,
    neighborhood: String,
    city: String,
    coordinates: { lat: Number, lng: Number }
  },
  features: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    parking: Number,
    furnished: Boolean
  },
  amenities: [String],
  images: [{
    url: String,
    publicId: String,
    isMain: Boolean
  }],
  owner: ObjectId (ref: User),
  agency: ObjectId (ref: User),
  status: ['active', 'pending', 'sold', 'rented'],
  isPremium: Boolean,
  isFeatured: Boolean,
  views: Number,
  favorites: [ObjectId (ref: User)]
}
```

## 🔒 Sécurité

- **JWT** pour l'authentification
- **Bcrypt** pour le hashage des mots de passe
- **Helmet** pour les en-têtes de sécurité
- **Rate limiting** pour prévenir les attaques
- **Validation** des données avec express-validator
- **CORS** configuré pour le frontend

## 📧 Système d'Emails

### Templates disponibles
- **Bienvenue** : Email de confirmation d'inscription
- **Vérification** : Lien de vérification d'email
- **Réinitialisation** : Lien de réinitialisation de mot de passe
- **Contact** : Confirmation de message reçu
- **Notifications** : Nouvelles propriétés correspondant aux critères

## 💳 Intégration Stripe

### Plans d'abonnement
- **Premium Mensuel** : 50,000 GNF/mois
- **Premium Annuel** : 500,000 GNF/an (2 mois gratuits)

### Fonctionnalités
- Création d'intentions de paiement
- Confirmation automatique des paiements
- Gestion des abonnements
- Webhooks pour les événements

## 🚀 Déploiement

### Variables d'environnement de production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/224suite
JWT_SECRET=secret_tres_securise_production
CLOUDINARY_CLOUD_NAME=production_cloud_name
STRIPE_SECRET_KEY=sk_live_votre_cle_production
```

### Scripts de déploiement
```bash
# Build pour production
npm run build

# Démarrage en production
npm start

# Tests
npm test
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Couverture de code
npm run test:coverage
```

## 📊 Monitoring

- **Morgan** pour les logs HTTP
- **Gestion d'erreurs** centralisée
- **Validation** des données
- **Rate limiting** pour la protection

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Email : support@224suite.com
- Documentation : `/api/docs`
- Issues : GitHub Issues

---

**Développé avec ❤️ pour 224Suite** 