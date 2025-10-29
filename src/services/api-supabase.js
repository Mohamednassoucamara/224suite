// Service API pour Supabase - 224Suite
import { createClient } from '@supabase/supabase-js';

class SupabaseApiService {
  constructor() {
    this.supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    this.supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error('Variables d\'environnement Supabase manquantes');
      throw new Error('Configuration Supabase incomplète');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }

  // === AUTHENTIFICATION ===
  async login(email, password) {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // Récupérer les informations utilisateur depuis la table users
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        throw new Error('Erreur lors de la récupération du profil utilisateur');
      }

      return {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role,
        is_active: userData.is_active,
        avatar: userData.avatar
      };
    } catch (error) {
      throw new Error(`Erreur de connexion: ${error.message}`);
    }
  }

  async register(userData) {
    try {
      const { email, password, first_name, last_name, phone, role } = userData;
      
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Si la confirmation d'email est requise, pas d'id utilisateur immédiat
      if (!authData?.user?.id) {
        return { message: 'Vérifiez votre email pour confirmer votre compte', needsEmailConfirmation: true };
      }

      // Créer le profil uniquement si l'utilisateur est authentifié et que l'id est disponible
      const { error: userError } = await this.supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          first_name,
          last_name,
          phone,
          role: role || 'user',
          is_active: true,
          email_verified: false
        });

      if (userError) {
        throw new Error('Erreur lors de la création du profil utilisateur');
      }

      return { message: 'Utilisateur créé avec succès', needsEmailConfirmation: false };
    } catch (error) {
      throw new Error(`Erreur d'inscription: ${error.message}`);
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      throw new Error(`Erreur de déconnexion: ${error.message}`);
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        throw new Error(error.message);
      }

      if (!user) {
        return null;
      }

      // Récupérer les informations complètes de l'utilisateur
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return userData;
    } catch (error) {
      throw new Error(`Erreur de récupération de l'utilisateur: ${error.message}`);
    }
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error('Utilisateur non trouvé');
      }

      return data;
    } catch (error) {
      throw new Error(`Erreur de récupération du profil: ${error.message}`);
    }
  }

  // === PROPRIÉTÉS ===
  async getProperties(filters = {}) {
    try {
      let query = this.supabase
        .from('properties')
        .select(`
          *,
          users!properties_user_id_fkey(first_name, last_name, phone)
        `)
        .eq('is_active', true);

      // Appliquer les filtres
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.district) {
        query = query.eq('district', filters.district);
      }

      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }

      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }

      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }

      if (filters.search) {
        query = query.textSearch('title,description,address', filters.search);
      }

      if (filters.is_featured) {
        query = query.eq('is_featured', true);
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Ajouter les images primaires
      const propertiesWithImages = await Promise.all(
        data.map(async (property) => {
          const { data: images } = await this.supabase
            .from('property_images')
            .select('*')
            .eq('property_id', property.id)
            .eq('is_primary', true)
            .limit(1);

          return {
            ...property,
            primary_image: images?.[0]?.image_url || null,
            owner_name: `${property.users?.first_name || ''} ${property.users?.last_name || ''}`.trim(),
            owner_phone: property.users?.phone || null
          };
        })
      );

      return propertiesWithImages;
    } catch (error) {
      throw new Error(`Erreur de récupération des propriétés: ${error.message}`);
    }
  }

  async getPropertyById(id) {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select(`
          *,
          users!properties_user_id_fkey(first_name, last_name, phone),
          property_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error('Propriété non trouvée');
      }

      // Trier les images par sort_order
      const sortedImages = data.property_images?.sort((a, b) => a.sort_order - b.sort_order) || [];

      return {
        ...data,
        images: sortedImages,
        owner_name: `${data.users?.first_name || ''} ${data.users?.last_name || ''}`.trim(),
        owner_phone: data.users?.phone || null
      };
    } catch (error) {
      throw new Error(`Erreur de récupération de la propriété: ${error.message}`);
    }
  }

  async createProperty(propertyData) {
    try {
      const { data: user } = await this.getCurrentUser();
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const { data, error } = await this.supabase
        .from('properties')
        .insert({
          ...propertyData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(`Erreur de création de la propriété: ${error.message}`);
    }
  }

  async updateProperty(id, propertyData) {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(`Erreur de mise à jour de la propriété: ${error.message}`);
    }
  }

  async deleteProperty(id) {
    try {
      const { error } = await this.supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Propriété supprimée avec succès' };
    } catch (error) {
      throw new Error(`Erreur de suppression de la propriété: ${error.message}`);
    }
  }

  // === FAVORIS ===
  async getFavorites(userId) {
    try {
      const { data, error } = await this.supabase
        .from('favorites')
        .select(`
          *,
          properties!favorites_property_id_fkey(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(fav => fav.properties);
    } catch (error) {
      throw new Error(`Erreur de récupération des favoris: ${error.message}`);
    }
  }

  async addFavorite(userId, propertyId) {
    try {
      const { error } = await this.supabase
        .from('favorites')
        .insert({
          user_id: userId,
          property_id: propertyId
        });

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Propriété ajoutée aux favoris' };
    } catch (error) {
      throw new Error(`Erreur d'ajout aux favoris: ${error.message}`);
    }
  }

  async removeFavorite(userId, propertyId) {
    try {
      const { error } = await this.supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Propriété retirée des favoris' };
    } catch (error) {
      throw new Error(`Erreur de suppression des favoris: ${error.message}`);
    }
  }

  async isFavorite(userId, propertyId) {
    try {
      const { data, error } = await this.supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return !!data;
    } catch (error) {
      throw new Error(`Erreur de vérification des favoris: ${error.message}`);
    }
  }

  // === MESSAGES ===
  async sendMessage(messageData) {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Message envoyé avec succès', data };
    } catch (error) {
      throw new Error(`Erreur d'envoi du message: ${error.message}`);
    }
  }

  async getMessages(userId) {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select(`
          *,
          properties!messages_property_id_fkey(title, id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(`Erreur de récupération des messages: ${error.message}`);
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
      const [propertiesResult, usersResult, messagesResult] = await Promise.all([
        this.supabase.from('properties').select('id', { count: 'exact' }),
        this.supabase.from('users').select('id', { count: 'exact' }),
        this.supabase.from('messages').select('id', { count: 'exact' })
      ]);

      return {
        totalProperties: propertiesResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalMessages: messagesResult.count || 0
      };
    } catch (error) {
      throw new Error(`Erreur de récupération des statistiques: ${error.message}`);
    }
  }

  // === UTILITAIRES ===
  async healthCheck() {
    try {
      const { error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        throw new Error(error.message);
      }

      return { status: 'OK', message: 'Service Supabase fonctionnel' };
    } catch (error) {
      return { status: 'ERROR', message: `Erreur Supabase: ${error.message}` };
    }
  }
}

// Créer une instance singleton
const supabaseApiService = new SupabaseApiService();

export default supabaseApiService;
