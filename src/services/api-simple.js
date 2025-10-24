// Service API simplifié pour le frontend - utilise des API REST
import config from '../config/config.js';

class ApiService {
  constructor() {
    this.baseURL = config.api.baseURL;
  }

  // === AUTHENTIFICATION ===
  async login(email, password) {
    try {
      // Simulation d'authentification (à remplacer par des appels API réels)
      const users = [
        {
          id: 1,
          email: 'admin@224suite.com',
          password: 'password123',
          first_name: 'Admin',
          last_name: '224Suite',
          role: 'admin',
          is_active: true
        },
        {
          id: 2,
          email: 'agent@224suite.com',
          password: 'password123',
          first_name: 'Agent',
          last_name: 'Immobilier',
          role: 'agent',
          is_active: true
        },
        {
          id: 3,
          email: 'user@224suite.com',
          password: 'password123',
          first_name: 'Utilisateur',
          last_name: 'Test',
          role: 'user',
          is_active: true
        }
      ];

      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      if (!user.is_active) {
        throw new Error('Compte désactivé');
      }

      // Retourner l'utilisateur sans le mot de passe
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Erreur de connexion: ${error.message}`);
    }
  }

  async register(userData) {
    try {
      // Simulation d'inscription (à remplacer par des appels API réels)
      const { email, password, first_name, last_name, phone } = userData;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Créer l'utilisateur
      const newUser = {
        id: Date.now(),
        email,
        password, // En production, hasher le mot de passe
        first_name,
        last_name,
        phone,
        role: 'user',
        is_active: true,
        created_at: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return { message: 'Utilisateur créé avec succès' };
    } catch (error) {
      throw new Error(`Erreur d'inscription: ${error.message}`);
    }
  }

  async getUserProfile(userId) {
    try {
      // Simulation de récupération du profil
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Erreur de récupération du profil: ${error.message}`);
    }
  }

  // === PROPRIÉTÉS ===
  async getProperties(filters = {}) {
    try {
      // Données de test des propriétés
      const properties = [
        {
          id: 1,
          title: 'Villa moderne à Kaloum',
          description: 'Magnifique villa moderne avec jardin, 3 chambres, salon spacieux, cuisine équipée. Située dans le quartier résidentiel de Kaloum.',
          type: 'villa',
          status: 'for-sale',
          price: 150000.00,
          currency: 'USD',
          area: 200.00,
          bedrooms: 3,
          bathrooms: 2,
          address: 'Kaloum, Conakry',
          district: 'Kaloum',
          latitude: 9.5370,
          longitude: -13.6785,
          primary_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          owner_name: 'Agent Immobilier',
          owner_phone: '+224123456790',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Appartement 2 chambres à Dixinn',
          description: 'Bel appartement au 3ème étage avec vue sur mer. 2 chambres, salon, cuisine, salle de bain. Proche de l\'université.',
          type: 'apartment',
          status: 'for-rent',
          price: 500.00,
          currency: 'USD',
          area: 80.00,
          bedrooms: 2,
          bathrooms: 1,
          address: 'Dixinn, Conakry',
          district: 'Dixinn',
          latitude: 9.6000,
          longitude: -13.6000,
          primary_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          owner_name: 'Agent Immobilier',
          owner_phone: '+224123456790',
          created_at: '2024-01-14T10:00:00Z'
        },
        {
          id: 3,
          title: 'Terrain constructible à Ratoma',
          description: 'Terrain de 500m² constructible, viabilisé, proche des commodités. Idéal pour construction de villa ou immeuble.',
          type: 'land',
          status: 'for-sale',
          price: 25000.00,
          currency: 'USD',
          area: 500.00,
          bedrooms: null,
          bathrooms: null,
          address: 'Ratoma, Conakry',
          district: 'Ratoma',
          latitude: 9.7000,
          longitude: -13.5000,
          primary_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          owner_name: 'Agent Immobilier',
          owner_phone: '+224123456790',
          created_at: '2024-01-13T10:00:00Z'
        },
        {
          id: 4,
          title: 'Maison familiale à Matam',
          description: 'Grande maison familiale avec 4 chambres, 2 salons, cuisine spacieuse, garage. Jardin arboré. Quartier calme et résidentiel.',
          type: 'house',
          status: 'for-sale',
          price: 120000.00,
          currency: 'USD',
          area: 180.00,
          bedrooms: 4,
          bathrooms: 3,
          address: 'Matam, Conakry',
          district: 'Matam',
          latitude: 9.6500,
          longitude: -13.5500,
          primary_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          owner_name: 'Agent Immobilier',
          owner_phone: '+224123456790',
          created_at: '2024-01-12T10:00:00Z'
        },
        {
          id: 5,
          title: 'Bureau commercial à Coléah',
          description: 'Local commercial de 100m², idéal pour bureau ou commerce. Parking disponible. Proche du centre-ville.',
          type: 'commercial',
          status: 'for-rent',
          price: 300.00,
          currency: 'USD',
          area: 100.00,
          bedrooms: null,
          bathrooms: 1,
          address: 'Coléah, Conakry',
          district: 'Coléah',
          latitude: 9.5800,
          longitude: -13.6500,
          primary_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          owner_name: 'Agent Immobilier',
          owner_phone: '+224123456790',
          created_at: '2024-01-11T10:00:00Z'
        }
      ];

      // Appliquer les filtres
      let filteredProperties = properties;

      if (filters.type) {
        filteredProperties = filteredProperties.filter(p => p.type === filters.type);
      }

      if (filters.status) {
        filteredProperties = filteredProperties.filter(p => p.status === filters.status);
      }

      if (filters.city) {
        filteredProperties = filteredProperties.filter(p => p.address.includes(filters.city));
      }

      if (filters.district) {
        filteredProperties = filteredProperties.filter(p => p.district === filters.district);
      }

      if (filters.min_price) {
        filteredProperties = filteredProperties.filter(p => p.price >= filters.min_price);
      }

      if (filters.max_price) {
        filteredProperties = filteredProperties.filter(p => p.price <= filters.max_price);
      }

      if (filters.bedrooms) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedrooms);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProperties = filteredProperties.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.address.toLowerCase().includes(searchTerm)
        );
      }

      return filteredProperties;
    } catch (error) {
      throw new Error(`Erreur de récupération des propriétés: ${error.message}`);
    }
  }

  async getPropertyById(id) {
    try {
      const properties = await this.getProperties();
      const property = properties.find(p => p.id === parseInt(id));
      
      if (!property) {
        throw new Error('Propriété non trouvée');
      }

      // Ajouter les images de la propriété
      property.images = [
        { id: 1, image_url: property.primary_image, alt_text: property.title, is_primary: true, sort_order: 1 },
        { id: 2, image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', alt_text: 'Vue supplémentaire', is_primary: false, sort_order: 2 }
      ];

      return property;
    } catch (error) {
      throw new Error(`Erreur de récupération de la propriété: ${error.message}`);
    }
  }

  // === FAVORIS ===
  async getFavorites(userId) {
    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      const properties = await this.getProperties();
      
      return properties.filter(p => favorites.includes(p.id));
    } catch (error) {
      throw new Error(`Erreur de récupération des favoris: ${error.message}`);
    }
  }

  async addFavorite(userId, propertyId) {
    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      
      if (favorites.includes(propertyId)) {
        throw new Error('Cette propriété est déjà dans vos favoris');
      }

      favorites.push(propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
      
      return { message: 'Propriété ajoutée aux favoris' };
    } catch (error) {
      throw new Error(`Erreur d'ajout aux favoris: ${error.message}`);
    }
  }

  async removeFavorite(userId, propertyId) {
    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      const updatedFavorites = favorites.filter(id => id !== propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
      
      return { message: 'Propriété retirée des favoris' };
    } catch (error) {
      throw new Error(`Erreur de suppression des favoris: ${error.message}`);
    }
  }

  async isFavorite(userId, propertyId) {
    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      return favorites.includes(propertyId);
    } catch (error) {
      throw new Error(`Erreur de vérification des favoris: ${error.message}`);
    }
  }

  // === MESSAGES ===
  async sendMessage(messageData) {
    try {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      const newMessage = {
        id: Date.now(),
        ...messageData,
        created_at: new Date().toISOString(),
        is_read: false
      };
      
      messages.push(newMessage);
      localStorage.setItem('messages', JSON.stringify(messages));
      
      return { message: 'Message envoyé avec succès' };
    } catch (error) {
      throw new Error(`Erreur d'envoi du message: ${error.message}`);
    }
  }

  // === RECHERCHE ===
  async searchProperties(query, filters = {}) {
    try {
      const searchFilters = {
        ...filters,
        search: query
      };
      return await this.getProperties(searchFilters);
    } catch (error) {
      throw new Error(`Erreur de recherche: ${error.message}`);
    }
  }

  // === STATISTIQUES ===
  async getStats() {
    try {
      const properties = await this.getProperties();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      
      return {
        totalProperties: properties.length,
        totalUsers: users.length,
        totalMessages: messages.length
      };
    } catch (error) {
      throw new Error(`Erreur de récupération des statistiques: ${error.message}`);
    }
  }

  // === UTILITAIRES ===
  async healthCheck() {
    return { status: 'OK', message: 'Service API fonctionnel' };
  }
}

// Créer une instance singleton
const apiService = new ApiService();

export default apiService;
