// Script de données de test pour Supabase
require('dotenv').config({ path: '../env.supabase.local' });
const { supabase } = require('./supabase-config');

async function seedSupabase() {
  console.log('🌱 Insertion des données de test dans Supabase...\n');

  try {
    // Vérifier si des données existent déjà
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (usersError) {
      console.error('❌ Erreur lors de la vérification des utilisateurs:', usersError.message);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('⚠️  Des données existent déjà dans la base de données');
      console.log('   Utilisez --force pour forcer l\'insertion');
      return;
    }

    // Insérer les utilisateurs de test
    console.log('1. Insertion des utilisateurs de test...');
    const { data: users, error: usersInsertError } = await supabase
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

    if (usersInsertError) {
      console.error('❌ Erreur lors de l\'insertion des utilisateurs:', usersInsertError.message);
      return;
    }

    console.log(`   ✅ ${users.length} utilisateurs insérés`);

    // Récupérer l'ID de l'agent pour les propriétés
    const agentId = users.find(u => u.role === 'agent')?.id;

    if (!agentId) {
      console.error('❌ Impossible de trouver l\'agent pour insérer les propriétés');
      return;
    }

    // Insérer les propriétés de test
    console.log('2. Insertion des propriétés de test...');
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .insert([
        {
          title: 'Villa moderne à Kaloum',
          description: 'Magnifique villa moderne avec jardin, 3 chambres, salon spacieux, cuisine équipée. Située dans le quartier résidentiel de Kaloum.',
          type: 'villa',
          status: 'for-sale',
          price: 150000.00,
          area: 200.00,
          bedrooms: 3,
          bathrooms: 2,
          address: 'Kaloum, Conakry',
          district: 'Kaloum',
          latitude: 9.5370,
          longitude: -13.6785,
          user_id: agentId
        },
        {
          title: 'Appartement 2 chambres à Dixinn',
          description: 'Bel appartement au 3ème étage avec vue sur mer. 2 chambres, salon, cuisine, salle de bain. Proche de l\'université.',
          type: 'apartment',
          status: 'for-rent',
          price: 500.00,
          area: 80.00,
          bedrooms: 2,
          bathrooms: 1,
          address: 'Dixinn, Conakry',
          district: 'Dixinn',
          latitude: 9.6000,
          longitude: -13.6000,
          user_id: agentId
        },
        {
          title: 'Terrain constructible à Ratoma',
          description: 'Terrain de 500m² constructible, viabilisé, proche des commodités. Idéal pour construction de villa ou immeuble.',
          type: 'land',
          status: 'for-sale',
          price: 25000.00,
          area: 500.00,
          address: 'Ratoma, Conakry',
          district: 'Ratoma',
          latitude: 9.7000,
          longitude: -13.5000,
          user_id: agentId
        }
      ])
      .select();

    if (propertiesError) {
      console.error('❌ Erreur lors de l\'insertion des propriétés:', propertiesError.message);
      return;
    }

    console.log(`   ✅ ${properties.length} propriétés insérées`);

    // Insérer des images de test pour la première propriété
    if (properties.length > 0) {
      console.log('3. Insertion des images de test...');
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
        console.log('   ⚠️  Erreur lors de l\'insertion des images:', imagesError.message);
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
          property_id: properties[0]?.id
        },
        {
          name: 'Marie Konaté',
          email: 'marie.konate@email.com',
          phone: '+224123456793',
          subject: 'Visite de l\'appartement',
          message: 'Bonjour, j\'aimerais visiter cet appartement. Quand seriez-vous disponible ?',
          property_id: properties[1]?.id
        }
      ]);

    if (messagesError) {
      console.log('   ⚠️  Erreur lors de l\'insertion des messages:', messagesError.message);
    } else {
      console.log('   ✅ Messages de test insérés');
    }

    console.log('\n🎉 Données de test insérées avec succès !');
    console.log('\n📋 Résumé des données insérées :');
    console.log(`   - ${users.length} utilisateurs`);
    console.log(`   - ${properties.length} propriétés`);
    console.log('   - Images de test');
    console.log('   - Messages de test');

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error.message);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedSupabase();
}

module.exports = { seedSupabase };
