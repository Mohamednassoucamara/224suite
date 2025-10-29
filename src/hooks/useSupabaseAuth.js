// Hook personnalisé pour l'authentification Supabase
import { useState, useEffect, useContext, createContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Créer le contexte d'authentification
const AuthContext = createContext({});

// Configuration Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Récupérer la session active
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error.message);
        } else {
          setSession(session);
          if (session?.user) {
            // Récupérer les informations complètes de l'utilisateur
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError) {
              console.error('Erreur lors de la récupération du profil:', userError.message);
              setUser(session.user);
            } else {
              setUser(userData);
            }
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Récupérer les informations complètes de l'utilisateur
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Erreur lors de la récupération du profil:', userError.message);
            setUser(session.user);
          } else {
            setUser(userData);
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const translateAuthError = (message) => {
    const text = (message || '').toLowerCase();
    if (text.includes('invalid login') || text.includes('invalid credentials')) {
      return 'Identifiants incorrects. Vérifiez votre email et mot de passe.';
    }
    if (text.includes('email not confirmed')) {
      return "Email non vérifié. Veuillez confirmer votre adresse avant de vous connecter.";
    }
    if (text.includes('rate limit')) {
      return 'Trop de tentatives. Réessayez dans quelques minutes.';
    }
    if (text.includes('user already registered') || text.includes('already registered')) {
      return 'Un compte existe déjà avec cet email.';
    }
    return message || 'Une erreur est survenue.';
  };

  // Fonction de connexion
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(translateAuthError(error.message));
      }

      return data;
    } catch (error) {
      throw new Error(`Erreur de connexion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const signUp = async (userData) => {
    try {
      setLoading(true);
      const { email, password, first_name, last_name, phone, role } = userData;
      
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        throw new Error(translateAuthError(authError.message));
      }

      // Si la confirmation d'email est requise, aucune session ni user.id immédiat
      // Dans ce cas, on ne tente PAS de créer le profil; on attend la connexion après confirmation
      if (!authData?.user?.id) {
        return { needsEmailConfirmation: true };
      }

      // Créer le profil uniquement si l'utilisateur est authentifié et que l'id est disponible
      const { error: userError } = await supabase
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

      return { needsEmailConfirmation: false };
    } catch (error) {
      throw new Error(`Erreur d'inscription: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error(`Erreur de déconnexion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Email de réinitialisation envoyé' };
    } catch (error) {
      throw new Error(`Erreur de réinitialisation: ${error.message}`);
    }
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      // Mettre à jour l'utilisateur local
      setUser({ ...user, ...updates });

      return { message: 'Profil mis à jour avec succès' };
    } catch (error) {
      throw new Error(`Erreur de mise à jour: ${error.message}`);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    supabase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser l'authentification
export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useSupabaseAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
};

export default useSupabaseAuth;
