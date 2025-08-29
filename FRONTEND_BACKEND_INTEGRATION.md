# 🔗 Guide d'Intégration Frontend-Backend - 224Suite

## 📋 Vue d'ensemble

Ce guide explique comment connecter le frontend React au backend Node.js/Express et à la base de données PostgreSQL.

## 🚀 Configuration Rapide

### 1. Variables d'Environnement

Créez un fichier `.env` dans le dossier racine du frontend :

```env
# URL de l'API backend
REACT_APP_API_URL=http://localhost:5000/api

# Configuration Cloudinary (optionnel)
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Configuration Google Maps (optionnel)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Configuration Stripe (optionnel)
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 2. Démarrage du Backend

```bash
# Dans le dossier backend
cd backend
npm install
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### 3. Démarrage du Frontend

```bash
# Dans le dossier racine
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

## 🏗️ Architecture des Services

### Service API Principal (`src/services/api.js`)

Le service API gère toutes les communications avec le backend :

```javascript
import apiService from '../services/api';

// Exemple d'utilisation
const properties = await apiService.getProperties();
const user = await apiService.getUserProfile();
```

### Hooks Personnalisés

#### useProperties (`src/hooks/useProperties.js`)
```javascript
import { useProperties } from '../hooks/useProperties';

const { properties, loading, error, fetchProperties } = useProperties();
```

#### useSearch (`src/hooks/useSearch.js`)
```javascript
import { useSearch } from '../hooks/useSearch';

const { searchResults, searchProperties, getSuggestions } = useSearch();
```

#### useUserData (`src/hooks/useUserData.js`)
```javascript
import { useUserData } from '../hooks/useUserData';

const { user, favorites, toggleFavorite } = useUserData();
```

## 🔐 Authentification

### Connexion
```javascript
import { useAuth } from '../hooks/useAuth';

const { login, logout, user } = useAuth();

// Connexion
await login({ email, password });

// Déconnexion
logout();
```

### Protection des Routes
```javascript
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};
```

## 🏠 Gestion des Propriétés

### Charger les Propriétés
```javascript
import { useProperties } from '../hooks/useProperties';

const PropertiesList = () => {
  const { properties, loading, error } = useProperties();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
```

### Créer une Propriété
```javascript
const PropertyForm = () => {
  const { createProperty, loading } = useProperties();
  
  const handleSubmit = async (formData) => {
    try {
      await createProperty(formData);
      // Redirection ou notification de succès
    } catch (error) {
      // Gestion d'erreur
    }
  };
};
```

## 🔍 Recherche

### Recherche Simple
```javascript
import { useSearch } from '../hooks/useSearch';

const SearchComponent = () => {
  const { searchResults, searchProperties } = useSearch();
  
  const handleSearch = async (query) => {
    await searchProperties({ q: query });
  };
};
```

### Recherche Avancée
```javascript
const handleAdvancedSearch = async (filters) => {
  await searchProperties({
    type: 'apartment',
    minPrice: 100000,
    maxPrice: 500000,
    location: 'Conakry',
    bedrooms: 2
  });
};
```

## 👤 Gestion des Utilisateurs

### Profil Utilisateur
```javascript
import { useUserData } from '../hooks/useUserData';

const UserProfile = () => {
  const { user, updateProfile, loading } = useUserData();
  
  const handleUpdateProfile = async (profileData) => {
    await updateProfile(profileData);
  };
};
```

### Favoris
```javascript
const PropertyCard = ({ property }) => {
  const { toggleFavorite, isFavorite } = useUserData();
  
  const handleToggleFavorite = () => {
    toggleFavorite(property.id);
  };
  
  return (
    <button onClick={handleToggleFavorite}>
      {isFavorite(property.id) ? '❤️' : '🤍'}
    </button>
  );
};
```

## 📧 Communication

### Envoyer un Message
```javascript
const ContactForm = () => {
  const sendMessage = async (messageData) => {
    await apiService.sendMessage(messageData);
  };
};
```

### Rendez-vous
```javascript
const AppointmentForm = () => {
  const createAppointment = async (appointmentData) => {
    await apiService.createAppointment(appointmentData);
  };
};
```

## 💳 Paiements

### Créer un Abonnement
```javascript
const SubscriptionPlans = () => {
  const { createSubscription } = useUserData();
  
  const handleSubscribe = async (planType) => {
    await createSubscription(planType);
  };
};
```

## 🛠️ Gestion des Erreurs

### Intercepteur Global
```javascript
// Dans api.js
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
  }
  return response.json();
};
```

### Composant d'Erreur
```javascript
const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Une erreur est survenue</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Recharger la page
        </button>
      </div>
    );
  }
  
  return children;
};
```

## 🔧 Configuration Avancée

### Timeout et Retry
```javascript
// Dans src/services/api.js
const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};
```

### Cache des Données
```javascript
// Utilisation du cache local
const cache = new Map();

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  return null;
};
```

## 🚀 Déploiement

### Variables d'Environnement de Production
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENV=production
```

### Build de Production
```bash
npm run build
```

## 🧪 Tests

### Test de Connexion API
```javascript
import ApiStatus from '../components/ApiStatus';

// Afficher le statut de l'API
<ApiStatus />
```

### Test des Hooks
```javascript
import { render, screen } from '@testing-library/react';
import { useProperties } from '../hooks/useProperties';

test('useProperties loads properties', async () => {
  render(<PropertiesList />);
  expect(await screen.findByText('Chargement...')).toBeInTheDocument();
});
```

## 📚 Ressources Utiles

- [Documentation API Backend](../backend/README.md)
- [Structure de la Base de Données](../backend/DATABASE.md)
- [Guide de Déploiement](../backend/DEPLOIEMENT.md)

## 🆘 Dépannage

### Problèmes Courants

1. **Erreur CORS** : Vérifiez la configuration CORS dans le backend
2. **Token expiré** : Le hook useAuth gère automatiquement la déconnexion
3. **Erreur de connexion** : Utilisez le composant ApiStatus pour diagnostiquer

### Logs de Débogage
```javascript
// Activer les logs détaillés
localStorage.setItem('debug', '224suite:*');
```

---

## ✅ Checklist d'Intégration

- [ ] Variables d'environnement configurées
- [ ] Backend démarré et accessible
- [ ] Service API testé
- [ ] Hooks personnalisés implémentés
- [ ] Authentification fonctionnelle
- [ ] Gestion des erreurs en place
- [ ] Tests de connexion passés

Votre frontend est maintenant prêt à communiquer avec le backend ! 🎉
