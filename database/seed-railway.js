// Script de peuplement spécifique pour Railway MySQL
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function seedRailway() {
  let connection;
  
  try {
    console.log('🌱 Peuplement de la base de données Railway avec des données de test...');
    
    // Configuration Railway
    const config = {
      host: 'gondola.proxy.rlwy.net',
      port: 11311,
      user: 'root',
      password: 'BPlZtcXgcrhlcSVGInePcSDffgMHZzmw',
      database: 'railway',
      charset: 'utf8mb4'
    };
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connexion établie avec succès !');
    
    // Vérifier si des données existent déjà
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count > 0) {
      console.log('⚠️  Des données existent déjà dans la base de données.');
      console.log('   Utilisez "npm run db:reset" pour réinitialiser la base de données.');
      return;
    }
    
    // Hasher le mot de passe par défaut
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    console.log('👥 Création des utilisateurs...');
    // Insérer des utilisateurs de test
    await connection.query(`
      INSERT INTO users (email, password, first_name, last_name, phone, role, email_verified) VALUES
      ('admin@224suite.com', ?, 'Admin', '224Suite', '+224123456789', 'admin', true),
      ('agent@224suite.com', ?, 'Agent', 'Immobilier', '+224123456790', 'agent', true),
      ('user@224suite.com', ?, 'Utilisateur', 'Test', '+224123456791', 'user', true)
    `, [hashedPassword, hashedPassword, hashedPassword]);
    
    console.log('🏠 Création des propriétés...');
    // Insérer des propriétés de test
    await connection.query(`
      INSERT INTO properties (title, description, type, status, price, area, bedrooms, bathrooms, address, district, latitude, longitude, user_id) VALUES
      ('Villa moderne à Kaloum', 'Magnifique villa moderne avec jardin, 3 chambres, salon spacieux, cuisine équipée. Située dans le quartier résidentiel de Kaloum.', 'villa', 'for-sale', 150000.00, 200.00, 3, 2, 'Kaloum, Conakry', 'Kaloum', 9.5370, -13.6785, 2),
      ('Appartement 2 chambres à Dixinn', 'Bel appartement au 3ème étage avec vue sur mer. 2 chambres, salon, cuisine, salle de bain. Proche de l\'université.', 'apartment', 'for-rent', 500.00, 80.00, 2, 1, 'Dixinn, Conakry', 'Dixinn', 9.6000, -13.6000, 2),
      ('Terrain constructible à Ratoma', 'Terrain de 500m² constructible, viabilisé, proche des commodités. Idéal pour construction de villa ou immeuble.', 'land', 'for-sale', 25000.00, 500.00, NULL, NULL, 'Ratoma, Conakry', 'Ratoma', 9.7000, -13.5000, 2),
      ('Maison familiale à Matam', 'Grande maison familiale avec 4 chambres, 2 salons, cuisine spacieuse, garage. Jardin arboré. Quartier calme et résidentiel.', 'house', 'for-sale', 120000.00, 180.00, 4, 3, 'Matam, Conakry', 'Matam', 9.6500, -13.5500, 2),
      ('Bureau commercial à Coléah', 'Local commercial de 100m², idéal pour bureau ou commerce. Parking disponible. Proche du centre-ville.', 'commercial', 'for-rent', 300.00, 100.00, NULL, 1, 'Coléah, Conakry', 'Coléah', 9.5800, -13.6500, 2)
    `);
    
    console.log('📸 Ajout des images...');
    // Insérer des images de propriétés (URLs d'exemple)
    await connection.query(`
      INSERT INTO property_images (property_id, image_url, alt_text, is_primary, sort_order) VALUES
      (1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'Villa moderne Kaloum', true, 1),
      (1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Jardin de la villa', false, 2),
      (2, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Appartement Dixinn', true, 1),
      (2, 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', 'Vue sur mer', false, 2),
      (3, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Terrain Ratoma', true, 1),
      (4, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'Maison familiale Matam', true, 1),
      (5, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'Bureau commercial Coléah', true, 1)
    `);
    
    console.log('❤️ Ajout des favoris...');
    // Insérer quelques favoris
    await connection.query(`
      INSERT INTO favorites (user_id, property_id) VALUES
      (3, 1),
      (3, 2),
      (3, 4)
    `);
    
    console.log('💬 Ajout des messages...');
    // Insérer des messages de test
    await connection.query(`
      INSERT INTO messages (name, email, phone, subject, message, property_id, user_id) VALUES
      ('Mamadou Diallo', 'mamadou@example.com', '+224123456789', 'Intéressé par la villa', 'Bonjour, je suis intéressé par cette villa. Pouvez-vous me donner plus d\'informations ?', 1, 2),
      ('Fatou Camara', 'fatou@example.com', '+224123456790', 'Visite de l\'appartement', 'Bonjour, je souhaiterais visiter cet appartement. Quand serait-ce possible ?', 2, 2)
    `);
    
    console.log('✅ Données de test insérées avec succès !');
    console.log('👥 Utilisateurs créés :');
    console.log('   - admin@224suite.com (Admin)');
    console.log('   - agent@224suite.com (Agent)');
    console.log('   - user@224suite.com (Utilisateur)');
    console.log('   Mot de passe par défaut : password123');
    console.log('🏠 Propriétés créées : 5 propriétés de test');
    console.log('📸 Images ajoutées : 7 images d\'exemple');
    console.log('💬 Messages créés : 2 messages de test');
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement de la base de données:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le script
seedRailway();
