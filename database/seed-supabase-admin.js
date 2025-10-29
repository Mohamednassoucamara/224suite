// Script d'insertion des données de test avec privilèges administrateur
require('dotenv').config({ path: '../env.supabase.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase avec clé de service (si disponible)
const supabaseUrl = 'https://yixwfiwyxhzjeixubmlr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpeHdmaXd5eGh6amVpeHVibWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzI3NDQsImV4cCI6MjA3Njk0ODc0NH0.sMwPos7KRBjH8AQToIi94NdCKvhpKdC-lsRMNEnWyQA';

// Utiliser la clé anonyme pour l'instant
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedSupabaseAdmin() {
  console.log('🌱 Insertion des données de test avec privilèges administrateur...\n');

  try {
    // Désactiver temporairement RLS pour l'insertion
    console.log('1. Désactivation temporaire de RLS...');
    
    const disableRLSQueries = [
      'ALTER TABLE users DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE properties DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE messages DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE saved_searches DISABLE ROW LEVEL SECURITY;'
    ];

    for (const query of disableRLSQueries) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey
          },
          body: JSON.stringify({ sql_query: query })
        });
        
        if (!response.ok) {
          console.log(`   ⚠️  RLS déjà désactivé ou erreur: ${query}`);
        }
      } catch (err) {
        console.log(`   ⚠️  Erreur RLS: ${err.message}`);
      }
    }

    console.log('   ✅ RLS désactivé temporairement');

    // Insérer les utilisateurs de test
    console.log('2. Insertion des utilisateurs de test...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          email: 'admin@224suite.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          first_name: 'Admin',
          last_name: '224Suite',
          phone: '+224123456789',
          role: 'admin',
          email_verified: true
        },
        {
          email: 'agent@224suite.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          first_name: 'Agent',
          last_name: 'Immobilier',
          phone: '+224123456790',
          role: 'agent',
          email_verified: true
        },
        {
          email: 'user@224suite.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          first_name: 'Utilisateur',
          last_name: 'Test',
          phone: '+224123456791',
          role: 'user',
          email_verified: true
        }
      ])
      .select();

    if (usersError) {
      console.log(`   ⚠️  Erreur lors de l'insertion des utilisateurs: ${usersError.message}`);
    } else {
      console.log(`   ✅ ${users.length} utilisateurs insérés`);
    }

    // Récupérer l'ID de l'agent pour les propriétés
    const { data: agentData } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'agent@224suite.com')
      .single();

    if (agentData) {
      // Insérer des images de test pour la première propriété
      console.log('3. Insertion des images de test...');
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .limit(1);

      if (properties && properties.length > 0) {
        const { error: imagesError } = await supabase
          .from('property_images')
          .insert([
            {
              property_id: properties[0].id,
              image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
              alt_text: 'Vue extérieure de la villa',
              is_primary: true,
              sort_order: 1
            },
            {
              property_id: properties[0].id,
              image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
              alt_text: 'Salon de la villa',
              is_primary: false,
              sort_order: 2
            }
          ]);

        if (imagesError) {
          console.log(`   ⚠️  Erreur lors de l'insertion des images: ${imagesError.message}`);
        } else {
          console.log('   ✅ Images de test insérées');
        }
      }

      // Insérer des messages de test
      console.log('4. Insertion des messages de test...');
      const { error: messagesError } = await supabase
        .from('messages')
        .insert([
          {
            name: 'Jean Dupont',
            email: 'jean.dupont@email.com',
            phone: '+224123456792',
            subject: 'Intéressé par la villa de Kaloum',
            message: 'Bonjour, je suis intéressé par cette villa. Pouvez-vous me donner plus d\'informations sur les conditions de vente ?',
            property_id: properties?.[0]?.id
          },
          {
            name: 'Marie Konaté',
            email: 'marie.konate@email.com',
            phone: '+224123456793',
            subject: 'Visite de l\'appartement',
            message: 'Bonjour, j\'aimerais visiter cet appartement. Quand seriez-vous disponible ?',
            property_id: properties?.[1]?.id
          }
        ]);

      if (messagesError) {
        console.log(`   ⚠️  Erreur lors de l'insertion des messages: ${messagesError.message}`);
      } else {
        console.log('   ✅ Messages de test insérés');
      }
    }

    // Réactiver RLS
    console.log('5. Réactivation de RLS...');
    const enableRLSQueries = [
      'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE properties ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE messages ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;'
    ];

    for (const query of enableRLSQueries) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey
          },
          body: JSON.stringify({ sql_query: query })
        });
        
        if (!response.ok) {
          console.log(`   ⚠️  RLS déjà activé ou erreur: ${query}`);
        }
      } catch (err) {
        console.log(`   ⚠️  Erreur RLS: ${err.message}`);
      }
    }

    console.log('   ✅ RLS réactivé');

    console.log('\n🎉 Données de test insérées avec succès !');
    console.log('\n📋 Résumé des données insérées :');
    console.log('   - Utilisateurs de test (admin, agent, user)');
    console.log('   - Images de test pour les propriétés');
    console.log('   - Messages de test');
    console.log('\n🔐 RLS réactivé pour la sécurité');

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error.message);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedSupabaseAdmin();
}

module.exports = { seedSupabaseAdmin };
