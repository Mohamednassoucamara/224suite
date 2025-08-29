// Configuration API pour 224Suite
const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: process.env.REACT_APP_API_URL || 'https://two24suite-backend.onrender.com/api',
  
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
    const errorMessage = errorData.message || errorData.error || `Erreur HTTP: ${response.status}`;
    throw new Error(errorMessage);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur API:', error);
      if (error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé');
      }
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erreur de connexion au serveur');
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
  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        includeAuth: true
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('224suite_token');
      localStorage.removeItem('224suite_user');
    }
  }

  // Mot de passe oublié
  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // Réinitialisation du mot de passe
  async resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
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

  // Upload d'images pour une propriété
  async uploadPropertyImages(propertyId, imageFiles) {
    const formData = new FormData();
    imageFiles.forEach((file, index) => {
      formData.append('images', file);
    });

    return this.request(`/properties/${propertyId}/images`, {
      method: 'POST',
      body: formData,
      includeAuth: true,
      headers: {} // Laisser fetch définir automatiquement les headers pour FormData
    });
  }

  // === RECHERCHE ===
  
  // Recherche de propriétés
  async searchProperties(searchParams) {
    const params = new URLSearchParams(searchParams);
    return this.request(`/search/properties?${params}`);
  }

  // Suggestions de recherche
  async getSearchSuggestions(query) {
    return this.request(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Recherche géolocalisée
  async searchNearby(lat, lng, radius = 10) {
    return this.request(`/search/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
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

  // Changer le mot de passe
  async changePassword(currentPassword, newPassword) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
      includeAuth: true
    });
  }

  // Obtenir les favoris
  async getFavorites() {
    return this.request('/users/favorites', {
      includeAuth: true
    });
  }

  // === MESSAGES ===
  
  // Envoyer un message
  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
      includeAuth: true
    });
  }

  // Obtenir les conversations
  async getConversations() {
    return this.request('/messages/conversations', {
      includeAuth: true
    });
  }

  // Obtenir les messages d'une conversation
  async getMessages(threadId) {
    return this.request(`/messages/${threadId}`, {
      includeAuth: true
    });
  }

  // === RENDEZ-VOUS ===
  
  // Créer un rendez-vous
  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
      includeAuth: true
    });
  }

  // Obtenir les rendez-vous
  async getAppointments() {
    return this.request('/appointments', {
      includeAuth: true
    });
  }

  // Confirmer/refuser un rendez-vous
  async updateAppointmentStatus(appointmentId, status) {
    return this.request(`/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
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
    return this.request(`/users/favorites/${propertyId}`, {
      method: 'POST',
      includeAuth: true
    });
  }

  // === PAIEMENTS ===
  
  // Créer un abonnement
  async createSubscription(planType) {
    return this.request('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify({ planType }),
      includeAuth: true
    });
  }

  // Obtenir le statut de l'abonnement
  async getSubscriptionStatus() {
    return this.request('/payments/subscription-status', {
      includeAuth: true
    });
  }

  // === SANTÉ ===
  
  // Vérifier la santé de l'API
  async healthCheck() {
    return this.request('/health');
  }

  // Test de connexion à la base de données
  async testDatabaseConnection() {
    return this.request('/test-postgresql');
  }
}

// Instance singleton
const apiService = new ApiService();

export default apiService;
