// Configuration de l'application 224Suite
const config = {
  // Configuration de l'API
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'https://two24suite-backend.onrender.com/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Configuration de l'authentification
  auth: {
    tokenKey: '224suite_token',
    userKey: '224suite_user',
    tokenExpiryKey: '224suite_token_expiry'
  },

  // Configuration des images
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 10
  },

  // Configuration de la recherche
  search: {
    debounceDelay: 300,
    minQueryLength: 2,
    maxSuggestions: 10
  },

  // Configuration de la pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50
  },

  // Configuration des monnaies
  currencies: [
    { code: 'USD', symbol: '$', name: 'Dollar US' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GNF', symbol: 'FG', name: 'Franc Guinéen' }
  ],

  // Configuration des types de propriétés
  propertyTypes: [
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'villa', label: 'Villa' },
    { value: 'land', label: 'Terrain' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'office', label: 'Bureau' }
  ],

  // Configuration des statuts de propriétés
  propertyStatus: [
    { value: 'for-sale', label: 'À vendre' },
    { value: 'for-rent', label: 'À louer' },
    { value: 'sold', label: 'Vendu' },
    { value: 'rented', label: 'Loué' }
  ],

  // Configuration des rôles utilisateurs
  userRoles: [
    { value: 'user', label: 'Utilisateur' },
    { value: 'agent', label: 'Agent immobilier' },
    { value: 'admin', label: 'Administrateur' }
  ],

  // Configuration des abonnements
  subscriptions: {
    plans: [
      {
        id: 'basic',
        name: 'Basique',
        price: 0,
        features: [
          'Recherche de propriétés',
          'Contact des propriétaires',
          'Favoris limités'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 29900, // 30 USD
        period: 'month',
        features: [
          'Toutes les fonctionnalités basiques',
          'Favoris illimités',
          'Notifications avancées',
          'Recherche avancée',
          'Support prioritaire'
        ]
      },
      {
        id: 'premium_plus',
        name: 'Premium Plus',
        price: 99000, // 100 USD
        period: 'month',
        features: [
          'Toutes les fonctionnalités premium',
          'Publier des annonces',
          'Statistiques détaillées',
          'Support dédié',
          'Accès VIP'
        ]
      }
    ]
  },

  // Configuration de la géolocalisation
  geolocation: {
    defaultRadius: 10, // km
    maxRadius: 50,
    conakryCoordinates: {
      lat: 9.5370,
      lng: -13.6785
    }
  },

  // Configuration des notifications
  notifications: {
    types: {
      email: true,
      push: false,
      sms: false
    },
    frequency: {
      immediate: 'Immediate',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire'
    }
  },

  // Configuration des erreurs
  errors: {
    network: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
    unauthorized: 'Vous devez être connecté pour accéder à cette fonctionnalité.',
    forbidden: 'Vous n\'avez pas les permissions nécessaires.',
    notFound: 'La ressource demandée n\'a pas été trouvée.',
    server: 'Erreur serveur. Veuillez réessayer plus tard.',
    validation: 'Veuillez vérifier les informations saisies.'
  },

  // Configuration des validateurs
  validators: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false
    },
    phone: {
      pattern: /^\+?[1-9]\d{1,14}$/,
      countries: ['GN', 'FR', 'US']
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },

  // Configuration des limites
  limits: {
    propertiesPerUser: 10,
    imagesPerProperty: 20,
    favoritesPerUser: 100,
    searchHistory: 50
  }
};

export default config;
