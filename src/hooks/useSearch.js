import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  // Recherche de propriétés
  const searchProperties = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.searchProperties(params);
      
      if (response.success) {
        setSearchResults(response.data.properties || response.data);
        setSearchParams(params);
        return response.data;
      } else {
        setError(response.message || 'Aucun résultat trouvé');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la recherche');
      setSearchResults([]);
      console.error('Erreur searchProperties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtenir des suggestions de recherche
  const getSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await apiService.getSearchSuggestions(query);
      
      if (response.success) {
        setSuggestions(response.data.suggestions || response.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Erreur getSuggestions:', error);
      setSuggestions([]);
    }
  }, []);

  // Recherche géolocalisée
  const searchNearby = useCallback(async (lat, lng, radius = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.searchNearby(lat, lng, radius);
      
      if (response.success) {
        setSearchResults(response.data.properties || response.data);
        return response.data;
      } else {
        setError(response.message || 'Aucun résultat trouvé à proximité');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la recherche géolocalisée');
      setSearchResults([]);
      console.error('Erreur searchNearby:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche avec filtres avancés
  const searchWithFilters = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...searchParams,
        ...filters
      };
      
      const response = await apiService.searchProperties(params);
      
      if (response.success) {
        setSearchResults(response.data.properties || response.data);
        setSearchParams(params);
        return response.data;
      } else {
        setError(response.message || 'Aucun résultat trouvé avec ces critères');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la recherche filtrée');
      setSearchResults([]);
      console.error('Erreur searchWithFilters:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Recherche rapide par mot-clé
  const quickSearch = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        q: query,
        limit: 20
      };
      
      const response = await apiService.searchProperties(params);
      
      if (response.success) {
        setSearchResults(response.data.properties || response.data);
        setSearchParams(params);
        return response.data;
      } else {
        setError(response.message || 'Aucun résultat trouvé');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la recherche rapide');
      setSearchResults([]);
      console.error('Erreur quickSearch:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Nettoyer les résultats
  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSuggestions([]);
    setError(null);
    setSearchParams({});
  }, []);

  // Recherche par type de propriété
  const searchByType = useCallback(async (propertyType) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        type: propertyType,
        limit: 20
      };
      
      const response = await apiService.searchProperties(params);
      
      if (response.success) {
        setSearchResults(response.data.properties || response.data);
        setSearchParams(params);
        return response.data;
      } else {
        setError(response.message || 'Aucun résultat trouvé pour ce type');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la recherche par type');
      setSearchResults([]);
      console.error('Erreur searchByType:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche par prix
  const searchByPriceRange = useCallback(async (minPrice, maxPrice, currency = 'USD') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        minPrice,
        maxPrice,
        currency,
        limit: 20
      };
      
      const response = await apiService.searchProperties(params);
      
      if (response.success) {
        setSearchResults(response.data.properties || response.data);
        setSearchParams(params);
        return response.data;
      } else {
        setError(response.message || 'Aucun résultat trouvé dans cette fourchette de prix');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la recherche par prix');
      setSearchResults([]);
      console.error('Erreur searchByPriceRange:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchResults,
    suggestions,
    loading,
    error,
    searchParams,
    searchProperties,
    getSuggestions,
    searchNearby,
    searchWithFilters,
    quickSearch,
    searchByType,
    searchByPriceRange,
    clearResults
  };
};
