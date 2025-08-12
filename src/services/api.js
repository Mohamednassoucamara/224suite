// Configuration API pour 224Suite
const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Timeout pour les requêtes
  TIMEOUT: 10000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Fonction pour créer les headers avec authentification
const createHeaders = (includeAuth = false) => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (includeAuth) {
    const token = localStorage.getItem('224suite_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Fonction pour gérer les erreurs
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
  }
  return response.json();
};

// Classe API principale
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: createHeaders(options.includeAuth),
      timeout: API_CONFIG.TIMEOUT,
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur API:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erreur API inconnue');
      }
    }
  }

  // === AUTHENTIFICATION ===
  
  // Inscription
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Connexion
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('224suite_token');
    localStorage.removeItem('224suite_user');
  }

  // === PROPRIÉTÉS ===
  
  // Obtenir toutes les propriétés
  async getProperties(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/properties?${params}`);
  }

  // Obtenir une propriété par ID
  async getProperty(id) {
    return this.request(`/properties/${id}`);
  }

  // Créer une propriété
  async createProperty(propertyData) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
      includeAuth: true
    });
  }

  // Mettre à jour une propriété
  async updateProperty(id, propertyData) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
      includeAuth: true
    });
  }

  // Supprimer une propriété
  async deleteProperty(id) {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
      includeAuth: true
    });
  }

  // === RECHERCHE ===
  
  // Recherche de propriétés
  async searchProperties(searchParams) {
    const params = new URLSearchParams(searchParams);
    return this.request(`/search?${params}`);
  }

  // === UTILISATEURS ===
  
  // Obtenir le profil utilisateur
  async getUserProfile() {
    return this.request('/users/profile', {
      includeAuth: true
    });
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      includeAuth: true
    });
  }

  // === CONTACT ===
  
  // Envoyer un message de contact
  async sendContactMessage(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  // === FAVORIS ===
  
  // Ajouter/retirer des favoris
  async toggleFavorite(propertyId) {
    return this.request(`/properties/${propertyId}/favorite`, {
      method: 'POST',
      includeAuth: true
    });
  }

  // === SANTÉ ===
  
  // Vérifier la santé de l'API
  async healthCheck() {
    return this.request('/health');
  }
}

// Instance singleton
const apiService = new ApiService();

export default apiService;
