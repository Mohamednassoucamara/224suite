import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger le profil utilisateur
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUserProfile();
      
      if (response.success) {
        setUser(response.data);
        return response.data;
      } else {
        setError(response.message || 'Erreur lors du chargement du profil');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement du profil utilisateur');
      console.error('Erreur fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour le profil utilisateur
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateProfile(profileData);
      
      if (response.success) {
        setUser(prev => ({ ...prev, ...response.data }));
        return response.data;
      } else {
        setError(response.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour du profil');
      console.error('Erreur updateProfile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Changer le mot de passe
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du changement de mot de passe');
      console.error('Erreur changePassword:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les favoris
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFavorites();
      
      if (response.success) {
        setFavorites(response.data.favorites || response.data);
        return response.data;
      } else {
        setError(response.message || 'Erreur lors du chargement des favoris');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement des favoris');
      console.error('Erreur fetchFavorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter/retirer un favori
  const toggleFavorite = useCallback(async (propertyId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.toggleFavorite(propertyId);
      
      if (response.success) {
        // Mettre à jour la liste des favoris
        const isFavorite = favorites.some(fav => fav.id === propertyId);
        
        if (isFavorite) {
          // Retirer du favori
          setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
        } else {
          // Ajouter au favori
          setFavorites(prev => [...prev, response.data.property]);
        }
        
        return response.data;
      } else {
        setError(response.message || 'Erreur lors de la modification des favoris');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la modification des favoris');
      console.error('Erreur toggleFavorite:', error);
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  // Vérifier si une propriété est en favori
  const isFavorite = useCallback((propertyId) => {
    return favorites.some(fav => fav.id === propertyId);
  }, [favorites]);

  // Obtenir le statut d'abonnement
  const getSubscriptionStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSubscriptionStatus();
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Erreur lors du chargement du statut d\'abonnement');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement du statut d\'abonnement');
      console.error('Erreur getSubscriptionStatus:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un abonnement
  const createSubscription = useCallback(async (planType) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.createSubscription(planType);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Erreur lors de la création de l\'abonnement');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la création de l\'abonnement');
      console.error('Erreur createSubscription:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    fetchUserProfile();
    fetchFavorites();
  }, [fetchUserProfile, fetchFavorites]);

  return {
    user,
    favorites,
    loading,
    error,
    fetchUserProfile,
    updateProfile,
    changePassword,
    fetchFavorites,
    toggleFavorite,
    isFavorite,
    getSubscriptionStatus,
    createSubscription
  };
};
