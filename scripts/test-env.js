#!/usr/bin/env node

/**
 * Script de test des variables d'environnement pour 224Suite
 * Usage: node scripts/test-env.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration de test
const config = {
  host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
  port: process.env.DB_PORT || 11311,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'BPlZtcXgcrhlcSVGInePcSDffgMHZzmw',
  database: process.env.DB_NAME || '224suite',
  charset: 'utf8mb4',
  connectTimeout: 30000,
  acquireTimeout: 30000,
  timeout: 30000
};

async function testEnvironment() {
  console.log('🧪 Test des variables d\'environnement 224Suite\n');

  // Test 1: Variables d'environnement
  console.log('📋 Variables d\'environnement:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'non défini'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || 'non défini'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'non défini'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'non défini'}`);
  console.log(`   REACT_APP_API_URL: ${process.env.REACT_APP_API_URL || 'non défini'}\n`);

  // Test 2: Connexion à la base de données
  console.log('🔌 Test de connexion à la base de données...');
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connexion à la base de données réussie !');
    
    // Test 3: Vérification des tables
    console.log('📊 Vérification des tables...');
    const [tables] = await connection.query('SHOW TABLES;');
    console.log(`✅ ${tables.length} tables trouvées:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    
    // Test 4: Test de requête simple
    console.log('🔍 Test de requête simple...');
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Requête réussie: ${rows[0].count} utilisateurs dans la base`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }

  // Test 5: Vérification des fichiers de configuration
  console.log('\n📁 Vérification des fichiers de configuration...');
  const fs = require('fs');
  const path = require('path');
  
  const configFiles = [
    'package.json',
    'database/config.js',
    'database/schema.sql'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} trouvé`);
    } else {
      console.log(`❌ ${file} manquant`);
    }
  });

  // Test 6: Vérification des dépendances
  console.log('\n📦 Vérification des dépendances...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['mysql2', 'react', 'react-dom'];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
      } else {
        console.log(`❌ ${dep} manquant`);
      }
    });
  } catch (error) {
    console.log('❌ Erreur lors de la lecture du package.json');
  }

  console.log('\n🎉 Test des variables d\'environnement terminé !');
  console.log('✅ Votre configuration est prête pour le déploiement');
}

// Exécuter le test
testEnvironment().catch(error => {
  console.error('❌ Erreur lors du test:', error.message);
  process.exit(1);
});
