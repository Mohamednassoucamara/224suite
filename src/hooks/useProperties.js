import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useProperties = (initialFilters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Charger les propriétés
  const fetchProperties = useCallback(async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...newFilters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await apiService.getProperties(params);
      
      if (response.success) {
        setProperties(response.data.properties || response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
        }));
      } else {
        setError(response.message || 'Erreur lors du chargement des propriétés');
      }
    } catch (error) {
      setError(error.message || 'Erreur de connexion');
      console.error('Erreur fetchProperties:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Charger une propriété spécifique
  const fetchProperty = useCallback(async (propertyId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProperty(propertyId);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Propriété non trouvée');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement de la propriété');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle propriété
  const createProperty = useCallback(async (propertyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.createProperty(propertyData);
      
      if (response.success) {
        // Recharger la liste des propriétés
        await fetchProperties();
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la création');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la création de la propriété');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProperties]);

  // Mettre à jour une propriété
  const updateProperty = useCallback(async (propertyId, propertyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateProperty(propertyId, propertyData);
      
      if (response.success) {
        // Mettre à jour la propriété dans la liste
        setProperties(prev => 
          prev.map(prop => 
            prop.id === propertyId ? response.data : prop
          )
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour de la propriété');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une propriété
  const deleteProperty = useCallback(async (propertyId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.deleteProperty(propertyId);
      
      if (response.success) {
        // Retirer la propriété de la liste
        setProperties(prev => prev.filter(prop => prop.id !== propertyId));
        return true;
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la suppression de la propriété');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload d'images
  const uploadImages = useCallback(async (propertyId, imageFiles) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.uploadPropertyImages(propertyId, imageFiles);
      
      if (response.success) {
        // Mettre à jour la propriété avec les nouvelles images
        setProperties(prev => 
          prev.map(prop => 
            prop.id === propertyId 
              ? { ...prop, images: [...(prop.images || []), ...response.data.images] }
              : prop
          )
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de l\'upload des images');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de l\'upload des images');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset à la première page
  }, []);

  // Changer de page
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Charger les propriétés au montage et quand les filtres/pagination changent
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    filters,
    pagination,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImages,
    updateFilters,
    changePage
  };
};
