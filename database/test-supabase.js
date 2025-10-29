// Script de test de connexion Supabase
require('dotenv').config({ path: '../env.supabase.local' });
const { supabase, testConnection } = require('./supabase-config');

async function testSupabase() {
  console.log('🧪 Test de connexion Supabase...\n');

  try {
    // Test de connexion de base
    console.log('1. Test de connexion...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Connexion échouée');
      return;
    }

    // Test des tables principales
    console.log('2. Test des tables...');
    
    const tables = ['users', 'properties', 'property_images', 'favorites', 'messages', 'appointments', 'subscriptions', 'saved_searches'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ Table ${table}: OK`);
        }
      } catch (err) {
        console.log(`   ❌ Table ${table}: ${err.message}`);
      }
    }

    // Test des données
    console.log('3. Test des données...');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(5);

    if (usersError) {
      console.log(`   ❌ Erreur lors de la récupération des utilisateurs: ${usersError.message}`);
    } else {
      console.log(`   ✅ ${users.length} utilisateurs trouvés`);
      users.forEach(user => {
        console.log(`      - ${user.email} (${user.role})`);
      });
    }

    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, title, type, status, price')
      .limit(5);

    if (propertiesError) {
      console.log(`   ❌ Erreur lors de la récupération des propriétés: ${propertiesError.message}`);
    } else {
      console.log(`   ✅ ${properties.length} propriétés trouvées`);
      properties.forEach(property => {
        console.log(`      - ${property.title} (${property.type}) - ${property.price} ${property.status}`);
      });
    }

    // Test des politiques RLS
    console.log('4. Test des politiques RLS...');
    
    try {
      // Test d'accès anonyme (devrait être limité)
      const { data: publicData, error: publicError } = await supabase
        .from('users')
        .select('id, email')
        .limit(1);
      
      if (publicError) {
        console.log('   ✅ RLS fonctionne (accès refusé aux utilisateurs)');
      } else {
        console.log('   ⚠️  RLS pourrait ne pas fonctionner correctement');
      }
    } catch (err) {
      console.log('   ✅ RLS fonctionne (accès refusé)');
    }

    console.log('\n🎉 Tests terminés !');
    console.log('\n📋 Prochaines étapes :');
    console.log('   1. Configurez vos variables d\'environnement');
    console.log('   2. Exécutez: npm run db:setup-supabase');
    console.log('   3. Exécutez: npm run db:seed-supabase');
    console.log('   4. Testez votre application !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testSupabase();
}

module.exports = { testSupabase };
