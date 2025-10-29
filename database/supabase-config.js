// Configuration Supabase pour 224Suite
const { createClient } = require('@supabase/supabase-js');

// Configuration directe pour les scripts
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yixwfiwyxhzjeixubmlr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpeHdmaXd5eGh6amVpeHVibWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzI3NDQsImV4cCI6MjA3Njk0ODc0NH0.sMwPos7KRBjH8AQToIi94NdCKvhpKdC-lsRMNEnWyQA';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Veuillez définir REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Configuration pour les requêtes
const config = {
  supabaseUrl,
  supabaseAnonKey,
  supabase
};

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Connexion Supabase établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Supabase:', error.message);
    return false;
  }
};

// Fonction pour créer un pool de connexions (compatibilité avec l'ancien code)
const createPool = () => {
  return {
    query: async (sql, params = []) => {
      // Cette fonction sera implémentée selon les besoins spécifiques
      console.log('Query Supabase:', sql, params);
      return { rows: [], rowCount: 0 };
    },
    end: () => {
      console.log('Pool de connexions Supabase fermé');
    }
  };
};

module.exports = {
  config,
  supabase,
  testConnection,
  createPool
};
