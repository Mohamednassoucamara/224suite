import { useState, useEffect, createContext, useContext } from 'react';
import apiService from '../services/api';

// Contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser l'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Vérifier le statut d'authentification
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('224suite_token');
      if (token) {
        const userData = await apiService.getUserProfile();
        setUser(userData.data);
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      // Token invalide, nettoyer le localStorage
      apiService.logout();
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.login(credentials);
      
      // Sauvegarder le token et les données utilisateur
      localStorage.setItem('224suite_token', response.data.token);
      localStorage.setItem('224suite_user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.register(userData);
      
      // Optionnel : connecter automatiquement après inscription
      if (response.data.token) {
        localStorage.setItem('224suite_token', response.data.token);
        localStorage.setItem('224suite_user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = () => {
    apiService.logout();
    setUser(null);
    setError(null);
  };

  // Mettre à jour le profil utilisateur
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.updateProfile(profileData);
      
      // Mettre à jour les données utilisateur
      setUser(response.data);
      localStorage.setItem('224suite_user', JSON.stringify(response.data));
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de mise à jour du profil';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('224suite_token');
  };

  // Vérifier le type d'utilisateur
  const isOwner = () => {
    return isAuthenticated() && user?.userType === 'owner';
  };

  const isAgency = () => {
    return isAuthenticated() && user?.userType === 'agency';
  };

  const isSeeker = () => {
    return isAuthenticated() && user?.userType === 'seeker';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isOwner,
    isAgency,
    isSeeker,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
