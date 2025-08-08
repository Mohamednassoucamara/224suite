# 🗄️ Structure de la Base de Données - 224Suite

## Vue d'ensemble

La plateforme 224Suite utilise MongoDB avec Mongoose comme ODM (Object Document Mapper) pour gérer les données immobilières à Conakry, Guinée.

## 📊 Collections Principales

### 1. **Users** - Utilisateurs
Gère tous les types d'utilisateurs : propriétaires, agences, et chercheurs.

#### Champs principaux :
- `firstName`, `lastName` : Informations personnelles
- `email` : Email unique (validation regex)
- `phone` : Téléphone guinéen (format +224)
- `password` : Mot de passe hashé (bcrypt)
- `userType` : 'owner', 'agency', 'seeker'
- `isVerified` : Vérification email
- `isPremium` : Statut premium
- `favorites` : Propriétés favorites (référence Property)

#### Champs spécifiques aux agences :
- `agency.name` : Nom de l'agence
- `agency.license` : Numéro de licence
- `agency.description` : Description de l'agence
- `agency.socialMedia` : Réseaux sociaux

#### Sécurité :
- `resetPasswordToken` : Token de réinitialisation
- `emailVerificationToken` : Token de vérification

### 2. **Properties** - Propriétés Immobilières
Stocke toutes les annonces immobilières.

#### Informations de base :
- `title` : Titre de l'annonce
- `description` : Description détaillée
- `type` : Type de bien (appartement, maison, villa, etc.)
- `transactionType` : 'vente' ou 'location'
- `price` : Prix en GNF/USD/EUR
- `status` : Statut de l'annonce

#### Localisation :
- `location.address` : Adresse complète
- `location.neighborhood` : Quartier
- `location.city` : Ville (défaut: Conakry)
- `location.coordinates` : Coordonnées GPS

#### Caractéristiques :
- `features.bedrooms` : Nombre de chambres
- `features.bathrooms` : Nombre de salles de bain
- `features.area` : Surface en m²
- `features.parking` : Places de parking
- `features.furnished` : Meublé ou non

#### Médias :
- `images` : Tableau d'images avec URL Cloudinary
- `virtualTour` : Lien visite virtuelle

#### Relations :
- `owner` : Référence User (propriétaire)
- `agency` : Référence User (agence)
- `favorites` : Utilisateurs qui ont mis en favori

### 3. **Messages** - Système de Messagerie
Gère les communications entre utilisateurs.

#### Structure :
- `sender` : Expéditeur (référence User)
- `recipient` : Destinataire (référence User)
- `property` : Propriété concernée (référence Property)
- `subject` : Sujet du message
- `content` : Contenu du message
- `threadId` : ID de conversation
- `isRead` : Statut de lecture

#### Types de messages :
- `inquiry` : Demande de renseignements
- `response` : Réponse
- `appointment` : Rendez-vous
- `general` : Message général

### 4. **Appointments** - Rendez-vous
Gère les visites et rendez-vous.

#### Informations :
- `requester` : Demandeur (référence User)
- `propertyOwner` : Propriétaire (référence User)
- `property` : Propriété (référence Property)
- `scheduledDate` : Date du rendez-vous
- `scheduledTime` : Heure (format HH:MM)
- `duration` : Durée en minutes
- `type` : Type de rendez-vous

#### Statuts :
- `pending` : En attente
- `confirmed` : Confirmé
- `declined` : Refusé
- `cancelled` : Annulé
- `completed` : Terminé

### 5. **Subscriptions** - Abonnements Premium
Gère les abonnements et fonctionnalités premium.

#### Plans disponibles :
- **Basic** : Gratuit (3 propriétés max)
- **Premium** : 20,000 GNF/mois (10 propriétés)
- **Agency** : 100,000 GNF/mois (50 propriétés)
- **Enterprise** : 300,000 GNF/mois (illimité)

#### Fonctionnalités par plan :
- `maxProperties` : Nombre max de propriétés
- `featuredListings` : Annonces en vedette
- `prioritySupport` : Support prioritaire
- `analytics` : Statistiques avancées
- `virtualTours` : Visites virtuelles
- `advancedSearch` : Recherche avancée

## 🔗 Relations entre Collections

### Relations One-to-Many :
- **User → Properties** : Un utilisateur peut avoir plusieurs propriétés
- **User → Messages** : Un utilisateur peut envoyer/recevoir plusieurs messages
- **User → Appointments** : Un utilisateur peut avoir plusieurs rendez-vous

### Relations Many-to-Many :
- **Users ↔ Properties** : Via les favoris
- **Users ↔ Users** : Via les messages

### Relations One-to-One :
- **User → Subscription** : Un utilisateur a un abonnement actif

## 📈 Index et Performance

### Index principaux :
```javascript
// Users
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ isPremium: 1 });

// Properties
propertySchema.index({ status: 1, type: 1 });
propertySchema.index({ 'location.city': 1, 'location.neighborhood': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ isPremium: 1, isFeatured: 1 });

// Messages
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ threadId: 1 });
messageSchema.index({ isRead: 1 });

// Appointments
appointmentSchema.index({ requester: 1, status: 1 });
appointmentSchema.index({ scheduledDate: 1, scheduledTime: 1 });
```

## 🔒 Sécurité et Validation

### Validation des données :
- **Email** : Format regex strict
- **Téléphone** : Format guinéen (+224)
- **Prix** : Valeurs positives uniquement
- **Dates** : Validation des créneaux horaires

### Sécurité :
- **Mots de passe** : Hashage bcrypt
- **Tokens** : JWT pour l'authentification
- **Reset tokens** : Expiration automatique
- **Validation** : Middleware Mongoose

## 📊 Statistiques et Analytics

### Métriques stockées :
- **Vues** : Nombre de vues par propriété
- **Favoris** : Nombre de favoris
- **Messages** : Statistiques de communication
- **Rendez-vous** : Taux de conversion

### Calculs automatiques :
- **Score de pertinence** : Basé sur les vues, favoris, premium
- **Statistiques utilisateur** : Activité, engagement
- **Métriques agence** : Performance des annonces

## 🚀 Optimisations

### Performance :
- **Index composites** pour les requêtes fréquentes
- **Pagination** pour les grandes listes
- **Projection** pour limiter les champs retournés
- **Aggregation** pour les statistiques complexes

### Scalabilité :
- **Sharding** possible sur les propriétés
- **Réplication** pour la haute disponibilité
- **Cache** Redis pour les données fréquentes

## 📋 Scripts de Migration

### Données de test :
```javascript
// Création d'utilisateurs de test
// Création de propriétés de test
// Création de messages de test
// Création de rendez-vous de test
```

### Maintenance :
- **Nettoyage** des tokens expirés
- **Archivage** des anciennes données
- **Backup** automatique quotidien

## 🔧 Configuration

### Variables d'environnement :
```env
MONGODB_URI=mongodb://localhost:27017/224suite
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### Connexion MongoDB :
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
```

Cette structure de base de données est conçue pour être scalable, performante et sécurisée, tout en répondant aux besoins spécifiques du marché immobilier guinéen.
