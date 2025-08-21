#!/usr/bin/env node

/**
 * Script de migration des données MongoDB vers PostgreSQL
 * 
 * Ce script permet de migrer les données existantes de MongoDB vers PostgreSQL
 * en utilisant les modèles Sequelize.
 * 
 * Usage:
 *   node scripts/migrate-from-mongodb.js [--dry-run] [--source=mongodb-uri]
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const db = require('../models');

const DRY_RUN = process.argv.includes('--dry-run');
const SOURCE_URI = process.argv.find(arg => arg.startsWith('--source='))?.split('=')[1] || process.env.MONGODB_URI;

async function migrateUsers(mongoCollection, sequelizeUser) {
  console.log('🔄 Migration des utilisateurs...');
  
  const users = await mongoCollection.find({}).toArray();
  console.log(`   ${users.length} utilisateurs trouvés`);
  
  if (DRY_RUN) {
    console.log('   Mode DRY-RUN - Aucune donnée ne sera modifiée');
    return;
  }
  
  for (const user of users) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await sequelizeUser.findOne({
        where: { email: user.email }
      });
      
      if (existingUser) {
        console.log(`   Utilisateur ${user.email} déjà existant, ignoré`);
        continue;
      }
      
      // Créer le nouvel utilisateur
      const newUser = await sequelizeUser.create({
        firstName: user.firstName || user.first_name || 'Prénom',
        lastName: user.lastName || user.last_name || 'Nom',
        email: user.email,
        phone: user.phone || '+224000000000',
        password: user.password || 'password123', // Sera hashé par les hooks
        role: user.userType === 'agency' ? 'agent' : 'user',
        isVerified: user.isVerified || false,
        isActive: user.isActive !== false,
        preferences: {
          notifications: user.notifications || {},
          address: user.address || {}
        }
      });
      
      console.log(`   ✅ Utilisateur ${user.email} migré (ID: ${newUser.id})`);
      
    } catch (error) {
      console.error(`   ❌ Erreur lors de la migration de ${user.email}:`, error.message);
    }
  }
}

async function migrateProperties(mongoCollection, sequelizeProperty, sequelizeUser) {
  console.log('🔄 Migration des propriétés...');
  
  const properties = await mongoCollection.find({}).toArray();
  console.log(`   ${properties.length} propriétés trouvées`);
  
  if (DRY_RUN) {
    console.log('   Mode DRY-RUN - Aucune donnée ne sera modifiée');
    return;
  }
  
  for (const property of properties) {
    try {
      // Trouver le propriétaire
      let ownerId = null;
      if (property.owner) {
        const owner = await sequelizeUser.findOne({
          where: { email: property.owner.email || property.owner }
        });
        ownerId = owner?.id;
      }
      
      if (!ownerId) {
        console.log(`   ⚠️  Propriétaire non trouvé pour ${property.title}, ignoré`);
        continue;
      }
      
      // Créer la nouvelle propriété
      const newProperty = await sequelizeProperty.create({
        title: property.title,
        description: property.description,
        type: mapPropertyType(property.type),
        status: mapPropertyStatus(property.transactionType),
        price: property.price,
        currency: property.currency || 'GNF',
        bedrooms: property.features?.bedrooms,
        bathrooms: property.features?.bathrooms,
        area: property.features?.area,
        areaUnit: 'm2',
        floors: property.features?.floors || 1,
        yearBuilt: property.features?.yearBuilt,
        address: {
          street: property.location?.address || '',
          neighborhood: property.location?.neighborhood || '',
          city: property.location?.city || 'Conakry',
          postalCode: ''
        },
        features: property.features || {},
        amenities: property.amenities || [],
        images: property.images || [],
        isFeatured: property.isFeatured || false,
        isPremium: property.isPremium || false,
        views: property.views || 0,
        favorites: property.favorites?.length || 0,
        isActive: property.status !== 'inactive',
        ownerId: ownerId
      });
      
      console.log(`   ✅ Propriété "${property.title}" migrée (ID: ${newProperty.id})`);
      
    } catch (error) {
      console.error(`   ❌ Erreur lors de la migration de "${property.title}":`, error.message);
    }
  }
}

function mapPropertyType(mongoType) {
  const typeMap = {
    'appartement': 'apartment',
    'maison': 'house',
    'villa': 'villa',
    'studio': 'apartment',
    'terrain': 'land',
    'bureau': 'office',
    'commerce': 'commercial'
  };
  
  return typeMap[mongoType] || 'apartment';
}

function mapPropertyStatus(mongoStatus) {
  const statusMap = {
    'vente': 'for-sale',
    'location': 'for-rent'
  };
  
  return statusMap[mongoStatus] || 'for-sale';
}

async function main() {
  if (!SOURCE_URI) {
    console.error('❌ URI MongoDB non spécifiée');
    console.log('Usage: node scripts/migrate-from-mongodb.js [--dry-run] [--source=mongodb-uri]');
    process.exit(1);
  }
  
  console.log('🚀 Début de la migration MongoDB → PostgreSQL');
  console.log(`📊 Source: ${SOURCE_URI}`);
  console.log(`🔧 Mode: ${DRY_RUN ? 'DRY-RUN' : 'MIGRATION'}`);
  console.log('');
  
  try {
    // Connexion à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    const mongoClient = new MongoClient(SOURCE_URI);
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    
    // Connexion à PostgreSQL
    console.log('🔌 Connexion à PostgreSQL...');
    await db.sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL établie');
    
    // Récupérer les collections MongoDB
    const usersCollection = mongoDb.collection('users');
    const propertiesCollection = mongoDb.collection('properties');
    
    // Migration des utilisateurs
    await migrateUsers(usersCollection, db.User);
    
    // Migration des propriétés
    await migrateProperties(propertiesCollection, db.Property, db.User);
    
    console.log('');
    console.log('🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    // Fermer les connexions
    if (mongoClient) {
      await mongoClient.close();
    }
    if (db.sequelize) {
      await db.sequelize.close();
    }
  }
}

// Exécuter la migration
if (require.main === module) {
  main();
}

module.exports = { migrateUsers, migrateProperties };
