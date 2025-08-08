#!/usr/bin/env node

/**
 * Script pour configurer automatiquement les labels GitHub
 * Usage: node scripts/setup-github-labels.js
 */

const fs = require('fs');
const path = require('path');

// Lire le fichier de configuration des labels
const labelsPath = path.join(__dirname, '..', '.github', 'labels.json');
const labels = JSON.parse(fs.readFileSync(labelsPath, 'utf8'));

console.log('🏷️  Configuration des Labels GitHub pour 224Suite\n');

console.log('📋 Labels à créer :');
labels.forEach((label, index) => {
  console.log(`${index + 1}. ${label.name} - ${label.description}`);
});

console.log('\n📝 Instructions :');
console.log('1. Allez sur https://github.com/YOUR_USERNAME/224suite/labels');
console.log('2. Cliquez sur "New label" pour chaque label ci-dessus');
console.log('3. Utilisez les informations suivantes :');

console.log('\n🔧 Configuration détaillée :');
labels.forEach(label => {
  console.log(`\n📌 ${label.name}`);
  console.log(`   Couleur: #${label.color}`);
  console.log(`   Description: ${label.description}`);
});

console.log('\n🚀 Alternative : Utilisez l\'API GitHub');
console.log('Vous pouvez également utiliser l\'API GitHub pour créer automatiquement tous les labels :');
console.log('https://docs.github.com/en/rest/issues/labels#create-a-label');

console.log('\n✅ Une fois terminé, vos labels seront configurés pour organiser efficacement les issues !');
